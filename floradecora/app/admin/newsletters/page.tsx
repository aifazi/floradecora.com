import { cookies } from "next/headers";

async function getNewsletters() {
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend}/api/newsletter`, { headers: { cookie: cookies().toString() }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminNewsletters() {
  const newsletters = await getNewsletters();
  return (
    <div>
      <div className="flex justify-between items-center">
        <div><h1 className="font-display text-2xl">Subscribers</h1><p className="text-sm text-ink/60">Newsletter emails — export or delete</p></div>
        <a href="/api/newsletter" download className="hidden">Export</a>
      </div>
      <div className="mt-6 rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F6F0] dark:bg-white/5 text-xs"><tr><th className="text-left p-3">Email</th><th className="text-left p-3">IP</th><th className="text-left p-3">Date</th><th className="text-right p-3">Actions</th></tr></thead>
          <tbody>
            {(newsletters as { id: string; email: string; ip?: string; createdAt: string }[]).map((n) => (
              <tr key={n.id} className="border-t border-black/5 dark:border-white/5">
                <td className="p-3 font-medium">{n.email}</td><td className="p-3 text-ink/50 text-xs">{n.ip || "—"}</td><td className="p-3 text-xs">{new Date(n.createdAt).toLocaleDateString()}</td><td className="p-3 text-right text-xs text-ink/50">DELETE /api/newsletter/{n.id}</td>
              </tr>
            ))}
            {newsletters.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-ink/50">No subscribers</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-ink/50">Total: {newsletters.length} • Use <code className="bg-black/5 px-1 rounded">GET /api/newsletter</code> with JWT</div>
    </div>
  );
}
