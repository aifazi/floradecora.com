"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { dictionaries } from "@/lib/i18n";
import { CDN_ASSETS } from "@/lib/cdn";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.42 1.42M17.66 17.66l1.42 1.42M4.93 19.07l1.42-1.42M17.66 6.34l1.42-1.42" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  const { theme, toggle, mounted } = useTheme();
  const { locale } = useLanguage();
  const NAV = [
    { href: "/about", label: dictionaries[locale].nav.about },
    { href: "/services", label: dictionaries[locale].nav.services },
    { href: "/projects", label: dictionaries[locale].nav.projects },
    { href: "/quote", label: "Quote" },
    { href: "/contact", label: dictionaries[locale].nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  // header style depends on theme + scrolled
  const isLightScrolled = scrolled && theme === "light";
  const headerClass = scrolled || open
    ? isLightScrolled
      ? "glass shadow-soft py-3 text-ink"
      : "glass-dark shadow-soft py-3 text-white"
    : "bg-transparent py-5 text-white";

  const logoClass = scrolled && isLightScrolled ? "brightness-0" : "brightness-0 invert";

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-ochre origin-left z-[60]" style={{ scaleX }} />
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerClass}`}>
        <div className="mx-auto max-w-content px-6 md:px-10 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 group shrink-0" onClick={() => setOpen(false)}>
            <motion.div whileHover={{ scale: 1.02, rotate: 0.6 }} transition={{ type: "spring", stiffness: 400 }}>
              <Image
                src={CDN_ASSETS.logo}
                alt="Flora Decora"
                width={182}
                height={44}
                priority unoptimized
               
                className={`h-8 md:h-9 w-auto object-contain transition-all duration-500 ${logoClass}`}
              />
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              const navText = isLightScrolled ? (active ? "text-ink" : "text-ink/60 hover:text-ink") : active ? "text-white" : "text-white/70 hover:text-white";
              const pillBg = isLightScrolled ? "bg-ink/5 border-ink/10" : "bg-white/10 border-white/10";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full text-[0.72rem] tracking-[0.16em] uppercase font-medium transition-colors ${navText}`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className={`absolute inset-0 backdrop-blur rounded-full border ${pillBg}`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}

            <LanguageSwitcher className={isLightScrolled ? "!bg-ink !text-white !border-ink" : ""} />
            <motion.button
              whileTap={{ scale: 0.88, rotate: 12 }}
              whileHover={{ scale: 1.06 }}
              onClick={toggle}
              aria-label="Toggle theme"
              className={`ml-1 w-9 h-9 rounded-full grid place-items-center border backdrop-blur transition-colors ${
                isLightScrolled ? "bg-ink text-white border-ink hover:bg-forest" : "bg-white/10 border-white/15 text-white hover:bg-white/15"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mounted ? (
                  <motion.span
                    key={theme}
                    initial={{ rotate: -30, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 30, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                  </motion.span>
                ) : (
                  <span className="w-4 h-4" />
                )}
              </AnimatePresence>
            </motion.button>

            <Link
              href="/contact"
              className={`ml-2 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[0.72rem] tracking-[0.14em] uppercase font-semibold transition-all hover:shadow-glow ${
                isLightScrolled ? "bg-ink text-white hover:bg-forest" : "bg-white text-forest-dim hover:bg-limestone"
              }`}
            >
              {dictionaries[locale].nav.start}
              <motion.span whileHover={{ rotate: 45, scale: 1.08 }} className="w-6 h-6 rounded-full bg-ochre text-white grid place-items-center text-xs">↗</motion.span>
            </Link>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggle}
              aria-label="Toggle theme"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/15 grid place-items-center text-white"
            >
              {mounted ? (theme === "dark" ? <SunIcon /> : <MoonIcon />) : null}
            </motion.button>
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className={`relative w-10 h-10 rounded-full backdrop-blur border grid place-items-center transition-colors ${
                isLightScrolled ? "bg-ink border-ink text-white" : "bg-white/10 border-white/15 text-white"
              }`}
            >
              <motion.span animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} className="absolute w-4 h-[1.5px] bg-current block" />
              <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="absolute w-4 h-[1.5px] bg-current block" />
              <motion.span animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} className="absolute w-4 h-[1.5px] bg-current block" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`md:hidden absolute top-full left-0 right-0 mx-3 mt-2 rounded-[1.6rem] overflow-hidden p-2 border backdrop-blur ${
                isLightScrolled ? "bg-white border-black/10 shadow-soft" : "glass-dark"
              }`}
            >
              <nav className="flex flex-col p-2">
                {NAV.map((item, i) => (
                  <motion.div key={item.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 + 0.1 }}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between px-6 py-4 rounded-2xl text-sm tracking-wide font-medium transition-colors ${
                        pathname === item.href
                          ? isLightScrolled
                            ? "bg-ink text-white"
                            : "bg-white text-forest-dim"
                          : isLightScrolled
                          ? "text-ink/70 hover:bg-ink/5"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.label} <span className="opacity-40">→</span>
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="p-2 mt-2">
                  <Link href="/contact" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 bg-ochre text-white rounded-2xl py-4 text-sm tracking-[0.14em] uppercase font-semibold">
                    Start a project
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
