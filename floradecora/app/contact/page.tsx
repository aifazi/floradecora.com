import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { cdnMedia } from "@/lib/cdn";

export const metadata: Metadata = {
  title: "Contact | Flora Decora",
  description: "Get in touch with Flora Decora for landscaping and themed garden projects across the UAE.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative min-h-[42vh] bg-forest-dim overflow-hidden flex items-end">
        <Image src={cdnMedia("Picture4-min.png")} alt="Flora Decora landscape detail" fill unoptimized className="object-cover opacity-25" sizes="100vw" quality={75} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dim via-forest-dim/60 to-transparent" />
        <div className="relative mx-auto max-w-content w-full px-6 md:px-10 pt-32 pb-12 md:pt-44 md:pb-14">
          <Reveal><span className="inline-flex rounded-full bg-white/10 backdrop-blur border border-white/10 px-3 py-1 text-xs tracking-[0.14em] uppercase text-white/80">Contact — CDN</span></Reveal>
          <Reveal delay={0.06}><h1 className="mt-4 font-display font-medium text-4xl md:text-6xl leading-[0.95] tracking-tightDisplay text-white max-w-3xl">Tell us about the ground you&apos;re working with.</h1></Reveal>
        </div>
      </section>

      <section className="bg-cream dark:bg-forest-dim">
        <div className="mx-auto max-w-content px-6 md:px-10 py-12 md:py-20 grid lg:grid-cols-[0.9fr_1.2fr] gap-8">
          <Reveal className="space-y-6">
            <div className="rounded-[1.6rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-7 shadow-card dark:shadow-glow">
              <div className="space-y-8">
                <div>
                  <div className="eyebrow text-ink/40 dark:text-white/40 mb-2">Office</div>
                  <p className="text-ink dark:text-white leading-relaxed">Office 106, Al Reef Building,<br />Asharij, Al Ain, UAE</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="eyebrow text-ink/40 dark:text-white/40 mb-2">Phone</div>
                    <a href="tel:+97137344243" className="font-medium hover:text-ochre-dark dark:text-white">+971 3 734 4243</a>
                  </div>
                  <div>
                    <div className="eyebrow text-ink/40 dark:text-white/40 mb-2">Email</div>
                    <a href="mailto:info@floradecora.com" className="font-medium hover:text-ochre-dark dark:text-white">info@floradecora.com</a>
                  </div>
                </div>
                <div>
                  <div className="eyebrow text-ink/40 dark:text-white/40 mb-2">Hours</div>
                  <p className="text-ink/70 dark:text-white/70 text-sm">Sunday — Thursday, 8:00 AM — 5:00 PM<br />Site visits within 72h</p>
                </div>
              </div>
              <div className="mt-8 rounded-2xl bg-forest text-white p-5 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-ochre grid place-items-center">◐</span>
                <div>
                  <div className="text-sm font-medium">Avg. reply — 4 hours</div>
                  <div className="text-xs text-white/60">We&apos;ll scope your project in 24h</div>
                </div>
              </div>
            </div>
            <div className="rounded-[1.6rem] overflow-hidden h-[220px] relative bg-ink">
              <Image src={cdnMedia("Picture2-min-scaled.jpg")} alt="Flora Decora office location Al Ain" fill unoptimized className="object-cover opacity-60" sizes="400px" quality={70} />
              <div className="absolute inset-0 grid place-items-center">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-medium shadow">📍 Al Ain, UAE — via CDN</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="rounded-[1.6rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 md:p-8 shadow-soft">
            <h2 className="font-display text-xl mb-6 dark:text-white">Send an inquiry</h2>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
