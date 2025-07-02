import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProjects, exportProjects } from '@/apis'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table'
import { Link } from 'react-router-dom'
import { SearchIcon, DownloadIcon, UploadIcon } from 'lucide-react'
import type { Project } from '@/types'

export function Projects() {
  const [searchParams, setSearchParams] = useState({
    query: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  })
  const [isExporting, setIsExporting] = useState(false)

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects', searchParams],
    queryFn: () => getProjects(searchParams)
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const query = new FormData(form).get('query') as string
    setSearchParams(prev => ({ ...prev, query, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }))
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      await exportProjects(searchParams.query)
    } catch (error) {
      console.error('导出项目失败:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">项目列表</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleExport} 
            disabled={isExporting}
            className="flex items-center gap-1"
          >
            <DownloadIcon className="h-4 w-4" />
            {isExporting ? '导出中...' : '导出项目'}
          </Button>
          <Link to="/import">
            <Button className="flex items-center gap-1">
              <UploadIcon className="h-4 w-4" />
              导入项目
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <form onSubmit={handleSearch} className="flex-1 flex space-x-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="query"
              placeholder="搜索项目名称..."
              defaultValue={searchParams.query}
              className="w-full pl-9"
            />
          </div>
          <Button type="submit">搜索</Button>
        </form>
      </div>

      <div className="rounded-md border h-[30rem] overflow-hidden">
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[40%]">项目名称</TableHead>
                <TableHead className="w-[25%] text-right">创建时间</TableHead>
                <TableHead className="w-[25%] text-right">更新时间</TableHead>
                <TableHead className="w-[10%] text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-${index}`} className="animate-pulse">
                    <TableCell>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-4 bg-muted rounded w-full ml-auto"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-4 bg-muted rounded w-full ml-auto"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-8 bg-muted rounded w-16 mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : projectsData?.list && projectsData.list.length > 0 ? (
                projectsData.list.map((project: Project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium truncate max-w-[300px]">
                      {project.name}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {new Date(project.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {new Date(project.updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link to={`/projects/${project.id}`}>
                        <Button variant="outline" size="sm" className="w-16">
                          查看
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {projectsData && projectsData.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            显示 {(searchParams.page - 1) * searchParams.limit + 1} 到{' '}
            {Math.min(
              searchParams.page * searchParams.limit,
              projectsData.total
            )}{' '}
            条， 共 {projectsData.total} 条记录
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(searchParams.page - 1)}
              disabled={searchParams.page <= 1}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(searchParams.page + 1)}
              disabled={
                searchParams.page >=
                Math.ceil(projectsData.total / searchParams.limit)
              }
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
