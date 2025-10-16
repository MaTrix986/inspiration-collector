'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import InspirationForm from '@/components/inspiration-form';

export default function CreateInspirationPage() {
  const router = useRouter();
  const { session } = useAuth();

  const handleSave = async (inspiration: any) => {
    // 确保用户已登录
    if (!session) {
      console.error('用户未登录');
      return false;
    }
    
    try {
      const response = await fetch('/api/inspirations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...inspiration,
          userId: session.user.id // 确保传递用户ID
        }),
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <InspirationForm onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}