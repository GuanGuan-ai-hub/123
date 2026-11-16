import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import CartFab from "@/components/CartFab";

export const metadata: Metadata = {
  title: {
    default: "医疗工艺数据库 Medical Process Database | 医疗设施设计标准指南",
    template: "%s | 医疗工艺数据库",
  },
  description:
    "医疗设施标准组件库、功能规划单元与设计指南的中英双语平台(架构复刻自 iHFG,内容为自有演示数据)。Bilingual platform for health facility standard components, FPUs and design guidelines.",
};

const FOOTER_LINKS = [
  ["使用指南", "User Guide"],
  ["使用条件", "Terms"],
  ["免责声明", "Disclaimer"],
  ["版权声明", "Copyright"],
  ["关于我们", "About"],
  ["贡献者", "Contributors"],
  ["常见问题", "FAQ"],
  ["联系我们", "Contact"],
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1 max-w-[1240px] w-full mx-auto px-6 py-10">{children}</main>
        <footer className="site-footer">
          <div className="tick-rule opacity-60" />
          <div className="max-w-[1240px] mx-auto px-6 py-9">
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {FOOTER_LINKS.map(([zh, en]) => (
                <span key={zh} className="whitespace-nowrap">
                  {zh}
                  <span className="en ml-1.5">{en}</span>
                </span>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-line text-[12px] leading-relaxed flex flex-wrap items-start gap-x-4 gap-y-1">
              <span className="mono text-[10.5px] tracking-[0.1em]">© 2026</span>
              <span>
                医疗工艺数据库 · 本站为架构功能演示,内容数据需替换为自有版权材料;原站内容版权归 TAHPI 所有
                <br />
                <span className="en normal-case tracking-normal">
                  Medical Process Database · Architecture demo only. All content must be replaced with licensed material.
                </span>
              </span>
            </div>
          </div>
        </footer>
        <CartFab />
      </body>
    </html>
  );
}
