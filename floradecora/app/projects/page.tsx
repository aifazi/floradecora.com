import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import Counter from "@/components/Counter";
import EditableText from "@/components/editor/EditableText";
import { cdnMedia } from "@/lib/cdn";
import { getProjects } from "@/lib/api";
import ProjectFilter from "@/components/ProjectFilter";
import SearchBar from "@/components/SearchBar";
import { getContent } from "@/lib/content";
import { PAGE_PROJECTS } from "@/lib/content-defaults";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("page_projects", PAGE_PROJECTS);
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { canonical: "/projects" },
  };
}

export default async function ProjectsPage() {
  const [PROJECTS, c] = await Promise.all([getProjects(), getContent("page_projects", PAGE_PROJECTS)]);
  const badge = c.hero.badge.replace("{count}", String(PROJECTS.length));
  return (
    <>
      <section className="relative min-h-[46vh] bg-forest-dim overflow-hidden flex items-end">
        <Image src={c.hero.image} alt={c.hero.imageAlt} fill className="object-cover opacity-30" sizes="100vw" priority quality={75} />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dim via-forest-dim/60 to-transparent" />
        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 pt-32 pb-12 md:pt-44 md:pb-14">
          <Reveal>
            <span className="inline-flex rounded-full bg-white/10 backdrop-blur border border-white/10 px-3 py-1 text-xs tracking-[0.14em] uppercase text-white/80">
              {badge}
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <EditableText field="hero.title" as="h1" className="mt-4 font-display font-medium text-4xl md:text-6xl leading-[0.95] tracking-tightDisplay text-white max-w-3xl">
              {c.hero.title}
            </EditableText>
          </Reveal>
          <Reveal delay={0.1}>
            <EditableText field="hero.subtitle" as="p" className="mt-4 max-w-xl text-white/60 leading-relaxed">
              {c.hero.subtitle}
            </EditableText>
          </Reveal>
        </div>
      </section>

      <section className="bg-white dark:bg-forest border-b border-black/5 dark:border-white/10">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-8 grid grid-cols-3 gap-4">
          {c.stats.map((s, i) => (
            <div key={i} className="rounded-2xl bg-cream dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 text-center">
              <div className="font-display text-3xl font-medium dark:text-white"><Counter value={(s as any).dynamic === "count" ? PROJECTS.length : s.n || 0} suffix={s.suffix} /></div>
              <div className="text-xs tracking-[0.12em] uppercase text-ink/50 dark:text-white/50 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream dark:bg-forest-dim">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-12 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading field="section" eyebrow={c.section.eyebrow} title={c.section.title} withLine />
            <div className="flex flex-col gap-3 items-end">
              <SearchBar placeholder={c.section.searchPlaceholder} />
              <EditableText field="section.helper" as="p" className="max-w-md text-ink/60 dark:text-white/60 text-sm leading-relaxed text-right">
                {c.section.helper}
              </EditableText>
            </div>
          </div>
          <ProjectFilter projects={PROJECTS} />
        </div>
      </section>
    </>
  );
}
