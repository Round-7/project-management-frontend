import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { importProjects } from '@/apis'
import { FileUp, FileCheck, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../components/ui/card'
import to from 'await-to-js'

export function Import() {
  const queryClient = useQueryClient()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importMutation = useMutation({
    mutationFn: (file: File) => importProjects(file),
    onSuccess: () => {
      // 导入成功后，刷新项目列表
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploadedFile = e.dataTransfer.files[0]
      if (isValidExcelFile(uploadedFile)) {
        setFile(uploadedFile)
      } else {
        alert('请上传有效的Excel文件 (.xlsx, .xls)')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0]
      if (isValidExcelFile(uploadedFile)) {
        setFile(uploadedFile)
      } else {
        alert('请上传有效的Excel文件 (.xlsx, .xls)')
      }
    }
  }

  const handleImport = async () => {
    if (!file) return

    const [error] = await to(importMutation.mutateAsync(file))
    if (error) {
      console.error('导入失败', error)
    } else {
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const isValidExcelFile = (file: File) => {
    const validExtensions = ['.xlsx', '.xls']
    return validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">导入项目数据</h1>

      <Card>
        <CardHeader>
          <CardTitle>Excel 数据导入</CardTitle>
          <CardDescription>
            上传Excel文件导入项目数据，支持.xlsx和.xls格式
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 transition-colors
              ${isDragging ? 'border-primary' : 'border-muted'}
              ${file ? 'bg-muted/10' : ''}
              flex flex-col items-center justify-center cursor-pointer
              h-48
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            {file ? (
              <>
                <FileCheck className="h-12 w-12 text-green-500 mb-4" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </>
            ) : (
              <>
                <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-medium">点击或拖拽文件到此处</p>
                <p className="text-sm text-muted-foreground">
                  支持格式: .xlsx, .xls
                </p>
              </>
            )}
          </div>

          {importMutation.isPending && (
            <div className="bg-muted/20 p-4 rounded-md">
              <p className="text-center">正在导入，请稍候...</p>
            </div>
          )}

          {importMutation.isSuccess && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md flex items-center">
              <FileCheck className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">导入成功</p>
                <p className="text-sm">
                  成功导入 {importMutation.data?.successCount} 条记录， 失败{' '}
                  {importMutation.data?.failCount} 条
                </p>
              </div>
            </div>
          )}

          {importMutation.isError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">导入失败</p>
                <p className="text-sm">请检查文件格式是否正确</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setFile(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
            >
              重置
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file || importMutation.isPending}
            >
              开始导入
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
