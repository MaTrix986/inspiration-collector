import { connectToDatabase } from '@/lib/database';
import bcrypt from 'bcryptjs';

// 用户注册函数
export async function registerUser(name: string, email: string, password: string) {
  const { db } = await connectToDatabase();
  
  // 检查用户是否已存在
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    throw new Error('用户已存在');
  }
  
  // 对密码进行哈希处理
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // 创建新用户
  const result = await db.collection('users').insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  // 返回创建的用户（不包含密码）
  const user = await db.collection('users').findOne({ _id: result.insertedId });
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  throw new Error('用户创建失败');
}