/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getPersonalized, getToplist, getTetail, getSongUrl, getLyric, getSearch } from '@/api/http';
import { toggleLikeSong, getSongs, addHistory, getHistory, deleteHistory, playSongCount } from '@/api/http1';
import MusicSidebar from '@/components/music/MusicSidebar.vue';
import MusicSearch from '@/components/music/MusicSearch.vue';
import SongTable from '@/components/music/SongTable.vue';
import PlaylistCard from '@/components/music/PlaylistCard.vue';
import MusicPlayer from '@/components/music/MusicPlayer.vue';
import LyricModal from '@/components/music/LyricModal.vue';
// 移动端底部导航 Tab 配置
const mobileTabs = [
    { id: 'recommend', label: '推荐', icon: 'fas fa-compass' },
    { id: 'toplist', label: '排行榜', icon: 'fas fa-trophy' },
    { id: 'likes', label: '喜欢', icon: 'fas fa-heart' },
    { id: 'history', label: '历史', icon: 'fas fa-history' },
    { id: 'search', label: '搜索', icon: 'fas fa-search' },
];
const playlists = ref([]);
const toplistData = ref([]);
const currentSong = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.8);
const searchQuery = ref('');
const likedSearchQuery = ref('');
const loading = ref(false);
const error = ref(null);
const activeTab = ref('recommend');
// 持久化数据
const likedSongs = ref([]);
const historySongs = ref([]);
const searchHistory = ref([]);
// 我喜欢的列表过滤
const filteredLikedSongs = computed(() => {
    const query = likedSearchQuery.value.trim().toLowerCase();
    if (!query)
        return likedSongs.value;
    return likedSongs.value.filter(song => {
        const nameMatch = song.name.toLowerCase().includes(query);
        const artistMatch = song.ar?.[0]?.name?.toLowerCase().includes(query);
        const albumMatch = song.al?.name?.toLowerCase().includes(query);
        return nameMatch || artistMatch || albumMatch;
    });
});
const showLyricModal = ref(false);
const lyrics = ref([]);
const currentLyricIndex = ref(-1);
const searchResults = ref([]);
// 播放队列
const playQueue = ref([]);
const queueIndex = ref(0);
const audioPlayer = new Audio();
audioPlayer.volume = volume.value;
// --- 方法 ---
const formatNumber = (num) => {
    if (!num)
        return '0';
    if (num > 100000000)
        return (num / 100000000).toFixed(1) + '亿';
    if (num > 10000)
        return (num / 10000).toFixed(1) + '万';
    return num.toString();
};
const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds))
        return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};
// 切换 Tab
const switchTab = (tab) => {
    activeTab.value = tab;
    if (tab === 'toplist' && toplistData.value.length === 0) {
        fetchTopList();
    }
};
// 获取推荐歌单
const fetchRecommendPlaylists = async () => {
    loading.value = true;
    error.value = null;
    try {
        const songNum = 20;
        const response = await getPersonalized(songNum);
        playlists.value = response.result || [];
    }
    catch (e) {
        console.warn('Failed to fetch from local backend, using mock data', e);
        error.value = '无法获取推荐歌单，请重试。';
    }
    finally {
        loading.value = false;
    }
};
// 获取排行榜
const fetchTopList = async () => {
    loading.value = true;
    try {
        const res = await getToplist();
        toplistData.value = res.data.list || [];
    }
    catch (e) {
        console.error('Fetch toplist error', e);
        error.value = '无法获取推荐歌单，请重试。';
    }
    finally {
        loading.value = false;
    }
};
// 获取歌单详情并播放第一首
const getPlaylistDetail = async (id) => {
    loading.value = true;
    try {
        const response = await getTetail(id);
        const tracks = response.data.playlist?.tracks || [];
        if (tracks.length > 0) {
            const songs = tracks.map((t) => ({
                id: t.id,
                name: t.name,
                ar: t.ar || [{ name: 'Unknown' }],
                al: t.al || { picUrl: '', name: '' },
                dt: t.dt || 0
            }));
            setPlayQueue(songs, 0);
        }
    }
    catch (e) {
        console.error('Failed to get playlist detail', e);
    }
    finally {
        loading.value = false;
    }
};
// 设置播放队列
const setPlayQueue = (songs, startIndex = 0) => {
    playQueue.value = songs;
    queueIndex.value = startIndex;
    if (songs.length > 0) {
        playSong(songs[startIndex]);
    }
};
// 播放歌曲
const playSong = async (song) => {
    const indexInQueue = playQueue.value.findIndex(s => s.id === song.id);
    if (indexInQueue !== -1) {
        queueIndex.value = indexInQueue;
    }
    currentSong.value = song;
    lyrics.value = [];
    currentLyricIndex.value = -1;
    addToHistory(song);
    try {
        const res = await getSongUrl(song.id);
        const url = res.data?.[0]?.url;
        if (url) {
            audioPlayer.src = url;
            audioPlayer.play();
            isPlaying.value = true;
            fetchLyrics(song.id);
            playSongCount(song);
        }
        else {
            console.warn('No URL found for song:', song.name);
            // 不自动跳转下一首，让用户手动选择
        }
    }
    catch (e) {
        console.error('Play error', e);
        // 不自动跳转下一首，让用户手动选择
    }
};
// 从搜索结果播放
const playSongFromSearch = (song, index) => {
    setPlayQueue(searchResults.value, index);
};
// 获取歌词
const fetchLyrics = async (id) => {
    try {
        const res = await getLyric(id);
        const lyricStr = res.data;
        if (lyricStr) {
            parseLyrics(lyricStr);
        }
    }
    catch (e) {
        console.error('Fetch lyrics error', e);
    }
};
// 解析歌词
const parseLyrics = (lyricStr) => {
    const lines = lyricStr.split('\n');
    const parsed = [];
    const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
    lines.forEach(line => {
        const match = timeReg.exec(line);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const milliseconds = parseInt(match[3].padEnd(3, '0'));
            const time = minutes * 60 + seconds + milliseconds / 1000;
            const text = line.replace(timeReg, '').trim();
            if (text) {
                parsed.push({ time, text });
            }
        }
    });
    lyrics.value = parsed;
};
const togglePlay = () => {
    if (!currentSong.value)
        return;
    if (isPlaying.value) {
        audioPlayer.pause();
    }
    else {
        audioPlayer.play();
    }
    isPlaying.value = !isPlaying.value;
};
const prevSong = () => {
    if (playQueue.value.length === 0)
        return;
    let prevIndex = queueIndex.value - 1;
    if (prevIndex < 0) {
        prevIndex = playQueue.value.length - 1;
    }
    queueIndex.value = prevIndex;
    playSong(playQueue.value[prevIndex]);
};
const nextSong = () => {
    if (playQueue.value.length === 0)
        return;
    let nextIndex = queueIndex.value + 1;
    if (nextIndex >= playQueue.value.length) {
        nextIndex = 0;
    }
    queueIndex.value = nextIndex;
    playSong(playQueue.value[nextIndex]);
};
const seekTo = (time) => {
    audioPlayer.currentTime = time;
    currentTime.value = time;
};
const toggleMute = () => {
    if (volume.value === 0) {
        volume.value = 0.8;
        audioPlayer.volume = 0.8;
    }
    else {
        volume.value = 0;
        audioPlayer.volume = 0;
    }
};
const setVolume = (vol) => {
    volume.value = vol;
    audioPlayer.volume = vol;
};
const toggleLyricModal = () => {
    if (!currentSong.value)
        return;
    showLyricModal.value = !showLyricModal.value;
};
// --- 搜索逻辑 ---
const handleSearch = async (keyword) => {
    keyword = (keyword || searchQuery.value).trim();
    if (!keyword)
        return;
    saveSearchHistory(keyword);
    activeTab.value = 'search';
    loading.value = true;
    error.value = null;
    try {
        const res = await getSearch(keyword, 30, 1);
        const data = res.data;
        if (data.result && data.result.songs) {
            searchResults.value = data.result.songs.map((s) => ({
                id: s.id,
                name: s.name,
                ar: s.artists || [{ name: 'Unknown' }],
                al: s.album || { picUrl: '', name: '' },
                dt: s.duration || 0
            }));
        }
        else {
            searchResults.value = [];
        }
    }
    catch (e) {
        console.error('Search error', e);
        error.value = '搜索失败，请检查网络连接';
        searchResults.value = [];
    }
    finally {
        loading.value = false;
    }
};
// --- 搜索历史管理 ---
const saveSearchHistory = (keyword) => {
    const index = searchHistory.value.indexOf(keyword);
    if (index !== -1) {
        searchHistory.value.splice(index, 1);
    }
    searchHistory.value.unshift(keyword);
    if (searchHistory.value.length > 10) {
        searchHistory.value.pop();
    }
    localStorage.setItem('search_history', JSON.stringify(searchHistory.value));
};
const removeSearchHistory = (index) => {
    searchHistory.value.splice(index, 1);
    localStorage.setItem('search_history', JSON.stringify(searchHistory.value));
};
const clearSearchHistory = () => {
    searchHistory.value = [];
    localStorage.removeItem('search_history');
};
const refreshData = () => {
    if (activeTab.value === 'recommend')
        fetchRecommendPlaylists();
    else if (activeTab.value === 'toplist')
        fetchTopList();
};
// --- 喜欢与历史逻辑 ---
const isLiked = (id) => likedSongs.value.some(s => s.id === id);
const toggleLike = async (song) => {
    try {
        await toggleLikeSong(song);
    }
    catch (e) {
        console.error('Like toggle error', e);
        return;
    }
    const index = likedSongs.value.findIndex(s => s.id === song.id);
    if (index !== -1) {
        likedSongs.value.splice(index, 1);
    }
    else {
        likedSongs.value.unshift(song);
    }
};
const addToHistory = async (song) => {
    try {
        await addHistory(song);
    }
    catch (e) {
        console.warn('Failed to add history on backend', e);
    }
    historySongs.value = historySongs.value.filter(s => s.id !== song.id);
    historySongs.value.unshift(song);
    if (historySongs.value.length > 50)
        historySongs.value.pop();
    localStorage.setItem('play_history', JSON.stringify(historySongs.value));
};
const clearHistory = async () => {
    try {
        await deleteHistory();
        historySongs.value = [];
        localStorage.removeItem('play_history');
    }
    catch (e) {
        console.warn('Failed to clear history on backend', e);
    }
};
const playAllLiked = () => {
    if (likedSongs.value.length > 0) {
        setPlayQueue(likedSongs.value, 0);
    }
};
const getLikedSongs = async () => {
    // 未登录或 token 不存在时跳过，避免 401 报错
    if (!localStorage.getItem('token'))
        return;
    try {
        const response = await getSongs(1, 100);
        likedSongs.value = response.data || [];
    }
    catch (e) {
        console.warn('Failed to fetch liked songs (may be unauthenticated)', e);
    }
};
const getHistorySongs = async () => {
    // 未登录或 token 不存在时跳过，避免 401 报错
    if (!localStorage.getItem('token'))
        return;
    try {
        const response = await getHistory(1, 50);
        historySongs.value = response.data || [];
    }
    catch (e) {
        console.warn('Failed to fetch history songs (may be unauthenticated)', e);
    }
};
// --- 生命周期 ---
onMounted(() => {
    fetchRecommendPlaylists();
    getLikedSongs();
    getHistorySongs();
    const savedHistory = localStorage.getItem('play_history');
    if (savedHistory)
        historySongs.value = JSON.parse(savedHistory);
    const savedSearchHistory = localStorage.getItem('search_history');
    if (savedSearchHistory)
        searchHistory.value = JSON.parse(savedSearchHistory);
    let rafId = null;
    const onTimeUpdate = () => {
        if (rafId !== null)
            return;
        rafId = requestAnimationFrame(() => {
            rafId = null;
            currentTime.value = audioPlayer.currentTime;
            duration.value = audioPlayer.duration || 0;
            if (lyrics.value.length > 0) {
                const idx = lyrics.value.findIndex((l, i) => {
                    const next = lyrics.value[i + 1];
                    return audioPlayer.currentTime >= l.time && (!next || audioPlayer.currentTime < next.time);
                });
                if (idx !== -1 && idx !== currentLyricIndex.value) {
                    currentLyricIndex.value = idx;
                }
            }
        });
    };
    audioPlayer.addEventListener('timeupdate', onTimeUpdate);
    audioPlayer.addEventListener('ended', () => {
        isPlaying.value = false;
        nextSong();
    });
});
onUnmounted(() => {
    audioPlayer.pause();
    audioPlayer.src = '';
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-col md:flex-row min-h-screen text-gray-200 font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['font-sans']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['selection:bg-purple-500']} */ ;
/** @type {__VLS_StyleScopedClasses['selection:text-white']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "fixed bottom-20 left-0 right-0 z-40 flex md:hidden bg-[#1a1a2e]/95 backdrop-blur-xl border-t border-white/10" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-20']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-40']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#1a1a2e]/95']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
for (const [tab] of __VLS_vFor((__VLS_ctx.mobileTabs))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.switchTab(tab.id);
                // @ts-ignore
                [mobileTabs, switchTab,];
            } },
        key: (tab.id),
        ...{ class: (__VLS_ctx.activeTab === tab.id ? 'text-purple-400 bg-purple-500/10' : 'text-white/50') },
        ...{ class: "flex-1 flex flex-col items-center py-2 text-xs transition-colors" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: (tab.icon) },
        ...{ class: "text-lg mb-0.5" },
    });
    /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-0.5']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (tab.label);
    // @ts-ignore
    [activeTab,];
}
const __VLS_0 = MusicSidebar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onSwitchTab': {} },
    activeTab: (__VLS_ctx.activeTab),
    likedCount: (__VLS_ctx.likedSongs.length),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSwitchTab': {} },
    activeTab: (__VLS_ctx.activeTab),
    likedCount: (__VLS_ctx.likedSongs.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ switchTab: {} },
    { onSwitchTab: (__VLS_ctx.switchTab) });
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "flex-1 flex flex-col relative overflow-hidden bg-transparent music-main" },
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['music-main']} */ ;
const __VLS_7 = MusicSearch;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSearch': {} },
    ...{ 'onClearHistory': {} },
    ...{ 'onRemoveHistory': {} },
    modelValue: (__VLS_ctx.searchQuery),
    history: (__VLS_ctx.searchHistory),
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSearch': {} },
    ...{ 'onClearHistory': {} },
    ...{ 'onRemoveHistory': {} },
    modelValue: (__VLS_ctx.searchQuery),
    history: (__VLS_ctx.searchHistory),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = ({ search: {} },
    { onSearch: (__VLS_ctx.handleSearch) });
const __VLS_14 = ({ clearHistory: {} },
    { onClearHistory: (__VLS_ctx.clearSearchHistory) });
const __VLS_15 = ({ removeHistory: {} },
    { onRemoveHistory: (__VLS_ctx.removeSearchHistory) });
var __VLS_10;
var __VLS_11;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 pb-48 md:pb-36" },
    ref: "scrollContainer",
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-48']} */ ;
/** @type {__VLS_StyleScopedClasses['md:pb-36']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col items-center justify-center h-64 text-white/50" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-64']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white/50']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-purple-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col items-center justify-center h-64 text-red-400 bg-red-500/10 rounded-xl border border-red-500/20 p-6" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-64']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-red-500/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-red-500/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-exclamation-circle text-3xl mb-3" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-exclamation-circle']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "font-medium" },
    });
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    (__VLS_ctx.error);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.refreshData) },
        ...{ class: "mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-red-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-red-600']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
}
else if (__VLS_ctx.activeTab === 'search') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "space-y-8 animate-fade-in" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "text-2xl font-bold text-white" },
    });
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-purple-400" },
    });
    /** @type {__VLS_StyleScopedClasses['text-purple-400']} */ ;
    (__VLS_ctx.searchQuery);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-sm text-white/50" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white/50']} */ ;
    (__VLS_ctx.searchResults.length);
    if (__VLS_ctx.searchResults.length === 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-center py-20 text-white/40 bg-white/5 rounded-xl border border-dashed border-white/10" },
        });
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white/40']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
            ...{ class: "fas fa-search text-4xl mb-4 opacity-30" },
        });
        /** @type {__VLS_StyleScopedClasses['fas']} */ ;
        /** @type {__VLS_StyleScopedClasses['fa-search']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    }
    else {
        const __VLS_16 = SongTable;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
            ...{ 'onPlay': {} },
            ...{ 'onToggleLike': {} },
            songs: (__VLS_ctx.searchResults),
            isLiked: (__VLS_ctx.isLiked),
        }));
        const __VLS_18 = __VLS_17({
            ...{ 'onPlay': {} },
            ...{ 'onToggleLike': {} },
            songs: (__VLS_ctx.searchResults),
            isLiked: (__VLS_ctx.isLiked),
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        let __VLS_21;
        const __VLS_22 = ({ play: {} },
            { onPlay: (__VLS_ctx.playSongFromSearch) });
        const __VLS_23 = ({ toggleLike: {} },
            { onToggleLike: (__VLS_ctx.toggleLike) });
        var __VLS_19;
        var __VLS_20;
    }
}
else if (__VLS_ctx.activeTab === 'recommend') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "space-y-8 animate-fade-in" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "text-2xl font-bold text-white flex items-center gap-2" },
    });
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-chevron-right text-sm text-white/40 mt-1" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-chevron-right']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white/40']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" },
    });
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['lg:grid-cols-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['xl:grid-cols-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
    for (const [playlist] of __VLS_vFor((__VLS_ctx.playlists))) {
        const __VLS_24 = PlaylistCard;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
            ...{ 'onSelect': {} },
            key: (playlist.id),
            playlist: (playlist),
        }));
        const __VLS_26 = __VLS_25({
            ...{ 'onSelect': {} },
            key: (playlist.id),
            playlist: (playlist),
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        let __VLS_29;
        const __VLS_30 = ({ select: {} },
            { onSelect: ((p) => __VLS_ctx.getPlaylistDetail(p.id)) });
        var __VLS_27;
        var __VLS_28;
        // @ts-ignore
        [switchTab, activeTab, activeTab, activeTab, likedSongs, searchQuery, searchQuery, searchHistory, handleSearch, clearSearchHistory, removeSearchHistory, loading, error, error, refreshData, searchResults, searchResults, searchResults, isLiked, playSongFromSearch, toggleLike, playlists, getPlaylistDetail,];
    }
}
else if (__VLS_ctx.activeTab === 'toplist') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "space-y-8 animate-fade-in" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "text-2xl font-bold text-white" },
    });
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" },
    });
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['lg:grid-cols-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
    for (const [list] of __VLS_vFor((__VLS_ctx.toplistData))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.activeTab === 'search'))
                        return;
                    if (!!(__VLS_ctx.activeTab === 'recommend'))
                        return;
                    if (!(__VLS_ctx.activeTab === 'toplist'))
                        return;
                    __VLS_ctx.getPlaylistDetail(list.id);
                    // @ts-ignore
                    [activeTab, getPlaylistDetail, toplistData,];
                } },
            key: (list.id),
            ...{ class: "group cursor-pointer bg-white/5 backdrop-blur-sm rounded-xl p-3 shadow-sm hover:shadow-lg transition-all border border-white/10 flex flex-col" },
        });
        /** @type {__VLS_StyleScopedClasses['group']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:shadow-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "relative aspect-square rounded-lg overflow-hidden mb-3" },
        });
        /** @type {__VLS_StyleScopedClasses['relative']} */ ;
        /** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (list.coverImgUrl),
            alt: (list.name),
            ...{ class: "w-full h-full object-cover group-hover:scale-105 transition-transform" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
        /** @type {__VLS_StyleScopedClasses['group-hover:scale-105']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3" },
        });
        /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
        /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-gradient-to-t']} */ ;
        /** @type {__VLS_StyleScopedClasses['from-black/60']} */ ;
        /** @type {__VLS_StyleScopedClasses['to-transparent']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-end']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-3']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-white text-xs font-bold" },
        });
        /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
            ...{ class: "font-bold text-white/80 truncate" },
        });
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white/80']} */ ;
        /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
        (list.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-xs text-white/50 mt-1 line-clamp-2" },
        });
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white/50']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['line-clamp-2']} */ ;
        (list.updateFrequency || '每日更新');
        // @ts-ignore
        [];
    }
}
else if (__VLS_ctx.activeTab === 'likes') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "space-y-4 md:space-y-6 animate-fade-in" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:space-y-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 p-4 md:p-8 rounded-2xl text-white shadow-lg shadow-purple-500/30 gap-4" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-start']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
    /** @type {__VLS_StyleScopedClasses['from-purple-600']} */ ;
    /** @type {__VLS_StyleScopedClasses['to-pink-600']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:p-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-purple-500/30']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center gap-4 md:gap-6" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-16 h-16 md:w-32 md:h-32 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner flex-shrink-0" },
    });
    /** @type {__VLS_StyleScopedClasses['w-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:w-32']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:h-32']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-inner']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-heart text-2xl md:text-5xl text-white/90" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-heart']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:text-5xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white/90']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "text-xl md:text-3xl font-bold mb-1 md:mb-2" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:text-3xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:mb-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-white/80 text-xs md:text-sm" },
    });
    /** @type {__VLS_StyleScopedClasses['text-white/80']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
    (__VLS_ctx.filteredLikedSongs.length);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.playAllLiked) },
        ...{ class: "w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm md:text-base" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:w-auto']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:px-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-purple-600']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:text-base']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-play" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-play']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "relative" },
    });
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-white/40" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-search']} */ ;
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['left-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
    /** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white/40']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        value: (__VLS_ctx.likedSearchQuery),
        type: "text",
        placeholder: "在喜欢的歌曲中搜索...",
        ...{ class: "w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:bg-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 placeholder-white/30 text-white" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['pl-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['pr-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:border-purple-500/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:ring-purple-500/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    /** @type {__VLS_StyleScopedClasses['placeholder-white/30']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
    if (__VLS_ctx.likedSearchQuery) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.activeTab === 'search'))
                        return;
                    if (!!(__VLS_ctx.activeTab === 'recommend'))
                        return;
                    if (!!(__VLS_ctx.activeTab === 'toplist'))
                        return;
                    if (!(__VLS_ctx.activeTab === 'likes'))
                        return;
                    if (!(__VLS_ctx.likedSearchQuery))
                        return;
                    __VLS_ctx.likedSearchQuery = '';
                    // @ts-ignore
                    [activeTab, filteredLikedSongs, playAllLiked, likedSearchQuery, likedSearchQuery, likedSearchQuery,];
                } },
            ...{ class: "absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70" },
        });
        /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
        /** @type {__VLS_StyleScopedClasses['right-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
        /** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white/40']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:text-white/70']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
            ...{ class: "fas fa-times-circle" },
        });
        /** @type {__VLS_StyleScopedClasses['fas']} */ ;
        /** @type {__VLS_StyleScopedClasses['fa-times-circle']} */ ;
    }
    if (__VLS_ctx.filteredLikedSongs.length === 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-center py-20 text-white/40 bg-white/5 rounded-xl border border-dashed border-white/10" },
        });
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white/40']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        if (__VLS_ctx.likedSongs.length === 0) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
                ...{ class: "fas fa-music text-4xl mb-4 opacity-30" },
            });
            /** @type {__VLS_StyleScopedClasses['fas']} */ ;
            /** @type {__VLS_StyleScopedClasses['fa-music']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
                ...{ class: "fas fa-search text-4xl mb-4 opacity-30" },
            });
            /** @type {__VLS_StyleScopedClasses['fas']} */ ;
            /** @type {__VLS_StyleScopedClasses['fa-search']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        (__VLS_ctx.likedSongs.length === 0 ? '暂无喜欢的歌曲，快去添加吧！' : '未找到匹配的歌曲');
    }
    else {
        const __VLS_31 = SongTable;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
            ...{ 'onPlay': {} },
            ...{ 'onToggleLike': {} },
            songs: (__VLS_ctx.filteredLikedSongs),
            isLiked: (() => true),
        }));
        const __VLS_33 = __VLS_32({
            ...{ 'onPlay': {} },
            ...{ 'onToggleLike': {} },
            songs: (__VLS_ctx.filteredLikedSongs),
            isLiked: (() => true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_32));
        let __VLS_36;
        const __VLS_37 = ({ play: {} },
            { onPlay: (__VLS_ctx.playSong) });
        const __VLS_38 = ({ toggleLike: {} },
            { onToggleLike: (__VLS_ctx.toggleLike) });
        var __VLS_34;
        var __VLS_35;
    }
}
else if (__VLS_ctx.activeTab === 'history') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "space-y-6 animate-fade-in" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "text-2xl font-bold text-white flex items-center gap-2" },
    });
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-history text-white/40" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-history']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white/40']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.clearHistory) },
        ...{ class: "text-xs text-white/40 hover:text-purple-400 transition-colors px-3 py-1 border border-white/20 rounded-full hover:border-purple-500/50" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white/40']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-purple-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:border-purple-500/50']} */ ;
    if (__VLS_ctx.historySongs.length === 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-center py-20 text-white/40 bg-white/5 rounded-xl border border-dashed border-white/10" },
        });
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white/40']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
            ...{ class: "fas fa-clock text-4xl mb-4 opacity-30" },
        });
        /** @type {__VLS_StyleScopedClasses['fas']} */ ;
        /** @type {__VLS_StyleScopedClasses['fa-clock']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border border-white/10 overflow-hidden" },
        });
        /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
        for (const [song, index] of __VLS_vFor((__VLS_ctx.historySongs))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.error))
                            return;
                        if (!!(__VLS_ctx.activeTab === 'search'))
                            return;
                        if (!!(__VLS_ctx.activeTab === 'recommend'))
                            return;
                        if (!!(__VLS_ctx.activeTab === 'toplist'))
                            return;
                        if (!!(__VLS_ctx.activeTab === 'likes'))
                            return;
                        if (!(__VLS_ctx.activeTab === 'history'))
                            return;
                        if (!!(__VLS_ctx.historySongs.length === 0))
                            return;
                        __VLS_ctx.playSong(song);
                        // @ts-ignore
                        [activeTab, likedSongs, likedSongs, toggleLike, filteredLikedSongs, filteredLikedSongs, playSong, playSong, clearHistory, historySongs, historySongs,];
                    } },
                key: (song.id + '-' + index),
                ...{ class: "flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors group" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:bg-white/5']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-white/5']} */ ;
            /** @type {__VLS_StyleScopedClasses['last:border-0']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            /** @type {__VLS_StyleScopedClasses['group']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0" },
            });
            /** @type {__VLS_StyleScopedClasses['relative']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['h-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
            /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (song.al?.picUrl || 'https://picsum.photos/100?random=' + song.id),
                alt: (song.name),
                ...{ class: "w-full object-cover" },
            });
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center" },
            });
            /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
            /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
            /** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
            /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
            /** @type {__VLS_StyleScopedClasses['group-hover:flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
                ...{ class: "fas fa-play text-white text-xs" },
            });
            /** @type {__VLS_StyleScopedClasses['fas']} */ ;
            /** @type {__VLS_StyleScopedClasses['fa-play']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-1 min-w-0" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
            /** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
                ...{ class: "text-sm font-bold text-white/80 truncate group-hover:text-purple-400 transition-colors" },
            });
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-white/80']} */ ;
            /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
            /** @type {__VLS_StyleScopedClasses['group-hover:text-purple-400']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            (song.name);
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "text-xs text-white/50 truncate" },
            });
            /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-white/50']} */ ;
            /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
            (song.ar?.[0]?.name || '未知歌手');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "text-xs text-white/40 font-mono hidden sm:block" },
            });
            /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-white/40']} */ ;
            /** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
            /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
            /** @type {__VLS_StyleScopedClasses['sm:block']} */ ;
            (__VLS_ctx.formatTime((song.dt || 0) / 1000));
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.error))
                            return;
                        if (!!(__VLS_ctx.activeTab === 'search'))
                            return;
                        if (!!(__VLS_ctx.activeTab === 'recommend'))
                            return;
                        if (!!(__VLS_ctx.activeTab === 'toplist'))
                            return;
                        if (!!(__VLS_ctx.activeTab === 'likes'))
                            return;
                        if (!(__VLS_ctx.activeTab === 'history'))
                            return;
                        if (!!(__VLS_ctx.historySongs.length === 0))
                            return;
                        __VLS_ctx.toggleLike(song);
                        // @ts-ignore
                        [toggleLike, formatTime,];
                    } },
                ...{ class: "p-2 rounded-full hover:bg-white/10 transition-colors" },
                ...{ class: (__VLS_ctx.isLiked(song.id) ? 'text-red-500' : 'text-white/30') },
            });
            /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
                ...{ class: (__VLS_ctx.isLiked(song.id) ? 'fas' : 'far') },
                ...{ class: "fa-heart" },
            });
            /** @type {__VLS_StyleScopedClasses['fa-heart']} */ ;
            // @ts-ignore
            [isLiked, isLiked,];
        }
    }
}
const __VLS_39 = LyricModal;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    ...{ 'onClose': {} },
    visible: (__VLS_ctx.showLyricModal),
    song: (__VLS_ctx.currentSong),
    lyrics: (__VLS_ctx.lyrics),
    currentTime: (__VLS_ctx.currentTime),
}));
const __VLS_41 = __VLS_40({
    ...{ 'onClose': {} },
    visible: (__VLS_ctx.showLyricModal),
    song: (__VLS_ctx.currentSong),
    lyrics: (__VLS_ctx.lyrics),
    currentTime: (__VLS_ctx.currentTime),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
let __VLS_44;
const __VLS_45 = ({ close: {} },
    { onClose: (...[$event]) => {
            __VLS_ctx.showLyricModal = false;
            // @ts-ignore
            [showLyricModal, showLyricModal, currentSong, lyrics, currentTime,];
        } });
var __VLS_42;
var __VLS_43;
const __VLS_46 = MusicPlayer;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    ...{ 'onTogglePlay': {} },
    ...{ 'onPrev': {} },
    ...{ 'onNext': {} },
    ...{ 'onToggleLike': {} },
    ...{ 'onToggleLyrics': {} },
    ...{ 'onToggleMute': {} },
    ...{ 'onSeek': {} },
    ...{ 'onSetVolume': {} },
    currentSong: (__VLS_ctx.currentSong),
    isPlaying: (__VLS_ctx.isPlaying),
    isLiked: (__VLS_ctx.currentSong ? __VLS_ctx.isLiked(__VLS_ctx.currentSong.id) : false),
    isMuted: (__VLS_ctx.volume === 0),
    currentTime: (__VLS_ctx.currentTime),
    duration: (__VLS_ctx.duration),
    volume: (__VLS_ctx.volume),
}));
const __VLS_48 = __VLS_47({
    ...{ 'onTogglePlay': {} },
    ...{ 'onPrev': {} },
    ...{ 'onNext': {} },
    ...{ 'onToggleLike': {} },
    ...{ 'onToggleLyrics': {} },
    ...{ 'onToggleMute': {} },
    ...{ 'onSeek': {} },
    ...{ 'onSetVolume': {} },
    currentSong: (__VLS_ctx.currentSong),
    isPlaying: (__VLS_ctx.isPlaying),
    isLiked: (__VLS_ctx.currentSong ? __VLS_ctx.isLiked(__VLS_ctx.currentSong.id) : false),
    isMuted: (__VLS_ctx.volume === 0),
    currentTime: (__VLS_ctx.currentTime),
    duration: (__VLS_ctx.duration),
    volume: (__VLS_ctx.volume),
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_51;
const __VLS_52 = ({ togglePlay: {} },
    { onTogglePlay: (__VLS_ctx.togglePlay) });
const __VLS_53 = ({ prev: {} },
    { onPrev: (__VLS_ctx.prevSong) });
const __VLS_54 = ({ next: {} },
    { onNext: (__VLS_ctx.nextSong) });
const __VLS_55 = ({ toggleLike: {} },
    { onToggleLike: (__VLS_ctx.toggleLike) });
const __VLS_56 = ({ toggleLyrics: {} },
    { onToggleLyrics: (__VLS_ctx.toggleLyricModal) });
const __VLS_57 = ({ toggleMute: {} },
    { onToggleMute: (__VLS_ctx.toggleMute) });
const __VLS_58 = ({ seek: {} },
    { onSeek: (__VLS_ctx.seekTo) });
const __VLS_59 = ({ setVolume: {} },
    { onSetVolume: (__VLS_ctx.setVolume) });
var __VLS_49;
var __VLS_50;
// @ts-ignore
[isLiked, toggleLike, currentSong, currentSong, currentSong, currentTime, isPlaying, volume, volume, duration, togglePlay, prevSong, nextSong, toggleLyricModal, toggleMute, seekTo, setVolume,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=index.vue.js.map