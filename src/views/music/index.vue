<template>
  <div
    class="flex flex-col md:flex-row min-h-screen text-gray-200 font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white"
    style="background: linear-gradient(135deg, #1e1b4b, #312e81, #3730a3)"
  >
    <!-- 侧边栏 -->
    <MusicSidebar :activeTab="activeTab" :likedCount="likedSongs.length" @switchTab="switchTab" />

    <!-- 主内容区 -->
    <main class="flex-1 flex flex-col relative overflow-hidden bg-transparent music-main">
      <!-- 移动端顶部导航 Tab -->
      <div
        class="flex md:hidden sticky top-0 z-30 px-2 pt-1"
        style="touch-action: none; background: transparent;"
      >
        <button
          v-for="tab in mobileTabs"
          :key="tab.id"
          @click="switchTab(tab.id)"
          :class="activeTab === tab.id ? 'text-purple-300 bg-white/10 shadow-lg shadow-purple-500/10' : 'text-white/40 hover:text-white/70'"
          class="flex-1 flex flex-col items-center py-2.5 mx-1 rounded-xl text-xs font-medium transition-all duration-300"
        >
          <i :class="tab.icon" class="text-base mb-1"></i>
          <span class="tracking-wide">{{ tab.label }}</span>
        </button>
      </div>

      <!-- 顶部搜索栏（桌面端始终显示，移动端仅在搜索 Tab 显示） -->
      <div :class="['md:block', activeTab === 'search' ? 'block' : 'hidden md:block']">
        <MusicSearch
          v-model="searchQuery"
          :history="searchHistory"
          @search="handleSearch"
          @clearHistory="clearSearchHistory"
          @removeHistory="removeSearchHistory"
        />
      </div>

      <!-- 内容滚动区域 -->
      <div
        class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 pb-36 md:pb-36"
        ref="scrollContainer"
      >
        <!-- 加载状态 -->
        <div v-if="loading" class="flex flex-col items-center justify-center h-64 text-white/50">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mb-4"></div>
          <p>正在加载音乐数据...</p>
        </div>

        <!-- 错误提示 -->
        <div
          v-else-if="error"
          class="flex flex-col items-center justify-center h-64 text-red-400 bg-red-500/10 rounded-xl border border-red-500/20 p-6"
        >
          <i class="fas fa-exclamation-circle text-3xl mb-3"></i>
          <p class="font-medium">{{ error }}</p>
          <button
            @click="refreshData"
            class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            重试
          </button>
        </div>

        <!-- 搜索结果视图 -->
        <div v-else-if="activeTab === 'search'" class="space-y-8 animate-fade-in">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white">
              搜索 "<span class="text-purple-400">{{ searchQuery }}</span
              >" 的结果
            </h2>
            <span class="text-sm text-white/50">共找到 {{ searchResults.length }} 首歌曲</span>
          </div>

          <div
            v-if="searchResults.length === 0"
            class="text-center py-20 text-white/40 bg-white/5 rounded-xl border border-dashed border-white/10"
          >
            <i class="fas fa-search text-4xl mb-4 opacity-30"></i>
            <p>未找到相关歌曲，换个关键词试试？</p>
          </div>

          <SongTable
            v-else
            :songs="searchResults"
            :isLiked="isLiked"
            @play="playSongFromSearch"
            @toggleLike="toggleLike"
          />
        </div>

        <!-- 1. 推荐歌单视图 -->
        <div v-else-if="activeTab === 'recommend'" class="space-y-8 animate-fade-in">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white flex items-center gap-2">
              推荐歌单 <i class="fas fa-chevron-right text-sm text-white/40 mt-1"></i>
            </h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <PlaylistCard
              v-for="playlist in playlists"
              :key="playlist.id"
              :playlist="playlist"
              @select="(p: any) => getPlaylistDetail(p.id)"
            />
          </div>
        </div>

        <!-- 2. 排行榜视图 -->
        <div v-else-if="activeTab === 'toplist'" class="space-y-8 animate-fade-in">
          <h2 class="text-2xl font-bold text-white">官方排行榜</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div
              v-for="list in toplistData"
              :key="list.id"
              @click="getPlaylistDetail(list.id)"
              class="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-xl p-3 shadow-sm hover:shadow-lg transition-all border border-white/10 flex flex-col"
            >
              <div class="relative aspect-square rounded-lg overflow-hidden mb-3">
                <img
                  :src="list.coverImgUrl"
                  :alt="list.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3"
                >
                  <span class="text-white text-xs font-bold">点击播放</span>
                </div>
              </div>
              <h3 class="font-bold text-white/80 truncate">{{ list.name }}</h3>
              <p class="text-xs text-white/50 mt-1 line-clamp-2">
                {{ list.updateFrequency || '每日更新' }}
              </p>
            </div>
          </div>
        </div>

        <!-- 3. 我喜欢的视图 -->
        <div v-else-if="activeTab === 'likes'" class="space-y-4 md:space-y-6 animate-fade-in">
          <div
            class="flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 p-4 md:p-8 rounded-2xl text-white shadow-lg shadow-purple-500/30 gap-4"
          >
            <div class="flex items-center gap-4 md:gap-6">
              <div
                class="w-16 h-16 md:w-32 md:h-32 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner flex-shrink-0"
              >
                <i class="fas fa-heart text-2xl md:text-5xl text-white/90"></i>
              </div>
              <div>
                <h2 class="text-xl md:text-3xl font-bold mb-1 md:mb-2">我喜欢的音乐</h2>
                <p class="text-white/80 text-xs md:text-sm">
                  {{ filteredLikedSongs.length }} 首歌曲
                </p>
              </div>
            </div>
            <button
              @click="playAllLiked"
              class="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <i class="fas fa-play"></i> 播放全部
            </button>
          </div>

          <!-- 我喜欢的搜索栏 -->
          <div class="relative">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-white/40"></i>
            <input
              v-model="likedSearchQuery"
              type="text"
              placeholder="在喜欢的歌曲中搜索..."
              class="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:bg-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 placeholder-white/30 text-white"
            />
            <button
              v-if="likedSearchQuery"
              @click="likedSearchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
            >
              <i class="fas fa-times-circle"></i>
            </button>
          </div>

          <div
            v-if="filteredLikedSongs.length === 0"
            class="text-center py-20 text-white/40 bg-white/5 rounded-xl border border-dashed border-white/10"
          >
            <i v-if="likedSongs.length === 0" class="fas fa-music text-4xl mb-4 opacity-30"></i>
            <i v-else class="fas fa-search text-4xl mb-4 opacity-30"></i>
            <p>
              {{ likedSongs.length === 0 ? '暂无喜欢的歌曲，快去添加吧！' : '未找到匹配的歌曲' }}
            </p>
          </div>

          <SongTable
            v-else
            :songs="filteredLikedSongs"
            :isLiked="() => true"
            @play="playSong"
            @toggleLike="toggleLike"
          />
        </div>

        <!-- 4. 最近播放视图 -->
        <div v-else-if="activeTab === 'history'" class="space-y-6 animate-fade-in">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white flex items-center gap-2">
              <i class="fas fa-history text-white/40"></i> 最近播放
            </h2>
            <button
              @click="clearHistory"
              class="text-xs text-white/40 hover:text-purple-400 transition-colors px-3 py-1 border border-white/20 rounded-full hover:border-purple-500/50"
            >
              清空历史
            </button>
          </div>

          <div
            v-if="historySongs.length === 0"
            class="text-center py-20 text-white/40 bg-white/5 rounded-xl border border-dashed border-white/10"
          >
            <i class="fas fa-clock text-4xl mb-4 opacity-30"></i>
            <p>暂无播放记录</p>
          </div>

          <div
            v-else
            class="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border border-white/10 overflow-hidden"
          >
            <div
              v-for="(song, index) in historySongs"
              :key="song.id + '-' + index"
              @click="playSong(song)"
              class="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors group"
            >
              <div class="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                <img
                  :src="song.al?.picUrl || 'https://picsum.photos/100?random=' + song.id"
                  :alt="song.name"
                  class="w-full object-cover"
                />
                <div
                  class="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center"
                >
                  <i class="fas fa-play text-white text-xs"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h4
                  class="text-sm font-bold text-white/80 truncate group-hover:text-purple-400 transition-colors"
                >
                  {{ song.name }}
                </h4>
                <p class="text-xs text-white/50 truncate">{{ song.ar?.[0]?.name || '未知歌手' }}</p>
              </div>
              <div class="text-xs text-white/40 font-mono hidden sm:block">
                {{ formatTime((song.dt || 0) / 1000) }}
              </div>
              <button
                @click.stop="toggleLike(song)"
                class="p-2 rounded-full hover:bg-white/10 transition-colors"
                :class="isLiked(song.id) ? 'text-red-500' : 'text-white/30'"
              >
                <i :class="isLiked(song.id) ? 'fas' : 'far'" class="fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
  import { useAuthStore } from '@/store'
  import { useMessage } from '@/composables/useMessage'
  const msg = useMessage()
  import { usePlayerStore } from '@/store/player'
  import { getPersonalized, getToplist, getTetail, getSearch } from '@/api/http'
  import { toggleLikeSong, getSongs, addHistory, getHistory, deleteHistory } from '@/api/http1'
  import MusicSidebar from '@/components/music/MusicSidebar.vue'
  import MusicSearch from '@/components/music/MusicSearch.vue'
  // 条件渲染组件 - 动态导入
  const SongTable = defineAsyncComponent(() => import('@/components/music/SongTable.vue'))
  const PlaylistCard = defineAsyncComponent(() => import('@/components/music/PlaylistCard.vue'))

  // --- 类型定义 ---
  interface Playlist {
    id: number
    name: string
    coverImgUrl: string
    playCount: number
    creator?: { nickname: string }
    copywriter: string
  }

  interface Song {
    id: number
    name: string
    ar: { name: string }[]
    al: { picUrl: string; name?: string }
    dt: number
  }

  // 使用全局播放器 store
  const playerStore = usePlayerStore()

  // 移动端底部导航 Tab 配置
  const mobileTabs = [
    { id: 'recommend' as const, label: '推荐', icon: 'fas fa-compass' },
    { id: 'toplist' as const, label: '排行榜', icon: 'fas fa-trophy' },
    { id: 'likes' as const, label: '喜欢', icon: 'fas fa-heart' },
    { id: 'history' as const, label: '历史', icon: 'fas fa-history' },
    { id: 'search' as const, label: '搜索', icon: 'fas fa-search' }
  ]

  const playlists = ref<Playlist[]>([])
  const toplistData = ref<any[]>([])
  const searchQuery = ref('')
  const likedSearchQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const activeTab = ref<'recommend' | 'toplist' | 'likes' | 'history' | 'search'>('recommend')

  // 持久化数据
  const likedSongs = ref<Song[]>([])
  const historySongs = ref<Song[]>([])
  const searchHistory = ref<string[]>([])

  // 我喜欢的列表过滤
  const filteredLikedSongs = computed(() => {
    const query = likedSearchQuery.value.trim().toLowerCase()
    if (!query) return likedSongs.value
    return likedSongs.value.filter((song) => {
      const nameMatch = song.name.toLowerCase().includes(query)
      const artistMatch = song.ar?.[0]?.name?.toLowerCase().includes(query)
      const albumMatch = song.al?.name?.toLowerCase().includes(query)
      return nameMatch || artistMatch || albumMatch
    })
  })

  const searchResults = ref<Song[]>([])

  // --- 方法 ---

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // 切换 Tab
  const switchTab = (tab: 'recommend' | 'toplist' | 'likes' | 'history' | 'search') => {
    activeTab.value = tab
    if (tab === 'toplist' && toplistData.value.length === 0) {
      fetchTopList()
    }
  }

  // 获取推荐歌单
  const fetchRecommendPlaylists = async () => {
    loading.value = true
    error.value = null
    try {
      const songNum = 20
      const response = await getPersonalized(songNum)
      playlists.value = response.result || []
    } catch (e) {
      console.warn('Failed to fetch from local backend, using mock data', e)
      error.value = '无法获取推荐歌单，请重试。'
    } finally {
      loading.value = false
    }
  }

  // 获取排行榜
  const fetchTopList = async () => {
    loading.value = true
    try {
      const res = await getToplist()
      toplistData.value = res.data.list || []
    } catch (e) {
      console.error('Fetch toplist error', e)
      error.value = '无法获取推荐歌单，请重试。'
    } finally {
      loading.value = false
    }
  }

  // 获取歌单详情并播放第一首
  const getPlaylistDetail = async (id: number) => {
    loading.value = true
    try {
      const response = await getTetail(id)
      const tracks = response.data.playlist?.tracks || []
      if (tracks.length > 0) {
        const songs: Song[] = tracks.map((t: any) => ({
          id: t.id,
          name: t.name,
          ar: t.ar || [{ name: 'Unknown' }],
          al: t.al || { picUrl: '', name: '' },
          dt: t.dt || 0
        }))
        playerStore.setPlayQueue(songs, 0)
      }
    } catch (e) {
      console.error('Failed to get playlist detail', e)
    } finally {
      loading.value = false
    }
  }

  // 播放歌曲 - 委托给全局 store
  const playSong = (song: Song) => {
    playerStore.playSong(song)
  }

  // 从搜索结果播放
  const playSongFromSearch = (song: Song, index: number) => {
    playerStore.setPlayQueue(searchResults.value, index)
  }

  // --- 搜索逻辑 ---
  const handleSearch = async (keyword?: string) => {
    keyword = (keyword || searchQuery.value).trim()
    if (!keyword) return
    saveSearchHistory(keyword)
    activeTab.value = 'search'
    loading.value = true
    error.value = null
    try {
      const res = await getSearch(keyword, 30, 1)
      const data = res.data
      if (data.result && data.result.songs) {
        searchResults.value = data.result.songs.map((s: any) => ({
          id: s.id,
          name: s.name,
          ar: s.artists || [{ name: 'Unknown' }],
          al: s.album || { picUrl: '', name: '' },
          dt: s.duration || 0
        }))
      } else {
        searchResults.value = []
      }
    } catch (e) {
      console.error('Search error', e)
      error.value = '搜索失败，请检查网络连接'
      searchResults.value = []
    } finally {
      loading.value = false
    }
  }

  // --- 搜索历史管理 ---
  const saveSearchHistory = (keyword: string) => {
    const index = searchHistory.value.indexOf(keyword)
    if (index !== -1) {
      searchHistory.value.splice(index, 1)
    }
    searchHistory.value.unshift(keyword)
    if (searchHistory.value.length > 10) {
      searchHistory.value.pop()
    }
    localStorage.setItem('search_history', JSON.stringify(searchHistory.value))
  }

  const removeSearchHistory = (index: number) => {
    searchHistory.value.splice(index, 1)
    localStorage.setItem('search_history', JSON.stringify(searchHistory.value))
  }

  const clearSearchHistory = () => {
    searchHistory.value = []
    localStorage.removeItem('search_history')
  }

  const refreshData = () => {
    if (activeTab.value === 'recommend') fetchRecommendPlaylists()
    else if (activeTab.value === 'toplist') fetchTopList()
  }

  // --- 喜欢与历史逻辑 ---
  const isLiked = (id: number) => likedSongs.value.some((s) => s.id === id)

  const toggleLike = async (song: Song) => {
    // 未登录用户不允许喜欢操作
    if (!localStorage.getItem('token')) {
      msg.error('未登录，游客状态不能进行喜欢标记', 1000)
      return
    }
    try {
      await toggleLikeSong(song)
    } catch (e) {
      console.error('Like toggle error', e)
      return
    }
    const index = likedSongs.value.findIndex((s) => s.id === song.id)
    if (index !== -1) {
      likedSongs.value.splice(index, 1)
    } else {
      likedSongs.value.unshift(song)
    }
  }

  const addToHistory = async (song: Song) => {
    try {
      await addHistory(song)
    } catch (e) {
      console.warn('Failed to add history on backend', e)
    }
    historySongs.value = historySongs.value.filter((s) => s.id !== song.id)
    historySongs.value.unshift(song)
    if (historySongs.value.length > 50) historySongs.value.pop()
    localStorage.setItem('play_history', JSON.stringify(historySongs.value))
  }

  const clearHistory = async () => {
    try {
      await deleteHistory()
      historySongs.value = []
      localStorage.removeItem('play_history')
    } catch (e) {
      console.warn('Failed to clear history on backend', e)
    }
  }

  const playAllLiked = () => {
    if (likedSongs.value.length > 0) {
      playerStore.setPlayQueue(likedSongs.value, 0)
    }
  }

  const getLikedSongs = async () => {
    if (!localStorage.getItem('token')) return
    try {
      const response = await getSongs(1, 100)
      likedSongs.value = response.data || []
    } catch (e) {
      console.warn('Failed to fetch liked songs (may be unauthenticated)', e)
    }
  }

  const getHistorySongs = async () => {
    if (!localStorage.getItem('token')) return
    try {
      const response = await getHistory(1, 50)
      historySongs.value = response.data || []
    } catch (e) {
      console.warn('Failed to fetch history songs (may be unauthenticated)', e)
    }
  }

  // --- 生命周期 ---
  onMounted(() => {
    // 不需要登录的接口 - 直接请求
    fetchRecommendPlaylists()

    // 需要登录的接口 - 先判断登录状态
    const authStore = useAuthStore()
    if (authStore.isLoggedIn) {
      getLikedSongs()
      getHistorySongs()
    }

    const savedHistory = localStorage.getItem('play_history')
    if (savedHistory) historySongs.value = JSON.parse(savedHistory)

    const savedSearchHistory = localStorage.getItem('search_history')
    if (savedSearchHistory) searchHistory.value = JSON.parse(savedSearchHistory)
  })
</script>

<style scoped>
  /* 桌面端主内容区两边留空 */
  @media (min-width: 768px) {
    .music-main {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
