'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function InspirationForm({ 
  inspiration,
  onSave
}: {
  inspiration?: Inspiration | null;
  onSave: (inspiration: Omit<Inspiration, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'userId'>) => Promise<boolean>;
}) {
  const { session } = useAuth();
  const [title, setTitle] = useState(inspiration?.title || '');
  const [content, setContent] = useState(inspiration?.content || '');
  const [imageUrl, setImageUrl] = useState(inspiration?.imageUrl || '');
  const [isPublic, setIsPublic] = useState(inspiration?.isPublic || false);
  const [tags, setTags] = useState<string[]>(inspiration?.tags || []);
  const [category, setCategory] = useState(inspiration?.category || '');
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const success = await onSave({
        title,
        content,
        imageUrl,
        isPublic,
        tags,
        category,
      });
      
      if (!success) {
        setError('保存失败');
      }
    } catch (err) {
      setError('保存过程中发生错误');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p>请先登录以创建或编辑灵感</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{inspiration ? '编辑灵感' : '创建灵感'}</CardTitle>
        <CardDescription>
          {inspiration 
            ? '编辑您的灵感内容' 
            : '创建一个新的灵感条目'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入灵感标题"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">内容</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="描述您的灵感..."
              className="w-full min-h-[120px] p-3 border border-input rounded-md bg-background text-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">图片URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {imageUrl && (
              <div className="mt-2">
                <img 
                  src={imageUrl} 
                  alt="预览" 
                  className="w-full max-w-xs h-auto rounded-md border"
                  onError={(e) => {
                    // 如果图片加载失败，显示错误信息
                    e.currentTarget.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'text-red-500 text-sm';
                    errorDiv.textContent = '图片加载失败';
                    e.currentTarget.parentNode?.appendChild(errorDiv);
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>标签</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-xs hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="添加标签"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                添加
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">分类</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="例如：设计、开发、生活等"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              id="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="isPublic">公开此灵感</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/inspirations">
                取消
              </Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}