"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; toggle: () => void; mounted: boolean }>({ theme: "light", toggle: () => {}, mounted: false });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme | null) || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
    document.documentElement.style.colorScheme = saved;
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
    // bloom burst on toggle
    document.documentElement.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.002)" }, { transform: "scale(1)" }],
      { duration: 420, easing: "cubic-bezier(0.16,1,0.3,1)" }
    );
  };

  return <Ctx.Provider value={{ theme, toggle, mounted }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
