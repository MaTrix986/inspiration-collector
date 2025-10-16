'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function InspirationDetailPage({ params }: { params: { id: string } }) {
  const { session } = useAuth();
  const router = useRouter();
  const [inspiration, setInspiration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInspiration();
  }, [params.id]);

  const fetchInspiration = async () => {
    try {
      const response = await fetch(`/api/inspirations/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setInspiration(data.data.inspiration);
      } else {
        setError(data.error || '获取灵感失败');
      }
    } catch (err) {
      setError('网络错误');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这个灵感吗？')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/inspirations/${params.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push('/dashboard/inspirations');
      } else {
        alert(data.error || '删除失败');
      }
    } catch (err) {
      console.error(err);
      alert('删除失败');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">错误: {error}</p>
      </div>
    );
  }

  if (!inspiration) {
    return (
      <div className="text-center py-12">
        <p>未找到该灵感</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold">{inspiration.title}</h1>
                <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                  {inspiration.isPublic ? '公开' : '私有'}
                </span>
              </div>
              
              {/* 标签和分类显示 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {inspiration.category && (
                  <span className="inline-block px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                    {inspiration.category}
                  </span>
                )}
                {inspiration.tags && inspiration.tags.map((tag: string) => (
                  <span key={tag} className="inline-block px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>创建于 {new Date(inspiration.createdAt).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{inspiration.viewCount} 次查看</span>
              </div>
              
              {inspiration.imageUrl && (
                <div className="mb-6">
                  <img 
                    src={inspiration.imageUrl} 
                    alt={inspiration.title}
                    className="w-full max-h-96 object-contain rounded-md"
                  />
                </div>
              )}
              
              {inspiration.content && (
                <div className="prose max-w-none mb-8">
                  <p className="text-gray-700 whitespace-pre-wrap">{inspiration.content}</p>
                </div>
              )}
              
              {session && session.user.id === inspiration.userId && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <a
                    href={`/dashboard/inspirations/${inspiration.id}/edit`}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    编辑
                  </a>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    删除
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}