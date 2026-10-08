"use client";
import { Reveal, Stagger, StaggerItem } from "./Reveal";
import { PAGE_ABOUT } from "@/lib/content-defaults";

const REVIEWS = PAGE_ABOUT.testimonials.reviews;

export default function Testimonials({ reviews = REVIEWS }: { reviews?: typeof REVIEWS }) {
  return (
    <Stagger className="mt-8 grid md:grid-cols-3 gap-4">
      {reviews.map((r, i) => (
        <StaggerItem key={i} className="rounded-3xl bg-white dark:bg-white/[0.06] border-2 border-black/[0.06] dark:border-white/10 p-6 sm:p-7 shadow-card hover:shadow-soft transition-shadow">
          <div className="flex gap-1 text-ochre">
            {Array.from({ length: r.rating }).map((_, j) => (
              <span key={j}>★</span>
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
