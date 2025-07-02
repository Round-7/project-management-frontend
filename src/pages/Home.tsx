import { useQuery } from '@tanstack/react-query'
import { getProjects, getProjectStats } from '@/apis'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { BarChart, Clock, Database, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Home() {
  const [stats, setStats] = useState<{
    totalProjects: number
    weeklyNew: number
    recentlyUpdated: number
  }>({
    totalProjects: 0,
    weeklyNew: 0,
    recentlyUpdated: 0
  })

  // 获取最近的项目列表
  const { data: projectsData, isLoading } = useQuery({
    queryKey: [
      'projects',
      { limit: 5, sortBy: 'updatedAt', sortOrder: 'desc' }
    ],
    queryFn: () =>
      getProjects({ limit: 5, sortBy: 'updatedAt', sortOrder: 'desc' })
  })

  // 获取项目统计数据
  const { data: projectStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['projectStats'],
    queryFn: getProjectStats,
    retry: 1
  })

  // 更新统计数据
  useEffect(() => {
    if (projectStats) {
      setStats({
        totalProjects: projectStats.totalCount,
        weeklyNew: projectStats.weeklyNewCount,
        recentlyUpdated: projectStats.recentlyUpdatedCount
      })
    }
  }, [projectStats])

  const statCards = [
    {
      title: '项目总数',
      value: stats.totalProjects,
      icon: Database,
      description: '系统中的所有项目',
      isLoading: isLoadingStats
    },
    {
      title: '本周新增',
      value: stats.weeklyNew,
      icon: BarChart,
      description: '最近7天新增的项目',
      isLoading: isLoadingStats
    },
    {
      title: '最近更新',
      value: stats.recentlyUpdated,
      icon: Clock,
      description: '最近7天更新的项目',
      isLoading: isLoadingStats
    }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stat.isLoading ? (
                <div className="flex items-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">
                    加载中...
                  </span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>近期项目</CardTitle>
            <CardDescription>最近更新的5个项目</CardDescription>
          </div>
          <Link to="/projects">
            <Button variant="outline" size="sm">
              查看全部
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">加载项目数据...</p>
            </div>
          ) : projectsData?.list && projectsData.list.length > 0 ? (
            <div className="space-y-4">
              {projectsData.list.map(project => (
                <div
                  key={project.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <Link
                      to={`/projects/${project.id}`}
                      className="hover:underline"
                    >
                      <p className="font-medium">{project.name}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      更新于: {new Date(project.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <Link to={`/projects/${project.id}`}>
                    <Button variant="ghost" size="sm">
                      查看
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              暂无项目数据
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
