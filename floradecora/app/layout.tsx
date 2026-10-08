import type { Metadata } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import JsonLd from "@/components/JsonLd";
import { EditModeProvider } from "@/components/editor/EditModeContext";
import EditBar from "@/components/editor/EditBar";
import { getContent } from "@/lib/content";
import { SITE_HEADER, SITE_FOOTER, SITE_CONTACT, SITE_WHATSAPP, SITE_JSONLD, SITE_SEO } from "@/lib/content-defaults";
import { Analytics } from "@vercel/analytics/react";
import { cookies, headers } from "next/headers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

const siteUrl = "https://floradecora.com";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContent("site_seo", SITE_SEO);
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seo.title,
      template: "%s | Flora Decora",
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: "Flora Decora", url: siteUrl }],
    creator: "Flora Decora",
    publisher: "Flora Decora",
    formatDetection: { email: false, address: false, telephone: false },
    alternates: { canonical: "/", languages: { "en-AE": "/", "ar-AE": "/?lang=ar" } },
    openGraph: {
      type: "website",
      locale: "en_AE",
      alternateLocale: ["ar_AE"],
      url: siteUrl,
      siteName: seo.siteName,
      title: seo.title,
      description: seo.ogDescription,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Flora Decora — Al Ain, UAE" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images: ["/opengraph-image"],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    icons: { icon: "/logo.png", apple: "/logo.png" },
    category: "Landscaping",
  };
}

const themeScript = `(() => {
  try {
    const t = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', t === 'dark');
    document.documentElement.style.colorScheme = t;
    const l = localStorage.getItem('locale') || 'en';
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  } catch {}
})();`;

function pageKeyFromPath(pathname: string): string {
  const seg = pathname.split("?")[0].split("/").filter(Boolean)[0];
  return seg ? `page_${seg}` : "page_home";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieLocale = cookies().get("locale")?.value as "en" | "ar" | undefined;
  const headerLocale = headers().get("x-locale") as "en" | "ar" | null;
  const locale = cookieLocale && ["en", "ar"].includes(cookieLocale) ? cookieLocale : headerLocale && ["en", "ar"].includes(headerLocale) ? headerLocale : "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  const pathname = headers().get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");
  const pageKey = pageKeyFromPath(pathname);

  const [header, footer, contact, whatsapp, jsonld] = await Promise.all([
    getContent("site_header", SITE_HEADER),
    getContent("site_footer", SITE_FOOTER),
    getContent("site_contact", SITE_CONTACT),
    getContent("site_whatsapp", SITE_WHATSAPP),
    getContent("site_jsonld", SITE_JSONLD),
  ]);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd contact={contact} jsonld={jsonld} />
      </head>
      <body className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable} font-body`}>
        {isAdmin ? (
          <LanguageProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </LanguageProvider>
        ) : (
          <EditModeProvider pageKey={pageKey}>
            <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:text-white focus:px-6 focus:py-3 focus:text-sm">
              Skip to content
            </a>
            <EditBar />
            <LanguageProvider>
              <ThemeProvider>
                <LoadingScreen />
                <Header nav={header.nav} cta={header.cta} />
                <main id="main">{children}</main>
                <Footer content={footer} contact={contact} />
                <WhatsAppWidget phone={whatsapp.phone} message={whatsapp.message} />
                {process.env.VERCEL === "1" && <Analytics />}
              </ThemeProvider>
            </LanguageProvider>
          </EditModeProvider>
        )}
      </body>
    </html>
  );
}
