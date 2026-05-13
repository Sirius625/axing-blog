import { get, post, put } from './index'

export const fetchDashboardStats = () => get('/dashboard/stats')
// 推荐歌单接口
export const getPersonalized = async (num: number) => {
  const result = await get(`/personalized?limit=${num}`)
  return result.data || { success: false }
}
// 获取歌单排行榜接口
export const getToplist = async () => {
  const result = await get('/toplist/detail')
  return {
    data: result?.data || []
  }
}
// 获取歌单详情并播放第一首
export const getTetail = async (id: number) => {
  const result = await get(`/playlist/detail?id=${id}`)
  return {
    data: result?.data || []
  }
}
// 获取歌曲URL接口
export const getSongUrl = async (id: number) => {
  const result = await get(`/song/url?id=${id}`)
  return {
    data: result?.data?.data || []
  }
}
// 获取歌曲歌词接口
export const getLyric = async (id: number) => {
  const result = await get(`/lyric?id=${id}`)
  return {
    data: result?.data?.lrc?.lyric || []
  }
}
// 搜索接口
export const getSearch = async (keywords: any, limit: number, type: number) => {
  const result = await get(`/search?keywords=${keywords}&limit=${limit}&type=${type}`)
  return {
    data: result?.data || []
  }
}


