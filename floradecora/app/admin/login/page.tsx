"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@floradecora.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 shadow-card space-y-6">
        <div>
          <h1 className="font-display text-2xl">Admin Login</h1>
          <p className="text-sm text-ink/60 dark:text-white/60 mt-1">FloraDecora dashboard — JWT secured</p>
        </div>
        <div>
          <label className="text-xs font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-ochre" />
        </div>
        <div>
          <label className="text-xs font-medium">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-1 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-ochre" />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-ochre text-white py-3 text-sm font-semibold hover:bg-ochre-light disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-xs text-ink/50 dark:text-white/50 text-center">Default: admin@floradecora.com / Admin123! — change after first login</p>
      </form>
    </div>
  );
}
