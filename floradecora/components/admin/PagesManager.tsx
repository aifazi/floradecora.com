"use client";
import { useState } from "react";
import { CrudModal, Field, Input, Textarea } from "./CrudModal";

type Page = { id: string; slug: string; title: string; blocks: any; published: boolean };
const empty: Page = { id: "", slug: "", title: "", blocks: [{ type: "hero", data: { title: "New Page", subtitle: "Subtitle here" } }], published: true };

export default function PagesManager({ initial }: { initial: Page[] }) {
  const [items, setItems] = useState<Page[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState<Page>(empty);
  const [loading, setLoading] = useState(false);
  async function refresh() { const res = await fetch("/api/pages?all=true"); if (res.ok) setItems(await res.json()); }
  function startCreate() { setForm(empty); setEditing(null); setOpen(true); }
  function startEdit(p: Page) { setForm({ ...p, blocks: p.blocks }); setEditing(p); setOpen(true); }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    let blocks = form.blocks;
    if (typeof blocks === "string") {
      try { blocks = JSON.parse(blocks as any); } catch { alert("Invalid JSON"); setLoading(false); return; }
    }
    const payload = { ...form, blocks };
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/pages/${editing.id}` : "/api/pages";
    const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    setLoading(false); if (res.ok) { setOpen(false); refresh(); } else { const t = await res.text(); alert("Failed: " + t); }
  }
  async function del(id: string) { if (!confirm("Delete page?")) return; const res = await fetch(`/api/pages/${id}`, { method: "DELETE" }); if (res.ok) refresh(); }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div><h1 className="font-display text-2xl">Pages — Visual CMS</h1><p className="text-sm text-ink/60 dark:text-white/60">Create any page: home, about, services, future app1.app → no code, editable via Odoo-style</p></div>
        <button onClick={startCreate} className="rounded-full bg-ochre text-white px-5 py-2.5 text-sm font-semibold">+ New Page</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className={`group rounded-[1.6rem] border p-5 hover:shadow-glow hover:-translate-y-1 transition-all ${p.published ? "bg-white dark:bg-white/[0.06] border-black/5 dark:border-white/10" : "bg-zinc-50 dark:bg-white/5 opacity-60"}`}>
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-forest text-white grid place-items-center">◈</div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${p.published ? "bg-emerald-500 text-white" : "bg-zinc-300"}`}>{p.published ? "Published" : "Draft"}</span>
            </div>
            <div className="font-display font-medium mt-3">{p.title}</div>
            <div className="text-xs font-mono text-ink/40 mt-1">/{p.slug}</div>
            <div className="text-xs text-ink/50 dark:text-white/50 mt-2 line-clamp-2">{JSON.stringify(p.blocks).slice(0, 80)}…</div>
            <div className="mt-4 flex gap-2"><button onClick={() => startEdit(p)} className="flex-1 rounded-full bg-cream dark:bg-white/10 py-2 text-xs">Edit</button><button onClick={() => del(p.id)} className="px-4 rounded-full border text-red-600 text-xs">Delete</button></div>
          </div>
        ))}
      </div>
      <CrudModal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Page" : "New Page"}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Slug (e.g. about, app1)"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></Field>
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="Blocks (JSON) — Odoo blocks"><Textarea value={typeof form.blocks === "string" ? form.blocks as any : JSON.stringify(form.blocks, null, 2)} onChange={(e) => setForm({ ...form, blocks: e.target.value as any })} rows={12} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
          <button disabled={loading} className="w-full rounded-full bg-ochre text-white py-3 font-semibold">{loading ? "Saving..." : editing ? "Update" : "Create"}</button>
        </form>
      </CrudModal>
    </div>
  );
}