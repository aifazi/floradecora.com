"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "What areas do you cover?",
    a: "We operate across the entire UAE — Al Ain, Abu Dhabi, Dubai, Sharjah and the Northern Emirates. For municipal and large-scale projects we deploy dedicated teams to any emirate within 48 hours of contract signing.",
  },
  {
    q: "Do you handle maintenance after build?",
    a: "Yes — operation & maintenance for 20+ years is our core. Weekly inspections, monthly consumable planning, irrigation tuning, seasonal replanting and pest management are all managed by our own crews. We never subcontract maintenance.",
  },
  {
    q: "How water-efficient are your designs?",
    a: "Industry-leading. Smart drip, zoned scheduling and soil-moisture sensors. Our 2023 Al Ain retrofit cut consumption 22% across 8 parks while improving turf health. We target 30% savings on all new projects.",
  },
  {
    q: "What's the typical timeline?",
    a: "Concept 2–4 weeks, construction 8–16 weeks depending on scope. Site visits within 72h of first inquiry. We deliver fixed-price quotes with no hidden costs.",
  },
  {
    q: "Can you supply plants from your nursery?",
    a: "Yes — our 12,000 m² Abu Dhabi nursery produces 40,000 seedlings per month across 120+ species. Same-day delivery to Al Ain and Abu Dhabi, 24-hour delivery to Dubai. All stock is acclimatised to UAE conditions.",
  },
  {
    q: "Do you work with international design standards?",
    a: "Yes. Our team is certified in LEED, Estidama and CEEQUAL. We follow BS 8545 for tree procurement and BS 4428 for landscape operations. All projects meet or exceed municipality technical requirements.",
  },
  {
    q: "What about extreme heat resilience?",
    a: "We select species rated for 50°C+ and use subsurface drip to reduce evaporation. Our shade structures lower soil temperature by 8–12°C. Every design includes a heat-stress protocol for July–September.",
  },
  {
    q: "How do you price — fixed or variable?",
    a: "Both. Fixed-price for defined scopes (most common), cost-plus for phased municipal work. Transparent breakdowns with every quote. No surprises.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-8 space-y-3">
      {FAQS.map((f, i) => (
        <div key={f.q} className="rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 overflow-hidden">
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
