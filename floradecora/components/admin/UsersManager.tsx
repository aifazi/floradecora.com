"use client";
import { useState } from "react";
import { Field, Input } from "./CrudModal";

export default function UsersManager({ me }: { me: { email: string; role: string } | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function create(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMsg("");
    const res = await fetch("/api/auth/seed", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) setMsg(`Created ${data.email}`); else setMsg(data.error || "Failed — need ADMIN_API_KEY header if users exist");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl">Users</h1>
      <p className="text-sm text-ink/60 dark:text-white/60 mt-1">Manage admin accounts — JWT + bcryptjs, R2 media, Prisma</p>

      <div className="mt-6 rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-6">
        <div className="text-sm font-medium">Current Admin</div>
        <div className="mt-2 p-4 rounded-xl bg-cream dark:bg-white/5 border border-black/5 dark:border-white/10">
          <div className="text-sm font-medium">{me?.email || "Not logged in"}</div>
          <div className="text-xs text-ink/50">{me?.role || "—"} • JWT access 15m / refresh 7d • httpOnly cookie</div>
        </div>
      </div>

      <div className="mt-6 rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-6">
        <h3 className="font-display">Create New Admin</h3>
        <p className="text-xs text-ink/50 mt-1">Uses <code className="bg-black/5 px-1 rounded">POST /api/auth/seed</code> — if users exist, requires <code className="bg-black/5 px-1 rounded">x-api-key: ADMIN_API_KEY</code> header. For local: use the seed above with api-key.</p>
        <form onSubmit={create} className="mt-4 space-y-4">
          <Field label="Email"><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="newadmin@floradecora.com" /></Field>
          <Field label="Password (min 8)"><Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} /></Field>
          <button disabled={loading} className="w-full rounded-full bg-ochre text-white py-3 font-semibold">{loading ? "Creating..." : "Create Admin"}</button>
        </form>
        {msg && <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-sm">{msg}</div>}
        <div className="mt-4 text-xs text-ink/50">All admin routes are <code className="bg-black/5 px-1 rounded">JwtOrApiKeyGuard</code> — JWT Bearer or <code className="bg-black/5 px-1 rounded">x-api-key</code> fallback. Change <code className="bg-black/5 px-1 rounded">JWT_SECRET</code> in prod.</div>
      </div>
    </div>
  );
}
