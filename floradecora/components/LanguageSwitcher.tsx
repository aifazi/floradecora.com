"use client";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, mounted } = useLanguage();
  if (!mounted) return <span className={`w-12 h-9 rounded-full border border-white/10 bg-white/5 ${className}`} />;
  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      aria-label="Switch language"
      className={`rounded-full border px-3 py-2 text-xs font-medium backdrop-blur transition-colors bg-white/10 border-white/15 text-white hover:bg-white/15 ${className}`}
    >
      {locale === "en" ? "AR" : "EN"}
    </button>
  );
}
