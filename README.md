# 项目管理系统 - 前端

项目管理系统的前端应用，基于 React 和 TypeScript，提供友好的用户界面。

## 技术栈

- React
- TypeScript
- Vite
- TailwindCSS
- React Query
- ShadcnUI 组件库

## 快速开始

### 1. 安装依赖

```bash
cd frontend
bun install
```

### 2. 配置环境变量

创建`.env.local`文件，配置 API 地址：

```
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. 启动开发服务

```bash
bun run dev
```

### 4. 构建静态网站

```bash
bun run build
```

生成的静态文件位于`dist`目录，可部署到任何静态网站托管服务上。

## 静态部署指南

### Netlify/Vercel 部署

1. 连接您的 GitHub 仓库
2. 构建命令设置为`bun run build`
3. 发布目录设置为`dist`
4. 设置环境变量`VITE_API_BASE_URL`指向您的后端 API 地址

### 手动部署到服务器

1. 在本地构建项目：

```bash
bun run build
```

2. 将`dist`目录中的文件上传到您的 Web 服务器

3. 配置 Web 服务器（如 Nginx、Apache）提供静态文件服务

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 如果需要，代理API请求
    location /api/ {
        proxy_pass http://your-api-server:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 项目结构

```
frontend/
  - public/       # 静态资源
  - src/
    - apis/       # API请求封装
    - assets/     # 项目资源
    - components/ # UI组件
    - pages/      # 页面组件
    - providers/  # 全局状态提供者
    - router/     # 路由配置
    - types/      # 类型定义
    - utils/      # 工具函数
    - App.tsx     # 应用入口
    - main.tsx    # 渲染入口
```

## 开发指南

- 使用组件化开发，保持组件粒度适中
- 使用 React Query 进行数据获取和缓存
- 遵循 TypeScript 类型安全原则
- 使用 TailwindCSS 进行样式开发
