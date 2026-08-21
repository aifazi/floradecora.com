import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import Counter from "@/components/Counter";
import HoverBloom from "@/components/HoverBloom";

export const metadata: Metadata = {
  title: "Projects | Flora Decora",
  description: "Themed gardens, public parks and landscaping projects delivered across the UAE — all images from assest.",
};

const PROJECTS = [
  { title: "Butterfly Garden — AI Concept 01", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-29-2026-11_38_00-pm.png" },
  { title: "Desert Oasis — AI Concept 02", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-29-2026-11_38_43-pm.png" },
  { title: "Palm Plaza — AI Concept 03", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-29-2026-11_39_48-pm.png" },
  { title: "Wildflower Meadow — AI Concept 04", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-29-2026-11_42_38-pm.png" },
  { title: "Courtyard Study — AI Concept 05", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-29-2026-11_43_24-pm.png" },
  { title: "Oasis Boulevard — AI Concept 06", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-29-2026-11_46_54-pm.png" },
  { title: "Terraced Garden — AI Concept 07", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-29-2026-11_49_03-pm.png" },
  { title: "Bloom Corridor — AI Concept 08", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-29-2026-11_51_18-pm.png" },
  { title: "Night Garden — AI Concept 09", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-29-2026-11_52_08-pm.png" },
  { title: "Heritage Park — AI Concept 10", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-29-2026-11_58_10-pm.png" },
  { title: "Urban Arboretum — AI Concept 11", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-29-2026-11_58_31-pm.png" },
  { title: "Sunset Lawn — AI Concept 12", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-30-2026-12_04_31-am.png" },
  { title: "Canopy Walk — AI Concept 13", type: "AI Render", year: "2026", img: "/images/chatgpt-image-jul-30-2026-12_15_15-am.png" },
  { title: "Site Master — 6.png", type: "Site Plan", year: "2024", img: "/images/6.png" },
  { title: "Planting Study — 8.png", type: "Site Plan", year: "2024", img: "/images/8.png" },
  { title: "Public Park Revamp", type: "Photo", year: "2023", img: "/images/picture2-min-scaled.jpg" },
  { title: "Municipal Nursery", type: "Photo", year: "2023", img: "/images/picture3-min-scaled.jpg" },
  { title: "Irrigation Detail", type: "Photo", year: "2023", img: "/images/picture4-min.png" },
  { title: "Brand — Logo Alt", type: "Brand", year: "2024", img: "/images/stklapp-imgur.png" },
];

export default function ProjectsPage() {
  return (
    <>
      <section className="relative min-h-[46vh] bg-forest-dim overflow-hidden flex items-end">
        <Image src="/images/chatgpt-image-jul-30-2026-12_15_15-am.png" alt="" fill className="object-cover opacity-30" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dim via-forest-dim/60 to-transparent" />
        <div className="relative mx-auto max-w-content w-full px-6 md:px-10 pt-32 pb-12 md:pt-44 md:pb-14">
          <Reveal><span className="inline-flex rounded-full bg-white/10 backdrop-blur border border-white/10 px-3 py-1 text-xs tracking-[0.14em] uppercase text-white/80">Projects • 19 assets from assest</span></Reveal>
          <Reveal delay={0.06}><h1 className="mt-4 font-display font-medium text-4xl md:text-6xl leading-[0.95] tracking-tightDisplay text-white max-w-3xl">Every image from assest, now living on the site.</h1></Reveal>
        </div>
      </section>

      <section className="bg-white dark:bg-forest border-b border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-content px-6 md:px-10 py-8 grid grid-cols-3 gap-4">
          {[
            { n: 19, label: "Assets wired" },
            { n: 150, label: "Clients" },
            { n: 20, label: "Years" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-cream dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 text-center">
              <div className="font-display text-3xl font-medium dark:text-white"><Counter value={s.n} suffix={s.label==="Assets wired"?"": "+"} /></div>
              <div className="text-xs tracking-[0.12em] uppercase text-ink/50 dark:text-white/50 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream dark:bg-forest-dim">
        <div className="mx-auto max-w-content px-6 md:px-10 py-12 md:py-20">
          <SectionHeading eyebrow="Recent Work — all assest" title="14 AI concepts + 6.png/8.png + 3 photos + logos" withLine />
          <p className="mt-3 text-sm text-ink/60 dark:text-white/60">Sourced from <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">C:\FAZI\floradecora.com\assest</code> — sanitized to <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">/public/images</code></p>
          <Stagger className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROJECTS.map((p) => (
              <StaggerItem key={p.img} className="group">
                <HoverBloom className="rounded-[1.6rem] bg-white dark:bg-white/5 p-2 shadow-card hover:shadow-glow border border-black/5 dark:border-white/10 h-full">
                  <div className="relative aspect-[4/3] rounded-[1.2rem] overflow-hidden bg-ink">
                    <Image src={p.img} alt={p.title} fill className="object-cover group-hover:scale-[1.06] transition-transform duration-700" sizes="380px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium">{p.type}</span>
                    <span className="absolute bottom-3 right-3 text-white/80 text-xs tracking-wide">{p.year}</span>
                  </div>
                  <div className="px-3 py-4">
                    <h3 className="font-display text-[15px] leading-tight dark:text-white">{p.title}</h3>
                    <span className="mt-2 inline-flex text-xs text-ochre-dark dark:text-ochre-light gap-1 group-hover:gap-2 transition-all">View →</span>
                  </div>
                </HoverBloom>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
