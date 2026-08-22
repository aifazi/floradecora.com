import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import Counter from "@/components/Counter";
import { MagneticButton } from "@/components/MagneticButton";
import { Parallax } from "@/components/Parallax";
import HoverBloom from "@/components/HoverBloom";
import { cdnMedia } from "@/lib/cdn";

const SERVICES = [
  { title: "Themed & Butterfly Gardens", note: "Design, build, operate", icon: "🦋", accent: "from-amber-400/20 to-orange-500/20" },
  { title: "Landscaping Design", note: "Concept to construction", icon: "✎", accent: "from-emerald-400/20 to-teal-500/20" },
  { title: "Development", note: "Hard & soft landscape", icon: "⬢", accent: "from-stone-400/20 to-zinc-500/20" },
  { title: "Commercial Nurseries", note: "Development & management", icon: "🌿", accent: "from-lime-400/20 to-green-500/20" },
  { title: "Outdoor Sports Facilities", note: "Development", icon: "◎", accent: "from-sky-400/20 to-blue-500/20" },
  { title: "Pest Control", note: "Agricultural & public health", icon: "◐", accent: "from-amber-400/15 to-yellow-500/15" },
  { title: "Operation & Maintenance", note: "Landscaping facilities", icon: "⚙", accent: "from-zinc-400/20 to-neutral-500/20" },
  { title: "Irrigation Systems", note: "Design & installation", icon: "💧", accent: "from-cyan-400/20 to-blue-500/20" },
];

const PROCESS = [
  { phase: "01 — Setup", title: "Initial Setup", points: ["Trained, experienced staff placed on site", "PPE, specialized tools and equipment", "Landscaping plan tailored to client"], color: "bg-ochre" },
  { phase: "02 — Launch", title: "Initial Operations", points: ["Day-to-day operations schedule", "Staff briefed on client requirements", "Weekly site inspections begin"], color: "bg-sage" },
  { phase: "03 — Sustain", title: "Ongoing Operations", points: ["Consumables ordered on a monthly cycle", "Colour-coded zoning for suitable use", "Advanced lawn analysis & treatment"], color: "bg-forest" },
];

export default function Home() {
  return (
    <>
      {/* HERO — fitted to border */}
      <section className="relative min-h-[92vh] bg-forest-dim overflow-hidden flex items-center p-3 sm:p-4 md:p-6">
        <div className="absolute inset-0">
          <Parallax offset={40} className="absolute inset-0">
            <Image src={cdnMedia("Picture2-min-scaled.jpg")} alt="Lush themed garden by Flora Decora in Al Ain, UAE" fill priority fetchPriority="high" quality={80} unoptimized className="object-cover object-center animate-kenburns scale-[1.08]" sizes="100vw" />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-r from-forest-dim via-forest-dim/80 to-forest-dim/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dim via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-[0.06] mix-blend-soft-light" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-content 2xl:max-w-content-2xl w-full rounded-[2.2rem] sm:rounded-[2.5rem] border border-white/15 overflow-hidden bg-forest-dim/20 backdrop-blur-sm px-5 sm:px-6 md:px-8 lg:px-10 pt-24 sm:pt-28 pb-8 sm:pb-10 md:pt-32 md:pb-12 grid lg:grid-cols-[1.08fr_0.92fr] gap-8 md:gap-10 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/15 px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/90 text-[0.68rem] tracking-[0.16em] uppercase font-medium">Est. 2003 — Al Ain, UAE</span>
                <span className="hidden sm:inline-flex ml-2 rounded-full bg-white text-forest-dim px-2.5 py-1 text-[0.62rem] tracking-wide font-semibold">20+ Years</span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 font-display font-[550] leading-[0.9] tracking-tightDisplay text-white text-balance text-5xl sm:text-6xl lg:text-[5.2rem]">
                We draw
                <span className="inline-flex items-center ml-3 align-middle">
                  <span className="inline-block w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 border-white/20 -rotate-6">
                    <Image src={cdnMedia("Picture3-min-scaled.jpg")} alt="Flora Decora garden detail" width={80} height={80} unoptimized className="w-full h-full object-cover" quality={75} />
                  </span>
                </span>
                <br />
                <span className="bg-gradient-to-r from-ochre-light to-amber-200 bg-clip-text text-transparent">the plan,</span>
                <br />
                then we grow it.
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-6 max-w-xl text-white/70 text-lg leading-relaxed text-balance">
                Flora Decora designs, builds and operates <span className="text-white">themed gardens, public parks</span> and tourist attractions across the UAE — from the first line on a site plan to twenty years of maintenance after.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <MagneticButton href="/contact">Start a project</MagneticButton>
                <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white px-7 py-4 text-[0.72rem] tracking-[0.16em] uppercase font-medium hover:bg-white hover:text-forest-dim transition-colors">
                  View projects
                </Link>
                <span className="hidden md:inline-flex items-center gap-2 text-white/50 text-xs ml-2">
                  <span className="w-8 h-px bg-white/20" /> Trusted by 150+ clients
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.26} className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <span key={i} className="w-9 h-9 rounded-full bg-white/15 border-2 border-forest-dim grid place-items-center text-xs backdrop-blur">✦</span>
                ))}
              </div>
              <div className="text-xs">
                <div className="text-white font-medium">Rated 4.9/5 by municipal clients</div>
                <div className="text-white/50">Al Ain Municipality • Abu Dhabi Parks</div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.18} className="relative hidden md:block h-[420px] md:h-[480px] lg:h-[560px]">
            <div className="absolute top-6 right-6 left-6 bottom-6">
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.35)] bg-white p-2">
                <div className="relative w-full h-full rounded-[1.6rem] overflow-hidden">
                  <Image src={cdnMedia("Picture3-min-scaled.jpg")} alt="Butterfly Garden Al Ain by Flora Decora" fill unoptimized className="object-cover" sizes="540px" quality={75} />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="glass rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs tracking-[0.14em] uppercase text-ink/60">Featured</div>
                        <div className="font-display text-lg leading-none mt-1">Butterfly Garden — Al Ain</div>
                      </div>
                      <span className="w-10 h-10 rounded-full bg-forest text-white grid place-items-center">↗</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -left-6 bottom-10 w-[220px] rounded-2xl overflow-hidden shadow-soft bg-white p-1.5 animate-float hidden xl:block">
                <div className="relative h-[140px] rounded-xl overflow-hidden">
                  <Image src={cdnMedia("Picture4-min.png")} alt="Irrigation system installation detail" fill unoptimized className="object-cover" sizes="220px" quality={75} />
                </div>
                <div className="p-3">
                  <div className="text-xs font-semibold">Irrigation Systems</div>
                  <div className="text-[11px] text-ink/60">Design & installation</div>
                </div>
              </div>
              <div className="absolute -right-2 top-14 glass-dark rounded-full px-4 py-3 flex items-center gap-3 shadow-soft">
                <span className="w-10 h-10 rounded-full bg-ochre grid place-items-center text-white">✓</span>
                <div className="pr-2">
                  <div className="text-white text-sm font-semibold leading-none">300+ projects</div>
                  <div className="text-white/60 text-xs">Delivered on time</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-forest-dim/60 backdrop-blur">
          <div className="overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap py-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="flex items-center gap-6 px-6 text-white/60 text-xs tracking-[0.18em] uppercase">
                  <span>Themed Gardens</span> <span className="w-1 h-1 rounded-full bg-ochre" />
                  <span>Public Parks</span> <span className="w-1 h-1 rounded-full bg-ochre" />
                  <span>Irrigation</span> <span className="w-1 h-1 rounded-full bg-ochre" />
                  <span>Nurseries</span> <span className="w-1 h-1 rounded-full bg-ochre" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-cream dark:bg-forest-dim relative -mt-px">
        <div className="mx-auto max-w-content 2xl:max-w-content-2xl px-4 sm:px-6 md:px-10 lg:px-12 xl:px-10 2xl:px-8 py-8">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              { n: 20, suffix: "+", label: "Years Experience", sub: "Since 2003" },
              { n: 300, suffix: "+", label: "Projects Delivered", sub: "UAE wide" },
              { n: 150, suffix: "+", label: "Clients Served", sub: "Gov & private" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <HoverBloom className="rounded-[1.5rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 md:p-8 shadow-card hover:shadow-soft dark:hover:shadow-glow">
                  <div className="font-display text-4xl md:text-5xl font-medium tracking-tightDisplay text-ink dark:text-white">
                    <Counter value={s.n} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-sm font-semibold text-ink dark:text-white">{s.label}</div>
                  <div className="text-xs text-ink/50 dark:text-white/50">{s.sub}</div>
                </HoverBloom>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-cream dark:bg-forest-dim overflow-hidden border-y border-transparent dark:border-white/5">
        <div className="mx-auto max-w-content 2xl:max-w-content-2xl px-4 sm:px-6 md:px-10 lg:px-12 xl:px-10 2xl:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start">
            <div>
              <SectionHeading eyebrow="About Flora Decora" title="Two decades of shaping the UAE's public gardens." withLine />
              <Stagger className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { k: "01", v: "In-house team" },
                  { k: "02", v: "End-to-end" },
                  { k: "03", v: "20 yrs care" },
                ].map((f) => (
                  <StaggerItem key={f.k} className="rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4">
                    <div className="text-ochre text-xs tracking-widest">{f.k}</div>
                    <div className="font-medium text-sm mt-1 dark:text-white">{f.v}</div>
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal delay={0.12} className="mt-8 space-y-4 text-ink/70 dark:text-white/70 leading-relaxed">
                <p>We are a premier landscaping and gardening company specializing in designing, constructing and operating touristic theme gardens and public parks throughout the United Arab Emirates.</p>
                <p>Design, consultancy, planning, nurseries, hard and soft landscape, irrigation and ongoing operation are all managed in-house — by the same teams from first sketch to final hedge trim.</p>
              </Reveal>
              <Reveal delay={0.18} className="mt-8">
                <Link href="/about" className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-6 py-3 text-sm hover:bg-forest transition-colors">
                  More about our studio <span>→</span>
                </Link>
              </Reveal>
            </div>
            <Reveal className="relative lg:sticky lg:top-28">
              <HoverBloom className="relative rounded-[2rem] overflow-hidden bg-white dark:bg-white/5 p-2 shadow-soft hover:shadow-glow border border-black/5 dark:border-white/10">
                <Parallax offset={22} className="relative aspect-[4/3.2] rounded-[1.6rem] overflow-hidden">
                  <Image src={cdnMedia("Picture4-min.png")} alt="Flora Decora nursery and landscape operations" fill unoptimized className="object-cover" sizes="(max-width: 1024px) 100vw, 560px" quality={75} />
                  <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live site — Al Ain
                  </div>
                </Parallax>
                <div className="grid grid-cols-2 gap-3 p-3">
                  <div className="rounded-2xl bg-limestone dark:bg-white/10 p-4 hover-bloom">
                    <div className="text-2xl font-display font-medium">150+</div>
                    <div className="text-xs text-ink/60 dark:text-white/60">Skilled horticulturists</div>
                  </div>
                  <div className="rounded-2xl bg-forest text-white p-4 hover-bloom">
                    <div className="text-xs uppercase tracking-[0.16em] opacity-70">Coverage</div>
                    <div className="font-medium mt-1">Al Ain → Abu Dhabi</div>
                  </div>
                </div>
              </HoverBloom>
              <div className="absolute -z-10 -bottom-10 -right-10 w-72 h-72 bg-ochre/15 rounded-full blur-[60px]" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* GALLERY — CDN */}
      <section className="bg-white dark:bg-forest border-y border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-content 2xl:max-w-content-2xl px-4 sm:px-6 md:px-10 lg:px-12 xl:px-10 2xl:px-8 py-10 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Selected Work — Built Projects" title="Concept to bloom, all in-house." />
            <Link href="/projects" className="hidden md:inline-flex rounded-full border border-black/10 dark:border-white/15 px-6 py-3 text-sm hover:bg-ink hover:text-white dark:hover:bg-white dark:hover:text-ink transition-colors">View all projects →</Link>
          </div>
          <p className="mt-3 text-sm text-ink/60 dark:text-white/60 max-w-2xl">A selection of built work from Al Ain and Abu Dhabi — concepts available on request.</p>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { src: cdnMedia("Picture2-min-scaled.jpg"), title: "Butterfly Garden — Al Ain", meta: "4,200 m² • Built 2023" },
              { src: cdnMedia("Picture3-min-scaled.jpg"), title: "Municipal Nursery", meta: "12,000 m² • Built 2023" },
              { src: cdnMedia("01_1 - Photo.jpg.jpeg"), title: "Central Park — Al Ain", meta: "18,000 m² • Built 2022" },
              { src: cdnMedia("05.jpg.jpeg"), title: "Desert Oasis — Abu Dhabi", meta: "9,500 m² • Built 2022" },
              { src: cdnMedia("Picture4-min.png"), title: "Irrigation Master Plan", meta: "8 parks • Built 2023" },
              { src: cdnMedia("6.png"), title: "Site Master Plan", meta: "Al Ain • Plan 2024" },
            ].map((c, i) => (
              <Reveal key={c.src} delay={i * 0.05}>
                <HoverBloom className="group relative rounded-[1.6rem] overflow-hidden bg-ink aspect-[4/3] p-1.5 tilt-card">
                  <div className="relative w-full h-full rounded-[1.3rem] overflow-hidden bg-ink">
                    <Image src={c.src} alt={c.title} fill unoptimized loading="lazy" className="object-cover group-hover:scale-[1.08] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]" sizes="400px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-transparent group-hover:from-black/75 transition-colors" />
                    <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase font-medium">Built</div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-white font-medium text-sm group-hover:translate-y-[-2px] transition-transform">{c.title}</div>
                        <div className="text-white/70 text-xs">{c.meta}</div>
                      </div>
                      <span className="w-9 h-9 rounded-full bg-white text-ink grid place-items-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-card">↗</span>
                    </div>
                  </div>
                </HoverBloom>
              </Reveal>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              cdnMedia("8.png"),
              cdnMedia("01_1 - Photo.jpg.jpeg"),
              cdnMedia("05.jpg.jpeg"),
              cdnMedia("Picture2-min-scaled.jpg"),
              cdnMedia("Picture3-min-scaled.jpg"),
              cdnMedia("Picture4-min.png"),
            ].map((src, i) => (
              <Reveal key={src} delay={0.3 + i * 0.04} className="relative aspect-square rounded-2xl overflow-hidden bg-cream dark:bg-white/5 border border-black/5 dark:border-white/10">
                <Image src={src} alt="Flora Decora project thumbnail" fill unoptimized loading="lazy" className="object-cover hover:scale-[1.06] transition-transform duration-700" sizes="200px" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MOCK PREVIEW — for client review */}
      <section className="bg-cream dark:bg-forest-dim border-y border-transparent dark:border-white/5">
        <div className="mx-auto max-w-content 2xl:max-w-content-2xl px-4 sm:px-6 md:px-10 lg:px-12 xl:px-10 2xl:px-8 py-12 md:py-16 2xl:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Preview — Mock Concepts" title="Mockups for review before build." withLine />
            <span className="rounded-full bg-ochre/10 dark:bg-ochre/20 border border-ochre/20 px-4 py-2 text-xs font-medium text-ochre-dark dark:text-ochre-light">12 mocks • Preview only</span>
          </div>
          <p className="mt-3 text-sm text-ink/60 dark:text-white/60 max-w-2xl">Concepts for preview — not built. Approve a direction and we’ll build it for real.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_38_00 PM.png"), label: "Mock 01" },
              { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_38_43 PM.png"), label: "Mock 02" },
              { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_39_48 PM.png"), label: "Mock 03" },
              { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_42_38 PM.png"), label: "Mock 04" },
              { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_43_24 PM.png"), label: "Mock 05" },
              { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_46_54 PM.png"), label: "Mock 06" },
              { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_49_03 PM.png"), label: "Mock 07" },
              { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_51_18 PM.png"), label: "Mock 08" },
              { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_52_08 PM.png"), label: "Mock 09" },
              { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_58_10 PM.png"), label: "Mock 10" },
              { src: cdnMedia("ChatGPT Image Jul 30, 2026, 12_04_31 AM.png"), label: "Mock 11" },
              { src: cdnMedia("ChatGPT Image Jul 30, 2026, 12_15_15 AM.png"), label: "Mock 12" },
            ].map((m, i) => (
              <Reveal key={m.src} delay={i * 0.03} className="group relative aspect-[4/3] rounded-[1.8rem] sm:rounded-3xl overflow-hidden bg-white dark:bg-white/5 border-2 border-black/[0.06] dark:border-white/10 shadow-card hover:shadow-glow hover:border-ochre/20 dark:hover:border-ochre/30 transition-all">
                <Image src={m.src} alt={m.label} fill unoptimized loading="lazy" className="object-cover group-hover:scale-[1.04] transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px" />
                <div className="absolute inset-0 ring-1 ring-black/5 dark:ring-white/5 rounded-[1.8rem] sm:rounded-3xl pointer-events-none" />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 dark:bg-forest/80 backdrop-blur border border-black/5 dark:border-white/10 px-3 py-1 text-[10px] tracking-[0.14em] uppercase font-semibold text-ink dark:text-white">{m.label}</span>
                <span className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-ochre text-white grid place-items-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">↗</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-cream dark:bg-forest-dim border-y border-transparent dark:border-white/5">
        <div className="mx-auto max-w-content 2xl:max-w-content-2xl px-4 sm:px-6 md:px-10 lg:px-12 xl:px-10 2xl:px-8 py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="What we do" title="Eight disciplines, one in-house team." withLine />
            <p className="max-w-md text-ink/60 dark:text-white/60 text-sm leading-relaxed">From concept render to daily maintenance — we keep it all under one roof so the garden actually matches the drawing.</p>
          </div>
          <Stagger className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((s) => (
              <StaggerItem key={s.title} className="group">
                <HoverBloom className="relative rounded-3xl bg-white dark:bg-white/[0.06] border-2 border-black/[0.06] dark:border-white/10 p-6 sm:p-7 shadow-card hover:shadow-glow overflow-hidden h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-ink dark:bg-white text-white dark:text-ink grid place-items-center text-sm group-hover:bg-ochre dark:group-hover:bg-ochre group-hover:text-white transition-colors group-hover:rotate-6 group-hover:scale-110 duration-500">{s.icon}</div>
                    <h3 className="mt-6 font-display text-[1.05rem] leading-tight font-medium text-ink dark:text-white">{s.title}</h3>
                    <p className="mt-1 text-xs text-ink/60 dark:text-white/60">{s.note}</p>
                    <div className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-ochre-dark dark:text-ochre-light opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                      Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-ochre/10 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 grid place-items-center text-ochre">✦</span>
                </HoverBloom>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-8 flex justify-center">
            <Link href="/services" className="rounded-full bg-ink text-white px-8 py-3.5 text-sm hover:bg-forest transition-colors">View all services →</Link>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white dark:bg-forest border-y border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-content 2xl:max-w-content-2xl px-4 sm:px-6 md:px-10 lg:px-12 xl:px-10 2xl:px-8 py-16 md:py-24">
          <SectionHeading eyebrow="How we work" title="From handover to steady-state — in three moves." withLine />
          <div className="mt-12 grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-ochre via-sage to-forest opacity-20" />
            {PROCESS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <HoverBloom className="relative rounded-3xl bg-cream dark:bg-white/[0.06] border-2 border-black/[0.06] dark:border-white/10 dark:border-white/10 p-6 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-full ${step.color} text-white grid place-items-center text-xs font-mono group-hover:scale-110 transition-transform`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="eyebrow text-ink/50 dark:text-white/50 !text-[0.62rem]">{step.phase}</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl dark:text-white">{step.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {step.points.map((p) => (
                      <li key={p} className="flex gap-3 text-sm text-ink/70 dark:text-white/70 leading-relaxed">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-ochre shrink-0 group-hover:scale-125 transition-transform" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </HoverBloom>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-forest-dim">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-dim to-black" />
          <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-ochre/15 rounded-full blur-[90px]" />
          <div className="absolute -bottom-24 -left-24 w-[520px] h-[520px] bg-sage/15 rounded-full blur-[90px]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        </div>
        <div className="relative mx-auto max-w-content 2xl:max-w-content-2xl px-4 sm:px-6 md:px-10 lg:px-12 xl:px-10 2xl:px-8 py-16 md:py-20">
          <div className="rounded-[2rem] bg-white/[0.06] backdrop-blur border border-white/10 p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs text-white/80">✦ Let&apos;s break ground</div>
              <h2 className="mt-4 font-display text-3xl md:text-4xl font-medium text-white leading-tight">Have a garden, park or attraction to plan?</h2>
              <p className="mt-3 text-white/60">Tell us the site, the budget and the timeline — we&apos;ll bring the plan and the plants.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/contact" className="rounded-full bg-ochre text-white px-8 py-4 text-sm font-semibold hover:bg-ochre-light transition-colors text-center">Send an inquiry</Link>
              <a href="tel:+97137344243" className="rounded-full bg-white text-ink px-8 py-4 text-sm font-semibold hover:bg-limestone transition-colors text-center">Call +971 3 734 4243</a>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/40">
            <span className="rounded-full border border-white/10 px-3 py-1">Avg. reply — 4 hours</span>
            <span className="rounded-full border border-white/10 px-3 py-1">No pitch deck required</span>
            <span className="rounded-full border border-white/10 px-3 py-1">Site visit within 72h</span>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl md:text-4xl text-ochre-light">{value}</p>
      <p className="eyebrow text-limestone/50 mt-2">{label}</p>
    </div>
  );
}
