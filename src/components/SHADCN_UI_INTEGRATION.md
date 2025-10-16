# shadcn/ui 集成说明

本文档总结了在 Next.js 项目中集成 shadcn/ui 组件库的步骤和实现方案。

## 1. 安装依赖

我们安装了以下依赖包来支持 shadcn/ui：

- `clsx` 和 `tailwind-merge`：用于条件样式合并
- `@radix-ui/react-slot`：用于构建可组合组件
- `class-variance-authority`：用于创建可变体组件
- `@radix-ui/react-label`：用于标签组件
- `@radix-ui/react-select`：用于选择器组件
- `lucide-react`：用于图标组件

## 2. 配置文件

### components.json
创建了配置文件来定义组件的别名和路径：

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### utils.ts
创建了工具函数文件来处理类名合并：

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 3. 主题支持

### ThemeProvider
创建了主题提供者组件以支持深色模式：

```tsx
'use client';

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### 根布局更新
在根布局中添加了 ThemeProvider 以启用主题支持。

## 4. 组件实现

我们创建了以下 shadcn/ui 组件：

1. Button（按钮）
2. Card（卡片）
3. Input（输入框）
4. Textarea（文本域）
5. Badge（徽章）
6. Select（选择器）

## 5. 组件替换

我们将现有组件替换为使用 shadcn/ui 组件：

1. DashboardNav（导航组件）
2. InspirationForm（灵感表单）
3. InspirationList（灵感列表）
4. DashboardPage（仪表板页面）
5. Home Page（主页）

## 6. 样式一致性

更新了全局 CSS 样式以支持 shadcn/ui 的颜色变量和主题系统。

## 使用说明

现在可以在项目中使用以下方式导入和使用组件：

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
```

所有组件都支持主题切换和响应式设计。