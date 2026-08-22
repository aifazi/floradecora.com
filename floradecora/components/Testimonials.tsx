"use client";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

const REVIEWS = [
  {
    name: "Al Ain Municipality",
    role: "Parks Department",
    text: "20 years of reliable maintenance — their teams are on-site before we call. The butterfly garden has become the city's most visited attraction.",
    rating: 5,
  },
  {
    name: "Abu Dhabi Parks",
    role: "Operations Division",
    text: "Nursery supply and irrigation retrofit cut water 22% without losing green cover. Their smart scheduling pays for itself every quarter.",
    rating: 5,
  },
  {
    name: "Private Developer",
    role: "Al Reef Residence",
    text: "From master plan to bloom in 14 weeks. One team, one plan — it shows. The garden doubled our property value within the first year.",
    rating: 5,
  },
  {
    name: "Ministry of Climate Change",
    role: "UAE Green Agenda 2030",
    text: "Flora Decora's native planting matrices are now the benchmark for arid-climate landscaping. Their Ghaf and Sidr survival rates exceed 95%.",
    rating: 5,
  },
  {
    name: "Tourism Authority",
    role: "Al Ain Tourism",
    text: "The themed gardens they designed for us now attract over 200,000 visitors annually. Their understanding of desert microclimates is unmatched.",
    rating: 5,
  },
  {
    name: "Education City",
    role: "Campus Landscaping",
    text: "They transformed 18,000 m² of desert into a living campus with zero additional water consumption. The outdoor classrooms are in constant use.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <Stagger className="mt-8 grid md:grid-cols-3 gap-4">
      {REVIEWS.map((r, i) => (
        <StaggerItem key={r.name} className="rounded-3xl bg-white dark:bg-white/[0.06] border-2 border-black/[0.06] dark:border-white/10 p-6 sm:p-7 shadow-card hover:shadow-soft transition-shadow">
          <div className="flex gap-1 text-ochre">
            {Array.from({ length: r.rating }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink/70 dark:text-white/70">
            &ldquo;{r.text}&rdquo;
          </p>
          <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10">
            <div className="text-sm font-semibold dark:text-white">{r.name}</div>
            <div className="text-xs text-ink/50 dark:text-white/50">{r.role}</div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
