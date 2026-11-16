import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import SideNav from "@/components/SideNav";
import AddToCartButton from "@/components/AddToCartButton";
import { components, getFullDetailBySlug, categoryOf, sampleDetails } from "@/lib/data";
import { zhComponentName, categoryEn, sampleEn } from "@/lib/i18n";

export function generateStaticParams() {
  // 静态导出:组件索引 + 3 个 RDS 样本(样本可能不在索引内)全部预渲染
  const slugs = new Set([...components.map(c => c.slug), ...sampleDetails.map(s => s.slug)]);
  return Array.from(slugs).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const full = getFullDetailBySlug(slug);
  if (full) {
    const d = full.detail;
    if (full.source === "sample-zh") return { title: `${d.name} ${sampleEn(slug)}` };
    return { title: `${zhComponentName(d.name) ?? d.name} ${d.name}` };
  }
  const c = components.find(x => x.slug === slug);
  return { title: c ? `${zhComponentName(c.name) ?? c.name} ${c.name}` : "标准组件" };
}

export default async function ComponentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const full = getFullDetailBySlug(slug);
  const index = components.find(x => x.slug === slug);
  if (!full && !index) notFound();
  const detail = full?.detail;
  const isSample = full?.source === "sample-zh";

  const code = detail ? detail.rds.roomCode : index!.code;
  const cat = categoryOf(code);
  const enCat = categoryEn(cat);
  const zhTitle = detail
    ? (isSample ? detail.name : (zhComponentName(detail.name) ?? detail.name))
    : (zhComponentName(index!.name) ?? index!.name);
  const enTitle = detail
    ? (isSample ? sampleEn(slug, detail.name) : detail.name.replace(/&#39;/g, "'").replace(/&amp;/g, "&"))
    : index!.name.replace(/&#39;/g, "'").replace(/&amp;/g, "&");

  return (
    <div>
      <Breadcrumb items={[
        { label: "标准组件", labelEn: "Components", href: "/standard-components" },
        { label: zhTitle, labelEn: enTitle },
      ]} />
      <div className="flex flex-col lg:flex-row gap-12">
        <SideNav />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="mono text-[10.5px] text-ink-3 tracking-[0.12em]">SEC.05 / COMPONENT DETAIL</span>
            <span className="flex-1 h-px bg-line" />
            <span className="mono text-[10.5px] text-ink-3">{detail ? `RDS · RLS · REVIT · ${isSample ? "SAMPLE" : "FULL-RDS"}` : "INDEX ONLY"}</span>
          </div>

          <div className="flex flex-wrap justify-between items-start gap-4">
            <h1 className="page-title mb-0">
              {zhTitle}
              <span className="en-line text-[12px] mt-1">{enTitle}</span>
            </h1>
            <div className="flex gap-2.5 pt-1">
              <button className="btn-ghost">打印<span className="en ml-1.5">Print</span></button>
              <button className="btn-ghost">邮件分享<span className="en ml-1.5">Email</span></button>
            </div>
          </div>

          <div className="tech-strip mt-5 mb-8">
            <span className="tech-cell">编码 / CODE <b>{code}</b></span>
            <span className="tech-cell">类别 / TYPE <b>{cat} · {enCat}</b></span>
            <span className="tech-cell">文件 / FILES <b>{detail ? "03" : "00"}</b></span>
            <span className="tech-cell">状态 / STATUS <b>{isSample ? "SAMPLE" : detail ? "FULL-RDS" : "INDEX"}</b></span>
          </div>

          {!detail ? (
            <div className="section-card">
              <div className="section-title">{index!.code} · {categoryOf(index!.code)} / {enCat}</div>
              <div className="p-6 text-[14px] leading-relaxed text-ink-2">
                该组件为索引演示数据,尚未编制中文房间数据表(RDS)。
                <span className="en-line normal-case mt-1">This entry is index-only; no Room Data Sheet has been authored yet.</span>
                完整演示样本请查看 / Full samples:
                <ul className="mt-3 space-y-1.5">
                  <li><Link className="text-link hover:underline underline-offset-2" href="/standard-components/1-Bed-Room-Standard-15m2">单人间病房 - 标准型 15m² / 1 Bed Room — Standard, 15 m²</Link></li>
                  <li><Link className="text-link hover:underline underline-offset-2" href="/standard-components/Operating-Room-General">手术室 - 综合型 / Operating Room — General</Link></li>
                  <li><Link className="text-link hover:underline underline-offset-2" href="/standard-components/Consult-Exam-Room">诊察室 / Consult &amp; Examination Room</Link></li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {/* 文件区:在线编辑 / RLS PDF / 付费 Revit */}
              <div className="section-card">
                <div className="section-title">在线简报系统 / Online Briefing</div>
                <div className="p-6 flex flex-wrap gap-6 items-center">
                  <div className="w-[112px] text-center border border-line">
                    <div className="tech-grid-fine bg-brand-soft py-5">
                      <div className="mono text-[15px] font-semibold text-brand-dark tracking-[0.06em]">HFBS</div>
                    </div>
                    <div className="mono text-[10px] text-ink-3 py-1 border-t border-line">ONLINE</div>
                  </div>
                  <div className="flex-1 min-w-[240px] text-[13.5px] leading-relaxed text-ink-2">{detail.files[0].description}</div>
                  <button className="btn-brand btn-tech">在线编辑<span className="en ml-2 text-[#0d2c1f]">Edit</span></button>
                </div>
              </div>

              <div className="section-card">
                <div className="section-title">房间布局图(RLS)/ Room Layout Sheet</div>
                <div className="p-6 flex flex-wrap gap-6 items-center border-b border-line">
                  <div className="w-[112px] text-center border border-line bg-section">
                    <div className="py-5 mono text-[11.5px] text-ink-2">RLS</div>
                    <div className="mono text-[10px] text-ink-3 py-1 border-t border-line">PDF</div>
                  </div>
                  <div className="flex-1 min-w-[240px] text-[13.5px] leading-relaxed text-ink-2">{detail.files[1].description}</div>
                  <div className="mono text-[14px] font-semibold w-16 text-center">{detail.files[1].price}</div>
                  <button className="btn-brand btn-tech">查看<span className="en ml-1.5 text-[#0d2c1f]">View</span></button>
                </div>
                <div className="p-6 flex flex-wrap gap-6 items-center">
                  <div className="w-[112px] text-center border border-brand">
                    <div className="bg-brand py-5 mono text-[11.5px] text-[#0d2c1f] font-semibold">RVT</div>
                    <div className="mono text-[10px] text-ink-3 py-1 border-t border-line">REVIT</div>
                  </div>
                  <div className="flex-1 min-w-[240px] text-[13.5px] leading-relaxed text-ink-2">{detail.files[2].description}</div>
                  <div className="mono text-[14px] font-semibold w-16 text-center">{detail.files[2].price}</div>
                  <AddToCartButton fileId={`demo-${detail.rds.roomCode}`} code={detail.rds.roomCode} />
                </div>
              </div>

              {/* RDS 头部元数据 */}
              <div className="section-card">
                <div className="section-title">在线房间数据表(RDS)/ Room Data Sheet</div>
                <table className="table-std kv-table">
                  <tbody>
                    <tr><th className="w-56">房间编码<span className="en block mt-0.5 normal-case">Room Code</span></th><td className="mono">{detail.rds.roomCode}</td></tr>
                    <tr><th>净面积(m²)<span className="en block mt-0.5 normal-case">Net Area</span></th><td className="mono">{detail.rds.netRoomArea}</td></tr>
                    <tr><th>运营时间<span className="en block mt-0.5 normal-case">Hours of Operation</span></th><td>{detail.rds.hoursOfOperation}</td></tr>
                    <tr><th>占用人员<span className="en block mt-0.5 normal-case">Occupancy</span></th><td>{detail.rds.occupancy}</td></tr>
                    <tr><th>描述/特殊要求<span className="en block mt-0.5 normal-case">Description / Special Requirements</span></th><td>{detail.rds.description}</td></tr>
                    <tr><th>修订历史<span className="en block mt-0.5 normal-case">Amendments</span></th>
                      <td className="mono text-[13px]">{detail.rds.amendments.map((a, i) => <div key={i}>{a.date} {a.note}</div>)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 装修构造表 */}
              <div className="section-card">
                <div className="section-title">装修构造与饰面 / Finishes &amp; Fabric</div>
                <div className="overflow-x-auto">
                  <table className="table-std">
                    <thead>
                      <tr>
                        <th className="row-index">ID</th>
                        <th>部位<span className="en ml-1.5 normal-case">Element</span></th>
                        <th>材料<span className="en ml-1.5 normal-case">Material</span></th>
                        <th>饰面<span className="en ml-1.5 normal-case">Finish</span></th>
                        <th>规格说明<span className="en ml-1.5 normal-case">Specification</span></th>
                        <th>选型<span className="en ml-1.5 normal-case">Selection</span></th>
                        <th className="col-line">备注<span className="en ml-1.5 normal-case">Remarks</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.finishes.map(f => (
                        <tr key={f.id}>
                          <td className="row-index">{f.id}</td>
                          <td>{f.fabric}</td><td>{f.material}</td>
                          <td>{f.finish}</td><td>{f.specification}</td><td>{f.selection}</td>
                          <td className="text-ink-3 col-line">{f.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 设备家具表 */}
              <div className="section-card">
                <div className="section-title">设备与家具配置 / Equipment &amp; Furniture</div>
                <div className="overflow-x-auto">
                  <table className="table-std">
                    <thead>
                      <tr>
                        <th className="row-index">ID</th>
                        <th>名称<span className="en ml-1.5 normal-case">Item</span></th>
                        <th>类别<span className="en ml-1.5 normal-case">Category</span></th>
                        <th>组<span className="en ml-1.5 normal-case">Group</span></th>
                        <th>数量<span className="en ml-1.5 normal-case">Qty</span></th>
                        <th className="col-line">备注<span className="en ml-1.5 normal-case">Remarks</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.equipment.map(e => (
                        <tr key={e.id}>
                          <td className="row-index">{e.id}</td>
                          <td>{e.description}</td><td>{e.category}</td>
                          <td>{e.group}</td><td className="mono">{e.qty}</td>
                          <td className="text-ink-3 col-line">{e.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
