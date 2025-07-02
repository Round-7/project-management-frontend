import { getBaseUrl } from '../src/utils/api'

// Vercel API代理路由
export default async function handler(req, res) {
  // 获取后端API URL（可以通过环境变量配置）
  const BACKEND_URL = getBaseUrl()
  try {
    // 获取请求路径（去掉/api/proxy前缀）
    const path = req.url.replace(/^\/api\/proxy/, '')

    // 构建完整的后端URL
    const url = `${BACKEND_URL}${path}`

    // 准备请求选项
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // 转发其他请求头，但排除host和connection等
        ...Object.keys(req.headers)
          .filter(
            key =>
              !['host', 'connection', 'content-length'].includes(
                key.toLowerCase()
              )
          )
          .reduce((obj, key) => {
            obj[key] = req.headers[key]
            return obj
          }, {})
      }
    }

    // 如果有请求体，添加到选项中
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      options.body = JSON.stringify(req.body)
    }

    // 发送请求到后端
    const response = await fetch(url, options)

    // 获取响应数据
    const data = await response.text()

    // 确定响应内容类型
    const contentType =
      response.headers.get('content-type') || 'application/json'

    // 设置响应头
    res.setHeader('Content-Type', contentType)

    // 发送响应状态码和数据
    res.status(response.status).send(data)
  } catch (error) {
    // 错误处理
    console.error('API代理错误:', error)
    res.status(500).json({ error: '代理请求失败' })
  }
}
