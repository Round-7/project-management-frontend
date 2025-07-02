import { Link, useLocation, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  ListTodo,
  FileSpreadsheet,
  Settings
} from 'lucide-react'
import { cn } from '@/utils/cn'

export function Layout() {
  const location = useLocation()

  const menuItems = [
    { href: '/', icon: LayoutDashboard, label: '首页' },
    { href: '/projects', icon: ListTodo, label: '项目列表' },
    { href: '/import', icon: FileSpreadsheet, label: '导入数据' },
    { href: '/settings', icon: Settings, label: '设置' }
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* 侧边栏 */}
      <aside className="w-64 border-r bg-muted/20">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-xl font-bold">项目管理系统</h2>
        </div>
        <nav className="space-y-1 px-2 py-4">
          {menuItems.map(item => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1">
        {/* 顶部导航 */}
        <header className="border-b bg-background">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-lg font-medium">项目管理</h1>
            <div className="flex items-center gap-4">
              <Link to="/settings" title="系统设置">
                <button className="rounded-full bg-muted p-2 hover:bg-muted/80">
                  <Settings className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* 内容 */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
