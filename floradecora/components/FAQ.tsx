"use client";
import { useState } from "react";

const FAQS = [
  { q: "What areas do you cover?", a: "Al Ain, Abu Dhabi and across the UAE for municipal and private projects." },
  { q: "Do you handle maintenance after build?", a: "Yes — operation & maintenance for 20+ years is core. Weekly inspections, monthly consumables and lawn analysis." },
  { q: "How water-efficient are your designs?", a: "Smart drip, zoned scheduling and soil sensors. Our 2023 retrofit cut 22% consumption." },
  { q: "What's the typical timeline?", a: "Concept 2–4 weeks, build 8–16 weeks, visit within 72h of inquiry." },
  { q: "Can you supply plants from your nursery?", a: "Yes — 12,000 m² nursery delivering 40k seedlings/month, native & adapted species." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-8 space-y-3">
      {FAQS.map((f, i) => (
        <div key={f.q} className="rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
            <span className="font-medium dark:text-white">{f.q}</span>
            <span className={`w-8 h-8 rounded-full grid place-items-center border transition-all ${open === i ? "bg-ink text-white rotate-45" : "bg-cream dark:bg-white/10"}`}>+</span>
          </button>
          {open === i && <div className="px-5 pb-5 text-sm text-ink/60 dark:text-white/60 leading-relaxed">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}
