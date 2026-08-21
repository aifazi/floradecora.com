"use client";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

const EVENTS = [
  { year: "2003", title: "Founded in Al Ain", desc: "Started with municipal maintenance and private villas." },
  { year: "2009", title: "First Themed Garden", desc: "Butterfly garden prototype — later scaled to 4,200 m²." },
  { year: "2015", title: "Nursery & Steel Hub", desc: "12,000 m² nursery + in-house fabrication for shade structures." },
  { year: "2019", title: "100+ Projects", desc: "Coverage Al Ain → Abu Dhabi, 150+ skilled horticulturists." },
  { year: "2023", title: "Smart Irrigation", desc: "Retrofit 8 parks, -22% water use with sensor-driven drip." },
  { year: "2026", title: "300+ and Growing", desc: "Vertical gardens, sports fields and tourist attractions." },
];

export default function Timeline() {
  return (
    <Stagger className="relative mt-12">
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-ochre via-sage to-forest opacity-20 -translate-x-1/2" />
      {EVENTS.map((e, i) => (
        <StaggerItem key={e.year} className={`relative flex flex-col md:flex-row gap-4 md:gap-0 md:items-center py-6 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
          <div className="flex-1 md:px-8">
            <div className={`rounded-[1.5rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 shadow-card md:max-w-[420px] ${i % 2 === 0 ? "md:ml-auto" : ""}`}>
              <div className="text-xs tracking-[0.16em] uppercase text-ochre">{e.year}</div>
              <h4 className="font-display text-lg mt-1 dark:text-white">{e.title}</h4>
              <p className="text-sm text-ink/60 dark:text-white/60 mt-1">{e.desc}</p>
            </div>
          </div>
          <div className="hidden md:grid place-items-center w-10 h-10 rounded-full bg-ink text-white border-4 border-cream dark:border-forest-dim shrink-0 z-10">
            <span className="w-2 h-2 rounded-full bg-ochre" />
          </div>
          <div className="flex-1 hidden md:block" />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
