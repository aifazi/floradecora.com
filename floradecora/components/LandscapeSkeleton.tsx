"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

type Aspect = "4/3" | "3/2" | "16/9" | "1/1" | "3/4" | "4/5";
type Variant = "card" | "hero" | "card-small";

const aspectMap: Record<Aspect, string> = {
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-[16/9]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
};

const variantMap: Record<Variant, string> = {
  card: "rounded-3xl p-1.5",
  hero: "rounded-[2rem]",
  "card-small": "rounded-2xl",
};

export function LandscapeSkeleton({
  className = "",
  aspectRatio = "4/3",
  variant = "card",
}: {
  className?: string;
  aspectRatio?: Aspect;
  variant?: Variant;
}) {
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <div className={`relative overflow-hidden bg-ink ${aspectMap[aspectRatio]} ${variantMap[variant]} ${className}`}>
      {/* Soil */}
      <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-gradient-to-t from-forest/60 via-forest/30 to-transparent rounded-b-[inherit]" />
      {/* Grass — 6 blades, CSS-driven, no JS loop for perf */}
      <div className="absolute bottom-[16%] left-0 right-0 h-[22%] flex items-end justify-around px-[8%] pointer-events-none">
        {[18, 22, 16, 24, 20, 18].map((h, i) => (
          <motion.div
            key={i}
            className="w-[2px] bg-gradient-to-t from-sage to-sage/30 origin-bottom rounded-full"
            style={{ height: `${h}%` }}
            initial={prefersReduced ? { opacity: 1 } : { scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] as const }}
          />
        ))}
      </div>
      {/* Flowers — 3 only, staggered, spring */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: "22%", bottom: "28%" },
          { left: "68%", bottom: "34%" },
          { left: "45%", bottom: "22%" },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-[20px] h-[20px]"
            style={{ left: pos.left, bottom: pos.bottom }}
            initial={prefersReduced ? { opacity: 1 } : { scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.12, type: "spring", stiffness: 260, damping: 18 } as const}
          >
            <div className="absolute bottom-0 left-1/2 w-[2px] h-[14px] bg-sage-dark -translate-x-1/2 rounded-full" />
            <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 w-[16px] h-[16px] flex items-center justify-center">
              {Array.from({ length: 5 }).map((_, j) => (
                <span
                  key={j}
                  className="absolute w-[7px] h-[11px] rounded-[100%_100%_55%_55%] bg-gradient-to-b from-ochre-light to-ochre shadow-[0_1px 4px_rgba(192,138,46,0.25)]"
                  style={{ transform: `rotate(${j * 72}deg) translateY(-4px)`, transformOrigin: "50% 100%" }}
                />
              ))}
              <span className="absolute w-[5px] h-[5px] rounded-full bg-amber-200 z-10" />
            </div>
          </motion.div>
        ))}
      </div>
      {/* Subtle shimmer — CSS only, respects reduced-motion via media query */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-full animate-[shimmer_2.8s_ease-in-out_infinite] motion-reduce:hidden" />
    </div>
  );
}

export function ImageWithLandscapeSkeleton({
  src,
  alt,
  className = "",
  aspectRatio = "4/3",
  priority = false,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: Aspect;
  priority?: boolean;
  [key: string]: unknown;
}) {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <LandscapeSkeleton aspectRatio={aspectRatio} variant="card" className={`absolute inset-0 transition-opacity duration-500 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`} />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        {...(props as Record<string, unknown>)}
      />
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-forest/60 text-white/80 text-xs">Image unavailable</div>
      )}
    </div>
  );
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-ink p-1.5 ${className}`}>
      <LandscapeSkeleton variant="card" aspectRatio="4/3" className="absolute inset-0" />
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between gap-3">
        <div className="h-10 w-3/4 bg-white/10 rounded-full animate-pulse" />
        <div className="w-9 h-9 rounded-full bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}

export function HeroSkeleton({ className = "" }: { className?: string }) {
  return (
    <section className={`relative min-h-[92vh] bg-forest-dim overflow-hidden flex items-center ${className}`}>
      <LandscapeSkeleton variant="hero" aspectRatio="16/9" className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-dim via-forest-dim/80 to-forest-dim/20" />
      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-28 grid lg:grid-cols-[1.08fr_0.92fr] gap-8 items-center">
        <div className="space-y-6">
          <div className="h-6 w-48 bg-white/10 rounded-full animate-pulse" />
          <div className="space-y-3">
            <div className="h-12 w-3/4 bg-white/10 rounded-2xl animate-pulse" />
            <div className="h-12 w-1/2 bg-ochre/20 rounded-2xl animate-pulse" />
          </div>
          <div className="h-20 w-full max-w-xl bg-white/5 rounded-2xl animate-pulse" />
        </div>
        <div className="hidden md:block h-[480px] rounded-[2rem] bg-white/5 animate-pulse" />
      </div>
    </section>
  );
}
