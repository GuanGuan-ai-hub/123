import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import SideNav from "@/components/SideNav";
import { guidelines, fpus } from "@/lib/data";
import { guidelineEn, fpuEn } from "@/lib/i18n";

export function generateStaticParams() {
  return guidelines.map(g => ({ part: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ part: string }> }): Promise<Metadata> {
  const { part } = await params;
  const g = guidelines.find(x => x.slug === part);
  const en = guidelineEn(part);
  return { title: g ? `${g.letter} 册 ${g.name} · ${en.name}` : "设计指南" };
}

const CHAPTERS = [
  ["第 1 章 概述与使用方法", "Ch.1 Overview and How to Use"],
  ["第 2 章 规划流程与角色分级", "Ch.2 Planning Process and Role Grading"],
  ["第 3 章 设计标准与通用要求", "Ch.3 Design Standards and General Requirements"],
];

export default async function GuidelinePartPage({ params }: { params: Promise<{ part: string }> }) {
  const { part } = await params;
  const g = guidelines.find(x => x.slug === part);
  if (!g) notFound();
  const en = guidelineEn(g.slug);

  return (
    <div>
      <Breadcrumb items={[{ label: "设计指南", labelEn: "Guidelines" }, { label: `${g.letter} · ${g.name}`, labelEn: en.name }]} />
      <div className="flex flex-col lg:flex-row gap-12">
        <SideNav />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="mono text-[10.5px] text-ink-3 tracking-[0.12em]">SEC.04 / GUIDELINE {g.letter}</span>
            <span className="flex-1 h-px bg-line" />
            <span className="mono text-[10.5px] text-ink-3 truncate">{g.slug.toUpperCase()}</span>
          </div>
          <h1 className="page-title">
            <span className="text-brand-mid font-semibold mr-3 mono">{g.letter}</span>
            {g.name}
            <span className="en-line text-[12px] mt-1">{en.name}</span>
          </h1>
          <p className="lead mb-2 max-w-[72ch]">{g.desc}</p>
          <p className="en-lead mb-7">{en.desc}</p>

          <div className="tech-strip mb-8">
            <span className="tech-cell">分册 / VOLUME <b>{g.letter}</b></span>
            <span className="tech-cell">格式 / FORMAT <b>PDF</b></span>
            <span className="tech-cell">章节 / CHAPTERS <b>03</b></span>
            <span className="tech-cell">数据 / DATA <b>DEMO</b></span>
          </div>

          <div className="section-card">
            <div className="section-title">整册阅读 / Full Volume</div>
            <div className="p-6 flex flex-wrap gap-8 items-center">
              <div className="w-[112px] text-center border border-line">
                <div className="tech-grid-fine bg-brand-soft py-6">
                  <div className="mono text-[20px] font-semibold text-brand-dark tracking-[0.1em]">PDF</div>
                </div>
                <div className="mono text-[10.5px] text-ink-3 py-1.5 border-t border-line">{g.letter} / FULL</div>
              </div>
              <div className="flex-1 min-w-[240px] text-[14px] text-ink-2 leading-relaxed">
                在线阅读或下载本册完整 PDF(演示按钮,未接入真实文件)
                <span className="en-line normal-case mt-1">Read or download the full volume (demo button, no file attached).</span>
              </div>
              <button className="btn-brand btn-tech">免费阅读<span className="en ml-2 text-[#0d2c1f]">Read Free</span></button>
            </div>
          </div>

          <div className="section-card">
            <div className="section-title">章节 / Chapters</div>
            <table className="table-std">
              <thead>
                <tr>
                  <th className="row-index">IDX</th>
                  <th>章节<span className="en ml-1.5 normal-case">Chapter</span></th>
                  <th className="w-32 col-line">操作<span className="en ml-1.5 normal-case">Action</span></th>
                </tr>
              </thead>
              <tbody>
                {CHAPTERS.map(([zh, enTitle], i) => (
                  <tr key={zh}>
                    <td className="row-index">{String(i + 1).padStart(2, "0")}</td>
                    <td>
                      {zh}
                      <span className="en-line normal-case">{enTitle}</span>
                    </td>
                    <td className="col-line"><span className="text-link cursor-pointer hover:underline underline-offset-2">阅读<span className="en ml-1">Read</span></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 mono text-[11px] text-ink-3 border-t border-line">
              PLACEHOLDER · 演示占位章节,正式版接入真实分册章节结构
            </div>
          </div>

          {g.slug === "Health-Facility-Briefing-and-Design" && (
            <div className="section-card">
              <div className="section-title">功能规划单元 / FPUs in this Volume</div>
              <table className="table-std">
                <thead>
                  <tr>
                    <th className="row-index">IDX</th>
                    <th>单元<span className="en ml-1.5 normal-case">Unit</span></th>
                  </tr>
                </thead>
                <tbody>
                  {fpus.map((f, i) => (
                    <tr key={f.slug} id={`fpu-${f.slug}`}>
                      <td className="row-index">{String(i + 1).padStart(3, "0")}</td>
                      <td>
                        {f.name}
                        <span className="en-line normal-case">{fpuEn(f.slug, f.name)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 mono text-[11px] text-ink-3 border-t border-line">
                TOTAL {fpus.length} · 演示清单(正式版每行链接至单元详情页)
              </div>
            </div>
          )}

          <div className="mt-10 pt-5 border-t border-line text-[13.5px] flex items-center gap-3">
            <span className="mono text-[10.5px] text-ink-3">NEXT →</span>
            <Link href="/standard-components" className="text-link hover:underline underline-offset-2">前往标准组件库<span className="en ml-1">Standard Components</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
