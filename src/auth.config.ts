import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  callbacks: {
    authorized: async ({ auth, request }) => {
      // 保护路由的逻辑
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // 重定向到登录页
      }
      
      // 对于API路由，允许访问
      if (request.nextUrl.pathname.startsWith("/api")) {
        return true;
      }
      
      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // 自定义登录页面路径
  },
  session: {
    strategy: "jwt",
    // 设置会话过期时间（30天）
    maxAge: 30 * 24 * 60 * 60,
  },
  // JWT 配置
  jwt: {
    // 设置 JWT 过期时间（30天）
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;