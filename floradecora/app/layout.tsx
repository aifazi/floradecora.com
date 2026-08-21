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
import { Analytics } from "@vercel/analytics/react";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Flora Decora | Landscaping, Themed Gardens & Tourist Attractions",
    template: "%s | Flora Decora",
  },
  description:
    "Flora Decora is a premier UAE landscaping company in Al Ain — designing, building and operating themed gardens, butterfly gardens, public parks and municipal landscapes since 2003. 300+ projects across the UAE.",
  keywords: ["Flora Decora", "landscaping UAE", "Al Ain landscaping", "themed gardens", "butterfly garden", "public parks", "irrigation systems", "nursery Abu Dhabi"],
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
    siteName: "Flora Decora",
    title: "Flora Decora | Landscaping, Themed Gardens & Tourist Attractions",
    description: "Design, build, operate — themed gardens and public parks across the UAE since 2003. 300+ projects delivered.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Flora Decora — Al Ain, UAE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flora Decora | Landscaping, Themed Gardens & Tourist Attractions",
    description: "Premier UAE landscaping — themed gardens, public parks, irrigation since 2003.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  icons: { icon: "/logo.png", apple: "/logo.png" },
  category: "Landscaping",
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd />
      </head>
      <body className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable} font-body`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:text-white focus:px-6 focus:py-3 focus:text-sm">
          Skip to content
        </a>
        <LanguageProvider>
          <ThemeProvider>
            <LoadingScreen />
            <SmoothScroll />
            <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppWidget />
          <Analytics />
        </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
