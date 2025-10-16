import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { 
  getInspirations, 
  createInspiration,
  getInspirationById,
  updateInspiration,
  deleteInspiration,
  getAllTags,
  getAllCategories
} from "@/lib/inspiration-service";

// GET /api/inspirations - 获取灵感列表
export async function GET(request: Request) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const tag = searchParams.get('tag') || '';
  const category = searchParams.get('category') || '';
  
  try {
    const result = await getInspirations(
      session.user.id,
      page,
      limit,
      search,
      tag,
      category,
      sortBy,
      sortOrder as 'asc' | 'desc'
    );
    
    return NextResponse.json({ 
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取灵感列表失败:', error);
    return NextResponse.json({ error: "获取灵感列表失败" }, { status: 500 });
  }
}

// POST /api/inspirations - 创建灵感
export async function POST(request: Request) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { title, content, imageUrl, isPublic, tags = [], category = "" } = body;
    
    // 验证必填字段
    if (!title) {
      return NextResponse.json({ error: "标题是必填项" }, { status: 400 });
    }
    
    const newInspiration = await createInspiration({
      userId: session.user.id,
      title,
      content: content || "",
      imageUrl: imageUrl || "",
      isPublic: isPublic || false,
      viewCount: 0,
      tags: Array.isArray(tags) ? tags : [],
      category: category || "",
    });
    
    return NextResponse.json({ 
      success: true,
      data: { inspiration: newInspiration }
    });
  } catch (error) {
    console.error('创建灵感失败:', error);
    return NextResponse.json({ error: "创建灵感失败" }, { status: 500 });
  }
}

// GET /api/inspirations/[id] - 获取单个灵感
export async function GET_BY_ID(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }
  
  try {
    const inspiration = await getInspirationById(params.id, session.user.id);
    
    if (!inspiration) {
      return NextResponse.json({ error: "灵感不存在" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      data: { inspiration }
    });
  } catch (error) {
    console.error('获取灵感失败:', error);
    return NextResponse.json({ error: "获取灵感失败" }, { status: 500 });
  }
}

// PUT /api/inspirations/[id] - 更新灵感
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { title, content, imageUrl, isPublic, tags, category } = body;
    
    // 验证必填字段
    if (!title) {
      return NextResponse.json({ error: "标题是必填项" }, { status: 400 });
    }
    
    const updatedInspiration = await updateInspiration(params.id, session.user.id, {
      title,
      content: content || "",
      imageUrl: imageUrl || "",
      isPublic: isPublic !== undefined ? isPublic : false,
      tags: tags !== undefined ? (Array.isArray(tags) ? tags : []) : undefined,
      category: category !== undefined ? category : undefined,
    });
    
    if (!updatedInspiration) {
      return NextResponse.json({ error: "灵感不存在" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      data: { inspiration: updatedInspiration }
    });
  } catch (error) {
    console.error('更新灵感失败:', error);
    return NextResponse.json({ error: "更新灵感失败" }, { status: 500 });
  }
}

// DELETE /api/inspirations/[id] - 删除灵感
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }
  
  try {
    const result = await deleteInspiration(params.id, session.user.id);
    
    if (!result) {
      return NextResponse.json({ error: "灵感不存在" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "灵感删除成功"
    });
  } catch (error) {
    console.error('删除灵感失败:', error);
    return NextResponse.json({ error: "删除灵感失败" }, { status: 500 });
  }
}

// GET /api/tags - 获取所有标签
export async function GET_TAGS() {
  try {
    const tags = await getAllTags();
    return NextResponse.json({ 
      success: true,
      data: { tags }
    });
  } catch (error) {
    console.error('获取标签失败:', error);
    return NextResponse.json({ error: "获取标签失败" }, { status: 500 });
  }
}

// GET /api/categories - 获取所有分类
export async function GET_CATEGORIES() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ 
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json({ error: "获取分类失败" }, { status: 500 });
  }
}