/**
 * API响应通用接口
 */
export interface ApiResponse<T> {
  /** 状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
}

/**
 * 分页响应接口
 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  list: T[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页条数 */
  limit: number
  /** 总页数 */
  totalPages: number
}

/**
 * 健康检查信息接口
 */
export interface HealthInfo {
  /** 系统状态 */
  status: string
  /** 应用版本 */
  version: string
  /** 时间戳 */
  timestamp: string
  /** Node.js版本 */
  nodeVersion: string
  /** 数据库信息 */
  database: {
    /** 是否连接成功 */
    connected: boolean
    /** 数据库类型 */
    type: string
    /** 数据库版本 */
    version: string
  }
  /** 系统运行时间（秒） */
  uptime: number
}

/**
 * 系统信息接口
 */
export interface SystemInfo {
  /** 前端版本 */
  frontendVersion: string
  /** 后端版本 */
  backendVersion: string
  /** 运行环境 */
  environment: string
  /** 最后更新时间 */
  lastUpdated: string
  /** Node.js版本 */
  nodeVersion: string
  /** 数据库类型 */
  database: string
}

