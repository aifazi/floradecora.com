import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "ar"] as const;
const defaultLocale = "en";

export function middleware(req: NextRequest) {
  const cookieLocale = req.cookies.get("locale")?.value as typeof locales[number] | undefined;
  const headerLocale = req.headers.get("accept-language")?.split(",")[0]?.slice(0, 2) as typeof locales[number] | undefined;
  const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : headerLocale && locales.includes(headerLocale) ? headerLocale : defaultLocale;
  const res = NextResponse.next();
  res.headers.set("x-locale", locale);
  // expose hreflang link header for SEO
  res.headers.set("Link", `<https://floradecora.com/>; rel="alternate"; hreflang="en", <https://floradecora.com/?lang=ar>; rel="alternate"; hreflang="ar"`);
  return res;
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
