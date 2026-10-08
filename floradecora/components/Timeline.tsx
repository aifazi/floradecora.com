"use client";
import { Reveal, Stagger, StaggerItem } from "./Reveal";
import { PAGE_ABOUT } from "@/lib/content-defaults";

const EVENTS = PAGE_ABOUT.timeline.events;

export default function Timeline({ events = EVENTS }: { events?: typeof EVENTS }) {
  return (
    <Stagger className="relative mt-12">
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-ochre via-sage to-forest opacity-20 -translate-x-1/2" />
      {events.map((e, i) => (
        <StaggerItem key={i} className={`relative flex flex-col md:flex-row gap-4 md:gap-0 md:items-center py-6 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
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
