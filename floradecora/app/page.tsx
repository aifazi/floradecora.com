import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import Counter from "@/components/Counter";
import { MagneticButton } from "@/components/MagneticButton";
import { Parallax } from "@/components/Parallax";
import HoverBloom from "@/components/HoverBloom";
import Button from "@/components/Button";
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import { BLUR_DATAURL } from "@/lib/cdn";
import { ImageWithLandscapeSkeleton } from "@/components/LandscapeSkeleton";
import { getServices } from "@/lib/api";
import { getContent } from "@/lib/content";
import { PAGE_HOME } from "@/lib/content-defaults";

export default async function Home() {
  const [dynamicServices, c] = await Promise.all([
    getServices().catch(() => []),
    getContent("page_home", PAGE_HOME),
  ]);
  const SERVICES = dynamicServices.length ? dynamicServices.map((s: { title: string; body: string; icon: string; accent?: string }) => ({ title: s.title, note: s.body.slice(0, 40), icon: s.icon, accent: s.accent || "from-ochre/10 to-amber-100/10" })) : [
    { title: "Themed & Butterfly Gardens", note: "Design, build, operate", icon: "🦋", accent: "from-amber-400/20 to-orange-500/20" },
    { title: "Landscaping Design", note: "Concept to construction", icon: "✎", accent: "from-emerald-400/20 to-teal-500/20" },
    { title: "Development", note: "Hard & soft landscape", icon: "⬢", accent: "from-stone-400/20 to-zinc-500/20" },
    { title: "Commercial Nurseries", note: "Development & management", icon: "🌿", accent: "from-lime-400/20 to-green-500/20" },
    { title: "Outdoor Sports Facilities", note: "Development", icon: "◎", accent: "from-sky-400/20 to-blue-500/20" },
    { title: "Pest Control", note: "Agricultural & public health", icon: "◐", accent: "from-amber-400/15 to-yellow-500/15" },
    { title: "Operation & Maintenance", note: "Landscaping facilities", icon: "⚙", accent: "from-zinc-400/20 to-neutral-500/20" },
    { title: "Irrigation Systems", note: "Design & installation", icon: "💧", accent: "from-cyan-400/20 to-blue-500/20" },
  ];
  return (
    <>
      {/* HERO — wide to screen border */}
      <section className="relative min-h-[100svh] bg-forest-dim overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <Parallax offset={40} className="absolute inset-0">
            <EditableImage field="hero.bgImage" src={c.hero.bgImage} alt={c.hero.bgImageAlt} fill className="object-cover object-center animate-kenburns scale-[1.08]" sizes="100vw" />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-r from-forest-dim via-forest-dim/80 to-forest-dim/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dim via-transparent to-transparent" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 pt-28 pb-10 md:pt-36 md:pb-16 grid lg:grid-cols-[1.08fr_0.92fr] gap-8 md:gap-10 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/15 px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <EditableText field="hero.badge" as="span" className="text-white/90 text-[0.68rem] tracking-[0.16em] uppercase font-medium">
                  {c.hero.badge}
                </EditableText>
                <span className="hidden sm:inline-flex ml-2 rounded-full bg-white text-forest-dim px-2.5 py-1 text-[0.62rem] tracking-wide font-semibold">
                  <EditableText field="hero.badgeChip" as="span">
                    {c.hero.badgeChip}
                  </EditableText>
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
               <h1 className="mt-6 font-display font-medium leading-[0.9] tracking-tightDisplay text-white text-balance text-5xl sm:text-6xl lg:text-[5.2rem]">
                <EditableText field="hero.titleLine1" as="span">
                  {c.hero.titleLine1}
                </EditableText>
                <span className="inline-flex items-center ml-3 align-middle">
                  <span className="inline-block w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 border-white/20 -rotate-6">
                    <EditableImage field="hero.circleImage" src={c.hero.circleImage} alt="Flora Decora garden detail" width={80} height={80} className="w-full h-full object-cover" />
                  </span>
                </span>
                <br />
                <EditableText field="hero.titleLine2" as="span" className="bg-gradient-to-r from-ochre-light to-amber-200 bg-clip-text text-transparent">{c.hero.titleLine2}</EditableText>
                <br />
                <EditableText field="hero.titleLine3" as="span">{c.hero.titleLine3}</EditableText>
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <EditableText field="hero.subtitle" as="p" className="mt-6 max-w-xl text-white/70 text-lg leading-relaxed text-balance">
                {c.hero.subtitle}
              </EditableText>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <MagneticButton href="/contact">{c.hero.primaryCta}</MagneticButton>
                <Button href="/projects" variant="ghost" size="md">
                  {c.hero.secondaryCta}
                </Button>
                <span className="hidden md:inline-flex items-center gap-2 text-white/50 text-xs ml-2">
                  <span className="w-8 h-px bg-white/20" />
                  <EditableText field="hero.trusted" as="span">
                    {c.hero.trusted}
                  </EditableText>
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
                <EditableText field="hero.rating" as="div" className="text-white font-medium">
                  {c.hero.rating}
                </EditableText>
                <EditableText field="hero.ratingBy" as="div" className="text-white/50">
                  {c.hero.ratingBy}
                </EditableText>
              </div>
             </Reveal>
           </div>
           {/* Mobile feature card — visible only on small screens */}
           <Reveal delay={0.2} className="mt-8 md:hidden">
             <div className="rounded-2xl overflow-hidden shadow-soft bg-white p-1.5">
               <div className="relative h-[180px] rounded-xl overflow-hidden">
                 <Image src={c.hero.featureImage} alt={c.hero.featureTitle} fill placeholder="blur" blurDataURL={BLUR_DATAURL} className="object-cover" sizes="(max-width: 768px) 100vw, 540px" quality={70} />
                 <div className="absolute bottom-0 left-0 right-0 p-3">
                   <div className="glass rounded-xl p-3 flex items-center justify-between">
                     <div>
                       <div className="text-[10px] tracking-[0.14em] uppercase text-ink/60">{c.hero.featureLabel}</div>
                       <div className="font-display text-sm leading-none mt-1">{c.hero.featureTitle}</div>
                     </div>
                     <span className="w-8 h-8 rounded-full bg-forest text-white grid place-items-center text-sm">↗</span>
                   </div>
                 </div>
               </div>
             </div>
           </Reveal>
           <Reveal delay={0.18} className="relative hidden md:block h-[420px] md:h-[480px] lg:h-[560px]">
            <div className="absolute top-6 right-6 left-6 bottom-6">
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.35)] bg-white p-2">
                <div className="relative w-full h-full rounded-[1.6rem] overflow-hidden">
                  <Image src={c.hero.featureImage} alt={c.hero.featureImageAlt} fill className="object-cover" sizes="540px" quality={75} />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="glass rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <EditableText field="hero.featureLabel" as="div" className="text-xs tracking-[0.14em] uppercase text-ink/60">
                          {c.hero.featureLabel}
                        </EditableText>
                        <EditableText field="hero.featureTitle" as="div" className="font-display text-lg leading-none mt-1">
                          {c.hero.featureTitle}
                        </EditableText>
                      </div>
                      <span className="w-10 h-10 rounded-full bg-forest text-white grid place-items-center">↗</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -left-6 bottom-10 w-[220px] rounded-2xl overflow-hidden shadow-soft bg-white p-1.5 hidden xl:block">
                <div className="relative h-[140px] rounded-xl overflow-hidden">
                  <Image src={c.hero.irrigationImage} alt="Irrigation system installation detail" fill className="object-cover" sizes="220px" quality={75} />
                </div>
                <div className="p-3">
                  <EditableText field="hero.irrigationTitle" as="div" className="text-xs font-semibold">
                    {c.hero.irrigationTitle}
                  </EditableText>
                  <EditableText field="hero.irrigationNote" as="div" className="text-[11px] text-ink/60">
                    {c.hero.irrigationNote}
                  </EditableText>
                </div>
              </div>
              <div className="absolute -right-2 top-14 glass-dark rounded-full px-4 py-3 flex items-center gap-3 shadow-soft">
                <span className="w-10 h-10 rounded-full bg-ochre grid place-items-center text-white">✓</span>
                <div className="pr-2">
                  <EditableText field="hero.statValue" as="div" className="text-white text-sm font-semibold leading-none">
                    {c.hero.statValue}
                  </EditableText>
                  <EditableText field="hero.statNote" as="div" className="text-white/60 text-xs">
                    {c.hero.statNote}
                  </EditableText>
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
                  {c.hero.marquee.map((m, j) => (
                    <span key={j} className="flex items-center gap-6">
                      <span>{m}</span>
                      {j < c.hero.marquee.length - 1 && <span className="w-1 h-1 rounded-full bg-ochre" />}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-cream dark:bg-forest-dim relative -mt-px">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-8">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {c.stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <HoverBloom className="rounded-[1.5rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 md:p-8 shadow-card hover:shadow-soft dark:hover:shadow-glow">
                  <div className="font-display text-4xl md:text-5xl font-medium tracking-tightDisplay text-ink dark:text-white">
                    <Counter value={s.n} suffix={s.suffix} />
                  </div>
                  <EditableText field={`stats.${i}.label`} as="div" className="mt-2 text-sm font-semibold text-ink dark:text-white">
                    {s.label}
                  </EditableText>
                  <EditableText field={`stats.${i}.sub`} as="div" className="text-xs text-ink/50 dark:text-white/50">
                    {s.sub}
                  </EditableText>
                </HoverBloom>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-cream dark:bg-forest-dim overflow-hidden border-y border-transparent dark:border-white/5">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start">
            <div>
              <SectionHeading field="about" eyebrow={c.about.eyebrow} title={c.about.title} withLine />
              <Stagger className="mt-8 grid grid-cols-3 gap-3">
                {c.about.features.map((f, i) => (
                  <StaggerItem key={i} className="rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4">
                    <div className="text-ochre text-xs tracking-widest">{f.k}</div>
                    <EditableText field={`about.features.${i}.v`} as="div" className="font-medium text-sm mt-1 dark:text-white">
                      {f.v}
                    </EditableText>
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal delay={0.12} className="mt-8 space-y-4 text-ink/70 dark:text-white/70 leading-relaxed">
                <EditableText field="about.p1" as="p">
                  {c.about.p1}
                </EditableText>
                <EditableText field="about.p2" as="p">
                  {c.about.p2}
                </EditableText>
              </Reveal>
              <Reveal delay={0.18} className="mt-8">
                <Button href="/about" variant="secondary" size="sm">
                  {c.about.cta} <span>→</span>
                </Button>
              </Reveal>
            </div>
            <Reveal className="relative lg:sticky lg:top-28">
              <HoverBloom className="relative rounded-[2rem] overflow-hidden bg-white dark:bg-white/5 p-2 shadow-soft hover:shadow-glow border border-black/5 dark:border-white/10">
                <Parallax offset={22} className="relative aspect-[4/3.2] rounded-[1.6rem] overflow-hidden">
                  <EditableImage field="about.image" src={c.about.image} alt={c.about.imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 560px" />
                  <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <EditableText field="about.liveChip" as="span">
                      {c.about.liveChip}
                    </EditableText>
                  </div>
                </Parallax>
                <div className="grid grid-cols-2 gap-3 p-3">
                  <div className="rounded-2xl bg-limestone dark:bg-white/10 p-4 hover-bloom">
                    <EditableText field="about.teamValue" as="div" className="text-2xl font-display font-medium">
                      {c.about.teamValue}
                    </EditableText>
                    <EditableText field="about.teamLabel" as="div" className="text-xs text-ink/60 dark:text-white/60">
                      {c.about.teamLabel}
                    </EditableText>
                  </div>
                  <div className="rounded-2xl bg-forest text-white p-4 hover-bloom">
                    <EditableText field="about.coverageLabel" as="div" className="text-xs uppercase tracking-[0.16em] opacity-70">
                      {c.about.coverageLabel}
                    </EditableText>
                    <EditableText field="about.coverageValue" as="div" className="font-medium mt-1">
                      {c.about.coverageValue}
                    </EditableText>
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
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-10 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading field="gallery" eyebrow={c.gallery.eyebrow} title={c.gallery.title} />
            <Button href="/projects" variant="outline" size="sm" className="hidden md:inline-flex">
              {c.gallery.cta}
            </Button>
          </div>
          <EditableText field="gallery.intro" as="p" className="mt-3 text-sm text-ink/60 dark:text-white/60 max-w-2xl">
            {c.gallery.intro}
          </EditableText>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {c.gallery.items.map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <HoverBloom className="group relative rounded-3xl overflow-hidden bg-ink aspect-[4/3] p-1.5">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-ink">
                    <ImageWithLandscapeSkeleton src={item.src} alt={item.title} aspectRatio="4/3" className="absolute inset-0" priority={i < 2} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-transparent group-hover:from-black/75 transition-colors" />
                    <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase font-medium">{c.gallery.badge}</div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3">
                      <div>
                        <EditableText field={`gallery.items.${i}.title`} as="div" className="text-white font-medium text-sm group-hover:translate-y-[-2px] transition-transform">
                          {item.title}
                        </EditableText>
                        <EditableText field={`gallery.items.${i}.meta`} as="div" className="text-white/70 text-xs">
                          {item.meta}
                        </EditableText>
                      </div>
                      <span className="w-9 h-9 rounded-full bg-white text-ink grid place-items-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-card">↗</span>
                    </div>
                  </div>
                </HoverBloom>
              </Reveal>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-3">
            {c.gallery.thumbs.map((src, i) => (
              <Reveal key={i} delay={0.3 + i * 0.04} className="relative aspect-square rounded-2xl overflow-hidden bg-cream dark:bg-white/5 border-2 border-black/[0.06] dark:border-white/10">
                <ImageWithLandscapeSkeleton src={src} alt="Flora Decora project thumbnail" aspectRatio="1/1" className="absolute inset-0" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MOCK PREVIEW — for client review */}
      <section className="bg-cream dark:bg-forest-dim border-y border-transparent dark:border-white/5">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
             <SectionHeading field="concepts" eyebrow={c.concepts.eyebrow} title={c.concepts.title} withLine />
             <span className="rounded-full bg-ochre/10 dark:bg-ochre/20 border border-ochre/20 px-4 py-2 text-xs font-medium text-ochre-dark dark:text-ochre-light">{c.concepts.badge}</span>
          </div>
          <EditableText field="concepts.intro" as="p" className="mt-3 text-sm text-ink/60 dark:text-white/60 max-w-2xl">
            {c.concepts.intro}
          </EditableText>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {c.concepts.items.map((m, i) => (
              <Reveal key={i} delay={i * 0.03} className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-white dark:bg-white/5 border-2 border-black/[0.06] dark:border-white/10 shadow-card hover:shadow-glow hover:border-ochre/20 dark:hover:border-ochre/30 transition-all">
                <ImageWithLandscapeSkeleton src={m.src} alt={m.label} aspectRatio="4/3" className="absolute inset-0" />
                <div className="absolute inset-0 ring-1 ring-black/5 dark:ring-white/5 rounded-3xl pointer-events-none" />
                <EditableText field={`concepts.items.${i}.label`} as="span" className="absolute top-3 left-3 rounded-full bg-white/90 dark:bg-forest/80 backdrop-blur border border-black/5 dark:border-white/10 px-3 py-1 text-[10px] tracking-[0.14em] uppercase font-semibold text-ink dark:text-white">
                  {m.label}
                </EditableText>
                <span className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-ochre text-white grid place-items-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">↗</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-cream dark:bg-forest-dim border-y border-transparent dark:border-white/5">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading field="services" eyebrow={c.services.eyebrow} title={c.services.title} withLine />
            <EditableText field="services.intro" as="p" className="max-w-md text-ink/60 dark:text-white/60 text-sm leading-relaxed">
              {c.services.intro}
            </EditableText>
          </div>
          <Stagger className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((s) => (
              <StaggerItem key={s.title} className="group">
                <HoverBloom className="relative rounded-3xl bg-white dark:bg-white/[0.06] border-2 border-black/[0.06] dark:border-white/10 p-6 sm:p-7 shadow-card hover:shadow-glow overflow-hidden h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl`} />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-ink dark:bg-white text-white dark:text-ink grid place-items-center text-sm group-hover:bg-ochre dark:group-hover:bg-ochre group-hover:text-white transition-colors group-hover:rotate-6 group-hover:scale-110 duration-500">{s.icon}</div>
                    <h3 className="mt-6 font-display text-[1.05rem] leading-tight font-medium text-ink dark:text-white">{s.title}</h3>
                    <p className="mt-1 text-xs text-ink/60 dark:text-white/60">{s.note}</p>
                    <div className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-ochre-dark dark:text-ochre-light opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                      {c.services.explore} <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-ochre/10 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 grid place-items-center text-ochre">✦</span>
                </HoverBloom>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-8 flex justify-center">
            <Button href="/services" variant="secondary" size="md">
              {c.services.cta}
            </Button>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white dark:bg-forest border-y border-black/5 dark:border-white/10">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-24">
          <SectionHeading field="process" eyebrow={c.process.eyebrow} title={c.process.title} withLine />
          <div className="mt-12 grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-6 left-0 right-0 h-[1.5px] bg-gradient-to-r from-ochre via-sage to-forest opacity-30" />
            {c.process.steps.map((step, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <HoverBloom className="relative rounded-3xl bg-cream dark:bg-white/[0.06] border-2 border-black/[0.06] dark:border-white/10 p-6 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-full ${step.color} text-white grid place-items-center text-xs font-mono group-hover:scale-110 transition-transform`}>{String(i + 1).padStart(2, "0")}</span>
                    <EditableText field={`process.steps.${i}.phase`} as="span" className="eyebrow text-ink/50 dark:text-white/50 !text-[0.62rem]">
                      {step.phase}
                    </EditableText>
                  </div>
                  <EditableText field={`process.steps.${i}.title`} as="h3" className="mt-5 font-display text-xl dark:text-white">
                    {step.title}
                  </EditableText>
                  <ul className="mt-4 space-y-3">
                    {step.points.map((p, j) => (
                      <li key={j} className="flex gap-3 text-sm text-ink/70 dark:text-white/70 leading-relaxed">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-ochre shrink-0 group-hover:scale-125 transition-transform" />
                        <EditableText field={`process.steps.${i}.points.${j}`} as="span">
                          {p}
                        </EditableText>
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
        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16 md:py-20">
          <div className="rounded-[2rem] bg-white/[0.06] backdrop-blur border border-white/10 p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <EditableText field="cta.chip" as="div" className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs text-white/80">
                {c.cta.chip}
              </EditableText>
              <EditableText field="cta.title" as="h2" className="mt-4 font-display text-3xl md:text-4xl font-medium text-white leading-tight">
                {c.cta.title}
              </EditableText>
              <EditableText field="cta.sub" as="p" className="mt-3 text-white/60">
                {c.cta.sub}
              </EditableText>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button href="/contact" variant="primary" size="lg">
                {c.cta.primary}
              </Button>
              <Button href="tel:+97137344243" variant="outline" size="lg">
                {c.cta.secondary}
              </Button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/40">
            {c.cta.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/10 px-3 py-1">{t}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
