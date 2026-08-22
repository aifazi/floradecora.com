"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Button from "@/components/Button";

const SERVICES = [
  { id: "themed", label: "Themed / Butterfly Garden", rate: 180 },
  { id: "park", label: "Public Park", rate: 95 },
  { id: "irrigation", label: "Irrigation System", rate: 45 },
  { id: "nursery", label: "Nursery Supply", rate: 30 },
  { id: "maintenance", label: "O&M (monthly)", rate: 12 },
] as const;

export default function QuoteEstimator() {
  const [service, setService] = useState<string>("park");
  const [area, setArea] = useState(1000);
  const [complexity, setComplexity] = useState<"standard" | "premium">("standard");

  const estimate = useMemo(() => {
    const s = SERVICES.find((x) => x.id === service)!;
    const mult = complexity === "premium" ? 1.35 : 1;
    const low = Math.round(area * s.rate * mult * 0.9);
    const high = Math.round(area * s.rate * mult * 1.15);
    return { low, high, perM2: s.rate };
  }, [service, area, complexity]);

  return (
    <div className="rounded-[1.6rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 md:p-8 shadow-soft">
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="eyebrow text-ink/50 dark:text-white/60 block mb-2">Service</label>
          <select value={service} onChange={(e) => setService(e.target.value)} className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm">
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.label} — AED {s.rate}/m²</option>)}
          </select>
        </div>
        <div>
          <label className="eyebrow text-ink/50 dark:text-white/60 block mb-2">Area: {area.toLocaleString()} m²</label>
          <input type="range" min={100} max={20000} step={100} value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full accent-ochre" />
          <div className="flex justify-between text-xs text-ink/40">100 m² <span>20,000 m²</span></div>
        </div>
        <div>
          <label className="eyebrow text-ink/50 dark:text-white/60 block mb-2">Finish</label>
          <div className="flex gap-2">
            {(["standard", "premium"] as const).map((c) => (
              <button key={c} onClick={() => setComplexity(c)} className={`flex-1 rounded-full px-4 py-3 text-sm font-medium border capitalize ${complexity === c ? "bg-ink text-white border-ink dark:bg-white dark:text-ink" : "bg-white dark:bg-white/5 border-black/10"}`}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-forest text-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.14em] uppercase opacity-60">Estimated range</div>
          <div className="font-display text-3xl mt-1">AED {estimate.low.toLocaleString()} — {estimate.high.toLocaleString()}</div>
          <div className="text-xs opacity-60 mt-1">~ AED {estimate.perM2}/m² × {area.toLocaleString()} m² ({complexity}) — indicative only</div>
        </div>
        <Button href={`/contact?quote=${encodeURIComponent(`${service} ${area}m²`)}`} variant="primary" size="md">
          Request exact quote →
        </Button>
      </div>
      <p className="mt-3 text-xs text-ink/40 dark:text-white/40">Estimates exclude VAT, soil works & imported specimens. Site visit within 72h for firm price.</p>
    </div>
  );
}
