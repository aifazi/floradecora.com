"use client";
import { useState } from "react";
import { CrudModal, Field, Input, Textarea } from "./CrudModal";

type Setting = { id: string; key: string; value: unknown; updatedAt: string };

const presets: { key: string; label: string; hint: string; example: string }[] = [
  { key: "site.name", label: "Site Name", hint: "Header/logo", example: '"FloraDecora"' },
  { key: "site.tagline", label: "Tagline", hint: "Hero subtitle", example: '"We draw the plan, then we grow it."' },
  { key: "contact.phone", label: "Phone", hint: "Footer/contact", example: '"+971 3 734 4243"' },
  { key: "contact.email", label: "Email", hint: "Contact page", example: '"info@floradecora.com"' },
  { key: "contact.address", label: "Address", hint: "Footer", example: '"Office 106, Al Reef Bldg, Al Ain, UAE"' },
  { key: "seo.title", label: "SEO Title", hint: "Meta title", example: '"FloraDecora | Landscaping..."' },
  { key: "home.stats", label: "Home Stats", hint: "JSON array", example: '[{"n":20,"suffix":"+","label":"Years"}]' },
];

export default function SettingsManager({ initial }: { initial: Setting[] }) {
  const [items, setItems] = useState<Setting[]>(initial);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const res = await fetch("/api/settings");
    if (res.ok) setItems(await res.json());
  }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    let parsed: unknown;
    try { parsed = JSON.parse(value); } catch { parsed = value; }
    const res = await fetch(`/api/settings/${key}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ value: parsed }) });
    setLoading(false);
    if (res.ok) { setOpen(false); refresh(); } else alert("Failed");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="font-display text-2xl">Site Settings</h1><p className="text-sm text-ink/60">Key-value CMS — edit any content, site uses <code className="bg-black/5 px-1 rounded">GET /api/settings/:key</code></p></div>
        <button onClick={() => { setKey(""); setValue(""); setOpen(true); }} className="rounded-full bg-ochre text-white px-5 py-2.5 text-sm font-semibold">+ New Setting</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {presets.map((p) => (
          <button key={p.key} onClick={() => { setKey(p.key); setValue(p.example); setOpen(true); }} className="text-left rounded-2xl bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-4 hover:border-ochre/30">
            <div className="text-sm font-medium">{p.label} <span className="text-xs font-mono text-ink/40">{p.key}</span></div>
            <div className="text-xs text-ink/50">{p.hint}</div>
          </button>
        ))}
      </div>

      <div className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F6F0] dark:bg-white/5 text-xs"><tr><th className="text-left p-3">Key</th><th className="text-left p-3">Value</th><th className="text-left p-3">Updated</th><th className="text-right p-3">Actions</th></tr></thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t border-black/5 dark:border-white/5">
                <td className="p-3 font-mono text-xs font-medium">{s.key}</td>
                <td className="p-3 max-w-[400px] truncate text-xs">{JSON.stringify(s.value).slice(0, 120)}</td>
                <td className="p-3 text-xs">{new Date(s.updatedAt).toLocaleDateString()}</td>
                <td className="p-3 text-right flex justify-end gap-2">
                  <button onClick={() => { setKey(s.key); setValue(JSON.stringify(s.value, null, 2)); setOpen(true); }} className="px-3 py-1 rounded-full bg-cream dark:bg-white/10 text-xs">Edit</button>
                  <button onClick={async () => { if (!confirm("Delete?")) return; const res = await fetch(`/api/settings/${s.key}`, { method: "DELETE" }); if (res.ok) refresh(); }} className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-ink/50">No settings — create one from presets above</td></tr>}
          </tbody>
        </table>
      </div>

      <CrudModal open={open} onClose={() => setOpen(false)} title={key ? `Edit ${key}` : "New Setting"}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Key (a-z0-9._-)"><Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="site.name" required /></Field>
          <Field label="Value (JSON or string)"><Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={6} placeholder={'"FloraDecora" or {"n":20} or ["a","b"]'} required /></Field>
          <button disabled={loading} className="w-full rounded-full bg-ochre text-white py-3 font-semibold">{loading ? "Saving..." : "Save"}</button>
        </form>
      </CrudModal>
    </div>
  );
}
