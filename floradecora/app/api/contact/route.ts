import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// simple in-memory rate limit (per IP)
const rateMap = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1h
const MAX_REQ = 5;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const rec = rateMap.get(ip);
  if (!rec || now > rec.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (rec.count >= MAX_REQ) return false;
  rec.count++;
  return true;
}

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().max(30).optional().or(z.literal("")),
  project_type: z.string().max(80).optional().or(z.literal("")),
  message: z.string().min(10).max(3000),
  botcheck: z.string().optional(),
  turnstile: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests, try again later." }, { status: 429 });
  }

  let data: Record<string, string> = {};
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    data = await req.json();
  } else {
    const fd = await req.formData();
    fd.forEach((v, k) => (data[k] = String(v)));
  }

  // honeypot
  if (data.botcheck) {
    return NextResponse.json({ success: true });
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  // Turnstile verify if configured
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && parsed.data.turnstile) {
    try {
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ secret: turnstileSecret, response: parsed.data.turnstile, remoteip: ip }),
      });
      const out = await verify.json();
      if (!out.success) return NextResponse.json({ success: false, error: "Human verification failed" }, { status: 400 });
    } catch {}
  }

  const web3Key = process.env.WEB3FORMS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!web3Key) {
    return NextResponse.json({ success: false, error: "Server not configured (WEB3FORMS_KEY)" }, { status: 500 });
  }

  // forward to Web3Forms server-side (key not exposed)
  const forward = new FormData();
  forward.append("access_key", web3Key);
  forward.append("name", parsed.data.name);
  forward.append("email", parsed.data.email);
  if (parsed.data.phone) forward.append("phone", parsed.data.phone);
  if (parsed.data.project_type) forward.append("project_type", parsed.data.project_type);
  forward.append("message", parsed.data.message);
  forward.append("subject", "New inquiry from floradecora.com");
  forward.append("from_name", "Flora Decora Website");

  try {
    const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: forward });
    const result = await res.json();
    if (result.success) return NextResponse.json({ success: true });
    return NextResponse.json({ success: false, error: "Upstream failed" }, { status: 502 });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Network error" }, { status: 502 });
  }
}
