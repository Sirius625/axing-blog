import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

export interface RequestResult<T = any> {
  success: boolean
  code: number
  message: string
  data: T | null
  error?: any
}

export interface RequestConfig<T = any> extends AxiosRequestConfig {
  showSuccess?: boolean
  showError?: boolean
  successMessage?: string
}

// 创建两个 axios 实例，分别对应不同后端服务
const services = {
  // 网易云音乐 API 代理 (端口 3000)
  music: axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
  }),
  // 本地管理后台 (端口 3030)
  manage: axios.create({
    baseURL: import.meta.env.MANAGE_API_BASE_URL || 'http://localhost:3030',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 为 manage 服务添加 token 拦截器
services.manage.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, error => Promise.reject(error))

// 通用请求函数
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

// ===== 音乐服务 (端口 3000) =====
export const get = async <T = any>(url: string, config: RequestConfig = {}) =>
  request<T>('music', { url, method: 'GET', ...config })

export const post = async <T = any>(url: string, data?: any, config: RequestConfig = {}) =>
  request<T>('music', { url, method: 'POST', data, ...config })

export const put = async <T = any>(url: string, data?: any, config: RequestConfig = {}) =>
  request<T>('music', { url, method: 'PUT', data, ...config })

export const del = async <T = any>(url: string, config: RequestConfig = {}) =>
  request<T>('music', { url, method: 'DELETE', ...config })

// ===== 管理后台服务 (端口 3030) =====
export const get1 = async <T = any>(url: string, config: RequestConfig = {}) =>
  request<T>('manage', { url, method: 'GET', ...config })

export const post1 = async <T = any>(url: string, data?: any, config: RequestConfig = {}) =>
  request<T>('manage', { url, method: 'POST', data, ...config })

export const put1 = async <T = any>(url: string, data?: any, config: RequestConfig = {}) =>
  request<T>('manage', { url, method: 'PUT', data, ...config })

export const del1 = async <T = any>(url: string, config: RequestConfig = {}) =>
  request<T>('manage', { url, method: 'DELETE', ...config })
