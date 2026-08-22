"use client";
import { motion } from "framer-motion";

export default function HoverBloom({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`relative overflow-hidden group ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(420px circle at 50% 50%, rgba(214,168,82,0.16), transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
