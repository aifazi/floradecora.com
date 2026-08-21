"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Locale } from "@/lib/i18n";

const Ctx = createContext<{ locale: Locale; setLocale: (l: Locale) => void; mounted: boolean }>({ locale: "en", setLocale: () => {}, mounted: false });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const saved = (localStorage.getItem("locale") as Locale | null) || "en";
    setLocaleState(saved);
    document.documentElement.lang = saved;
    document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    setMounted(true);
  }, []);
  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };
  return <Ctx.Provider value={{ locale, setLocale, mounted }}>{children}</Ctx.Provider>;
}
export const useLanguage = () => useContext(Ctx);
