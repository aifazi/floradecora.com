"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

export function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.15, y: y * 0.2 });
  };
  const handleLeave = () => setPos({ x: 0, y: 0 });

  const base =
    variant === "primary"
      ? "bg-ochre text-white hover:bg-ochre-light shadow-glow"
      : "bg-white/10 backdrop-blur text-white border border-white/20 hover:bg-white/15";
  return (
    <motion.div
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="inline-block"
    >
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={`inline-flex items-center gap-2 rounded-full px-8 py-4 text-[0.72rem] tracking-[0.18em] uppercase font-medium transition-colors ${base} ${className}`}
      >
        {children}
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          className="text-base leading-none"
        >
          →
        </motion.span>
      </Link>
    </motion.div>
  );
}

export function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}
