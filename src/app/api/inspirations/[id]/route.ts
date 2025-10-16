import { auth } from "@/auth";
import { NextResponse } from "next/server";

// 模拟数据库存储
const inspirations: any[] = [
  {
    id: "1",
    userId: "1",
    title: "设计灵感示例",
    content: "这是一个灵感内容示例",
    imageUrl: "",
    isPublic: false,
    viewCount: 0,
    tags: ["设计", "UI"],
    category: "前端开发",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/inspirations/[id] - 获取单个灵感详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }
  
  const inspiration = inspirations.find(insp => insp.id === params.id);
  
  if (!inspiration) {
    return NextResponse.json({ error: "灵感不存在" }, { status: 404 });
  }
  
  // 检查是否有权限访问（自己的灵感或公开的灵感）
  if (inspiration.userId !== session.user.id && !inspiration.isPublic) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 });
  }
  
  // 增加查看次数（仅对公开灵感或自己的灵感）
  if (inspiration.userId !== session.user.id) {
    inspiration.viewCount += 1;
  }
  
  return NextResponse.json({ 
    success: true,
    data: { inspiration }
  });
}

// PUT /api/inspirations/[id] - 更新灵感
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }
  
  const inspirationIndex = inspirations.findIndex(insp => insp.id === params.id);
  
  if (inspirationIndex === -1) {
    return NextResponse.json({ error: "灵感不存在" }, { status: 404 });
  }
  
  const inspiration = inspirations[inspirationIndex];
  
  // 检查是否有权限更新
  if (inspiration.userId !== session.user.id) {
    return NextResponse.json({ error: "无权限更新" }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    const { title, content, imageUrl, isPublic, tags = [], category = "" } = body;
    
    // 验证必填字段
    if (!title) {
      return NextResponse.json({ error: "标题是必填项" }, { status: 400 });
    }
    
    // 更新灵感
    inspiration.title = title;
    inspiration.content = content !== undefined ? content : inspiration.content;
    inspiration.imageUrl = imageUrl !== undefined ? imageUrl : inspiration.imageUrl;
    inspiration.isPublic = isPublic !== undefined ? isPublic : inspiration.isPublic;
    inspiration.tags = Array.isArray(tags) ? tags : inspiration.tags;
    inspiration.category = category !== undefined ? category : inspiration.category;
    inspiration.updatedAt = new Date().toISOString();
    
    // 更新数组中的对象
    inspirations[inspirationIndex] = inspiration;
    
    return NextResponse.json({ 
      success: true,
      data: { inspiration }
    });
  } catch (error) {
    return NextResponse.json({ error: "更新灵感失败" }, { status: 500 });
  }
}

// DELETE /api/inspirations/[id] - 删除灵感
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }
  
  const inspirationIndex = inspirations.findIndex(insp => insp.id === params.id);
  
  if (inspirationIndex === -1) {
    return NextResponse.json({ error: "灵感不存在" }, { status: 404 });
  }
  
  const inspiration = inspirations[inspirationIndex];
  
  // 检查是否有权限删除
  if (inspiration.userId !== session.user.id) {
    return NextResponse.json({ error: "无权限删除" }, { status: 403 });
  }
  
  // 删除灵感
  inspirations.splice(inspirationIndex, 1);
  
  return NextResponse.json({ 
    success: true,
    message: "删除成功"
  });
}