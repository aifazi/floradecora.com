import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend.replace(/\/$/, "")}/api/auth/refresh`, {
    method: "POST",
    headers: { cookie, "content-type": "application/json" },
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return NextResponse.json(data, { status: res.status });
  const nextRes = NextResponse.json(data);
  const setCookies = res.headers.getSetCookie?.() || [];
  for (const c of setCookies) nextRes.headers.append("set-cookie", c);
  return nextRes;
}
