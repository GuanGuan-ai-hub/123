import Link from "next/link";

/** 页头:居中报头式排版,品牌与导航均为中英双语 */
export default function SiteHeader() {
  const nav = [
    { href: "/", zh: "首页", en: "Home" },
    { href: "/guidelines/Health-Facility-Briefing-and-Design", zh: "设计指南", en: "Guidelines" },
    { href: "/fpus", zh: "功能规划单元", en: "FPUs" },
    { href: "/standard-components", zh: "标准组件", en: "Components" },
    { href: "/standard-components", zh: "在线简报系统", en: "Briefing" },
  ];

  return (
    <header className="site-header">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="relative flex flex-col items-center pt-4 pb-1">
          <span className="mono absolute left-0 top-5 hidden md:block text-[10px] text-ink-3 tracking-[0.12em]">
            EST. 2026
          </span>
          <span className="mono absolute right-0 top-5 hidden md:block text-[10px] text-ink-3 border border-line-strong px-2 py-[3px]">
            V26.10
          </span>

          <Link href="/" className="group flex flex-col items-center text-center">
            <span className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="医疗工艺数据库"
                className="w-9 h-9 object-contain drop-shadow-[0_1px_2px_rgba(22,56,43,0.15)]"
              />
              <span className="brand-name group-hover:text-link transition-colors">医疗工艺数据库</span>
            </span>
            <span className="brand-sub mt-1.5">MEDICAL PROCESS DATABASE · 医疗设施设计标准指南</span>
          </Link>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2 md:gap-x-9 py-2">
          {nav.map(item => (
            <Link key={item.en} href={item.href} className="nav-link text-center">
              {item.zh}
              <span className="nav-en">{item.en}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="tick-rule opacity-70" />
    </header>
  );
}
