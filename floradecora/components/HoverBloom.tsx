"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

export default function HoverBloom({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const onMove = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* bloom glow that follows cursor */}
      <div
        className="pointer-events-none absolute -inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(420px circle at ${pos.x}% ${pos.y}%, rgba(214,168,82,0.16), transparent 70%)`,
        }}
      />
      {/* petal burst on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <span className="absolute top-6 right-6 w-2 h-2 rounded-full bg-ochre/30 blur-[1px] group-hover:scale-[8] group-hover:opacity-0 transition-all duration-[900ms]" />
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  );
}
