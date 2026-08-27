"use client";
import { useState } from "react";
import { CrudModal, Field, Input, Textarea } from "./CrudModal";

type Post = { id: string; slug: string; title: string; excerpt: string; content: string[]; date: string; read: string; tags: string[]; cover?: string; published: boolean };
const empty: Post = { id: "", slug: "", title: "", excerpt: "", content: [], date: new Date().toISOString().slice(0, 10), read: "3 min", tags: [], cover: "", published: true };

export default function BlogManager({ initial }: { initial: Post[] }) {
  const [items, setItems] = useState<Post[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<Post>(empty);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const res = await fetch("/api/posts?all=true");
    if (res.ok) setItems(await res.json());
  }
  function startCreate() { setForm(empty); setEditing(null); setOpen(true); }
  function startEdit(p: Post) { setForm(p); setEditing(p); setOpen(true); }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const payload = { ...form, content: typeof form.content === "string" ? (form.content as unknown as string).split("\n").filter(Boolean) : form.content, tags: typeof form.tags === "string" ? (form.tags as unknown as string).split(",").map((s: string) => s.trim()).filter(Boolean) : form.tags };
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/posts/${editing.id}` : "/api/posts";
    const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    setLoading(false);
    if (res.ok) { setOpen(false); refresh(); } else alert("Failed");
  }
  async function del(id: string) { if (!confirm("Delete?")) return; const res = await fetch(`/api/posts/${id}`, { method: "DELETE" }); if (res.ok) refresh(); }

  const [view, setView] = useState<"cards" | "table">("cards");
  return (
    <div>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div><h1 className="font-display text-2xl">Blog — Visual Journal</h1><p className="text-sm text-ink/60 dark:text-white/60">Stories from 45°C shade • {items.length} posts, {items.filter((p) => p.published).length} published</p></div>
        <div className="flex gap-2">
          <div className="hidden sm:flex rounded-full bg-white dark:bg-white/10 border p-1"><button onClick={() => setView("cards")} className={`px-4 py-1.5 rounded-full text-xs ${view === "cards" ? "bg-ochre text-white" : ""}`}>Cards</button><button onClick={() => setView("table")} className={`px-4 py-1.5 rounded-full text-xs ${view === "table" ? "bg-ochre text-white" : ""}`}>Table</button></div>
          <button onClick={startCreate} className="rounded-full bg-ochre text-white px-5 py-2.5 text-sm font-semibold">+ New Post</button>
        </div>
      </div>
      {view === "cards" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="group rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 overflow-hidden hover:shadow-glow transition-all">
              <div className="h-36 bg-cream dark:bg-white/5 relative overflow-hidden">
                {p.cover ? <img src={p.cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full grid place-items-center text-3xl">✎</div>}
                <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-semibold ${p.published ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>{p.published ? "Published" : "Draft"}</span>
              </div>
              <div className="p-4">
                <div className="text-xs text-ochre font-medium">{p.tags.join(" • ") || "No tags"} • {p.read}</div>
                <div className="font-display font-medium mt-1 leading-tight line-clamp-2">{p.title}</div>
                <div className="text-xs text-ink/60 mt-1 line-clamp-2">{p.excerpt}</div>
                <div className="text-xs text-ink/40 mt-2">{p.date} • {p.slug}</div>
                <div className="mt-3 flex gap-2"><button onClick={() => startEdit(p)} className="flex-1 rounded-full bg-ink text-white dark:bg-white dark:text-ink py-2 text-xs">Edit</button><button onClick={() => del(p.id)} className="px-4 rounded-full border text-red-600 text-xs">Delete</button></div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="col-span-full p-10 text-center text-ink/50">No posts — write your first story</div>}
        </div>
      ) : (
        <div className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F6F0] dark:bg-white/5 text-xs"><tr><th className="text-left p-3">Cover</th><th className="text-left p-3">Title</th><th className="text-left p-3">Date</th><th className="text-left p-3">Published</th><th className="text-right p-3">Actions</th></tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-black/5 dark:border-white/5">
                  <td className="p-2">{p.cover ? <img src={p.cover} alt={p.title} className="w-12 h-8 rounded object-cover" /> : <div className="w-12 h-8 rounded bg-cream grid place-items-center text-xs">✎</div>}</td>
                  <td className="p-3 font-medium">{p.title}</td><td className="p-3 text-xs">{p.date}</td><td className="p-3">{p.published ? "✓" : "○"}</td>
                  <td className="p-3 text-right flex justify-end gap-2"><button onClick={() => startEdit(p)} className="px-3 py-1 rounded-full bg-cream dark:bg-white/10 text-xs">Edit</button><button onClick={() => del(p.id)} className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <CrudModal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Post" : "New Post"}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Slug"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></Field>
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="Excerpt"><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} /></Field>
          <Field label="Content (one paragraph per line)"><Textarea value={Array.isArray(form.content) ? form.content.join("\n") : form.content as unknown as string} onChange={(e) => setForm({ ...form, content: e.target.value.split("\n") as unknown as string[] })} rows={6} /></Field>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Date"><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="2024-03-10" /></Field>
            <Field label="Read"><Input value={form.read} onChange={(e) => setForm({ ...form, read: e.target.value })} /></Field>
            <Field label="Cover URL"><Input value={form.cover || ""} onChange={(e) => setForm({ ...form, cover: e.target.value })} /></Field>
          </div>
          <Field label="Tags (comma)"><Input value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags as unknown as string} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",") as unknown as string[] })} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
          <button disabled={loading} className="w-full rounded-full bg-ochre text-white py-3 font-semibold">{loading ? "Saving..." : editing ? "Update" : "Create"}</button>
        </form>
      </CrudModal>
    </div>
  );
}
