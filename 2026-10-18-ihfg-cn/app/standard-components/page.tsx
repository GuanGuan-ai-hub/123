import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import SideNav from "@/components/SideNav";
import ComponentTable from "@/components/ComponentTable";
import { components, categoryOf } from "@/lib/data";

export const metadata: Metadata = { title: "标准组件 Standard Components" };

export default function StandardComponentsPage() {
  const items = components.map(c => ({ ...c, category: categoryOf(c.code) }));
  const catCount = new Set(items.map(i => i.category)).size;

  return (
    <div>
      <Breadcrumb items={[{ label: "标准组件", labelEn: "Standard Components" }]} />
      <div className="flex flex-col lg:flex-row gap-12">
        <SideNav />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="mono text-[10.5px] text-ink-3 tracking-[0.12em]">SEC.02 / STANDARD COMPONENTS</span>
            <span className="flex-1 h-px bg-line" />
            <span className="mono text-[10.5px] text-ink-3">RDS · RLS</span>
          </div>
          <h1 className="page-title">
            标准组件
            <span className="en-line text-[12px] mt-1">Standard Components</span>
          </h1>
          <p className="lead mb-2 max-w-[72ch]">
            标准组件是本指南的核心内容,提供医疗设施中最常见房间与空间的详细信息。
            每个组件由<strong className="font-semibold text-ink">房间数据表(RDS)</strong>与<strong className="font-semibold text-ink">房间布局图(RLS)</strong>构成:
            RDS 给出单个房间类型的详细任务书要求(面积、运营、人员、装修构造、设备配置);
            RLS 呈现标准房间内的物理布局,并配套 Revit/CAD 文件辅助设计。
          </p>
          <p className="en-lead mb-7">
            Standard Components describe the most common rooms and spaces in a health facility. Each component combines a
            Room Data Sheet (RDS) with a Room Layout Sheet (RLS), plus Revit/CAD files for documentation.
          </p>

          <div className="tech-strip mb-8">
            <span className="tech-cell">索引 / INDEX <b>{items.length}</b></span>
            <span className="tech-cell">大类 / GROUPS <b>{String(catCount).padStart(2, "0")}</b></span>
            <span className="tech-cell">编码 / CODE <b>TYPE-VAR-AREA-I</b></span>
            <span className="tech-cell">数据 / DATA <b>DEMO</b></span>
          </div>

          <ComponentTable items={items} />
        </div>
      </div>
    </div>
  );
}
