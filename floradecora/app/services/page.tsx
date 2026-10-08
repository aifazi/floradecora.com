import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import Button from "@/components/Button";
import EditableText from "@/components/editor/EditableText";
import { getServices } from "@/lib/api";
import { getContent } from "@/lib/content";
import { PAGE_SERVICES } from "@/lib/content-defaults";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("page_services", PAGE_SERVICES);
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { canonical: "/services" },
  };
}

export default async function ServicesPage() {
  const [SERVICES, c] = await Promise.all([getServices(), getContent("page_services", PAGE_SERVICES)]);
  return (
    <>
      <section className="relative bg-forest-dim overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-dim to-black" />
        <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-ochre/15 rounded-full blur-[80px]" />
        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 pt-32 pb-14 md:pt-44 md:pb-20">
          <Reveal>
            <EditableText field="hero.badge" as="span" className="inline-flex rounded-full bg-white/10 backdrop-blur border border-white/10 px-3 py-1 text-xs tracking-[0.14em] uppercase text-white/80">
              {c.hero.badge}
            </EditableText>
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

      <section className="bg-cream dark:bg-forest-dim">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-12 md:py-16">
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s, i) => (
              <StaggerItem key={s.title} className="group rounded-[1.6rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-7 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all">
                <div className="flex items-start justify-between">
                  <span className="w-10 h-10 rounded-xl bg-ink text-white grid place-items-center group-hover:bg-ochre transition-colors">{s.icon}</span>
                  <span className="text-xs tracking-[0.16em] uppercase text-ink/30">0{i + 1}</span>
                </div>
                <h2 className="mt-6 font-display text-lg leading-snug text-ink">{s.title}</h2>
                <p className="mt-2 text-sm text-ink/60 leading-relaxed">{s.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-white dark:bg-forest border-y border-black/5 dark:border-white/10">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <EditableText field="cta.title" as="h3" className="font-display text-2xl dark:text-white">
              {c.cta.title}
            </EditableText>
            <EditableText field="cta.subtitle" as="p" className="text-ink/60 dark:text-white/60 mt-1">
              {c.cta.subtitle}
            </EditableText>
          </div>
          <Button href="/contact" variant="secondary" size="md">
            {c.cta.button}
          </Button>
        </div>
      </section>
    </>
  );
}
