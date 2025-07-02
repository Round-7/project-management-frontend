import axios from 'axios'
import { getApiBaseUrl } from './env'

// 获取API基础URL：优先使用环境变量，其次使用localStorage，最后使用默认值
export const getBaseUrl = (): string => {
  // 首先使用环境变量工具获取API URL
  const envApiUrl = getApiBaseUrl()

  // 其次检查localStorage
  const savedApiUrl = localStorage.getItem('apiUrl')
  if (savedApiUrl) {
    return savedApiUrl
  }

  // 如果环境变量有值则返回，否则使用默认值
  return envApiUrl
}

// 创建axios实例
export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器，确保每次请求都使用最新的baseURL
api.interceptors.request.use(config => {
  const currentBaseUrl = getBaseUrl()
  // 如果baseURL发生变化，则更新
  if (config.baseURL !== currentBaseUrl) {
    config.baseURL = currentBaseUrl
  }
  return config
})
