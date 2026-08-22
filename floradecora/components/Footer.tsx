import Image from "next/image";
import Link from "next/link";
import { CDN_ASSETS, BLUR_DATAURL } from "@/lib/cdn";

const FOOTER_LINKS = {
  explore: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Journal" },
    { href: "/quote", label: "Quote Estimator" },
    { href: "/contact", label: "Contact" },
  ],
  services: [
    { href: "/services", label: "Themed Gardens" },
    { href: "/services", label: "Landscaping Design" },
    { href: "/services", label: "Irrigation Systems" },
    { href: "/services", label: "Commercial Nurseries" },
    { href: "/services", label: "Pest Control" },
    { href: "/services", label: "Maintenance" },
  ],
};

const SOCIAL = [
  { label: "Instagram", href: "#", icon: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" },
  { label: "LinkedIn", href: "#", icon: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" },
  { label: "YouTube", href: "#", icon: "M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" },
];

export default function Footer() {
  return (
    <footer className="bg-forest-dim text-limestone relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-ochre/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-sage/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 pt-16 pb-8">
        <div className="grid lg:grid-cols-[1.2fr_1fr_1fr] gap-12 pb-12 border-b border-white/10">
          <div className="max-w-sm">
            <Image src={CDN_ASSETS.logo} alt="Flora Decora" width={180} height={48} placeholder="blur" blurDataURL={BLUR_DATAURL} className="h-8 sm:h-9 w-auto max-w-[160px] object-contain brightness-0 invert mb-6" />
            <p className="text-white/60 leading-relaxed text-sm">
              We draw the plan, then we grow it. Designing, building and operating themed gardens and public parks across the UAE since 2003. 300+ projects delivered.
            </p>
            <div className="mt-8 flex gap-3">
              {SOCIAL.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} className="w-9 h-9 rounded-full bg-white/10 border border-white/10 grid place-items-center hover:bg-ochre hover:border-ochre transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d={s.icon} /></svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="eyebrow text-white/40 mb-5">Explore</div>
            <ul className="space-y-3 text-sm">
              {FOOTER_LINKS.explore.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow text-white/40 mb-5">Services</div>
            <ul className="space-y-3 text-sm">
              {FOOTER_LINKS.services.map((l, i) => (
                <li key={l.label + i}>
                  <Link href={l.href} className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center text-xs text-white/40">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <p>© {new Date().getFullYear()} Flora Decora. Crafted for the desert, built to last.</p>
            <div className="flex gap-4">
              <span>Office 106, Al Reef Bldg, Al Ain, UAE</span>
              <a href="tel:+97137344243" className="hover:text-white transition-colors">+971 3 734 4243</a>
              <a href="mailto:info@floradecora.com" className="hover:text-white transition-colors">info@floradecora.com</a>
            </div>
          </div>
          <p className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for new projects
          </p>
        </div>
      </div>
    </footer>
  );
}
