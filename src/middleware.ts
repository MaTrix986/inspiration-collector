import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

// 指定使用 Node.js 运行时而不是 Edge 运行时
export const runtime = 'nodejs';

// 可选：配置匹配器来指定哪些路径需要保护
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下开头的路径:
     * - api (API路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (favicon文件)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}