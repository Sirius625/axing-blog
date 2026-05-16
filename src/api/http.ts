/**
 * 网易云音乐 API 接口层
 * 
 * 封装所有网易云音乐 API 代理调用，提供推荐歌单、排行榜、歌曲播放、歌词、搜索等功能。
 * 
 * @module api/http
 */

import { get, post, put } from './index'

/** 获取仪表盘统计数据 */
export const fetchDashboardStats = () => get('/dashboard/stats')

/**
 * 获取推荐歌单
 * @param num - 获取数量
 */
export const getPersonalized = async (num: number) => {
  const result = await get(`/personalized?limit=${num}`)
  return result.data || { success: false }
}

/** 获取歌单排行榜详情 */
export const getToplist = async () => {
  const result = await get('/toplist/detail')
  return {
    data: result?.data || []
  }
}

/**
 * 获取歌单详情
 * @param id - 歌单ID
 */
export const getTetail = async (id: number) => {
  const result = await get(`/playlist/detail?id=${id}`)
  return {
    data: result?.data || []
  }
}

/**
 * 获取歌曲播放 URL
 * @param id - 歌曲ID
 */
export const getSongUrl = async (id: number) => {
  const result = await get(`/song/url?id=${id}`)
  return {
    data: result?.data?.data || []
  }
}

/**
 * 获取歌曲歌词
 * @param id - 歌曲ID
 */
export const getLyric = async (id: number) => {
  const result = await get(`/lyric?id=${id}`)
  return {
    data: result?.data?.lrc?.lyric || []
  }
}

/**
 * 搜索接口
 * @param keywords - 搜索关键词
 * @param limit - 返回数量限制
 * @param type - 搜索类型（1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户）
 */
export const getSearch = async (keywords: any, limit: number, type: number) => {
  const result = await get(`/search?keywords=${keywords}&limit=${limit}&type=${type}`)
  return {
    data: result?.data || []
  }
}


