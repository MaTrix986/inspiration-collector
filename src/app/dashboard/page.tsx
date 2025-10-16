'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import InspirationList from '@/components/inspiration-list';
import DashboardNav from '@/components/dashboard-nav';
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { session, logout } = useAuth();
  const router = useRouter();

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">灵感收集器</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                欢迎, {session.user?.name || session.user?.email}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                登出
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <DashboardNav />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <InspirationList />
        </div>
      </main>
    </div>
  );
}