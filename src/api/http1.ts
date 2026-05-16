import { get1, post1, put1, del1 } from './index'

export const registerUser = async (userData: { name: string; password: string; email: string; role: string }) => {
    const result = await post1('/api/auth/register', userData)
    return result.data
}

export const loginUser = async (username: string, password: string) => {
    const result = await post1('/api/auth/login', { username, password })
    return result.data || null
}

export const fetchLikedSongs = async ({ keyword = '', page = 1, pageSize = 5 } = {}) => {
    const result = await get1<{ data: Array<any>; total: number }>('/api/liked-songs', {
        params: { keyword, page, pageSize }
    })
    return result.data || { data: [], total: 0 }
}

// 定义歌曲对象的结构接口（根据你提供的 Proxy 对象结构）
export interface SongData {
    id: number
    name: string
    ar: { name: string }[]
    al: { picUrl: string, name?: string }
    dt: number // duration
}


// 定义接口返回的数据结构
interface ToggleLikeResponse {
    code: number;
    message: string;
    action: 'added' | 'deleted';
}

/**
 * 切换歌曲喜欢状态
 * @param song 歌曲完整信息对象
 * @returns Promise<ToggleLikeResponse>
 */
export const toggleLikeSong = (song: SongData) => {
    return post1<ToggleLikeResponse>('/api/songs', {
        id: song.id,
        name: song.name,
        ar: song.ar,
        al: song.al,
        dt: song.dt
    });
};

export const getSongs = async (page: number, pageSize: number = 100) => {
  const result = await get1<{ data: any }>('/api/songs', {
    params: { page, pageSize }
  })
  return result.data || { data: null }
}

export const addHistory = (song: SongData) => {
    return post1<ToggleLikeResponse>('/api/history', {
        id: song.id,
        name: song.name,
        ar: song.ar,
        al: song.al,
        dt: song.dt
    });
};

export const getHistory = async (page: number, pageSize: number = 50) => {
  const result = await get1<{ data: any }>('/api/history', {
    params: { page, pageSize }
  })
  return result.data || { data: null }
}

export const deleteHistory = async () => {
  const result = await del1<{ data: any }>('/api/history/clear')
  return result.data || { data: null }
}

/**
 * 记录播放并同步更新播放次数
 * POST /api/songs/play-sync/:id
 * 逻辑：
 * 1. 在 history_songs 中记录/更新播放信息，并将 play_count + 1
 * 2. 检查 liked_songs 中是否存在该歌曲，如果存在，也将 play_count + 1
 */
export const playSongCount = async (song: SongData) => {
  const result = await post1<{ data: any }>('/api/songs/play-sync/' + song.id, {
    id: song.id,
    name: song.name,
    ar: song.ar,
    al: song.al,
    dt: song.dt
  })
  return result.data || { data: null }
}

// ==================== 博客文章 API ====================

export interface Article {
  id: number
  title: string
  content: string
  summary: string
  category: string
  tags: string[]
  cover: string
  author: string
  likes: number
  views: number
  created_at: string
  updated_at: string
}

export const getArticles = async (params: { page?: number; pageSize?: number; category?: string; keyword?: string } = {}) => {
  const result = await get1<{ success: boolean; data: Article[]; total: number }>('/api/articles', { params })
  // result.data = { success: true, data: [...], total: N }
  if (result.data && result.data.success) {
    return { data: result.data.data, total: result.data.total }
  }
  return { data: [], total: 0 }
}

export const getArticle = async (id: number) => {
  const result = await get1<{ success: boolean; data: Article }>('/api/articles/' + id)
  if (result.data && result.data.success) {
    return result.data.data
  }
  return null
}

export const createArticle = async (data: { title: string; content: string; summary?: string; category?: string; tags?: string[]; cover?: string }) => {
  const result = await post1<{ success: boolean; data: { id: number } }>('/api/articles', data)
  if (result.data && result.data.success) {
    return result.data.data
  }
  return null
}

export const updateArticle = async (id: number, data: { title: string; content: string; summary?: string; category?: string; tags?: string[]; cover?: string }) => {
  const result = await put1<{ success: boolean }>('/api/articles/' + id, data)
  return result.data
}

export const deleteArticle = async (id: number) => {
  const result = await del1<{ success: boolean }>('/api/articles/' + id)
  return result.data
}

export const likeArticle = async (id: number) => {
  const result = await post1<{ success: boolean }>('/api/articles/' + id + '/like')
  return result.data
}

export const getArticleCategories = async () => {
  const result = await get1<{ success: boolean; data: string[] }>('/api/articles/categories')
  if (result.data && result.data.success) {
    return result.data.data
  }
  return []
}
