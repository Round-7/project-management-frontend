import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { getHealthInfo, updateApiBaseUrl, getSavedApiBaseUrl } from '@/apis'
import type { SystemInfo } from '@/types'

export function Settings() {
  const [apiUrl, setApiUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    frontendVersion: '加载中...',
    backendVersion: '加载中...',
    environment: '加载中...',
    lastUpdated: '加载中...',
    nodeVersion: '加载中...',
    database: '加载中...'
  })

  // 获取系统信息
  const { data: healthData, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['health'],
    queryFn: getHealthInfo,
    retry: 1
  })

  // 初始化设置
  useEffect(() => {
    // 从localStorage获取API URL
    const savedApiUrl = getSavedApiBaseUrl()
    setApiUrl(savedApiUrl)
  }, [])

  // 更新系统信息
  useEffect(() => {
    if (healthData) {
      const now = new Date()
      setSystemInfo({
        frontendVersion: import.meta.env.VITE_APP_VERSION || 'v1.0.0',
        backendVersion: healthData.version || 'v1.0.0',
        environment: import.meta.env.MODE || '开发环境',
        lastUpdated: now.toLocaleString(),
        nodeVersion: healthData.nodeVersion || 'N/A',
        database: healthData.database?.type || 'PostgreSQL'
      })
    }
  }, [healthData])

  const handleSaveSettings = () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      // 检查URL是否有效
      if (!isValidUrl(apiUrl)) {
        setIsSaving(false)
        setSaveMessage({ type: 'error', text: '请输入有效的URL地址' })
        return
      }

      // 更新API基础URL
      updateApiBaseUrl(apiUrl)

      setTimeout(() => {
        setIsSaving(false)
        setSaveMessage({
          type: 'success',
          text: '设置已保存，正在应用新设置...'
        })

        // 2秒后重新加载页面以应用新的API地址
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }, 1000)
    } catch (error) {
      setIsSaving(false)
      setSaveMessage({ type: 'error', text: '保存设置失败' })
    }
  }

  // 验证URL是否有效
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch (error) {
      return false
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API 设置</CardTitle>
            <CardDescription>配置系统与后端 API 的连接参数</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                API 地址
              </label>
              <Input
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                placeholder="http://localhost:3000"
              />
              <p className="text-sm text-muted-foreground">
                设置后端 API 的基础地址（例如：http://localhost:3000）
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSaving ? '保存中...' : '保存设置'}
            </Button>
            {saveMessage && (
              <div
                className={`ml-4 text-sm ${
                  saveMessage.type === 'success'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {saveMessage.text}
              </div>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>系统信息</CardTitle>
            <CardDescription>当前系统的版本和环境信息</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingHealth ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">前端版本</p>
                  <p className="text-sm text-muted-foreground">
                    {systemInfo.frontendVersion}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">后端版本</p>
                  <p className="text-sm text-muted-foreground">
                    {systemInfo.backendVersion}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">环境</p>
                  <p className="text-sm text-muted-foreground">
                    {systemInfo.environment}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">最后更新</p>
                  <p className="text-sm text-muted-foreground">
                    {systemInfo.lastUpdated}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Node 版本</p>
                  <p className="text-sm text-muted-foreground">
                    {systemInfo.nodeVersion}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">数据库</p>
                  <p className="text-sm text-muted-foreground">
                    {systemInfo.database}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
