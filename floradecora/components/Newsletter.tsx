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
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const url = apiBase ? `${apiBase.replace(/\/$/, "")}/newsletter` : "/api/newsletter";
      const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      const j = await res.json();
      setStatus(j.success ? "done" : "error");
      if (j.success) setEmail("");
    } catch (_e) { setStatus("error"); }
  }
  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <div className="relative flex-1 md:min-w-[280px]">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full rounded-full bg-white/10 backdrop-blur border border-white/15 pl-5 pr-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-ochre focus:ring-2 focus:ring-ochre/20 transition-all" />
      </div>
      <button type="submit" disabled={status === "loading" || status === "done"} className="rounded-full bg-ochre text-white px-8 py-3 text-sm font-semibold hover:bg-ochre-light transition-colors disabled:opacity-60 shrink-0">
        {status === "loading" ? (
          <span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</span>
        ) : status === "done" ? (
          <span className="inline-flex items-center gap-1">✓ Subscribed</span>
        ) : (
          "Subscribe"
        )}
      </button>
      {status === "error" && <span className="text-xs text-amber-200">Check email & try again.</span>}
    </form>
  );
}
