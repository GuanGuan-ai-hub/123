// GET /api/components —— 组件索引(搜索/分页参数)
// 对齐原站"服务端一次性输出全表"的模式,API 版提供分页
import { NextRequest, NextResponse } from "next/server";
import { components, categoryOf } from "@/lib/data";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").toLowerCase().trim();
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? 1));
  const size = Math.min(100, Math.max(10, Number(req.nextUrl.searchParams.get("size") ?? 25)));

  const filtered = components.filter(c =>
    q === "" || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
  );
  const items = filtered.slice((page - 1) * size, page * size).map(c => ({ ...c, category: categoryOf(c.code) }));

  return NextResponse.json({
    state: "SUCCESS",
    total: filtered.length,
    page, size,
    items,
  });
}
