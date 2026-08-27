import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "ar"] as const;
const defaultLocale = "en";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname || "/";

  // Admin auth guard — protect /admin/* (except /admin/login)
  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login" || pathname.startsWith("/admin/login/");
    const hasToken = req.cookies.get("access_token") || req.cookies.get("refresh_token");
    if (!isLogin && !hasToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    if (isLogin && hasToken) {
      // optional: if already logged in, go to dashboard (we let user stay, but could redirect)
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
