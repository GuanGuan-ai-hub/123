import Link from "next/link";
import ProcDrawing from "@/components/ProcDrawing";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { components, fpus, guidelines, sampleDetails, categoryOf } from "@/lib/data";
import { zhComponentName, categoryEn, guidelineEn, sampleEn } from "@/lib/i18n";

export default function Home() {
  const featured = sampleDetails;
  const hero = featured[0];
  const side = featured.slice(1, 3);

  const latest = components
    .filter(c => !featured.some(f => f.slug === c.slug))
    .slice(0, 6);

  const catMap = new Map<string, number>();
  components.forEach(c => {
    const k = categoryOf(c.code);
    catMap.set(k, (catMap.get(k) || 0) + 1);
  });
  const cats = Array.from(catMap.entries())
    .filter(([name]) => name !== "其他")
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({
      name,
      count,
      items: components.filter(c => categoryOf(c.code) === name).slice(0, 3),
    }));

  const tickerItems = components.slice(0, 14).map(c => `${c.code} · ${categoryOf(c.code)} / ${categoryEn(categoryOf(c.code))}`);

  const stats: { zh: string; en: string; value: number; text?: string }[] = [
    { zh: "标准组件", en: "Components", value: components.length },
    { zh: "功能单元", en: "FPUs", value: fpus.length },
    { zh: "指南分册", en: "Volumes", value: guidelines.length },
    { zh: "编码体系", en: "Encoding", value: 0, text: "TYPE-VAR" },
  ];

  return (
    <div>
      <h1 className="sr-only">医疗工艺数据库 Medical Process Database · 医疗设施设计标准指南</h1>

      {/* 开篇:品牌 + 读数 */}
      <Reveal>
        <section className="border-b border-line pb-7">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mono text-[10.5px] text-ink-3 tracking-[0.12em] mb-3">
                SEC.00 / OVERVIEW &nbsp;·&nbsp; BILINGUAL EDITION
              </div>
              <div className="eyebrow mb-2">医疗设施规划设计资源 / Health Facility Planning Resources</div>
              <p className="text-[30px] md:text-[34px] leading-[1.25] font-semibold tracking-[-0.01em] text-ink max-w-[26ch]">
                医疗设施设计标准指南
              </p>
              <p className="en-line mt-1.5 text-[12px]">Health Facility Design Standards &amp; Component Database</p>
              <p className="lead mt-4 max-w-[56ch]">
                房间数据表(RDS)、房间布局图(RLS)、功能规划单元(FPU)与十册设计指南,
                按统一的编码体系组织,供规划、设计与深化阶段直接调用。
              </p>
              <p className="en-lead mt-2">
                Room Data Sheets, Room Layout Sheets, Functional Planning Units and ten guideline volumes,
                organised under one coding system for planning, design and documentation.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4 border-t sm:border-t-0 sm:border-l border-line pt-5 sm:pt-0 sm:pl-8">
              {stats.map(s => (
                <div key={s.en}>
                  <div className="mono text-[26px] leading-none text-brand-dark">
                    {s.text ? <span className="text-[13px] tracking-[0.02em]">{s.text}</span> : <CountUp to={s.value} />}
                  </div>
                  <div className="text-[11px] text-ink-2 mt-2">{s.zh}</div>
                  <div className="mono text-[9.5px] text-ink-3 tracking-[0.1em]">{s.en}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* 主推:一大两小 */}
      <Reveal delay={80}>
        <section className="mt-8 grid lg:grid-cols-[1.6fr_1fr] border border-line bg-white">
          <Link href={`/standard-components/${hero.slug}`} className="group relative lg:border-r border-line">
            <div className="thumb thumb-tint tech-grid-fine h-[260px] md:h-[320px] border-b border-line">
              <ProcDrawing seed={hero.slug} className="w-full h-full text-trace" weight={1.15} />
              <span className="scan-line" />
              <span className="absolute left-4 top-4 mono text-[10px] tracking-[0.12em] bg-white/90 border border-line px-2 py-1 text-ink-2">
                FEATURED / 01
              </span>
            </div>
            <div className="p-6 md:p-7">
              <div className="mono text-[10px] text-ink-3 tracking-[0.1em] mb-2">
                {hero.rds.roomCode} &nbsp;·&nbsp; {categoryOf(hero.rds.roomCode)} / {categoryEn(categoryOf(hero.rds.roomCode))}
              </div>
              <h2 className="text-[24px] md:text-[27px] font-semibold leading-snug text-ink group-hover:text-link transition-colors">
                {hero.name}
              </h2>
              <p className="en-line mt-1">{sampleEn(hero.slug, hero.name)}</p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2 line-clamp-2">
                {hero.rds.description}
              </p>
              <div className="mt-5 flex items-center gap-2 text-[12.5px] text-link">
                查看组件<span className="en ml-1">View component</span><span className="arrow-shift">→</span>
              </div>
            </div>
          </Link>

          <div className="grid grid-rows-2">
            {side.map((s, i) => (
              <Link
                key={s.slug}
                href={`/standard-components/${s.slug}`}
                className={`group flex ${i === 0 ? "border-b border-line" : ""}`}
              >
                <div className="thumb thumb-tint tech-grid-fine w-[46%] shrink-0 border-r border-line">
                  <ProcDrawing seed={s.slug} className="w-full h-full text-trace" variant="section" weight={1.6} />
                </div>
                <div className="p-5 flex flex-col justify-center min-w-0">
                  <div className="mono text-[10px] text-ink-3 tracking-[0.1em] mb-2">
                    {s.rds.roomCode}
                  </div>
                  <h3 className="text-[16.5px] font-semibold leading-snug text-ink group-hover:text-link transition-colors">
                    {s.name}
                  </h3>
                  <p className="en-line mt-1 truncate">{sampleEn(s.slug, s.name)}</p>
                  <div className="mono text-[10.5px] text-ink-3 mt-2.5">
                    {s.rds.netRoomArea} m² &nbsp;·&nbsp; {categoryOf(s.rds.roomCode)} / {categoryEn(categoryOf(s.rds.roomCode))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 编码跑马灯 */}
      <div className="ticker mt-6 border-y border-line overflow-hidden">
        <div className="ticker-track">
          {[0, 1].map(k => (
            <div className="ticker-group" key={k} aria-hidden={k === 1}>
              {tickerItems.map(t => (
                <span className="ticker-item" key={`${k}-${t}`}>
                  <i />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 最新组件:信息流 */}
      <Reveal delay={60}>
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="mono text-[10.5px] text-ink-3 tracking-[0.12em]">
              SEC.01 / 最新组件 LATEST COMPONENTS
            </span>
            <span className="flex-1 h-px bg-line" />
            <Link href="/standard-components" className="mono text-[10.5px] text-link hover:underline underline-offset-4">
              全部 {components.length} / ALL →
            </Link>
          </div>

          <div className="divide-y divide-line border-b border-line">
            {latest.map((c, i) => {
              const zh = zhComponentName(c.name);
              return (
                <Link
                  key={c.slug}
                  href={`/standard-components/${c.slug}`}
                  className="group flex items-center gap-5 py-5 hover:bg-brand-mist/60 transition-colors"
                >
                  <span className="mono text-[11px] text-ink-3 w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <div className="thumb thumb-tint w-[112px] h-[80px] shrink-0 border border-line">
                    <ProcDrawing seed={c.slug} className="w-full h-full text-brand-mid" variant="section" weight={2.4} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mono text-[10px] text-ink-3 tracking-[0.1em] mb-1">{c.code}</div>
                    <h3 className="text-[16.5px] font-medium text-ink group-hover:text-link transition-colors truncate">
                      {zh ?? c.name}
                    </h3>
                    <p className="en-line mt-0.5 truncate">{c.name.replace(/&#39;/g, "'").replace(/&amp;/g, "&")}</p>
                  </div>
                  <span className="hidden sm:inline mono text-[10px] text-ink-3 border border-line px-2 py-1 whitespace-nowrap">
                    {categoryOf(c.code)} / {categoryEn(categoryOf(c.code))}
                  </span>
                  <span className="text-link opacity-0 group-hover:opacity-100 transition-opacity arrow-shift">→</span>
                </Link>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* 按科室浏览 */}
      <Reveal delay={60}>
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="mono text-[10.5px] text-ink-3 tracking-[0.12em]">SEC.02 / 按科室浏览 BY DEPARTMENT</span>
            <span className="flex-1 h-px bg-line" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {cats.map(cat => (
              <div key={cat.name}>
                <div className="flex items-baseline justify-between border-b border-line-strong pb-2 mb-3">
                  <div>
                    <h3 className="text-[16px] font-semibold text-ink leading-tight">{cat.name}</h3>
                    <span className="mono text-[9.5px] text-ink-3 tracking-[0.1em]">{categoryEn(cat.name)}</span>
                  </div>
                  <span className="mono text-[10px] text-ink-3">{String(cat.count).padStart(3, "0")}</span>
                </div>
                <ul className="space-y-2.5">
                  {cat.items.map(it => (
                    <li key={it.slug}>
                      <Link href={`/standard-components/${it.slug}`} className="group flex items-start gap-2 text-[13.5px] text-ink-2 hover:text-link">
                        <span className="mono text-[10px] text-ink-3 mt-[3px]">—</span>
                        <span className="leading-snug">
                          {zhComponentName(it.name) ?? it.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/standard-components"
                  className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-link"
                >
                  更多「{cat.name}」<span className="en">More</span><span className="arrow-shift">»</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 设计指南:分册索引 */}
      <Reveal delay={60}>
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="mono text-[10.5px] text-ink-3 tracking-[0.12em]">SEC.03 / 设计指南 GUIDELINE VOLUMES</span>
            <span className="flex-1 h-px bg-line" />
            <span className="mono text-[10.5px] text-ink-3">A–W / 10</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-l border-t border-line">
            {guidelines.map(g => {
              const en = guidelineEn(g.slug);
              return (
                <Link
                  key={g.slug}
                  href={`/guidelines/${g.slug}`}
                  className="group border-r border-b border-line p-4 hover:bg-brand-mist transition-colors"
                >
                  <div className="mono text-[20px] text-brand leading-none">{g.letter}</div>
                  <div className="mt-3 text-[13px] leading-snug text-ink-2 group-hover:text-ink">{g.name}</div>
                  <div className="mono text-[9.5px] text-ink-3 mt-1 leading-snug tracking-[0.04em]">{en.name}</div>
                </Link>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal delay={60}>
        <div className="section-card mt-12">
          <div className="section-title">演示说明 / Demo Notes</div>
          <div className="p-6 text-[13.5px] leading-relaxed text-ink-2">
            本站为对 iHFG(healthfacilityguidelines.com)的<strong className="font-semibold text-ink">架构与功能复刻演示版</strong>:
            界面、信息架构、数据模型与交互流程均按逆向报告实现;组件索引为结构演示数据,详情内容(3 个样本)为自编中文演示数据。
            正式上线前应替换为自有版权的中文标准内容(如对接国内相关设计规范)。
            <p className="en-lead mt-2">
              This site is an architecture and interaction demo modelled on iHFG. The component index is structural sample data;
              only three RDS samples contain authored Chinese content. Replace all content with licensed material before launch.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
