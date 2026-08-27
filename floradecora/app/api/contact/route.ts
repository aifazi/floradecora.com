import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Rate limiting is handled by backend Throttler (5 req/min per IP) —
// frontend intentionally has no in-memory Map (not horizontally scalable).
// Cloudflare or backend returns 429; we propagate it.

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().max(30).optional().or(z.literal("")),
  project_type: z.string().max(80).optional().or(z.literal("")),
  message: z.string().min(10).max(3000),
  botcheck: z.string().optional(),
  turnstile: z.string().optional(),
});

function getClientIp(req: NextRequest): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first && /^[0-9a-f.:]+$/i.test(first) && first !== "unknown") return first;
  }
  return req.headers.get("x-real-ip")?.trim() || req.headers.get("cf-connecting-ip")?.trim() || "unknown";
}

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const auth = req.headers.get("authorization") || "";
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend}/api/contact`, { headers: { cookie, authorization: auth }, cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

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

  // Turnstile verify — required if secret is set
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = parsed.data.turnstile?.trim();
    if (!token) return NextResponse.json({ success: false, error: "Human verification required" }, { status: 400 });
    try {
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ secret: turnstileSecret, response: token, remoteip: ip }),
      });
      const out = await verify.json();
      if (!out.success) return NextResponse.json({ success: false, error: "Human verification failed" }, { status: 400 });
    } catch {
      return NextResponse.json({ success: false, error: "Verification error" }, { status: 400 });
    }
  }

  // Save to backend DB (always, even if Web3Forms fails) — propagate 429
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3002";
  try {
    const backendRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        projectType: parsed.data.project_type,
        message: parsed.data.message,
      }),
    });
    if (backendRes.status === 429) {
      return NextResponse.json({ success: false, error: "Too many requests, try again later." }, { status: 429 });
    }
    if (!backendRes.ok) {
      const err = await backendRes.json().catch(() => ({}));
      console.warn("Backend contact save failed", backendRes.status, err);
    }
  } catch (e) {
    console.warn("Backend contact network error", e);
  }

  const web3Key = process.env.WEB3FORMS_KEY;
  if (web3Key) {
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
      if (!result.success) console.warn("Web3Forms failed", result);
    } catch (e) {
      console.warn("Web3Forms network error", e);
    }
  }

  return NextResponse.json({ success: true });
}
