import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth-service";

// POST /api/auth/register - 用户注册
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    // 验证必填字段
    if (!name || !email || !password) {
      return NextResponse.json({ error: "所有字段都是必填的" }, { status: 400 });
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }
    
    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json({ error: "密码长度至少为6位" }, { status: 400 });
    }
    
    // 注册用户
    const user = await registerUser(name, email, password);
    
    return NextResponse.json({ 
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('注册失败:', error);
    if (error.message === '用户已存在') {
      return NextResponse.json({ error: "用户已存在" }, { status: 400 });
    }
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}