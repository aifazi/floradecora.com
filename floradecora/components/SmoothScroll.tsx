"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return; // disable on mobile — native scroll is faster
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || conn?.effectiveType === "2g") return;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return; // low-end
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.0,
      gestureOrientation: "vertical",
    });

    // expose for other components
    (window as any).lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
