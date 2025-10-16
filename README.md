# 灵感收集器 - 用户认证系统

这个项目演示了在Next.js 15中实现用户认证系统的完整方案。

## 功能特性

1. 用户登录/注册
2. 受保护的路由
3. 用户状态管理
4. 登出功能

## 技术栈

- Next.js 15 (App Router)
- NextAuth.js v5 (Auth.js)
- TypeScript
- Tailwind CSS
- React Icons

## 快速开始

1. 安装依赖:
   ```bash
   npm install
   ```

2. 运行开发服务器:
   ```bash
   npm run dev
   ```

3. 打开浏览器访问 http://localhost:3000

## 认证系统说明

### 核心文件

- `src/auth.ts` - NextAuth配置文件
- `src/middleware.ts` - 路由保护中间件
- `src/contexts/auth-context.tsx` - React上下文用于状态管理
- `src/components/with-auth.tsx` - 高阶组件用于保护页面
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API路由

### 默认用户

- 邮箱: admin@example.com
- 密码: password123

## 页面

- `/` - 首页 (根据认证状态显示不同内容)
- `/login` - 登录页面
- `/register` - 注册页面
- `/dashboard` - 受保护的仪表板页面
- `/api/protected` - 受保护的API路由示例

## 保护路由

有两种方式保护路由:

1. 使用中间件 (全局保护)
2. 使用`withAuth`高阶组件 (页面级别保护)

## 环境变量

项目使用`.env.local`文件存储密钥:
- `AUTH_SECRET` - NextAuth密钥

## 扩展建议

1. 连接真实数据库 (如MongoDB, PostgreSQL)
2. 添加邮箱验证
3. 实现密码重置功能
4. 添加更多OAuth提供商 (Google, GitHub等)
5. 实现角色和权限系统