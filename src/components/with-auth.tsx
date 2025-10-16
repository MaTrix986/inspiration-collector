'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuth(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        // 如果用户未登录，重定向到登录页面
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      // 在验证过程中显示加载状态
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    // 用户已验证，渲染受保护的组件
    return <WrappedComponent {...props} />;
  };
}