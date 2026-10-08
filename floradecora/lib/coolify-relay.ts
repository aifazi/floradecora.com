import { NextRequest, NextResponse } from "next/server";

const DEFAULT_INTERNAL = "http://10.0.1.1:8000";
const DEFAULT_PUBLIC = "http://localhost:8000";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function internalTargets(): string[] {
  const env = process.env.COOLIFY_URL ? stripTrailingSlash(process.env.COOLIFY_URL) : null;
  const candidates = [env, DEFAULT_INTERNAL].filter((v): v is string => Boolean(v));
  return Array.from(new Set(candidates));
}

function bounceTarget(pathname: string, search: string): string {
  const base = stripTrailingSlash(process.env.COOLIFY_PUBLIC_URL || DEFAULT_PUBLIC);
  return `${base}${pathname}${search}`;
}

export function bounceToCoolify(req: NextRequest): NextResponse {
  return NextResponse.redirect(bounceTarget(req.nextUrl.pathname, req.nextUrl.search), 302);
}

const SKIP_REQUEST_HEADERS = new Set([
  "host",
  "content-length",
  "connection",
  "accept-encoding",
  "content-encoding",
  "cookie",
  "authorization",
]);

export async function forwardWebhook(req: NextRequest, path: string): Promise<Response> {
  // Only GitHub delivery-shaped requests are relayed (signature + event headers
  // are forwarded untouched so Coolify can HMAC-verify the raw body).
  const githubEvent = req.headers.get("x-github-event");
  const delivery = req.headers.get("x-github-delivery");
  if (!githubEvent || !delivery) {
    return new Response("Not a GitHub webhook delivery", { status: 400 });
  }

  const body = await req.arrayBuffer();
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!SKIP_REQUEST_HEADERS.has(key.toLowerCase())) headers.set(key, value);
  });

  let lastError: unknown = null;
  for (const base of internalTargets()) {
    try {
      const upstream = await fetch(`${base}${path}`, {
        method: "POST",
        headers,
        body,
        cache: "no-store",
        redirect: "manual",
        signal: AbortSignal.timeout(8000),
      });
      const buf = await upstream.arrayBuffer();
      return new Response(buf, {
        status: upstream.status,
        headers: {
          "content-type": upstream.headers.get("content-type") || "text/plain; charset=utf-8",
        },
      });
    } catch (e) {
      lastError = e;
    }
  }
  console.warn(`Coolify webhook relay failed for ${path}:`, lastError);
  return new Response("Coolify unreachable", { status: 502 });
}
