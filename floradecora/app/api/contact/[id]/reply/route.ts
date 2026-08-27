import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.BACKEND_URL || "http://localhost:3002";
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const cookie = req.headers.get("cookie") || "";
  const auth = req.headers.get("authorization") || "";
  const text = await req.text();
  const res = await fetch(`${BACKEND}/api/contact/${params.id}/reply`, { method: "POST", headers: { cookie, authorization: auth, "content-type": "application/json" }, body: text });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
