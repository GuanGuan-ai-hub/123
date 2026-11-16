// GET /api/components/[slug] —— 组件详情(607 全量 RDS,来自逆向数据)
import { NextRequest, NextResponse } from "next/server";
import { getFullDetailBySlug } from "@/lib/data";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const detail = getFullDetailBySlug(slug);
  if (!detail) return NextResponse.json({ state: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ state: "SUCCESS", detail });
}
