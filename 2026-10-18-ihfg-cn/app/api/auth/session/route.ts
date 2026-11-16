// GET /api/auth/session —— 对齐原站 GET /HFBSAPI/IsUserSessionValid
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/store";

export async function GET(req: NextRequest) {
  const user = getSessionUser(req.cookies.get("sid")?.value);
  return NextResponse.json({
    state: "SUCCESS",
    sessionValid: user !== null,
    username: user,
  });
}
