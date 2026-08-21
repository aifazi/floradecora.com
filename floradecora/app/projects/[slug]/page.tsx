import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { PROJECTS, getProject } from "@/lib/projects";
import { cdnMedia } from "@/lib/cdn";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProject(params.slug);
  if (!p) return {};
  return {
    title: `${p.title} | Flora Decora`,
    description: p.description,
    openGraph: { images: [{ url: p.img }] },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) notFound();
  const related = PROJECTS.filter((x) => x.slug !== p.slug && x.type === p.type).slice(0, 3);

  return (
    <>
      <section className="relative min-h-[54vh] bg-forest-dim overflow-hidden flex items-end">
        <Image src={p.img} alt={p.title} fill className="object-cover opacity-40" sizes="100vw" priority quality={80} />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dim via-forest-dim/60 to-transparent" />
        <div className="relative mx-auto max-w-content w-full px-6 md:px-10 pt-32 pb-12 md:pt-44 md:pb-16">
          <Reveal>
            <Link href="/projects" className="inline-flex rounded-full bg-white/10 backdrop-blur border border-white/10 px-3 py-1 text-xs tracking-[0.14em] uppercase text-white/80">← Back to Projects</Link>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-4 font-display font-medium text-4xl md:text-5xl leading-[0.95] tracking-tightDisplay text-white max-w-3xl">{p.title}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white text-ink px-3 py-1 font-medium">{p.type}</span>
              <span className="rounded-full bg-white/10 backdrop-blur border border-white/15 text-white px-3 py-1">{p.year}</span>
              <span className="rounded-full bg-white/10 backdrop-blur border border-white/15 text-white px-3 py-1">{p.location}</span>
              <span className="rounded-full bg-white/10 backdrop-blur border border-white/15 text-white px-3 py-1">{p.area}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream dark:bg-forest-dim">
        <div className="mx-auto max-w-content px-6 md:px-10 py-12 md:py-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
          <Reveal>
            <p className="text-lg leading-relaxed text-ink/70 dark:text-white/70">{p.description}</p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {p.gallery.map((src) => (
                <div key={src} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream dark:bg-white/5 border border-black/5 dark:border-white/10">
                  <Image src={src} alt={p.title} fill className="object-cover" sizes="300px" quality={70} />
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08} className="space-y-4">
            <div className="rounded-[1.6rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 shadow-card">
              <div className="eyebrow text-ink/40 dark:text-white/40 mb-3">Project Facts</div>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-ink/50">Client</dt><dd className="font-medium dark:text-white">{p.client}</dd></div>
                <div className="flex justify-between"><dt className="text-ink/50">Year</dt><dd className="font-medium dark:text-white">{p.year}</dd></div>
                <div className="flex justify-between"><dt className="text-ink/50">Location</dt><dd className="font-medium dark:text-white">{p.location}</dd></div>
                <div className="flex justify-between"><dt className="text-ink/50">Area</dt><dd className="font-medium dark:text-white">{p.area}</dd></div>
              </dl>
              <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/10">
                <div className="eyebrow text-ink/40 dark:text-white/40 mb-2">Services</div>
                <div className="flex flex-wrap gap-2">{p.services.map((s) => <span key={s} className="rounded-full bg-cream dark:bg-white/10 px-3 py-1 text-xs">{s}</span>)}</div>
              </div>
            </div>
            <Link href="/contact" className="flex items-center justify-center gap-2 rounded-full bg-ink text-white py-4 text-sm font-medium hover:bg-forest transition-colors dark:bg-white dark:text-ink">Start a similar project →</Link>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-white dark:bg-forest border-t border-black/5 dark:border-white/10">
          <div className="mx-auto max-w-content px-6 md:px-10 py-12">
            <h3 className="font-display text-xl dark:text-white">Related projects</h3>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.slug} href={`/projects/${r.slug}`} className="group rounded-[1.6rem] bg-cream dark:bg-white/5 p-2 border border-black/5 dark:border-white/10">
                  <div className="relative aspect-[4/3] rounded-[1.2rem] overflow-hidden">
                    <Image src={r.img} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="380px" />
                  </div>
                  <div className="px-3 py-3 font-display text-sm dark:text-white">{r.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, image: p.img, description: p.description, author: { "@type": "Organization", name: "Flora Decora" } }) }} />
    </>
  );
}
