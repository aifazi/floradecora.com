import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.BACKEND_URL || "http://localhost:3002";
export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const auth = req.headers.get("authorization") || "";
  const res = await fetch(`${BACKEND}/api/email/providers`, { headers: { cookie, authorization: auth }, cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
