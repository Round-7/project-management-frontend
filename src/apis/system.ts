import to from 'await-to-js'
import type { ApiResponse, HealthInfo } from '@/types'
import { api } from '@/utils'

/**
 * 获取系统健康状态信息
 * @returns 系统健康状态信息
 */
export const getHealthInfo = async (): Promise<HealthInfo> => {
  const [error, response] = await to(
    api.get<ApiResponse<HealthInfo>>('/api/health')
  )

  if (error) {
    console.error('获取系统健康状态失败:', error)
    throw error
  }

  return response?.data.data
}

/**
 * 更新API基础URL
 * @param url 新的API基础URL
 */
export const updateApiBaseUrl = (url: string): void => {
  try {
    // 保存到localStorage
    localStorage.setItem('apiUrl', url)

    // 更新axios实例的baseURL
    api.defaults.baseURL = url
  } catch (error) {
    console.error('更新API基础URL失败:', error)
    throw error
  }
}

/**
 * 获取保存的API基础URL
 * @returns 保存的API基础URL或默认URL
 */
export const getSavedApiBaseUrl = (): string => {
  return localStorage.getItem('apiUrl') || import.meta.env.VITE_API_URL
}

/**
 * 初始化API配置
 * 从localStorage读取API基础URL并应用到axios实例
 */
export const initApiConfig = (): void => {
  const savedApiUrl = getSavedApiBaseUrl()
  api.defaults.baseURL = savedApiUrl
  console.log('API基础URL已初始化为:', savedApiUrl)
}
