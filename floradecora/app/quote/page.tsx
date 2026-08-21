import type { Metadata } from "next";
import QuoteEstimator from "@/components/QuoteEstimator";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Quote Estimator | Flora Decora",
  description: "Instant estimate for landscaping, themed gardens, irrigation and maintenance across the UAE. Get a firm price within 72h.",
};

export default function QuotePage() {
  return (
    <>
      <section className="relative bg-forest-dim overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-dim to-black" />
        <div className="relative mx-auto max-w-content 2xl:max-w-content-2xl px-4 sm:px-6 md:px-10 lg:px-12 xl:px-10 2xl:px-8 pt-32 pb-14 md:pt-44 md:pb-20">
          <Reveal><span className="inline-flex rounded-full bg-white/10 backdrop-blur border border-white/10 px-3 py-1 text-xs tracking-[0.14em] uppercase text-white/80">Instant Estimator</span></Reveal>
          <Reveal delay={0.06}><h1 className="mt-4 font-display font-medium text-4xl md:text-6xl leading-[0.95] tracking-tightDisplay text-white max-w-3xl">What will it cost to grow your plan?</h1></Reveal>
          <Reveal delay={0.1}><p className="mt-4 max-w-xl text-white/60 leading-relaxed">Move the sliders — get an indicative range in AED. Firm quote after site visit.</p></Reveal>
        </div>
      </section>
      <section className="bg-cream dark:bg-forest-dim">
        <div className="mx-auto max-w-content 2xl:max-w-content-2xl px-4 sm:px-6 md:px-10 lg:px-12 xl:px-10 2xl:px-8 py-12 md:py-16">
          <SectionHeading eyebrow="Calculator" title="Select service and area." withLine />
          <Reveal delay={0.08} className="mt-8">
            <QuoteEstimator />
          </Reveal>
        </div>
      </section>
    </>
  );
}
