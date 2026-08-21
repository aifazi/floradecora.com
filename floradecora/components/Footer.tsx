import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest-dim text-limestone relative overflow-hidden">
      {/* subtle gradient orb */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-ochre/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-sage/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-content px-6 md:px-10 pt-16 pb-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 pb-12 border-b border-white/10">
          <div className="max-w-sm">
            <Image src="/logo-alt.png" alt="Flora Decora" width={180} height={48} className="h-8 w-auto object-contain brightness-0 invert mb-6" />
            <p className="text-white/60 leading-relaxed text-sm">
              We draw the plan, then we grow it. Designing, building and operating themed gardens and public parks across the UAE since 2003.
            </p>
            <div className="mt-8 flex gap-3">
              {["IG", "LI", "YT"].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-full bg-white/10 border border-white/10 grid place-items-center text-xs hover:bg-white hover:text-forest-dim transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 md:gap-20">
            <div>
              <div className="eyebrow text-white/40 mb-5">Explore</div>
              <ul className="space-y-3 text-sm">
                {[
                  ["/about", "About"],
                  ["/services", "Services"],
                  ["/projects", "Projects"],
                  ["/contact", "Contact"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="eyebrow text-white/40 mb-5">Contact</div>
              <ul className="space-y-3 text-sm text-white/70">
                <li>Office 106, Al Reef Bldg.<br />Asharij, Al Ain, UAE</li>
                <li><a href="tel:+97137344243" className="hover:text-white transition-colors">+971 3 734 4243</a></li>
                <li><a href="mailto:info@floradecora.com" className="hover:text-white transition-colors">info@floradecora.com</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row gap-3 justify-between items-center text-xs text-white/40">
          <p>© {new Date().getFullYear()} Flora Decora. Crafted for the desert, built to last.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for new projects
          </p>
        </div>
      </div>
    </footer>
  );
}
