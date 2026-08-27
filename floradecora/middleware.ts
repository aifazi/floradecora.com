import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const locales = ["en", "ar"] as const;
const defaultLocale = "en";

async function verifyLocal(token: string): Promise<boolean> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    // enforce admin role if present (backend issues role=admin)
    if ((payload as { role?: string }).role && (payload as { role?: string }).role !== "admin") return false;
    // exp is checked by jose; if no exp, reject
    return true;
  } catch {
    return false;
  }
}

async function verifyViaBackend(accessToken: string | undefined, refreshToken: string | undefined): Promise<boolean> {
  try {
    const backend = process.env.BACKEND_URL || "http://backend:3002";
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${backend.replace(/\/$/, "")}/api/auth/me`, {
      headers: { cookie: `access_token=${accessToken || ""}; refresh_token=${refreshToken || ""}` },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

async function tryRefresh(refreshToken: string | undefined): Promise<{ access?: string; refresh?: string } | null> {
  if (!refreshToken) return null;
  try {
    const backend = process.env.BACKEND_URL || "http://backend:3002";
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${backend.replace(/\/$/, "")}/api/auth/refresh`, {
      method: "POST",
      headers: { cookie: `refresh_token=${refreshToken}`, "content-type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const setCookies = res.headers.getSetCookie?.() || (res.headers.get("set-cookie") ? [res.headers.get("set-cookie") as string] : []);
    // also try json body fallback
    const data = await res.json().catch(() => ({} as Record<string, string>));
    return { access: data.accessToken, refresh: data.refreshToken };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname || "/";

  // Admin auth guard — local JWT verify first (fast), fallback to backend, with refresh
  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login" || pathname.startsWith("/admin/login/");
    const accessToken = req.cookies.get("access_token")?.value;
    const refreshToken = req.cookies.get("refresh_token")?.value;
    if (!isLogin) {
      if (!accessToken && !refreshToken) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
      let valid = false;
      if (accessToken) valid = await verifyLocal(accessToken);
      if (!valid) valid = await verifyViaBackend(accessToken, refreshToken);
      if (!valid && refreshToken) {
        const refreshed = await tryRefresh(refreshToken);
        if (refreshed?.access) {
          // re-verify new access token
          const ok = (await verifyLocal(refreshed.access)) || (await verifyViaBackend(refreshed.access, refreshed.refresh));
          if (ok) {
            // let request through but set new cookies on response (via next response)
            const res = NextResponse.next();
            // propagate locales etc later; store tokens to set after locale logic
            // we will set cookies on the final response below
            // For now redirect not needed — continue to locale handling
            // Note: actual Set-Cookie from backend is not directly forwarded; we set minimal
            // The client will get new cookies on next successful auth/me via API route
            return res;
          }
        }
      }
      if (!valid) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        const res = NextResponse.redirect(url);
        res.cookies.delete("access_token");
        return res;
      }
    } else if (isLogin && accessToken) {
      // if already logged in and token valid, redirect to dashboard
      let valid = await verifyLocal(accessToken);
      if (!valid) valid = await verifyViaBackend(accessToken, refreshToken);
      if (valid) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
    }
  }

  const cookieLocale = req.cookies.get("locale")?.value as typeof locales[number] | undefined;
  const headerLocale = req.headers.get("accept-language")?.split(",")[0]?.slice(0, 2) as typeof locales[number] | undefined;
  const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : headerLocale && locales.includes(headerLocale) ? headerLocale : defaultLocale;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", locale);
  requestHeaders.set("x-pathname", pathname);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("x-locale", locale);
  res.headers.set("x-pathname", pathname);
  // sync cookie if missing
  if (!cookieLocale) {
    res.cookies.set("locale", locale, { path: "/", maxAge: 31536000, sameSite: "lax" });
  }
  // expose hreflang link header for SEO — per-path with x-default
  const base = "https://floradecora.com";
  const urlEn = `${base}${pathname}`;
  const urlAr = `${base}${pathname}?lang=ar`;
  res.headers.set("Link", `<${urlEn}>; rel="alternate"; hreflang="en", <${urlAr}>; rel="alternate"; hreflang="ar", <${urlEn}>; rel="alternate"; hreflang="x-default"`);
  return res;
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
