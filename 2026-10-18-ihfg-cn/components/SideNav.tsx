import Link from "next/link";
import { guidelines } from "@/lib/data";
import { guidelineEn } from "@/lib/i18n";

/** A–Z 大字母侧栏导航:左侧刻度导轨 + 等宽字母,中英双语 */
export default function SideNav() {
  return (
    <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-[132px] lg:self-start">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="mono text-[10.5px] text-ink-3 tracking-[0.14em]">A–Z INDEX</span>
        <span className="flex-1 h-px bg-line" />
        <span className="mono text-[10.5px] text-ink-3">{String(guidelines.length).padStart(2, "0")}</span>
      </div>
      <div className="sidenav-head">
        设计指南<span className="en ml-2 text-[9px]">Guidelines</span>
      </div>
      <ul className="sidenav-list border border-line border-t-0 bg-white rounded-b-[2px]">
        {guidelines.map(g => (
          <li key={g.slug} className="border-b border-line last:border-b-0">
            <Link href={`/guidelines/${g.slug}`} className="sidenav-item">
              <span className="sidenav-letter">{g.letter}</span>
              <span className="min-w-0">
                <span className="block text-[14px] leading-snug text-ink-2">{g.name}</span>
                <span className="block en text-[9px] normal-case tracking-[0.02em] mt-0.5 truncate">
                  {guidelineEn(g.slug).name}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
