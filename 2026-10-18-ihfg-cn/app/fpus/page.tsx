import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import SideNav from "@/components/SideNav";
import { fpus } from "@/lib/data";
import { fpuEn } from "@/lib/i18n";

export const metadata: Metadata = { title: "功能规划单元 Functional Planning Units" };

export default function FpusPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "功能规划单元", labelEn: "FPUs" }]} />
      <div className="flex flex-col lg:flex-row gap-12">
        <SideNav />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="mono text-[10.5px] text-ink-3 tracking-[0.12em]">SEC.03 / FUNCTIONAL PLANNING UNITS</span>
            <span className="flex-1 h-px bg-line" />
            <span className="mono text-[10.5px] text-ink-3">FPU</span>
          </div>
          <h1 className="page-title">
            功能规划单元
            <span className="en-line text-[12px] mt-1">Functional Planning Units</span>
          </h1>
          <p className="lead mb-2 max-w-[72ch]">
            功能规划单元(FPU)按临床与服务单元组织,每个单元定义其功能构成、房间组成(引用标准组件)、
            人员配置与面积指标。单元详情页规划中,当前可从
            <Link href="/guidelines/Health-Facility-Briefing-and-Design" className="text-link hover:underline underline-offset-2 mx-1">B 册指南</Link>
            进入对应章节。
          </p>
          <p className="en-lead mb-7">
            FPUs are organised by clinical and support unit, each defining its functional composition, room mix
            (referencing Standard Components), staffing and area benchmarks. Unit detail pages are planned;
            for now see Volume B.
          </p>

          <div className="tech-strip mb-8">
            <span className="tech-cell">单元 / UNITS <b>{String(fpus.length).padStart(2, "0")}</b></span>
            <span className="tech-cell">对应分册 / VOLUME <b>B</b></span>
            <span className="tech-cell">数据 / DATA <b>DEMO</b></span>
          </div>

          <div className="section-card">
            <div className="section-title">单元清单 / Unit List</div>
            <table className="table-std">
              <thead>
                <tr>
                  <th className="row-index">IDX</th>
                  <th>功能规划单元<span className="en ml-1.5 normal-case">Unit</span></th>
                </tr>
              </thead>
              <tbody>
                {fpus.map((f, i) => (
                  <tr key={f.slug}>
                    <td className="row-index">{String(i + 1).padStart(3, "0")}</td>
                    <td>
                      <Link href={`/guidelines/Health-Facility-Briefing-and-Design#fpu-${f.slug}`} className="text-link hover:underline underline-offset-2">
                        {f.name}
                      </Link>
                      <span className="en-line normal-case">{fpuEn(f.slug, f.name)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
