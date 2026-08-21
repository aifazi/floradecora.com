import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import Counter from "@/components/Counter";
import HoverBloom from "@/components/HoverBloom";
import { cdnMedia } from "@/lib/cdn";
import { PROJECTS } from "@/lib/projects";
import ProjectFilter from "@/components/ProjectFilter";

export const metadata: Metadata = {
  title: "Projects | Flora Decora",
  description: "300+ landscaping projects across the UAE — butterfly gardens, public parks, nurseries and irrigation. View case studies from Al Ain Municipality and Abu Dhabi Parks.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="relative min-h-[46vh] bg-forest-dim overflow-hidden flex items-end">
        <Image src={cdnMedia("ChatGPT Image Jul 30, 2026, 12_15_15 AM.png")} alt="Flora Decora canopy walk garden project" fill unoptimized className="object-cover opacity-30" sizes="100vw" priority quality={75} />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dim via-forest-dim/60 to-transparent" />
        <div className="relative mx-auto max-w-content w-full px-6 md:px-10 pt-32 pb-12 md:pt-44 md:pb-14">
          <Reveal><span className="inline-flex rounded-full bg-white/10 backdrop-blur border border-white/10 px-3 py-1 text-xs tracking-[0.14em] uppercase text-white/80">Projects • {PROJECTS.length} Case Studies</span></Reveal>
          <Reveal delay={0.06}><h1 className="mt-4 font-display font-medium text-4xl md:text-6xl leading-[0.95] tracking-tightDisplay text-white max-w-3xl">Gardens, parks & nurseries built to last 20 years.</h1></Reveal>
          <Reveal delay={0.1}><p className="mt-4 max-w-xl text-white/60 leading-relaxed">300+ projects for Al Ain Municipality & Abu Dhabi Parks — from butterfly houses to smart irrigation. Filter by type or view case study.</p></Reveal>
        </div>
      </section>

      <section className="bg-white dark:bg-forest border-b border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-content px-6 md:px-10 py-8 grid grid-cols-3 gap-4">
          {[
            { n: PROJECTS.length, label: "Case Studies" },
            { n: 150, label: "Clients" },
            { n: 20, label: "Years" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-cream dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 text-center">
              <div className="font-display text-3xl font-medium dark:text-white"><Counter value={s.n} suffix={s.label==="Case Studies"?"": "+"} /></div>
              <div className="text-xs tracking-[0.12em] uppercase text-ink/50 dark:text-white/50 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream dark:bg-forest-dim">
        <div className="mx-auto max-w-content px-6 md:px-10 py-12 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Selected Work" title="From concept to bloom — all in-house." withLine />
            <p className="max-w-md text-ink/60 dark:text-white/60 text-sm leading-relaxed">Served from <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">cdn.aifazi.net</code> via R2. Click for full case study.</p>
          </div>
          <ProjectFilter projects={PROJECTS} />
        </div>
      </section>
    </>
  );
}
