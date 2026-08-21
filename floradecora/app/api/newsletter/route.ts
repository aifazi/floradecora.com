import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });
const store = new Set<string>();
const nlRate = new Map<string, { c: number; r: number }>();
function nlLimit(ip: string) {
  const now = Date.now();
  const rec = nlRate.get(ip);
  if (!rec || now > rec.r) { nlRate.set(ip, { c: 1, r: now + 60000 }); return true; }
  if (rec.c >= 3) return false;
  rec.c++; return true;
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip")?.trim() || "unknown");
  if (!nlLimit(ip)) return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false }, { status: 400 });
  store.add(parsed.data.email.toLowerCase());
  // In production: forward to Brevo/Resend/Notion or add to DB
  console.log(`[newsletter] ${parsed.data.email} from ${ip} — total ${store.size}`);
  return NextResponse.json({ success: true });
}
