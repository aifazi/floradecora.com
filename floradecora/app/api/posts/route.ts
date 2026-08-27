import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:3002";

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const url = new URL(req.url);
  const search = url.search;
  const res = await fetch(`${BACKEND}/api/posts${search}`, { headers: { cookie }, cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const auth = req.headers.get("authorization") || "";
  const text = await req.text();
  const res = await fetch(`${BACKEND}/api/posts`, {
    method: "POST",
    headers: { cookie, authorization: auth, "content-type": "application/json" },
    body: text,
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
