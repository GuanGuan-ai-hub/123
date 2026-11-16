// POST /api/share/email —— 对齐原站 POST /StandardComponents/ShareItemViaEmail
// 演示版:记录到 .server-data/shares.json,不真发邮件
import { NextRequest, NextResponse } from "next/server";
import { recordShare } from "@/lib/server/store";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = String(form.get("name") ?? "");
  const email = String(form.get("email") ?? "");
  const code = String(form.get("code") ?? "");
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ state: "INVALID" }, { status: 400 });
  }
  recordShare({ name, email, itemCode: code });
  return NextResponse.json({ state: "SUCCESS" });
}
