/**
 * 项目基本信息接口
 */
export interface Project {
  /** 项目ID */
  id: string
  /** 项目名称 */
  name: string
  /** 创建时间 */
  createdAt: string | Date
  /** 更新时间 */
  updatedAt: string | Date
}

/**
 * 项目统计数据接口
 */
export interface ProjectStats {
  /** 项目总数 */
  totalCount: number
  /** 本周新增项目数 */
  weeklyNewCount: number
  /** 最近一周更新的项目数 */
  recentlyUpdatedCount: number
}

/**
 * 项目查询参数接口
 */
export interface ProjectQueryParams {
  /** 搜索关键词 */
  query?: string
  /** 当前页码 */
  page?: number
  /** 每页条数 */
  limit?: number
  /** 排序字段 */
  sortBy?: string
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
} 