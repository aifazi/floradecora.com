import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });
const store = new Set<string>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false }, { status: 400 });
  store.add(parsed.data.email.toLowerCase());
  // In production: forward to Brevo/Resend/Notion or add to DB
  console.log(`[newsletter] ${parsed.data.email} from ${ip} — total ${store.size}`);
  return NextResponse.json({ success: true });
}
