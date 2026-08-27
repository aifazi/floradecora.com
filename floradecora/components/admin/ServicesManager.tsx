"use client";
import { useState } from "react";
import { CrudModal, Field, Input, Textarea } from "./CrudModal";

type Svc = { id: string; slug: string; title: string; body: string; icon: string; accent?: string; order: number; enabled: boolean };
const empty: Svc = { id: "", slug: "", title: "", body: "", icon: "⬢", accent: "", order: 0, enabled: true };

export default function ServicesManager({ initial }: { initial: Svc[] }) {
  const [items, setItems] = useState<Svc[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Svc | null>(null);
  const [form, setForm] = useState<Svc>(empty);
  const [loading, setLoading] = useState(false);
  async function refresh() { const res = await fetch("/api/services?all=true"); if (res.ok) setItems(await res.json()); }
  function startCreate() { setForm(empty); setEditing(null); setOpen(true); }
  function startEdit(s: Svc) { setForm(s); setEditing(s); setOpen(true); }
  async function submit(e: React.FormEvent) { e.preventDefault(); setLoading(true); const method = editing ? "PUT" : "POST"; const url = editing ? `/api/services/${editing.id}` : "/api/services"; const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(form) }); setLoading(false); if (res.ok) { setOpen(false); refresh(); } else alert("Failed"); }
  async function del(id: string) { if (!confirm("Delete?")) return; const res = await fetch(`/api/services/${id}`, { method: "DELETE" }); if (res.ok) refresh(); }

  const enabled = items.filter((s) => s.enabled).length;
  return (
    <div>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div><h1 className="font-display text-2xl">Services — Visual</h1><p className="text-sm text-ink/60 dark:text-white/60">9 disciplines • {enabled} active • drag order, toggle enabled</p></div>
        <button onClick={startCreate} className="rounded-full bg-ochre text-white px-5 py-2.5 text-sm font-semibold">+ New Service</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {items.map((s) => (
          <div key={s.id} className={`group rounded-[1.6rem] border p-5 hover:shadow-glow hover:-translate-y-1 transition-all ${s.enabled ? "bg-white dark:bg-white/[0.06] border-black/5 dark:border-white/10" : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 opacity-60"}`}>
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-ink dark:bg-white text-white dark:text-ink grid place-items-center text-lg group-hover:bg-ochre group-hover:scale-110 transition-all">{s.icon}</div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${s.enabled ? "bg-emerald-500 text-white" : "bg-zinc-300 text-zinc-600"}`}>{s.enabled ? "Active" : "Disabled"}</span>
            </div>
            <div className="font-display font-medium mt-3">{s.title}</div>
            <div className="text-xs text-ink/60 dark:text-white/60 mt-1 line-clamp-2">{s.body}</div>
            <div className="text-xs font-mono text-ink/40 mt-2">{s.slug} • order {s.order}</div>
            <div className="mt-4 flex gap-2"><button onClick={() => startEdit(s)} className="flex-1 rounded-full bg-cream dark:bg-white/10 py-2 text-xs">Edit</button><button onClick={() => del(s.id)} className="px-4 rounded-full border text-red-600 text-xs">Delete</button></div>
          </div>
        ))}
      </div>
      <div className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-4">
        <div className="text-sm font-medium">List View — Order drag coming • {enabled}/{items.length} enabled</div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-ink/50"><tr><th className="text-left p-2">Order</th><th className="text-left p-2">Title</th><th className="text-left p-2">Enabled</th><th className="text-right p-2">Actions</th></tr></thead>
            <tbody>
              {[...items].sort((a, b) => a.order - b.order).map((s) => (
                <tr key={s.id} className="border-t border-black/5"><td className="p-2">{s.order}</td><td className="p-2">{s.icon} {s.title}</td><td className="p-2">{s.enabled ? "✓" : "○"}</td><td className="p-2 text-right"><button onClick={() => startEdit(s)} className="text-ochre text-xs">Edit</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CrudModal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Service" : "New Service"}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Slug"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></Field>
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="Body"><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={3} /></Field>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Icon (emoji)"><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></Field>
            <Field label="Order"><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></Field>
            <Field label="Accent"><Input value={form.accent || ""} onChange={(e) => setForm({ ...form, accent: e.target.value })} placeholder="from-amber-400/20 to-orange-500/20" /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} /> Enabled</label>
          <button disabled={loading} className="w-full rounded-full bg-ochre text-white py-3 font-semibold">{loading ? "Saving..." : editing ? "Update" : "Create"}</button>
        </form>
      </CrudModal>
    </div>
  );
}
