// POST /api/auth/login —— 对齐原站 /HFBSAPI/Login,改进:POST 传输(原站为 GET,密码进日志)
import { NextRequest, NextResponse } from "next/server";
import { loginUser, createSession } from "@/lib/server/store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = String(body?.username ?? "");
  const password = String(body?.password ?? "");
  if (!username || !password) {
    return NextResponse.json({ state: "INVALID" }, { status: 400 });
  }
  if (!loginUser(username, password)) {
    return NextResponse.json({ state: "INVALID_CREDENTIALS" });
  }
  const sid = createSession(username);
  return NextResponse.json({ state: "SUCCESS" }, {
    headers: { "Set-Cookie": `sid=${sid}; Path=/; HttpOnly; SameSite=Lax` },
  });
}
