'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InspirationForm from '@/components/inspiration-form';

export default function EditInspirationPage({ params }: { params: { id: string } }) {
  const [inspiration, setInspiration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const handleSave = async (updatedInspiration: any) => {
    try {
      const response = await fetch(`/api/inspirations/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInspiration),
      });

      const result = await response.json();
      
      if (result.success) {
        // 保存成功后跳转到灵感列表页面
        router.push('/dashboard/inspirations');
        router.refresh();
        return true;
      } else {
        console.error('保存失败:', result.error);
        return false;
      }
    } catch (error) {
      console.error('保存过程中发生错误:', error);
      return false;
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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <InspirationForm inspiration={inspiration} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}