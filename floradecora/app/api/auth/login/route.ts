import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const text = await req.text().catch(() => "");
  let body: unknown = {};
  try { body = text ? JSON.parse(text) : {}; } catch { body = {}; }
  const backend = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:3002";
  const url = `${backend.replace(/\/$/, "")}/api/auth/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const nextRes = NextResponse.json(data);
  // forward Set-Cookie from backend (httpOnly)
  const setCookies = res.headers.getSetCookie?.() || (res.headers.get("set-cookie") ? [res.headers.get("set-cookie") as string] : []);
  for (const c of setCookies) {
    // NextResponse cookies: append raw Set-Cookie
    nextRes.headers.append("set-cookie", c);
  }
  // Also ensure cookies are not Secure for local http (backend already respects COOKIE_SECURE)
  return nextRes;
}
