import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import Timeline from "@/components/Timeline";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import { cdnMedia } from "@/lib/cdn";
import { getContent } from "@/lib/content";
import { PAGE_ABOUT } from "@/lib/content-defaults";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("page_about", PAGE_ABOUT);
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const c = await getContent("page_about", PAGE_ABOUT);
  return (
    <>
      <section className="relative min-h-[54vh] bg-forest-dim overflow-hidden flex items-end">
        <Image src={c.hero.image} alt={c.hero.imageAlt} fill className="object-cover opacity-30" sizes="100vw" quality={75} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dim via-forest-dim/60 to-forest-dim/10" />
        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 pt-32 pb-12 md:pt-44 md:pb-16">
          <Reveal>
            <EditableText field="hero.badge" as="span" className="inline-flex rounded-full bg-white/10 backdrop-blur border border-white/10 px-3 py-1 text-xs tracking-[0.14em] uppercase text-white/80">
              {c.hero.badge}
            </EditableText>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-4 font-display font-medium text-4xl md:text-6xl leading-[0.95] tracking-tightDisplay text-white max-w-3xl text-balance">
              <EditableText field="hero.titleLead" as="span">
                {c.hero.titleLead}
              </EditableText>
              <EditableText field="hero.titleHighlight" as="span" className="text-ochre-light">
                {c.hero.titleHighlight}
              </EditableText>
              <EditableText field="hero.titleRest" as="span">
                {c.hero.titleRest}
              </EditableText>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream dark:bg-forest-dim">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24 grid lg:grid-cols-2 gap-10">
          <Reveal className="space-y-6 text-ink/70 dark:text-white/70 leading-relaxed text-lg">
            <EditableText field="intro.lead" as="p" className="text-ink dark:text-white text-xl leading-relaxed">
              {c.intro.lead}
            </EditableText>
            <EditableText field="intro.p2" as="p">
              {c.intro.p2}
            </EditableText>
            <div className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/10">
              <Image src={c.intro.image} alt={c.intro.imageAlt} width={600} height={400} className="w-full h-auto object-cover" quality={75} sizes="(max-width: 768px) 100vw, 600px" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-ink/70 dark:text-white/70 leading-relaxed text-lg">
            <EditableText field="intro.p3" as="p">
              {c.intro.p3}
            </EditableText>
            <div className="rounded-2xl bg-forest text-white p-6 flex gap-4 items-center">
              <span className="w-12 h-12 rounded-full bg-ochre grid place-items-center shrink-0">↗</span>
              <EditableText field="intro.quote" as="p" className="font-display text-lg leading-snug">
                {c.intro.quote}
              </EditableText>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white dark:bg-forest border-y border-black/5 dark:border-white/10">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24">
          <SectionHeading field="mission" eyebrow={c.mission.eyebrow} title={c.mission.title} withLine />
          <EditableText field="mission.body" as="p" className="mt-6 max-w-2xl text-ink/60 dark:text-white/60 leading-relaxed">
            {c.mission.body}
          </EditableText>
          <Stagger className="mt-12 grid md:grid-cols-3 gap-4">
            {c.mission.values.map((v, i) => (
              <StaggerItem key={i} className="rounded-3xl bg-cream dark:bg-white/[0.06] border-2 border-black/[0.06] dark:border-white/10 p-7 hover:shadow-soft hover:-translate-y-1 transition-all">
                <div className="w-10 h-10 rounded-xl bg-ink text-white grid place-items-center">{v.icon}</div>
                <EditableText field={`mission.values.${i}.title`} as="h3" className="mt-6 font-display text-lg leading-snug dark:text-white">
                  {v.title}
                </EditableText>
                <EditableText field={`mission.values.${i}.body`} as="p" className="mt-2 text-sm text-ink/60 dark:text-white/60 leading-relaxed">
                  {v.body}
                </EditableText>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-cream dark:bg-forest-dim">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24">
          <SectionHeading field="principles" eyebrow={c.principles.eyebrow} title={c.principles.title} withLine />
          <EditableText field="principles.intro" as="p" className="mt-4 max-w-2xl text-ink/60 dark:text-white/60">
            {c.principles.intro}
          </EditableText>
          <Stagger className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.principles.items.map((p, i) => (
              <StaggerItem key={i} className="rounded-[1.5rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 shadow-card">
                <div className="text-xs tracking-[0.16em] uppercase text-ochre">0{i + 1}</div>
                <EditableText field={`principles.items.${i}.title`} as="h3" className="mt-2 font-display text-lg text-forest dark:text-white">
                  {p.title}
                </EditableText>
                <EditableText field={`principles.items.${i}.body`} as="p" className="mt-2 text-sm text-ink/60 dark:text-white/60 leading-relaxed">
                  {p.body}
                </EditableText>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-white dark:bg-forest border-y border-black/5 dark:border-white/10">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24">
          <SectionHeading field="timeline" eyebrow={c.timeline.eyebrow} title={c.timeline.title} withLine />
          <Timeline events={c.timeline.events} />
        </div>
      </section>

      <section className="bg-cream dark:bg-forest-dim">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24">
          <SectionHeading field="testimonials" eyebrow={c.testimonials.eyebrow} title={c.testimonials.title} withLine />
          <Testimonials reviews={c.testimonials.reviews} />
          <div className="mt-8 flex flex-wrap gap-3 text-xs">
            {c.testimonials.chips.map((chip, i) => (
              <span key={chip} className={`rounded-full px-4 py-2 ${i === 1 ? "bg-ink text-white" : "border border-black/10 dark:border-white/10"}`}>{chip}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-forest border-y border-black/5 dark:border-white/10">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24 max-w-3xl">
          <SectionHeading field="faq" eyebrow={c.faq.eyebrow} title={c.faq.title} withLine />
          <FAQ items={c.faq.items} />
        </div>
      </section>
    </>
  );
}
