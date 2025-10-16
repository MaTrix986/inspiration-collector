import { connectToDatabase } from '@/lib/database';
import { ObjectId } from 'mongodb';

// 灵感数据类型定义
export interface Inspiration {
  _id?: string;
  userId: string;
  title: string;
  content: string;
  imageUrl?: string;
  isPublic: boolean;
  viewCount: number;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

// 标签数据类型定义
export interface Tag {
  _id?: string;
  name: string;
}

// 分类数据类型定义
export interface Category {
  _id?: string;
  name: string;
}

// 创建灵感
export async function createInspiration(inspiration: Omit<Inspiration, '_id' | 'createdAt' | 'updatedAt'>) {
  const { db } = await connectToDatabase();
  
  const newInspiration = {
    ...inspiration,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection('inspirations').insertOne(newInspiration);
  
  // 如果标签不存在，则创建新标签
  if (inspiration.tags && inspiration.tags.length > 0) {
    for (const tagName of inspiration.tags) {
      const existingTag = await db.collection('tags').findOne({ name: tagName });
      if (!existingTag) {
        await db.collection('tags').insertOne({ name: tagName });
      }
    }
  }
  
  // 如果分类不存在，则创建新分类
  if (inspiration.category) {
    const existingCategory = await db.collection('categories').findOne({ name: inspiration.category });
    if (!existingCategory) {
      await db.collection('categories').insertOne({ name: inspiration.category });
    }
  }
  
  return {
    ...newInspiration,
    _id: result.insertedId.toString(),
  };
}

// 获取灵感列表
export async function getInspirations(
  userId: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
  tag?: string,
  category?: string,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  const { db } = await connectToDatabase();
  
  // 构建查询条件
  const query: any = { userId };
  
  // 搜索条件
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }
  
  // 标签过滤
  if (tag) {
    query.tags = tag;
  }
  
  // 分类过滤
  if (category) {
    query.category = category;
  }
  
  // 构建排序条件
  const sort: any = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
  // 执行查询
  const skip = (page - 1) * limit;
  const inspirations = await db.collection('inspirations')
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
  
  // 获取总数
  const total = await db.collection('inspirations').countDocuments(query);
  
  // 获取所有标签和分类（用于筛选）
  const tags = await db.collection('tags').find({}).toArray();
  const categories = await db.collection('categories').find({}).toArray();
  
  return {
    inspirations: inspirations.map(insp => ({
      ...insp,
      _id: insp._id.toString(),
      createdAt: insp.createdAt,
      updatedAt: insp.updatedAt,
    })),
    tags: tags.map(tag => tag.name),
    categories: categories.map(category => category.name),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// 获取单个灵感
export async function getInspirationById(id: string, userId: string) {
  const { db } = await connectToDatabase();
  
  const inspiration = await db.collection('inspirations').findOne({
    _id: new ObjectId(id),
    userId,
  });
  
  if (!inspiration) {
    return null;
  }
  
  return {
    ...inspiration,
    _id: inspiration._id.toString(),
    createdAt: inspiration.createdAt,
    updatedAt: inspiration.updatedAt,
  };
}

// 更新灵感
export async function updateInspiration(
  id: string,
  userId: string,
  updateData: Partial<Omit<Inspiration, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>
) {
  const { db } = await connectToDatabase();
  
  const result = await db.collection('inspirations').updateOne(
    { _id: new ObjectId(id), userId },
    { 
      $set: { 
        ...updateData,
        updatedAt: new Date(),
      },
    }
  );
  
  if (result.matchedCount === 0) {
    return null;
  }
  
  // 如果标签不存在，则创建新标签
  if (updateData.tags) {
    for (const tagName of updateData.tags) {
      const existingTag = await db.collection('tags').findOne({ name: tagName });
      if (!existingTag) {
        await db.collection('tags').insertOne({ name: tagName });
      }
    }
  }
  
  // 如果分类不存在，则创建新分类
  if (updateData.category) {
    const existingCategory = await db.collection('categories').findOne({ name: updateData.category });
    if (!existingCategory) {
      await db.collection('categories').insertOne({ name: updateData.category });
    }
  }
  
  const updatedInspiration = await getInspirationById(id, userId);
  return updatedInspiration;
}

// 删除灵感
export async function deleteInspiration(id: string, userId: string) {
  const { db } = await connectToDatabase();
  
  const result = await db.collection('inspirations').deleteOne({
    _id: new ObjectId(id),
    userId,
  });
  
  return result.deletedCount > 0;
}

// 获取所有标签
export async function getAllTags() {
  const { db } = await connectToDatabase();
  
  const tags = await db.collection('tags').find({}).toArray();
  return tags.map(tag => tag.name);
}

// 获取所有分类
export async function getAllCategories() {
  const { db } = await connectToDatabase();
  
  const categories = await db.collection('categories').find({}).toArray();
  return categories.map(category => category.name);
}