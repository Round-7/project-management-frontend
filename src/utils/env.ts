/**
 * 环境变量工具，提供类型安全的访问方式
 */

/**
 * 获取API基础URL
 */
export const getApiBaseUrl = (): string => {
  // 始终使用相对路径，避免混合内容问题
  return '/api'
}

/**
 * 获取应用版本号
 */
export const getAppVersion = (): string => {
  return import.meta.env.VITE_APP_VERSION
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
