import to from 'await-to-js'
import { api } from '@/utils'
import type {
  Project,
  ProjectQueryParams,
  ProjectStats,
  PaginatedResponse,
  ApiResponse
} from '@/types'

/**
 * 获取项目列表
 * @param params 查询参数
 * @returns 分页项目列表
 */
export const getProjects = async (params: ProjectQueryParams = {}) => {
  const [error, response] = await to(
    api.get<ApiResponse<PaginatedResponse<Project>>>('/api/projects', {
      params
    })
  )
  if (error) {
    throw error
  }
  return response?.data.data
}

/**
 * 获取项目详情
 * @param id 项目ID
 * @returns 项目详情
 */
export const getProjectById = async (id: string): Promise<Project> => {
  const [error, response] = await to(
    api.get<ApiResponse<Project>>(`/api/projects/${id}`)
  )
  if (error) {
    throw error
  }
  return response?.data.data
}

/**
 * 获取项目统计数据
 * @returns 项目统计数据
 */
export const getProjectStats = async (): Promise<ProjectStats> => {
  const [error, response] = await to(
    api.get<ApiResponse<ProjectStats>>('/api/projects/stats')
  )
  if (error) {
    console.error('获取项目统计数据失败:', error)
    throw error
  }
  return response?.data.data
}

/**
 * 导入项目数据
 * @param file Excel文件
 * @returns 导入结果
 */
export const importProjects = async (
  file: File
): Promise<{ successCount: number; failCount: number }> => {
  const formData = new FormData()
  formData.append('file', file)

  const [error, response] = await to(
    api.post<ApiResponse<{ successCount: number; failCount: number }>>(
      '/api/projects/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  )
  if (error) {
    throw error
  }
  return response?.data.data
}

/**
 * 导出项目数据
 * @param query 可选的查询参数
 */
export const exportProjects = async (query?: string): Promise<void> => {
  // 使用blob方式下载文件
  const response = await api.get('/api/projects/export', {
    params: { query },
    responseType: 'blob'
  })

  // 创建下载链接
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url

  // 从响应头获取文件名，如果没有则使用默认名称
  const contentDisposition = response.headers['content-disposition']
  let filename = 'projects.xlsx'

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename=(.+)/)
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1]
    }
  }

  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()

  // 清理
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
}
