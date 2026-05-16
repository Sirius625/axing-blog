/**
 * HTTP 请求工具模块（双服务架构）
 * 
 * 基于 Axios 封装，同时支持两个后端服务：
 * 1. 网易云音乐 API 代理服务（端口 3000）- 用于音乐播放、搜索等功能
 * 2. 本地管理后台服务（端口 3030）- 用于用户认证、歌曲管理、文章管理等功能
 * 
 * @module api/index
 */

import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

/** 统一请求结果类型 */
export interface RequestResult<T = any> {
  success: boolean
  code: number
  message: string
  data: T | null
  error?: any
}

/** 扩展的请求配置 */
export interface RequestConfig<T = any> extends AxiosRequestConfig {
  showSuccess?: boolean
  showError?: boolean
  successMessage?: string
}

/** 双服务 Axios 实例 */
const services = {
  /** 网易云音乐 API 代理（端口 3000） */
  music: axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
  }),
  /** 本地管理后台（端口 3030） */
  manage: axios.create({
    baseURL: import.meta.env.VITE_MANAGE_API_BASE_URL || 'http://localhost:3030',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
  })
}

// ==================== 管理后台拦截器 ====================

/** 为 manage 服务添加 Token 请求拦截器 */
services.manage.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, error => Promise.reject(error))

/** 标记是否已经处理过 Token 过期，避免重复提示 */
let tokenExpiredHandled = false

/** 为 manage 服务添加响应拦截器 - 自动处理 Token 过期 */
services.manage.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !tokenExpiredHandled) {
      tokenExpiredHandled = true
      // Token 过期，清除本地存储，转为游客模式
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('username')
      localStorage.removeItem('user_id')
      ElMessage.warning('登录已过期，部分功能可能受限')
      // 触发自定义事件，让 App.vue 中的 loginModel 弹窗打开
      window.dispatchEvent(new CustomEvent('token-expired'))
      // 3秒后重置标记，允许下次再提示
      setTimeout(() => { tokenExpiredHandled = false }, 3000)
    }
    return Promise.reject(error)
  }
)

/** 监听 token-expired 事件，同步更新 authStore 状态 */
window.addEventListener('token-expired', () => {
  import('@/store').then(({ useAuthStore }) => {
    const authStore = useAuthStore()
    authStore.isLoggedIn = false
    authStore.user = null
    authStore.token = ''
  })
})

/**
 * 通用请求函数
 * 支持选择不同的后端服务发送请求
 * 
 * @param service - 目标服务（'music' | 'manage'）
 * @param config - 请求配置
 * @returns 统一格式的响应结果
 */
const request = async <T = any>(
  service: 'music' | 'manage',
  config: RequestConfig
): Promise<RequestResult<T>> => {
  const { showSuccess = false, showError = true, successMessage, ...axiosConfig } = config

  try {
    const response = await services[service].request<T>(axiosConfig)
    const message = successMessage || '请求成功'

    if (showSuccess) {
      ElMessage.success(message)
    }

    return {
      success: true,
      code: response.status,
      message,
      data: response.data as T
    }
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      '请求失败，请稍后重试'

    if (showError) {
      ElMessage.error(message)
    }

    return {
      success: false,
      code: error?.response?.status || 500,
      message,
      data: null,
      error
    }
  }
}

// ===== 音乐服务（端口 3000）=====
/** GET 请求（音乐服务） */
export const get = async <T = any>(url: string, config: RequestConfig = {}) =>
  request<T>('music', { url, method: 'GET', ...config })

/** POST 请求（音乐服务） */
export const post = async <T = any>(url: string, data?: any, config: RequestConfig = {}) =>
  request<T>('music', { url, method: 'POST', data, ...config })

/** PUT 请求（音乐服务） */
export const put = async <T = any>(url: string, data?: any, config: RequestConfig = {}) =>
  request<T>('music', { url, method: 'PUT', data, ...config })

/** DELETE 请求（音乐服务） */
export const del = async <T = any>(url: string, config: RequestConfig = {}) =>
  request<T>('music', { url, method: 'DELETE', ...config })

// ===== 管理后台服务（端口 3030）=====
/** GET 请求（管理后台服务） */
export const get1 = async <T = any>(url: string, config: RequestConfig = {}) =>
  request<T>('manage', { url, method: 'GET', ...config })

/** POST 请求（管理后台服务） */
export const post1 = async <T = any>(url: string, data?: any, config: RequestConfig = {}) =>
  request<T>('manage', { url, method: 'POST', data, ...config })

/** PUT 请求（管理后台服务） */
export const put1 = async <T = any>(url: string, data?: any, config: RequestConfig = {}) =>
  request<T>('manage', { url, method: 'PUT', data, ...config })

/** DELETE 请求（管理后台服务） */
export const del1 = async <T = any>(url: string, config: RequestConfig = {}) =>
  request<T>('manage', { url, method: 'DELETE', ...config })
