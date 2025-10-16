'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from 'next/link';

interface Inspiration {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isPublic: boolean;
  viewCount: number;
  tags?: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export default function InspirationList() {
  const { session } = useAuth();
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchInspirations();
  }, [searchTerm, selectedTag, selectedCategory, sortBy, sortOrder]);

  const fetchInspirations = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedTag) params.append('tag', selectedTag);
      if (selectedCategory) params.append('category', selectedCategory);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      
      const response = await fetch(`/api/inspirations?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setInspirations(data.data.inspirations);
        // 提取所有唯一的标签和分类
        const allTags = Array.from(new Set(data.data.inspirations.flatMap((insp: any) => insp.tags || []))) as string[];
        const allCategories = Array.from(new Set(data.data.inspirations.map((insp: any) => insp.category).filter(Boolean))) as string[];
        setTags(allTags);
        setCategories(allCategories);
      } else {
        setError(data.error || '获取灵感列表失败');
      }
    } catch (err) {
      setError('网络错误');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个灵感吗？')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/inspirations/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 从列表中移除已删除的灵感
        setInspirations(inspirations.filter(insp => insp.id !== id));
      } else {
        setError(data.error || '删除失败');
      }
    } catch (err) {
      setError('删除失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 搜索将在useEffect中自动触发
  };
  
  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
  };
  
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setSelectedCategory('');
  };

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p>请先登录以查看您的灵感</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">我的灵感</h2>
        <Button asChild>
          <Link href="/dashboard/inspirations/create">
            创建灵感
          </Link>
        </Button>
      </div>

      {/* 搜索和筛选控件 */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="搜索灵感..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="排序字段" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">创建时间</SelectItem>
                  <SelectItem value="title">标题</SelectItem>
                  <SelectItem value="viewCount">查看次数</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">降序</SelectItem>
                  <SelectItem value="asc">升序</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
          
          {/* 标签筛选 */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">标签:</span>
            <Button
              variant={selectedTag === '' ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagFilter('')}
            >
              全部
            </Button>
            {tags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagFilter(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
          
          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">分类:</span>
            <Button
              variant={selectedCategory === '' ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter('')}
            >
              全部
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* 清除筛选 */}
          {(searchTerm || selectedTag || selectedCategory) && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                清除筛选条件
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">错误: {error}</p>
          </CardContent>
        </Card>
      ) : inspirations.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? '未找到匹配的灵感' : '您还没有创建任何灵感'}
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard/inspirations/create">
                创建您的第一个灵感
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspirations.map((inspiration) => (
            <Card key={inspiration.id} className="flex flex-col">
              <CardContent className="pt-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold line-clamp-2">{inspiration.title}</h3>
                  <Badge variant={inspiration.isPublic ? "default" : "secondary"}>
                    {inspiration.isPublic ? '公开' : '私有'}
                  </Badge>
                </div>
                
                {inspiration.content && (
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {inspiration.content}
                  </p>
                )}
                
                {inspiration.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={inspiration.imageUrl} 
                      alt={inspiration.title}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                )}
                
                {/* 标签显示 */}
                {inspiration.tags && inspiration.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {inspiration.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* 分类显示 */}
                {inspiration.category && (
                  <div className="mb-2">
                    <Badge variant="outline">
                      {inspiration.category}
                    </Badge>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    {new Date(inspiration.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    {inspiration.viewCount} 次查看
                  </span>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/inspirations/${inspiration.id}`}>
                    查看
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/inspirations/${inspiration.id}/edit`}>
                    编辑
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(inspiration.id)}>
                  删除
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}