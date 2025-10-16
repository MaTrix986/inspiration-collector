import { auth } from "@/auth";
import { NextResponse } from "next/server";

// 模拟分类数据存储
const categories: any[] = [
  { id: "1", name: "前端开发" },
  { id: "2", name: "后端开发" },
  { id: "3", name: "移动开发" },
  { id: "4", name: "数据科学" },
];

// GET /api/categories - 获取所有分类
export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }
  
  return NextResponse.json({ 
    success: true,
    data: { categories }
  });
}

// POST /api/categories - 创建新分类
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
      return NextResponse.json({ error: "分类名称是必填项" }, { status: 400 });
    }
    
    // 检查分类是否已存在
    const existingCategory = categories.find(category => category.name === name);
    if (existingCategory) {
      return NextResponse.json({ error: "分类已存在" }, { status: 400 });
    }
    
    const newCategory = {
      id: Date.now().toString(),
      name,
    };
    
    categories.push(newCategory);
    
    return NextResponse.json({ 
      success: true,
      data: { category: newCategory }
    });
  } catch (error) {
    return NextResponse.json({ error: "创建分类失败" }, { status: 500 });
  }
}