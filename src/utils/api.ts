import axios from 'axios'
import { getApiBaseUrl } from './env'

// 创建axios实例
export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
})
