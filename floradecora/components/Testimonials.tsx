"use client";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

const REVIEWS = [
  { name: "Al Ain Municipality", role: "Parks Dept.", text: "20 years of reliable maintenance — their teams are on-site before we call.", rating: 5 },
  { name: "Abu Dhabi Parks", role: "Operations", text: "Nursery supply and irrigation retrofit cut water 22% without losing green cover.", rating: 5 },
  { name: "Private Developer", role: "Al Reef", text: "From master plan to bloom in 14 weeks. One team, one plan — it shows.", rating: 5 },
];

export default function Testimonials() {
  return (
    <Stagger className="mt-8 grid md:grid-cols-3 gap-4">
      {REVIEWS.map((r) => (
        <StaggerItem key={r.name} className="rounded-3xl bg-white dark:bg-white/[0.06] border-2 border-black/[0.06] dark:border-white/10 p-6 sm:p-7 shadow-card">
          <div className="flex gap-1 text-ochre">{Array.from({ length: r.rating }).map((_, i) => <span key={i}>★</span>)}</div>
          <p className="mt-3 text-sm leading-relaxed text-ink/70 dark:text-white/70">“{r.text}”</p>
          <div className="mt-4">
            <div className="text-sm font-semibold dark:text-white">{r.name}</div>
            <div className="text-xs text-ink/50 dark:text-white/50">{r.role}</div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
