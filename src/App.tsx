import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from '@/providers/QueryProvider'
import { router } from './router'
import { useEffect } from 'react'
import { initApiConfig } from '@/apis'

function App() {
  // 初始化API配置
  useEffect(() => {
    initApiConfig()
  }, [])

  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  )
}

export default App
