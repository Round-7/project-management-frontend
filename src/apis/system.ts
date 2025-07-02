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
