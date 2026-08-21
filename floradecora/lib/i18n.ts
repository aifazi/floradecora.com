export type Locale = "en" | "ar";

export const dictionaries = {
  en: {
    nav: { about: "About", services: "Services", projects: "Projects", contact: "Contact", start: "Start a project" },
    hero: { badge: "Est. 2003 — Al Ain, UAE", title1: "We draw", title2: "the plan,", title3: "then we grow it.", cta: "View projects", clients: "Trusted by 150+ clients", rating: "Rated 4.9/5 by municipal clients" },
    footer: { tagline: "We draw the plan, then we grow it.", explore: "Explore", contact: "Contact", rights: "Crafted for the desert, built to last." },
    contact: { office: "Office", phone: "Phone", email: "Email", hours: "Hours" },
  },
  ar: {
    nav: { about: "من نحن", services: "الخدمات", projects: "المشاريع", contact: "اتصل بنا", start: "ابدأ مشروعًا" },
    hero: { badge: "تأسست 2003 — العين، الإمارات", title1: "نرسم", title2: "الخطة،", title3: "ثم نزرعها.", cta: "عرض المشاريع", clients: "موثوق من 150+ عميل", rating: "تقييم 4.9/5 من العملاء البلديين" },
    footer: { tagline: "نرسم الخطة ثم نزرعها.", explore: "استكشاف", contact: "اتصال", rights: "صُنع للصحراء، ليبقى." },
    contact: { office: "المكتب", phone: "الهاتف", email: "البريد", hours: "الساعات" },
  },
} as const;

export function t(locale: Locale, path: string): string {
  const parts = path.split(".");
  let cur: unknown = dictionaries[locale];
  for (const p of parts) cur = (cur as Record<string, unknown>)?.[p];
  return (cur as string) || path;
}
