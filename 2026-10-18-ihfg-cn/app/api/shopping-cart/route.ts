// GET /api/shopping-cart —— 当前会话购物车;DELETE ?fileId= 移除
import { NextRequest, NextResponse } from "next/server";
import { getCart, removeFromCart } from "@/lib/server/store";

export async function GET(req: NextRequest) {
  const cart = getCart(req.cookies.get("sid")?.value ?? null);
  return NextResponse.json({ state: "SUCCESS", count: cart.items.length, items: cart.items });
}

export async function DELETE(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get("fileId") ?? "";
  const count = removeFromCart(req.cookies.get("sid")?.value ?? null, fileId);
  return NextResponse.json({ state: "SUCCESS", count });
}
