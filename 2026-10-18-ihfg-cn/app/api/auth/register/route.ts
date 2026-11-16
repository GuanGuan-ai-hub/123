// POST /api/auth/register —— 对齐原站 /HFBSAPI/Register
// 差异:gToken(reCAPTCHA)演示版不接入,字段校验与原站一致(7 字段 + 密码≥6)
import { NextRequest, NextResponse } from "next/server";
import { registerUser, createSession } from "@/lib/server/store";

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => null);
  const result = registerUser({
    username: String(b?.username ?? ""),
    email: String(b?.email ?? ""),
    password: String(b?.password ?? ""),
    firstname: String(b?.firstname ?? ""),
    lastname: String(b?.lastname ?? ""),
    phone: String(b?.phone ?? ""),
  });
  if (result.state !== "SUCCESS") return NextResponse.json(result);

  const sid = createSession(String(b.username));
  return NextResponse.json({ state: "SUCCESS" }, {
    headers: { "Set-Cookie": `sid=${sid}; Path=/; HttpOnly; SameSite=Lax` },
  });
}
