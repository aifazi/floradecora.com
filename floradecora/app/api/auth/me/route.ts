import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const auth = req.headers.get("authorization") || "";
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend.replace(/\/$/, "")}/api/auth/me`, {
    headers: { cookie, authorization: auth },
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
