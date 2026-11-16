"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ComponentIndex } from "@/lib/types";
import { zhComponentName, categoryEn } from "@/lib/i18n";

const inputBase = "bg-white border border-line-strong rounded-[2px] px-3 py-1.5 text-[13.5px] text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25";

/** 组件列表:客户端搜索 + 分页(25/50/75/100) */
export default function ComponentTable({ items }: { items: (ComponentIndex & { category: string })[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(25);
  const [cat, setCat] = useState("全部");

  const cats = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach(i => m.set(i.category, (m.get(i.category) || 0) + 1));
    return [["全部", items.length], ...Array.from(m.entries()).sort((a, b) => b[1] - a[1])] as [string, number][];
  }, [items]);

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return items.filter(i =>
      (cat === "全部" || i.category === cat) &&
      (kw === "" || i.name.toLowerCase().includes(kw) || i.code.toLowerCase().includes(kw))
    );
  }, [items, q, cat]);

  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const safePage = Math.min(page, pages - 1);
  const rows = filtered.slice(safePage * size, safePage * size + size);

  return (
    <div>
      {/* 工具行:条数选择 + 搜索 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-line">
        <label className="text-[13.5px] text-ink-2 flex items-center gap-2">
          每页<span className="en">Rows</span>
          <select
            className={`${inputBase} pr-7`}
            value={size}
            onChange={e => { setSize(Number(e.target.value)); setPage(0); }}
          >
            {[25, 50, 75, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          条
        </label>
        <label className="text-[13.5px] text-ink-2 flex items-center gap-2 w-full sm:w-auto pr-0 sm:pr-16">
          <span className="hidden sm:inline">搜索<span className="en ml-1">Search</span></span>
          <input
            className={`${inputBase} w-full sm:w-64`}
            placeholder="名称或编码 / Name or code, e.g. 1BR"
            value={q}
            onChange={e => { setQ(e.target.value); setPage(0); }}
          />
        </label>
      </div>

      {/* 大类筛选 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {cats.map(([name, n]) => (
          <button
            key={name}
            onClick={() => { setCat(name); setPage(0); }}
            className={`px-3 py-1 text-[13px] rounded-[2px] border ${
              cat === name
                ? "bg-brand-soft text-brand-dark border-brand font-semibold"
                : "bg-white border-line text-ink-2 hover:border-brand hover:text-brand-dark"
            }`}
          >
            <span className="block leading-tight">
              {name} <span className={cat === name ? "text-brand-dark/60" : "text-ink-3"}>({n})</span>
            </span>
            <span className="hidden sm:block mono text-[9px] tracking-[0.06em] opacity-70 mt-0.5">
              {name === "全部" ? "All" : categoryEn(name)}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-2">
        <span className="mono text-[10.5px] text-ink-3 tracking-[0.12em]">组件索引 / COMPONENT INDEX</span>
        <span className="flex-1 h-px bg-line" />
        <span className="mono text-[10.5px] text-ink-3">{String(filtered.length).padStart(3, "0")} ITEMS</span>
      </div>

      <div className="overflow-x-auto">
        <table className="table-std min-w-full">
          <thead>
            <tr>
              <th className="row-index">IDX</th>
              <th className="w-[62%]">名称<span className="en ml-1.5 normal-case">Name</span></th>
              <th className="text-right col-line">编码<span className="en ml-1.5 normal-case">Code</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i, idx) => (
              <tr key={i.slug}>
                <td className="row-index">{String(safePage * size + idx + 1).padStart(3, "0")}</td>
                <td>
                  <Link href={`/standard-components/${i.slug}`} className="text-link hover:underline underline-offset-2">
                    {zhComponentName(i.name) ?? i.name}
                  </Link>
                  <span className="en-line normal-case truncate">{i.name.replace(/&#39;/g, "'").replace(/&amp;/g, "&")}</span>
                </td>
                <td className="text-right col-line">
                  <Link href={`/standard-components/${i.slug}`} className="mono text-[12.5px] text-ink-3 hover:text-link">{i.code}</Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={3} className="text-center text-ink-3 py-10">没有匹配的组件<span className="en block mt-1">No matching components</span></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="mt-5 flex flex-wrap items-center gap-4 text-[13px] text-ink-3">
        <span>共 {filtered.length} 条 · 第 {safePage + 1} / {pages} 页<span className="en ml-2">{filtered.length} ITEMS</span></span>
        <div className="inline-flex gap-1">
          <button
            className="px-3 py-1 border border-line rounded-[2px] bg-white hover:border-brand disabled:opacity-40 disabled:hover:border-line"
            disabled={safePage === 0}
            onClick={() => setPage(p => p - 1)}
          >上一页<span className="en ml-1">Prev</span></button>
          {Array.from({ length: Math.min(7, pages) }, (_, k) => {
            const start = Math.max(0, Math.min(safePage - 3, pages - 7));
            const n = start + k;
            return (
              <button
                key={n}
                className={`px-3 py-1 border rounded-[2px] ${
                  n === safePage
                    ? "bg-brand-soft text-brand-dark border-brand font-semibold"
                    : "bg-white border-line hover:border-brand"
                }`}
                onClick={() => setPage(n)}
              >{n + 1}</button>
            );
          })}
          <button
            className="px-3 py-1 border border-line rounded-[2px] bg-white hover:border-brand disabled:opacity-40 disabled:hover:border-line"
            disabled={safePage >= pages - 1}
            onClick={() => setPage(p => p + 1)}
          >下一页<span className="en ml-1">Next</span></button>
        </div>
      </div>
    </div>
  );
}
