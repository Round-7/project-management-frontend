import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())

  // 默认后端API地址
  const apiUrl = localStorage.getItem('apiUrl') || env.VITE_API_URL

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
