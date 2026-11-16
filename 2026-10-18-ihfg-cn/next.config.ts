import type { NextConfig } from "next";

// 双模式:
// - 默认(全栈):支持 API Routes(购物车/登录/分享),本地 npm run dev / start
// - STATIC_EXPORT=1(纯静态):输出 out/,用于 GitHub Pages 等静态托管(无后端功能)
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  // 未设置环境变量时默认 /ihfg-cn(GitHub Pages);本地预览可置空 NEXT_PUBLIC_BASE_PATH= 走根路径
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? (isStaticExport ? "/ihfg-cn" : ""),
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
