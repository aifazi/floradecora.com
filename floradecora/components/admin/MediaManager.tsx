"use client";
import { useState } from "react";

type Media = { id: string; key: string; url: string; mime: string; size: number; createdAt: string };

export default function MediaManager({ initial }: { initial: Media[] }) {
  const [items, setItems] = useState<Media[]>(initial);
  const [uploading, setUploading] = useState(false);

  async function refresh() {
    const res = await fetch("/api/media");
    if (res.ok) setItems(await res.json());
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/media", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) refresh();
    else alert("Upload failed");
  }

  async function del(id: string) {
    if (!confirm("Delete media?")) return;
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (res.ok) refresh();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="font-display text-2xl">Media Library</h1><p className="text-sm text-ink/60">Upload to R2 / CDN — {items.length} assets</p></div>
        <label className="rounded-full bg-ochre text-white px-5 py-2.5 text-sm font-semibold cursor-pointer hover:bg-ochre-light">
          {uploading ? "Uploading..." : "+ Upload Image"}
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((m) => (
          <div key={m.id} className="group rounded-[1.2rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 overflow-hidden">
            <div className="aspect-[4/3] bg-cream dark:bg-white/5 overflow-hidden">
              <img src={m.url} alt={m.key} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-3">
              <div className="text-xs font-mono truncate">{m.key}</div>
              <div className="text-xs text-ink/50">{(m.size / 1024).toFixed(1)} KB • {m.mime}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(m.url)} className="text-xs px-3 py-1 rounded-full bg-cream dark:bg-white/10">Copy URL</button>
                <button onClick={() => del(m.id)} className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="mt-10 text-center text-ink/50">No media — upload an image to see it here. In local dev, files are stored in DB even without R2.</div>}
    </div>
  );
}
