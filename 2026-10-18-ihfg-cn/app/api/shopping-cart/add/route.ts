// POST /api/shopping-cart/add —— 对齐原站 POST /ShoppingCart/Add
// 实测行为:返回购物车数量字符串;同 fileId 去重
import { NextRequest, NextResponse } from "next/server";
import { addToCart } from "@/lib/server/store";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const fileId = String(form.get("fileId") ?? "");
  const code = String(form.get("code") ?? "");
  if (!fileId) return new NextResponse("INVALID", { status: 400 });

  let sid = req.cookies.get("sid")?.value;
  let setCookie: string | undefined;
  if (!sid) {
    sid = crypto.randomUUID();
    setCookie = `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`;
  }

  const count = addToCart(sid, fileId, code);
  return new NextResponse(String(count), {
    status: 200,
    headers: setCookie ? { "Set-Cookie": setCookie } : undefined,
  });
}
