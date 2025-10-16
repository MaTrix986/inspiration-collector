'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function DashboardNav() {
  const pathname = usePathname();
  
  const navItems = [
    { name: '仪表板', href: '/dashboard' },
    { name: '我的灵感', href: '/dashboard/inspirations' },
  ];

  // 桌面端导航
  const DesktopNav = () => (
    <div className="hidden md:flex space-x-2">
      {navItems.map((item) => (
        <Button
          key={item.name}
          variant={pathname === item.href ? "default" : "ghost"}
          size="sm"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          asChild
        >
          <Link href={item.href}>
            {item.name}
          </Link>
        </Button>
      ))}
    </div>
  );

  // 移动端导航
  const MobileNav = () => (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">切换导航菜单</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>导航菜单</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-2 mt-4">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? "default" : "ghost"}
                className="justify-start"
                asChild
              >
                <Link href={item.href}>
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <DesktopNav />
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  );
}