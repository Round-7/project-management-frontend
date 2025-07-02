import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="rounded-full bg-muted/10 p-6 mb-6">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">页面未找到</h2>
        <p className="text-muted-foreground mb-6">
          您尝试访问的页面不存在或已移动到其他位置。
        </p>
        <Link to="/">
          <Button>返回首页</Button>
        </Link>
      </div>
    </div>
  )
}
