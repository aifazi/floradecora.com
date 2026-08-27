"use client";
import { useState, useEffect } from "react";
import { Field, Input } from "./CrudModal";

const cdns = [
  { id: "r2", label: "Cloudflare R2", fields: [{ key: "endpoint", label: "Endpoint", placeholder: "https://xxx.r2.cloudflarestorage.com" }, { key: "accessKeyId", label: "Access Key" }, { key: "secretAccessKey", label: "Secret Key", type: "password" }, { key: "bucket", label: "Bucket", placeholder: "floradecora" }, { key: "cdnUrl", label: "CDN URL", placeholder: "https://cdn.aifazi.net" }] },
  { id: "cloudinary", label: "Cloudinary", fields: [{ key: "url", label: "Cloudinary URL", placeholder: "cloudinary://api_key:api_secret@cloud_name" }] },
  { id: "bunny", label: "BunnyCDN", fields: [{ key: "storageZone", label: "Storage Zone" }, { key: "apiKey", label: "API Key", type: "password" }, { key: "pullZone", label: "Pull Zone (e.g. cdn.example.com)" }] },
  { id: "local", label: "Local (DB only)", fields: [] },
];

type Provider = { id: string; provider: string; active: boolean; config: Record<string, string> };

export default function CdnManager() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [config, setConfig] = useState<Record<string, string>>({});

  async function load() { const res = await fetch("/api/cdn/providers"); if (res.ok) setProviders(await res.json()); }
  useEffect(() => { load(); }, []);

  async function save(p: string, active: boolean) {
    const res = await fetch(`/api/cdn/providers/${p}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ config, active }) });
    if (res.ok) { setEditing(null); setConfig({}); load(); } else alert("Failed");
  }
  async function test(p: string) {
    const res = await fetch(`/api/cdn/providers/${p}/test`, { method: "POST" });
    if (res.ok) alert("Test upload OK: " + (await res.json()).url);
    else alert("Test failed");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">CDN Providers</h1>
        <p className="text-sm text-ink/60 dark:text-white/60">Choose R2 / Cloudinary / Bunny — project will use active CDN for all uploads. Local saves to DB only (dev).</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {cdns.map((cd) => {
          const saved = providers.find((p) => p.provider === cd.id);
          const isActive = saved?.active;
          const isEditing = editing === cd.id;
          return (
            <div key={cd.id} className={`rounded-[1.6rem] border p-5 ${isActive ? "bg-ochre/10 border-ochre/30" : "bg-white dark:bg-white/[0.06] border-black/5 dark:border-white/10"}`}>
              <div className="flex justify-between items-center">
                <div className="font-display font-medium">{cd.label} {isActive && <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">Active</span>}</div>
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={!!isActive} onChange={() => save(cd.id, !isActive)} /> Active</label>
              </div>
              <div className="mt-4 space-y-3">
                {isEditing ? (
                  <>
                    {cd.fields.map((f) => (
                      <Field key={f.key} label={f.label}><Input type={(f as { type?: string }).type || "text"} value={config[f.key] || ""} onChange={(e) => setConfig({ ...config, [f.key]: e.target.value })} placeholder={f.placeholder} /></Field>
                    ))}
                    <div className="flex gap-2"><button onClick={() => save(cd.id, !!isActive)} className="flex-1 rounded-full bg-ochre text-white py-2 text-sm">Save</button><button onClick={() => setEditing(null)} className="flex-1 rounded-full border py-2 text-sm">Cancel</button></div>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-ink/50 break-all">{saved ? `Configured • ${Object.keys(saved.config).join(", ")}` : "Not configured"}</div>
                    <div className="flex gap-2"><button onClick={() => { setEditing(cd.id); setConfig(saved?.config || {}); }} className="flex-1 rounded-full bg-cream dark:bg-white/10 py-2 text-xs">Configure</button><button onClick={() => test(cd.id)} className="flex-1 rounded-full bg-forest text-white py-2 text-xs">Test Upload</button></div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-2xl bg-forest text-white p-6">
        <h3 className="font-display">How it works</h3>
        <p className="text-sm text-white/70 mt-2">All <code className="bg-white/10 px-1 rounded">MediaService.upload()</code> calls go via <code className="bg-white/10 px-1 rounded">CdnService</code> factory. Active provider is read from <code className="bg-white/10 px-1 rounded">cdn_providers where active=true</code> else env fallback `R2_ENDPOINT`/`CLOUDINARY_URL`/`BUNNY_*`. Change active and next upload uses new CDN.</p>
      </div>
    </div>
  );
}
