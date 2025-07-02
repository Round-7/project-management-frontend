/**
 * 环境变量工具，提供类型安全的访问方式
 */

/**
 * 获取API基础URL
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
}

/**
 * 获取应用版本号
 */
export const getAppVersion = (): string => {
  return import.meta.env.VITE_APP_VERSION || '0.1.0'
}

/**
 * 判断当前是否为生产环境
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD
}

/**
 * 判断当前是否为开发环境
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV
}
