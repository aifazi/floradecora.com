"use client";
import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
  dark = false,
  withLine = false,
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  dark?: boolean;
  withLine?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={align === "center" ? "text-center mx-auto max-w-3xl" : "text-left max-w-3xl"}
    >
      <div className={`inline-flex items-center gap-3 mb-5 ${align === "center" ? "justify-center" : ""}`}>
        {withLine && <span className={`h-px w-10 ${dark ? "bg-white/20" : "bg-ochre/30 dark:bg-white/20"}`} />}
        <p className={`eyebrow ${dark ? "text-ochre-light" : "text-ochre-dark dark:text-ochre-light"}`}>{eyebrow}</p>
      </div>
      <h2
        className={`font-display font-[500] leading-[0.95] tracking-tightDisplay text-balance text-4xl md:text-5xl lg:text-[3.4rem] ${
          dark ? "text-white" : "text-ink dark:text-white"
        }`}
      >
        {title}
      </h2>
    </motion.div>
  );
}
