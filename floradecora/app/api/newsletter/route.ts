import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ email: z.string().email().max(120) });

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const auth = req.headers.get("authorization") || "";
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/newsletter`, { headers: { cookie, authorization: auth }, cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip")?.trim() || "unknown";
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/newsletter`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({ email: parsed.data.email }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return NextResponse.json({ success: true });
    // handle duplicate
    if (res.status === 409) return NextResponse.json({ success: false, error: "Already subscribed" }, { status: 409 });
    return NextResponse.json({ success: false, error: data.error || "Failed" }, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: "Service unavailable" }, { status: 502 });
  }
}
