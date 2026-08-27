"use client";
import { useState, useEffect } from "react";
import { CrudModal, Field, Input, Textarea, Select } from "./CrudModal";

type Project = {
  id: string;
  slug: string;
  title: string;
  type: string;
  year: string;
  location: string;
  area: string;
  client: string;
  img: string;
  gallery: string[];
  description: string;
  services: string[];
  featured: boolean;
  built: boolean;
};

const empty: Project = { id: "", slug: "", title: "", type: "Photo", year: "2024", location: "Al Ain, UAE", area: "", client: "", img: "", gallery: [], description: "", services: [], featured: false, built: true };

export default function ProjectsManager({ initial }: { initial: Project[] }) {
  const [items, setItems] = useState<Project[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Project>(empty);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const res = await fetch("/api/projects");
    if (res.ok) setItems(await res.json());
  }

  function startCreate() { setForm(empty); setEditing(null); setOpen(true); }
  function startEdit(p: Project) { setForm(p); setEditing(p); setOpen(true); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/projects/${editing.id}` : "/api/projects";
    const payload = { ...form, gallery: typeof form.gallery === "string" ? (form.gallery as unknown as string).split(",").map((s: string) => s.trim()).filter(Boolean) : form.gallery, services: typeof form.services === "string" ? (form.services as unknown as string).split(",").map((s: string) => s.trim()).filter(Boolean) : form.services };
    const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    setLoading(false);
    if (res.ok) { setOpen(false); refresh(); } else alert("Failed: " + (await res.text()));
  }

  async function del(id: string) {
    if (!confirm("Delete project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) refresh(); else alert("Delete failed");
  }

  const [view, setView] = useState<"table" | "cards">("cards");
  const [search, setSearch] = useState("");
  const filtered = items.filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl">Projects</h1>
          <p className="text-sm text-ink/60 dark:text-white/60">Visual CMS — {items.length} projects, {items.filter((p) => p.featured).length} featured • drag to reorder coming</p>
        </div>
        <div className="flex gap-2">
          <div className="hidden sm:flex rounded-full bg-white dark:bg-white/10 border border-black/5 dark:border-white/10 p-1">
            <button onClick={() => setView("cards")} className={`px-4 py-1.5 rounded-full text-xs font-medium ${view === "cards" ? "bg-ochre text-white" : "text-ink/60"}`}>Cards</button>
            <button onClick={() => setView("table")} className={`px-4 py-1.5 rounded-full text-xs font-medium ${view === "table" ? "bg-ochre text-white" : "text-ink/60"}`}>Table</button>
          </div>
          <button onClick={startCreate} className="rounded-full bg-ochre text-white px-5 py-2.5 text-sm font-semibold hover:bg-ochre-light">+ New Project</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title or slug..." className="flex-1 min-w-[240px] rounded-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 px-4 py-2.5 text-sm outline-none focus:border-ochre" />
        <div className="flex gap-2 text-xs">
          <span className="px-3 py-2 rounded-full bg-white dark:bg-white/10 border border-black/5">Total {items.length}</span>
          <span className="px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Featured {items.filter((p) => p.featured).length}</span>
          <span className="px-3 py-2 rounded-full bg-cream dark:bg-white/5 border">Built {items.filter((p) => p.built).length}</span>
        </div>
      </div>

      {view === "cards" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="group rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 overflow-hidden shadow-card hover:shadow-glow hover:-translate-y-1 transition-all">
              <div className="relative aspect-[4/3] overflow-hidden bg-cream dark:bg-white/5">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 left-3 flex gap-1">
                  {p.featured && <span className="px-2 py-1 rounded-full bg-ochre text-white text-[10px] font-semibold">★ Featured</span>}
                  <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${p.built ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>{p.built ? "Built" : "Concept"}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="text-white font-medium text-sm leading-tight">{p.title}</div>
                  <div className="text-white/70 text-xs">{p.year} • {p.location} • {p.area}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs font-mono text-ink/50 truncate">{p.slug}</div>
                <div className="text-xs text-ink/60 dark:text-white/60 mt-1 line-clamp-2">{p.description.slice(0, 90)}...</div>
                <div className="mt-3 flex gap-1 flex-wrap">{p.services.slice(0, 3).map((s) => <span key={s} className="text-[10px] px-2 py-1 rounded-full bg-cream dark:bg-white/10">{s}</span>)}</div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => startEdit(p)} className="flex-1 rounded-full bg-ink text-white dark:bg-white dark:text-ink py-2 text-xs font-medium hover:bg-forest">Edit</button>
                  <button onClick={() => del(p.id)} className="px-4 rounded-full border border-red-200 text-red-600 text-xs hover:bg-red-600 hover:text-white">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="col-span-full p-10 text-center text-ink/50">No projects match {search}</div>}
        </div>
      ) : (
        <div className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F6F0] dark:bg-white/5 text-xs">
                <tr><th className="text-left p-3">Preview</th><th className="text-left p-3">Title</th><th className="text-left p-3">Slug</th><th className="text-left p-3">Year</th><th className="text-left p-3">Featured</th><th className="text-right p-3">Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/5">
                    <td className="p-2"><img src={p.img} alt={p.title} className="w-12 h-8 rounded-lg object-cover" /></td>
                    <td className="p-3 font-medium">{p.title}</td>
                    <td className="p-3 text-ink/60 font-mono text-xs">{p.slug}</td>
                    <td className="p-3">{p.year}</td>
                    <td className="p-3">{p.featured ? "★" : "—"}</td>
                    <td className="p-3 text-right flex justify-end gap-2">
                      <button onClick={() => startEdit(p)} className="px-3 py-1 rounded-full bg-cream dark:bg-white/10 text-xs hover:bg-ochre hover:text-white">Edit</button>
                      <button onClick={() => del(p.id)} className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs hover:bg-red-600 hover:text-white">Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-ink/50">No projects</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CrudModal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Project" : "New Project"}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Slug (unique, hyphenated)"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="butterfly-garden-al-ain" /></Field>
            <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Photo</option><option>AI Render</option><option>Site Plan</option><option>Brand</option></Select></Field>
            <Field label="Year"><Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} /></Field>
            <Field label="Area"><Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="4,200 m²" /></Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
            <Field label="Client"><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></Field>
          </div>
          <Field label="Cover Image URL"><Input value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} placeholder="https://cdn.aifazi.net/media/assest/..." /></Field>
          <Field label="Gallery URLs (comma separated)"><Input value={Array.isArray(form.gallery) ? form.gallery.join(", ") : form.gallery as unknown as string} onChange={(e) => setForm({ ...form, gallery: e.target.value.split(",") as unknown as string[] })} /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} /></Field>
          <Field label="Services (comma separated)"><Input value={Array.isArray(form.services) ? form.services.join(", ") : form.services as unknown as string} onChange={(e) => setForm({ ...form, services: e.target.value.split(",") as unknown as string[] })} placeholder="Themed Gardens, Irrigation" /></Field>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.built} onChange={(e) => setForm({ ...form, built: e.target.checked })} /> Built (real) else Concept</label>
          </div>
          <button disabled={loading} className="w-full rounded-full bg-ochre text-white py-3 font-semibold disabled:opacity-50">{loading ? "Saving..." : editing ? "Update" : "Create"}</button>
        </form>
      </CrudModal>
    </div>
  );
}
