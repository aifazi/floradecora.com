import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { InquiriesBar, ProjectsPie, EmailDonut, SubscribersArea } from "@/components/admin/DashboardCharts";

async function fetchWithAuth(path: string) {
  const cookieHeader = cookies().toString();
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend.replace(/\/$/, "")}${path}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) return [];
  return res.json();
}

function last7Days(contacts: { createdAt: string }[]) {
  const map = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(5, 10);
    map.set(key, 0);
  }
  for (const c of contacts) {
    const key = new Date(c.createdAt).toISOString().slice(5, 10);
    if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
}

function byType(projects: { type: string }[]) {
  const m = new Map<string, number>();
  for (const p of projects) m.set(p.type, (m.get(p.type) || 0) + 1);
  return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
}

export default async function AdminDashboard() {
  const cookieHeader = cookies().toString();
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const meRes = await fetch(`${backend}/api/auth/me`, { headers: { cookie: cookieHeader }, cache: "no-store" });
  if (!meRes.ok) redirect("/admin/login");
  const me = await meRes.json();

  const [contacts, newsletters, projects, posts, services, media, emailLogs, emailQueue] = await Promise.all([
    fetchWithAuth("/api/contact").catch(() => []),
    fetchWithAuth("/api/newsletter").catch(() => []),
    fetchWithAuth("/api/projects").catch(() => []),
    fetchWithAuth("/api/posts?all=true").catch(() => []),
    fetchWithAuth("/api/services?all=true").catch(() => []),
    fetchWithAuth("/api/media").catch(() => []),
    fetchWithAuth("/api/email/logs").catch(() => []),
    fetchWithAuth("/api/email/queue").catch(() => []),
  ]);

  const inquiriesTrend = last7Days(Array.isArray(contacts) ? contacts : []);
  const projectsByType = byType(Array.isArray(projects) ? projects : []);
  const emailByStatus = (() => {
    const logs = Array.isArray(emailLogs) ? emailLogs : [];
    const q = Array.isArray(emailQueue) ? emailQueue : [];
    const all = [...logs, ...q];
    const m = new Map<string, number>();
    for (const e of all) m.set(e.status, (m.get(e.status) || 0) + 1);
    if (m.size === 0) return [{ name: "sent", value: 1 }];
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  })();
  const subsTrend = (() => {
    const list = Array.isArray(newsletters) ? newsletters : [];
    const map = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(5, 10);
      map.set(k, 0);
    }
    for (const n of list) {
      const k = new Date(n.createdAt).toISOString().slice(5, 10);
      if (map.has(k)) map.set(k, (map.get(k) || 0) + 1);
    }
    let cum = 0;
    return Array.from(map.entries()).map(([date, c]) => { cum += c; return { date, count: cum }; });
  })();

  const stats = [
    { label: "Inquiries", value: Array.isArray(contacts) ? contacts.length : 0, sub: "last 30d", href: "/admin/contacts", color: "bg-ochre", icon: "✉", trend: "+12%" },
    { label: "Projects", value: Array.isArray(projects) ? projects.length : 0, sub: `${Array.isArray(projects) ? projects.filter((p: { featured: boolean }) => p.featured).length : 0} featured`, href: "/admin/projects", color: "bg-forest", icon: "◈", trend: "+3" },
    { label: "Blog Posts", value: Array.isArray(posts) ? posts.length : 0, sub: `${Array.isArray(posts) ? posts.filter((p: { published: boolean }) => p.published).length : 0} published`, href: "/admin/blog", color: "bg-sage", icon: "✎", trend: "—" },
    { label: "Services", value: Array.isArray(services) ? services.length : 0, sub: `${Array.isArray(services) ? services.filter((s: { enabled: boolean }) => s.enabled).length : 0} active`, href: "/admin/services", color: "bg-ink", icon: "⬢", trend: "9/9" },
    { label: "Subscribers", value: Array.isArray(newsletters) ? newsletters.length : 0, sub: "newsletter", href: "/admin/newsletters", color: "bg-amber-600", icon: "◎", trend: "+5" },
    { label: "Media", value: Array.isArray(media) ? media.length : 0, sub: "assets", href: "/admin/media", color: "bg-stone-600", icon: "▣", trend: `${Array.isArray(media) ? media.length : 0}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl leading-none">Good morning, {me.email.split("@")[0]} 👋</h1>
          <p className="text-sm text-ink/60 dark:text-white/60 mt-2">Visual CMS — every pixel editable. Oh, and your site is live.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/projects" className="rounded-full bg-ochre text-white px-5 py-2.5 text-sm font-semibold hover:bg-ochre-light">+ New Project</Link>
          <Link href="/admin/blog" className="rounded-full bg-white dark:bg-white/10 border border-black/5 dark:border-white/10 px-5 py-2.5 text-sm font-medium">+ New Post</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-5 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 rounded-xl ${s.color} text-white grid place-items-center text-sm group-hover:scale-110 transition-transform`}>{s.icon}</div>
              <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-ochre/10 text-ochre">{s.trend}</span>
            </div>
            <div className="mt-4 text-2xl font-display font-medium">{s.value}</div>
            <div className="text-sm font-medium -mt-1">{s.label}</div>
            <div className="text-xs text-ink/50 dark:text-white/50">{s.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-medium">Inquiries — Last 7 days</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-ochre/10 text-ochre">Bar</span>
          </div>
          <div className="mt-4">
            <InquiriesBar data={inquiriesTrend} />
          </div>
          <div className="mt-2 text-xs text-ink/50">Total {Array.isArray(contacts) ? contacts.length : 0} • <Link href="/admin/contacts" className="text-ochre underline">Manage</Link></div>
        </div>

        <div className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-6 shadow-card">
          <h3 className="font-display font-medium">Projects by Type</h3>
          <div className="mt-2">
            <ProjectsPie data={projectsByType.length ? projectsByType : [{ name: "Photo", value: 1 }]} />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {projectsByType.map((p) => (
              <span key={p.name} className="text-xs px-2 py-1 rounded-full bg-cream dark:bg-white/10">{p.name} {p.value}</span>
            ))}
          </div>
        </div>

        <div className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-6 shadow-card">
          <h3 className="font-display font-medium">Email Gateway</h3>
          <EmailDonut data={emailByStatus} />
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div><div className="font-medium">Queue</div><div className="text-ink/50">{Array.isArray(emailQueue) ? emailQueue.filter((q: { status: string }) => q.status !== "sent").length : 0}</div></div>
            <div><div className="font-medium">Sent</div><div className="text-ink/50">{Array.isArray(emailLogs) ? emailLogs.filter((l: { status: string }) => l.status === "sent").length : 0}</div></div>
            <div><div className="font-medium">Failed</div><div className="text-ink/50">{Array.isArray(emailLogs) ? emailLogs.filter((l: { status: string }) => l.status === "failed").length : 0}</div></div>
          </div>
          <Link href="/admin/emails" className="mt-3 block text-center text-xs text-ochre underline">Monitor →</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Recent Inquiries</h2>
            <Link href="/admin/contacts" className="text-xs text-ochre hover:underline">View all →</Link>
          </div>
          <div className="mt-4 rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F6F0] dark:bg-white/5 text-xs">
                <tr><th className="text-left p-3 font-medium">Name</th><th className="text-left p-3 font-medium">Email</th><th className="text-left p-3 font-medium">Status</th><th className="text-left p-3 font-medium">Date</th></tr>
              </thead>
              <tbody>
                {(Array.isArray(contacts) ? contacts.slice(0, 5) : []).map((c: { id: string; name: string; email: string; status: string; createdAt: string }) => (
                  <tr key={c.id} className="border-t border-black/5 dark:border-white/5 hover:bg-black/[0.02]">
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3 text-ink/60 truncate max-w-[180px]">{c.email}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${c.status === "new" ? "bg-amber-100 text-amber-700" : c.status === "won" ? "bg-emerald-100 text-emerald-700" : c.status === "contacted" ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"}`}>{c.status}</span></td>
                    <td className="p-3 text-ink/50 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {(!contacts || contacts.length === 0) && <tr><td colSpan={4} className="p-8 text-center text-ink/50">No inquiries yet — share your contact form</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-xl bg-cream dark:bg-white/5 p-4">
            <div className="text-xs font-medium">Subscribers growth</div>
            <SubscribersArea data={subsTrend} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-6 shadow-card">
            <h3 className="font-display">Quick Actions</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href="/admin/projects" className="rounded-2xl bg-cream dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 hover:bg-white transition-colors">
                <div className="text-lg">◈</div><div className="text-sm font-medium mt-1">Add Project</div><div className="text-xs text-ink/50">Showcase work</div>
              </Link>
              <Link href="/admin/blog" className="rounded-2xl bg-cream dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 hover:bg-white transition-colors">
                <div className="text-lg">✎</div><div className="text-sm font-medium mt-1">Write Post</div><div className="text-xs text-ink/50">Share story</div>
              </Link>
              <Link href="/admin/media" className="rounded-2xl bg-cream dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 hover:bg-white transition-colors">
                <div className="text-lg">▣</div><div className="text-sm font-medium mt-1">Upload Media</div><div className="text-xs text-ink/50">Images to CDN</div>
              </Link>
              <Link href="/admin/settings" className="rounded-2xl bg-cream dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 hover:bg-white transition-colors">
                <div className="text-lg">⚙</div><div className="text-sm font-medium mt-1">Site Settings</div><div className="text-xs text-ink/50">SEO & contact</div>
              </Link>
            </div>
          </div>

          <div className="rounded-[1.6rem] bg-forest text-white p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-ochre/20 rounded-full blur-2xl" />
            <h3 className="font-display text-lg relative">All Visual — All Editable</h3>
            <p className="text-sm text-white/70 mt-2 relative">Projects, blog, services, media, settings, emails, CDN — every pixel from admin. ISR 60s, JWT, Prisma.</p>
            <div className="mt-4 flex gap-2 relative">
              <span className="text-xs bg-white/10 border border-white/10 rounded-full px-3 py-1">Recharts</span>
              <span className="text-xs bg-white/10 border border-white/10 rounded-full px-3 py-1">Pro UI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
