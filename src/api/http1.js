import { get1, post1, del1 } from './index';
export const registerUser = async (userData) => {
    const result = await post1('/api/auth/register', userData);
    return result.data;
};
export const loginUser = async (username, password) => {
    const result = await post1('/api/auth/login', { username, password });
    return result.data || null;
};
export const fetchLikedSongs = async ({ keyword = '', page = 1, pageSize = 5 } = {}) => {
    const result = await get1('/api/liked-songs', {
        params: { keyword, page, pageSize }
    });
    return result.data || { data: [], total: 0 };
};
/**
 * 切换歌曲喜欢状态
 * @param song 歌曲完整信息对象
 * @returns Promise<ToggleLikeResponse>
 */
export const toggleLikeSong = (song) => {
    return post1('/api/songs', {
        id: song.id,
        name: song.name,
        ar: song.ar,
        al: song.al,
        dt: song.dt
    });
};
export const getSongs = async (page, pageSize = 100) => {
    const result = await get1('/api/songs', {
        params: { page, pageSize }
    });
    return result.data || { data: null };
};
export const addHistory = (song) => {
    return post1('/api/history', {
        id: song.id,
        name: song.name,
        ar: song.ar,
        al: song.al,
        dt: song.dt
    });
};
export const getHistory = async (page, pageSize = 50) => {
    const result = await get1('/api/history', {
        params: { page, pageSize }
    });
    return result.data || { data: null };
};
export const deleteHistory = async () => {
    const result = await del1('/api/history/clear');
    return result.data || { data: null };
};
/**
 * 记录播放并同步更新播放次数
 * POST /api/songs/play-sync/:id
 * 逻辑：
 * 1. 在 history_songs 中记录/更新播放信息，并将 play_count + 1
 * 2. 检查 liked_songs 中是否存在该歌曲，如果存在，也将 play_count + 1
 */
export const playSongCount = async (song) => {
    const result = await post1('/api/songs/play-sync/' + song.id, {
        id: song.id,
        name: song.name,
        ar: song.ar,
        al: song.al,
        dt: song.dt
    });
    return result.data || { data: null };
};
//# sourceMappingURL=http1.js.map