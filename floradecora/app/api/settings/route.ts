import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.BACKEND_URL || "http://localhost:3002";
export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const res = await fetch(`${BACKEND}/api/settings`, { headers: { cookie }, cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
