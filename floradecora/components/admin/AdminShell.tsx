"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AdminLogout from "@/components/AdminLogout";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "▦", exact: true },
  { href: "/admin/projects", label: "Projects", icon: "◈" },
  { href: "/admin/pages", label: "Pages", icon: "▤" },
  { href: "/admin/blog", label: "Blog", icon: "✎" },
  { href: "/admin/services", label: "Services", icon: "⬢" },
  { href: "/admin/contacts", label: "Inquiries", icon: "✉" },
  { href: "/admin/newsletters", label: "Subscribers", icon: "◎" },
  { href: "/admin/media", label: "Media", icon: "▣" },
  { href: "/admin/emails", label: "Emails", icon: "✉" },
  { href: "/admin/cdn", label: "CDN", icon: "☁" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
  { href: "/admin/users", label: "Users", icon: "◐" },
];

export default function AdminShell({ children, user }: { children: React.ReactNode; user: { email: string; role: string } | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // hide shell on login
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#F8F6F0] dark:bg-[#0F1B14] flex">
      {/* Mobile overlay */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 z-30 lg:hidden" />}
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-[280px] bg-[#12160F] dark:bg-black text-white flex flex-col transition-transform ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-[64px] flex items-center gap-3 px-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-xl bg-ochre grid place-items-center text-sm font-bold">F</div>
          <div>
            <div className="font-display font-medium leading-none">FloraDecora</div>
            <div className="text-[10px] tracking-[0.14em] uppercase text-white/50">Admin • Pro</div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.href : pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? "bg-white text-[#12160F] font-medium" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                <span className={`w-8 h-8 rounded-lg grid place-items-center text-xs ${active ? "bg-ochre text-white" : "bg-white/10"}`}>{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ochre grid place-items-center text-xs font-bold">{user?.email?.[0]?.toUpperCase() || "A"}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.email || "Admin"}</div>
              <div className="text-xs text-white/50 capitalize">{user?.role || "admin"} • JWT</div>
            </div>
          </div>
          <div className="mt-3">
            <AdminLogout />
          </div>
          <div className="mt-3 text-[10px] text-white/30 text-center">v2.0 • {new Date().getFullYear()} FloraDecora</div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[64px] bg-white/80 dark:bg-[#16261C]/80 backdrop-blur border-b border-black/5 dark:border-white/10 flex items-center gap-3 px-4 lg:px-8 sticky top-0 z-20">
          <button onClick={() => setOpen(!open)} className="lg:hidden w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 grid place-items-center">☰</button>
          <div className="flex-1 flex items-center gap-3">
            <div className="hidden lg:block">
              <div className="text-xs tracking-[0.14em] uppercase text-ink/40 dark:text-white/40">FloraDecora CMS • Pro</div>
              <div className="font-display font-medium -mt-1 text-sm">All content editable — projects, blog, pages, services, media, emails, cdn</div>
            </div>
            <div className="hidden md:flex items-center gap-2 ml-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40">⌕</span>
                <input placeholder="Search projects, posts, inquiries..." className="w-full rounded-full bg-[#F8F6F0] dark:bg-white/5 border border-black/5 dark:border-white/10 pl-9 pr-4 py-2 text-xs outline-none focus:border-ochre" onKeyDown={(e) => { if (e.key === "Enter") { const v = (e.target as HTMLInputElement).value; if (v) window.location.href = `/admin/projects`; } }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/contacts" className="relative w-9 h-9 rounded-full bg-white dark:bg-white/10 border border-black/5 dark:border-white/10 grid place-items-center hover:bg-ochre hover:text-white transition-colors" title="New inquiries">
              ✉<span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse" />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 text-xs text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live • Visual
            </span>
            <Link href="/" target="_blank" className="hidden sm:inline-flex rounded-full bg-ochre text-white px-4 py-2 text-xs font-semibold hover:bg-ochre-light shadow-sm">View site ↗</Link>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 bg-[#F8F6F0] dark:bg-[#0F1B14]">{children}</main>
      </div>
    </div>
  );
}
