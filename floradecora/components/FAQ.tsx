"use client";
import { useState } from "react";
import { PAGE_ABOUT } from "@/lib/content-defaults";

const FAQS = PAGE_ABOUT.faq.items;

export default function FAQ({ items = FAQS }: { items?: typeof FAQS }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-8 space-y-3">
      {items.map((f, i) => (
        <div key={i} className="rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-controls={`faq-${i}`} className="w-full flex items-center justify-between p-5 text-left">
            <span className="font-medium pr-4 dark:text-white">{f.q}</span>
            <span className={`w-8 h-8 rounded-full grid place-items-center border transition-all shrink-0 ${open === i ? "bg-ink text-white rotate-45 dark:bg-white dark:text-ink" : "bg-cream dark:bg-white/10"}`}>
              +
            </span>
          </button>
          <div id={`faq-${i}`} role="region" aria-hidden={open !== i} className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="px-5 pb-5 text-sm text-ink/60 dark:text-white/60 leading-relaxed">
              {f.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
