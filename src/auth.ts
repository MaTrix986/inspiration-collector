import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { User } from "next-auth";
import { authConfig } from '@/auth.config';
import { connectToDatabase } from '@/lib/database';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        // 连接数据库
        const { db } = await connectToDatabase();
        
        // 查找用户
        const user = await db.collection('users').findOne({
          email: credentials.email
        });
        
        // 验证用户是否存在以及密码是否正确
        if (user && await bcrypt.compare(credentials.password as string, user.password)) {
          // 返回用户信息（不包含密码），并确保id字段正确设置
          const { password, _id, ...userWithoutPassword } = user;
          return {
            ...userWithoutPassword,
            id: _id.toString(), // 确保id字段存在且为字符串
            email: user.email,
            name: user.name,
          } as User;
        } else {
          return null;
        }
      },
    }),
  ],
});