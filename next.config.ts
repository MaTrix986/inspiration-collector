import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 启用React Strict Mode
  reactStrictMode: true,
  // 压缩图片
  images: {
    minimumCacheTTL: 60,
  },
  // 启用swcMinify
  swcMinify: true,
};

export default nextConfig;
