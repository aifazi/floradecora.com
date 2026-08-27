import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import Timeline from "@/components/Timeline";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import { cdnMedia } from "@/lib/cdn";

export const metadata: Metadata = {
  title: "About Us | Flora Decora",
  description: "Flora Decora is a premier UAE landscaping company with over 20 years of experience.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { title: "Design that exceeds expectations", body: "We inspire our clients and the public they serve through design solutions that improve the human spirit, the public realm and biodiversity.", icon: "◐" },
  { title: "Always learning", body: "We continually learn from the natural world, other practitioners and the scientific community about new, effective techniques.", icon: "◎" },
  { title: "A place worth working", body: "We provide our staff with a challenging, respectful and exciting place of work — because gardens are only as good as the people who build them.", icon: "✦" },
];

const PRINCIPLES = [
  { title: "Simplicity", body: "Achieved through repetition of colours, textures, plants, shapes and materials — not the opposite of complexity, but its resolution." },
  { title: "Focalization", body: "The eye is drawn first to a focal point — plant, hardscape, colour or texture — that commands attention." },
  { title: "Balance", body: "Visual balance in the landscape is a comfortable experience, the way physical balance is a comfortable state." },
  { title: "Proportion & Scale", body: "Vertical, horizontal and spatial relationships, shaped by how the viewer's eye moves through the space." },
  { title: "Rhythm & Line", body: "Rhythm repeats after separation — an arc, a shape. Line is how the eye moves through a landscape." },
  { title: "Unity", body: "Every component is valued on its own, but together they create one collective experience." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[54vh] bg-forest-dim overflow-hidden flex items-end">
        <Image src={cdnMedia("Picture2-min-scaled.jpg")} alt="Flora Decora public park landscape in Al Ain" fill className="object-cover opacity-30" sizes="100vw" quality={75} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dim via-forest-dim/60 to-forest-dim/10" />
        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 pt-32 pb-12 md:pt-44 md:pb-16">
          <Reveal>
            <span className="inline-flex rounded-full bg-white/10 backdrop-blur border border-white/10 px-3 py-1 text-xs tracking-[0.14em] uppercase text-white/80">About Us — CDN</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-4 font-display font-medium text-4xl md:text-6xl leading-[0.95] tracking-tightDisplay text-white max-w-3xl text-balance">
              A studio built to see a garden <span className="text-ochre-light">through</span>, not just design it.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream dark:bg-forest-dim">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24 grid lg:grid-cols-2 gap-10">
          <Reveal className="space-y-6 text-ink/70 dark:text-white/70 leading-relaxed text-lg">
            <p className="text-ink dark:text-white text-xl leading-relaxed">We are Flora Decora — Al Ain, UAE. A premier landscaping studio for touristic theme gardens and public parks.</p>
            <p>With over 20 years and 300+ projects, we are one of the region&apos;s leaders in vertical gardens, theme gardens and municipal landscaping.</p>
            <div className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/10">
              <Image src={cdnMedia("ChatGPT Image Jul 29, 2026, 11_42_38 PM.png")} alt="Desert oasis garden vision by Flora Decora" width={600} height={400} className="w-full h-auto object-cover" quality={75} sizes="(max-width: 768px) 100vw, 600px" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-ink/70 dark:text-white/70 leading-relaxed text-lg">
            <p>Design, consultancy, planning, nurseries, hard & soft landscape, irrigation and operation — all managed in-house by our own technicians.</p>
            <div className="rounded-2xl bg-forest text-white p-6 flex gap-4 items-center">
              <span className="w-12 h-12 rounded-full bg-ochre grid place-items-center shrink-0">↗</span>
              <p className="font-display text-lg leading-snug">One team, one plan — from first sketch to the twentieth year of maintenance.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white dark:bg-forest border-y border-black/5 dark:border-white/10">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24">
          <SectionHeading eyebrow="Our Mission" title="Cost-efficient work, reputations built on it." withLine />
          <p className="mt-6 max-w-2xl text-ink/60 dark:text-white/60 leading-relaxed">To deliver the best product and service in the most cost-efficient way possible, and to build healthy business relations in an industry that comes to know us by reputation.</p>
          <Stagger className="mt-12 grid md:grid-cols-3 gap-4">
            {VALUES.map((v) => (
              <StaggerItem key={v.title} className="rounded-3xl bg-cream dark:bg-white/[0.06] border-2 border-black/[0.06] dark:border-white/10 dark:border-white/10 p-7 hover:shadow-soft hover:-translate-y-1 transition-all">
                <div className="w-10 h-10 rounded-xl bg-ink text-white grid place-items-center">{v.icon}</div>
                <h3 className="mt-6 font-display text-lg leading-snug dark:text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-ink/60 dark:text-white/60 leading-relaxed">{v.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-cream dark:bg-forest-dim">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24">
          <SectionHeading eyebrow="Principles" title="How we judge our own designs." withLine />
          <p className="mt-4 max-w-2xl text-ink/60 dark:text-white/60">Every design is judged against the same principles used across the fine and applied arts.</p>
          <Stagger className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRINCIPLES.map((p, i) => (
              <StaggerItem key={p.title} className="rounded-[1.5rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 shadow-card">
                <div className="text-xs tracking-[0.16em] uppercase text-ochre">0{i + 1}</div>
                <h3 className="mt-2 font-display text-lg text-forest dark:text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-ink/60 dark:text-white/60 leading-relaxed">{p.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-white dark:bg-forest border-y border-black/5 dark:border-white/10">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24">
          <SectionHeading eyebrow="Timeline" title="20+ years, one project at a time." withLine />
          <Timeline />
        </div>
      </section>

      <section className="bg-cream dark:bg-forest-dim">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24">
          <SectionHeading eyebrow="Testimonials" title="What clients say." withLine />
          <Testimonials />
          <div className="mt-8 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full border border-black/10 dark:border-white/10 px-4 py-2">Trusted by 150+ clients</span>
            <span className="rounded-full bg-ink text-white px-4 py-2">Avg. 4.9/5 satisfaction</span>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-forest border-y border-black/5 dark:border-white/10">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24 max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Before you visit, a few answers." withLine />
          <FAQ />
        </div>
      </section>
    </>
  );
}
