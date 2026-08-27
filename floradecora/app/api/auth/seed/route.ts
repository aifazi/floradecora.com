import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.BACKEND_URL || "http://localhost:3002";
export async function POST(req: NextRequest) {
  const text = await req.text();
  const cookie = req.headers.get("cookie") || "";
  const apiKey = req.headers.get("x-api-key") || process.env.ADMIN_API_KEY || "";
  const res = await fetch(`${BACKEND}/api/auth/seed`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie, "x-api-key": apiKey },
    body: text,
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
