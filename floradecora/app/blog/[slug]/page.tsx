import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { POSTS, getPost } from "@/lib/blog";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPost(params.slug); if (!p) return {}; return { title: `${p.title} | Flora Decora`, description: p.excerpt };
}
export default function PostPage({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug); if (!p) notFound();
  return (
    <>
      <section className="bg-cream dark:bg-forest-dim">
        <div className="mx-auto max-w-content px-6 md:px-10 pt-32 pb-8 md:pt-44">
          <Reveal><Link href="/blog" className="text-xs tracking-[0.14em] uppercase text-ochre">← Back to journal</Link></Reveal>
          <Reveal delay={0.06}><h1 className="mt-3 font-display text-3xl md:text-5xl leading-tight max-w-3xl dark:text-white">{p.title}</h1></Reveal>
          <Reveal delay={0.1}><div className="mt-3 text-sm text-ink/50 dark:text-white/50">{p.date} • {p.read} • {p.tags.join(", ")}</div></Reveal>
        </div>
      </section>
      <section className="bg-white dark:bg-forest border-y border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-content px-6 md:px-10 py-12 md:py-16 max-w-3xl space-y-6 text-ink/70 dark:text-white/70 leading-relaxed">
          {p.content.map((para, i) => <Reveal key={i} delay={i * 0.06}><p>{para}</p></Reveal>)}
          <Reveal><Link href="/contact" className="inline-flex rounded-full bg-ink text-white px-6 py-3 text-sm mt-4 dark:bg-white dark:text-ink">Discuss your garden →</Link></Reveal>
        </div>
      </section>
    </>
  );
}
