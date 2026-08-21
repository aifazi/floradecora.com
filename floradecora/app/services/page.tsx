import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services | Flora Decora",
  description: "Landscaping design, themed gardens, development, nurseries, irrigation, pest control and maintenance.",
};

const SERVICES = [
  { title: "Themed & Butterfly Gardens", body: "End-to-end delivery of touristic theme gardens and butterfly houses, from concept through construction and long-term operation.", icon: "🦋" },
  { title: "Landscaping Design", body: "Concept-to-construction design for public parks, municipal landscapes and private developments.", icon: "✎" },
  { title: "Development", body: "Hard and soft landscape construction delivered by in-house crews, coordinated with design and irrigation.", icon: "⬢" },
  { title: "Commercial Nurseries", body: "Planning, planting and ongoing management of nurseries that supply and support our projects.", icon: "🌿" },
  { title: "Outdoor Sports Facilities", body: "Design and build of outdoor sports surfaces integrated with the surrounding landscape.", icon: "◎" },
  { title: "Pest Control", body: "Licensed pest control protecting both planted landscapes and public health.", icon: "◐" },
  { title: "Operation & Maintenance", body: "Scheduled operations, weekly inspections and monthly consumable planning to keep every site performing.", icon: "⚙" },
  { title: "Irrigation Systems", body: "Efficient irrigation designed for the UAE climate, sized to each site's planting and water needs.", icon: "💧" },
  { title: "Steel Fabrication", body: "In-house fabrication for structures, shade elements and hardscape features.", icon: "◆" },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative bg-forest-dim overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-dim to-black" />
        <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-ochre/15 rounded-full blur-[80px]" />
        <div className="relative mx-auto max-w-content px-6 md:px-10 pt-32 pb-14 md:pt-44 md:pb-20">
          <Reveal><span className="inline-flex rounded-full bg-white/10 backdrop-blur border border-white/10 px-3 py-1 text-xs tracking-[0.14em] uppercase text-white/80">Services</span></Reveal>
          <Reveal delay={0.06}><h1 className="mt-4 font-display font-medium text-4xl md:text-6xl leading-[0.95] tracking-tightDisplay text-white max-w-3xl">Nine disciplines, one in-house team.</h1></Reveal>
          <Reveal delay={0.1}><p className="mt-4 max-w-xl text-white/60 leading-relaxed">Every stage of a landscape&apos;s life — design, build, plant, irrigate, protect and maintain — handled by our own technicians.</p></Reveal>
        </div>
      </section>

      <section className="bg-cream dark:bg-forest-dim">
        <div className="mx-auto max-w-content px-6 md:px-10 py-12 md:py-16">
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
        <div className="mx-auto max-w-content px-6 md:px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl dark:text-white">Not sure where to start?</h3>
            <p className="text-ink/60 dark:text-white/60 mt-1">Tell us what you&apos;re building — we&apos;ll scope it in 24h.</p>
          </div>
          <Link href="/contact" className="rounded-full bg-ink dark:bg-white text-white dark:text-ink px-8 py-4 text-sm font-medium hover:bg-forest dark:hover:bg-cream transition-colors shrink-0">Send an inquiry →</Link>
        </div>
      </section>
    </>
  );
}
