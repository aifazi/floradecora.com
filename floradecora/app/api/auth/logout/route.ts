import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend.replace(/\/$/, "")}/api/auth/logout`, {
    method: "POST",
    headers: { cookie },
  });
  const nextRes = NextResponse.json({ success: true });
  // clear frontend cookies
  nextRes.cookies.set("access_token", "", { maxAge: 0, path: "/" });
  nextRes.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
  const setCookies = res.headers.getSetCookie?.() || [];
  for (const c of setCookies) nextRes.headers.append("set-cookie", c);
  return nextRes;
}
