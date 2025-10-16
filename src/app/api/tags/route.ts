import { auth } from "@/auth";
import { NextResponse } from "next/server";

// 模拟标签数据存储
const tags: any[] = [
  { id: "1", name: "设计" },
  { id: "2", name: "UI" },
  { id: "3", name: "后端" },
  { id: "4", name: "数据库" },
];

// GET /api/tags - 获取所有标签
export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }
  
  return NextResponse.json({ 
    success: true,
    data: { tags }
  });
}

// POST /api/tags - 创建新标签
export async function POST(request: Request) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { name } = body;
    
    // 验证必填字段
    if (!name) {
      return NextResponse.json({ error: "标签名称是必填项" }, { status: 400 });
    }
    
    // 检查标签是否已存在
    const existingTag = tags.find(tag => tag.name === name);
    if (existingTag) {
      return NextResponse.json({ error: "标签已存在" }, { status: 400 });
    }
    
    const newTag = {
      id: Date.now().toString(),
      name,
    };
    
    tags.push(newTag);
    
    return NextResponse.json({ 
      success: true,
      data: { tag: newTag }
    });
  } catch (error) {
    return NextResponse.json({ error: "创建标签失败" }, { status: 500 });
  }
}