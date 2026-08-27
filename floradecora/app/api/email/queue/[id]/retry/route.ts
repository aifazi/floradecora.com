import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.BACKEND_URL || "http://localhost:3002";
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const cookie = req.headers.get("cookie") || "";
  const auth = req.headers.get("authorization") || "";
  const res = await fetch(`${BACKEND}/api/email/queue/${params.id}/retry`, { method: "POST", headers: { cookie, authorization: auth } });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
