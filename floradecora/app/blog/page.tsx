import Link from "next/link";
import type { Metadata } from "next";
import { POSTS } from "@/lib/blog";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import Newsletter from "@/components/Newsletter";

export const metadata: Metadata = { title: "Blog | Flora Decora", description: "Gardening insights, irrigation and park operations from Al Ain, UAE.", alternates: { canonical: "/blog" } };

export default function BlogPage() {
  return (
    <>
      <section className="relative bg-forest-dim overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-dim to-black" />
        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 pt-32 pb-14 md:pt-44 md:pb-20">
          <Reveal><span className="inline-flex rounded-full bg-white/10 backdrop-blur border border-white/10 px-3 py-1 text-xs tracking-[0.14em] uppercase text-white/80">Journal</span></Reveal>
          <Reveal delay={0.06}><h1 className="mt-4 font-display font-medium text-4xl md:text-6xl leading-[0.95] tracking-tightDisplay text-white max-w-3xl">What we learn in 45°C shade.</h1></Reveal>
        </div>
      </section>
      <section className="bg-cream dark:bg-forest-dim">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-12 md:py-16">
          <SectionHeading eyebrow="Latest" title="From nursery to park." withLine />
          <Stagger className="mt-8 grid md:grid-cols-3 gap-4">
            {POSTS.map((p) => (
              <StaggerItem key={p.slug} className="rounded-3xl bg-white dark:bg-white/[0.06] border-2 border-black/[0.06] dark:border-white/10 p-6 sm:p-7 shadow-card hover:shadow-glow transition-shadow">
                <div className="text-xs tracking-[0.14em] uppercase text-ochre">{p.tags.join(" • ")} • {p.read}</div>
                <h3 className="mt-2 font-display text-lg dark:text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-ink/60 dark:text-white/60">{p.excerpt}</p>
                <Link href={`/blog/${p.slug}`} className="mt-4 inline-flex text-xs text-ochre-dark dark:text-ochre-light gap-1 hover:gap-2 transition-all">Read →</Link>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-12 rounded-2xl bg-gradient-to-br from-forest via-forest-dim to-forest-light text-white p-6 md:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-ochre/15 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs text-white/80 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Monthly newsletter
                </div>
                <div className="font-display text-2xl md:text-3xl">Get monthly garden notes</div>
                <div className="text-sm opacity-60 mt-1">Irrigation tips, plant palettes, project before/afters. No spam — unsubscribe anytime.</div>
              </div>
              <Newsletter />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
