"use client";
import { useState, FormEvent } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus("error"); return; }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      const j = await res.json();
      setStatus(j.success ? "done" : "error");
      if (j.success) setEmail("");
    } catch { setStatus("error"); }
  }
  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required className="flex-1 rounded-full bg-white/10 backdrop-blur border border-white/15 px-6 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-ochre" />
      <button type="submit" disabled={status === "loading"} className="rounded-full bg-ochre text-white px-8 py-3 text-sm font-semibold hover:bg-ochre-light transition-colors disabled:opacity-60">{status === "loading" ? "..." : status === "done" ? "✓ Subscribed" : "Subscribe"}</button>
      {status === "error" && <span className="text-xs text-amber-200">Check email & try again.</span>}
    </form>
  );
}
