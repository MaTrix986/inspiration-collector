'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { session } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    const { logout } = useAuth();
    await logout();
    router.refresh();
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  const handleInspirations = () => {
    router.push('/dashboard/inspirations');
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">灵感收集器</h1>
          <p className="text-lg mb-8 text-muted-foreground">收集、组织和回顾您的创意灵感</p>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {session ? "欢迎回来!" : "开始使用"}
            </CardTitle>
            <CardDescription>
              {session 
                ? `您好, ${session.user?.name || session.user?.email}，您已登录到您的账户` 
                : "请登录或注册以开始收集您的灵感"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {session ? (
              <div className="flex flex-col gap-4">
                <Button onClick={handleDashboard} className="w-full">
                  进入仪表板
                </Button>
                <Button onClick={handleInspirations} variant="secondary" className="w-full">
                  我的灵感
                </Button>
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  登出
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Button onClick={handleLogin} className="w-full">
                  登录
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/register">
                    注册
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-muted-foreground">
              © 2025 灵感收集器. 保留所有权利.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}