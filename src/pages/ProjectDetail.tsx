import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProjectById } from '@/apis'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ArrowLeft, Calendar, Clock, Loader2, Copy } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>()

  const {
    data: project,
    isLoading,
    error
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => (id ? getProjectById(id) : null),
    enabled: !!id
  })

  const handleCopyId = () => {
    if (project?.id) {
      navigator.clipboard.writeText(project.id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">加载项目详情...</p>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/">
                <BreadcrumbLink>首页</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/projects">
                <BreadcrumbLink>项目列表</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>项目详情</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center">
          <Link to="/projects">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回项目列表
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">项目详情</h1>
        </div>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">加载失败</CardTitle>
            <CardDescription>
              无法加载项目详情，项目可能不存在或已被删除
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-2"
            >
              重试
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/">
              <BreadcrumbLink>首页</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/projects">
              <BreadcrumbLink>项目列表</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{project.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/projects">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回列表
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopyId}>
            <Copy className="h-4 w-4 mr-2" />
            复制ID
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>项目的基本信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  项目ID
                </h3>
                <div className="mt-1 font-mono text-sm flex items-center">
                  <span className="truncate">{project.id}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-1"
                    onClick={handleCopyId}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  项目名称
                </h3>
                <p className="mt-1 text-lg font-medium">{project.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>时间信息</CardTitle>
            <CardDescription>项目的创建和更新时间</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    创建时间
                  </h3>
                  <p className="mt-1">
                    {new Date(project.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    更新时间
                  </h3>
                  <p className="mt-1">
                    {new Date(project.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
