import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.BACKEND_URL || "http://localhost:3002";
export async function POST(req: NextRequest) {
  const text = await req.text();
  const cookie = req.headers.get("cookie") || "";
  // Do NOT inject the server-side ADMIN_API_KEY here — only forward a client-supplied key,
  // otherwise unauthenticated browser requests could create admins.
  const apiKey = req.headers.get("x-api-key") || "";
  const res = await fetch(`${BACKEND}/api/auth/seed`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie, "x-api-key": apiKey },
    body: text,
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
