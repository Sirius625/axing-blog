/**
 * 管理后台 API 接口层
 *
 * 封装所有管理后台 API 调用，提供用户认证、歌曲管理、播放历史、博客文章等功能。
 *
 * @module api/http1
 */

import { get1, post1, put1, del1 } from './index'

// ==================== 用户认证 ====================

/** 用户注册 */
export const registerUser = async (userData: {
  name: string
  password: string
  email: string
  role: string
}) => {
  const result = await post1('/api/auth/register', userData)
  return result.data
}

/** 用户登录 */
export const loginUser = async (username: string, password: string) => {
  const result = await post1('/api/auth/login', { username, password })
  return result.data || null
}

// ==================== 喜欢的歌曲 ====================

/** 获取喜欢的歌曲列表（分页） */
export const fetchLikedSongs = async ({ keyword = '', page = 1, pageSize = 5 } = {}) => {
  const result = await get1<{ data: Array<any>; total: number }>('/api/liked-songs', {
    params: { keyword, page, pageSize }
  })
  return result.data || { data: [], total: 0 }
}

/** 歌曲数据结构 */
export interface SongData {
  id: number
  name: string
  ar: { name: string }[]
  al: { picUrl: string; name?: string }
  dt: number // 歌曲时长（毫秒）
}

/** 喜欢/取消喜欢响应结构 */
interface ToggleLikeResponse {
  code: number
  message: string
  action: 'added' | 'deleted'
}

/**
 * 切换歌曲喜欢状态
 * @param song - 歌曲完整信息对象
 */
export const toggleLikeSong = (song: SongData) => {
  return post1<ToggleLikeResponse>('/api/songs', {
    id: song.id,
    name: song.name,
    ar: song.ar,
    al: song.al,
    dt: song.dt
  })
}

/** 获取喜欢的歌曲列表（管理后台） */
export const getSongs = async (page: number, pageSize: number = 100) => {
  const result = await get1<{ data: any }>('/api/songs', {
    params: { page, pageSize }
  })
  return result.data || { data: null }
}

// ==================== 播放历史 ====================

/** 添加播放历史 */
export const addHistory = (song: SongData) => {
  return post1<ToggleLikeResponse>('/api/history', {
    id: song.id,
    name: song.name,
    ar: song.ar,
    al: song.al,
    dt: song.dt
  })
}

/** 获取播放历史列表 */
export const getHistory = async (page: number, pageSize: number = 50) => {
  const result = await get1<{ data: any }>('/api/history', {
    params: { page, pageSize }
  })
  return result.data || { data: null }
}

/** 清空播放历史 */
export const deleteHistory = async () => {
  const result = await del1<{ data: any }>('/api/history/clear')
  return result.data || { data: null }
}

/**
 * 记录播放并同步更新播放次数
 *
 * 逻辑：
 * 1. 在 history_songs 中记录/更新播放信息，并将 play_count + 1
 * 2. 检查 liked_songs 中是否存在该歌曲，如果存在，也将 play_count + 1
 *
 * @param song - 歌曲信息对象
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

// ==================== 博客文章 ====================

/** 文章数据结构 */
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

/**
 * 获取文章列表（分页）
 * @param params.page - 页码
 * @param params.pageSize - 每页条数
 * @param params.category - 分类筛选
 * @param params.keyword - 搜索关键词
 */
export const getArticles = async (
  params: { page?: number; pageSize?: number; category?: string; keyword?: string } = {}
) => {
  const result = await get1<{ success: boolean; data: Article[]; total: number }>('/api/articles', {
    params
  })
  if (result.data && result.data.success) {
    return { data: result.data.data, total: result.data.total }
  }
  return { data: [], total: 0 }
}

/** 获取文章详情 */
export const getArticle = async (id: number) => {
  const result = await get1<{ success: boolean; data: Article }>('/api/articles/' + id)
  if (result.data && result.data.success) {
    return result.data.data
  }
  return null
}

/** 创建文章 */
export const createArticle = async (data: {
  title: string
  content: string
  summary?: string
  category?: string
  tags?: string[]
  cover?: string
}) => {
  const result = await post1<{ success: boolean; data: { id: number } }>('/api/articles', data)
  if (result.data && result.data.success) {
    return result.data.data
  }
  return null
}

/** 更新文章 */
export const updateArticle = async (
  id: number,
  data: {
    title: string
    content: string
    summary?: string
    category?: string
    tags?: string[]
    cover?: string
  }
) => {
  const result = await put1<{ success: boolean }>('/api/articles/' + id, data)
  return result.data
}

/** 删除文章 */
export const deleteArticle = async (id: number) => {
  const result = await del1<{ success: boolean }>('/api/articles/' + id)
  return result.data
}

/** 点赞文章 */
export const likeArticle = async (id: number) => {
  const result = await post1<{ success: boolean }>('/api/articles/' + id + '/like')
  return result.data
}

/** 获取文章分类列表 */
export const getArticleCategories = async () => {
  const result = await get1<{ success: boolean; data: string[] }>('/api/articles/categories')
  if (result.data && result.data.success) {
    return result.data.data
  }
  return []
}

// ==================== 视频管理 ====================

/** 视频数据结构 */
export interface VideoData {
  id: number
  title: string
  description: string
  url: string
  file_size: number
  duration: number
  author: string
  user_id: number
  is_public: number
  created_at: string
}

/** 获取视频列表 */
export const getVideos = async (
  params: { page?: number; pageSize?: number; keyword?: string } = {}
) => {
  const result = await get1<{ data: VideoData[]; total: number }>('/api/videos', { params })
  return result.data || { data: [], total: 0 }
}

/** 上传视频 */
export const uploadVideo = async (data: {
  title: string
  description: string
  isPublic: boolean
  videoBase64: string
}) => {
  const result = await post1<{ data: VideoData }>('/api/videos/upload', data)
  return result.data || null
}

/** 删除视频 */
export const deleteVideo = async (id: number) => {
  const result = await del1<{ message: string }>('/api/videos/' + id)
  return result.data || null
}
