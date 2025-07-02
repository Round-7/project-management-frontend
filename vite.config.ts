import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { getBaseUrl } from './src/utils/api'

// https://vite.dev/config/
export default defineConfig(() => {
  // 默认后端API地址
  const apiUrl = getBaseUrl()

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      proxy: {
        // 将所有/api开头的请求代理到后端服务器
        '/api': {
          target: apiUrl,
          changeOrigin: true
        }
      }
    }
  }
})
