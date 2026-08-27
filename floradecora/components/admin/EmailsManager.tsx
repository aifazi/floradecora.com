"use client";
import { useState, useEffect } from "react";
import { CrudModal, Field, Input, Select, Textarea } from "./CrudModal";

type Provider = { id: string; provider: string; active: boolean; config: Record<string, string> };
type Log = { id: string; to: string; subject: string; provider: string; status: string; error?: string; attempts: number; createdAt: string };
type Queue = { id: string; to: string; subject: string; provider: string; status: string; attempts: number; nextRetry?: string; error?: string; createdAt: string };

const emailProviders = [
  { id: "smtp", label: "SMTP", fields: [{ key: "host", label: "Host", placeholder: "smtp.gmail.com" }, { key: "port", label: "Port", placeholder: "587" }, { key: "user", label: "User" }, { key: "pass", label: "Pass", type: "password" }, { key: "from", label: "From", placeholder: "noreply@floradecora.com" }] },
  { id: "resend", label: "Resend", fields: [{ key: "apiKey", label: "API Key" }, { key: "from", label: "From", placeholder: "onboarding@resend.dev" }] },
  { id: "brevo", label: "Brevo", fields: [{ key: "apiKey", label: "API Key" }, { key: "from", label: "From" }] },
];

type Template = { id: string; key: string; name: string; subject: string; body: string };

export default function EmailsManager() {
  const [tab, setTab] = useState<"providers" | "queue" | "logs" | "templates">("providers");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [queue, setQueue] = useState<Queue[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [tmplForm, setTmplForm] = useState<Template>({ id: "", key: "", name: "", subject: "", body: "" });
  const [tmplOpen, setTmplOpen] = useState(false);

  async function loadProviders() { const res = await fetch("/api/email/providers"); if (res.ok) setProviders(await res.json()); }
  async function loadLogs() { const res = await fetch("/api/email/logs"); if (res.ok) setLogs(await res.json()); }
  async function loadQueue() { const res = await fetch("/api/email/queue"); if (res.ok) setQueue(await res.json()); }
  async function loadTemplates() { const res = await fetch("/api/email/templates"); if (res.ok) setTemplates(await res.json()); }

  useEffect(() => { loadProviders(); loadLogs(); loadQueue(); loadTemplates(); }, []);

  async function saveProvider(p: string, active: boolean) {
    const cfg = config;
    const res = await fetch(`/api/email/providers/${p}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ config: cfg, active }) });
    if (res.ok) { setEditing(null); setConfig({}); loadProviders(); } else alert("Failed");
  }

  async function testProvider(p: string) {
    setLoading(true);
    const res = await fetch(`/api/email/providers/${p}/test`, { method: "POST" });
    setLoading(false);
    if (res.ok) alert("Test sent via " + p);
    else alert("Test failed: " + (await res.text()));
  }

  async function retry(id: string) {
    const res = await fetch(`/api/email/queue/${id}/retry`, { method: "POST" });
    if (res.ok) { loadQueue(); loadLogs(); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Emails — Gateway</h1>
        <p className="text-sm text-ink/60 dark:text-white/60">Configure SMTP / Resend / Brevo — project will use active provider. Monitor queue, logs, retry.</p>
      </div>

      <div className="flex gap-2 border-b border-black/5 dark:border-white/10 overflow-x-auto">
        {[
          { id: "providers", label: "Providers" },
          { id: "queue", label: `Queue (${queue.filter((q) => q.status !== "sent").length})` },
          { id: "logs", label: "Logs" },
          { id: "templates", label: `Templates (${templates.length})` },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as never)} className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${tab === t.id ? "border-ochre text-ochre" : "border-transparent text-ink/60"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "providers" && (
        <div className="grid md:grid-cols-3 gap-4">
          {emailProviders.map((ep) => {
            const saved = providers.find((p) => p.provider === ep.id);
            const isActive = saved?.active;
            const isEditing = editing === ep.id;
            return (
              <div key={ep.id} className={`rounded-[1.6rem] border p-5 ${isActive ? "bg-ochre/10 border-ochre/30" : "bg-white dark:bg-white/[0.06] border-black/5 dark:border-white/10"}`}>
                <div className="flex justify-between items-center">
                  <div className="font-display font-medium">{ep.label} {isActive && <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">Active</span>}</div>
                  <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={!!isActive} onChange={() => saveProvider(ep.id, !isActive)} /> Active</label>
                </div>
                <div className="mt-4 space-y-3">
                  {isEditing ? (
                    <>
                      {ep.fields.map((f) => (
                        <Field key={f.key} label={f.label}>
                          <Input type={(f as { type?: string }).type || "text"} value={config[f.key] || ""} onChange={(e) => setConfig({ ...config, [f.key]: e.target.value })} placeholder={f.placeholder} />
                        </Field>
                      ))}
                      <div className="flex gap-2">
                        <button onClick={() => saveProvider(ep.id, !!isActive)} className="flex-1 rounded-full bg-ochre text-white py-2 text-sm">Save</button>
                        <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-black/10 py-2 text-sm">Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-ink/50 break-all">{saved ? `Configured • ${Object.keys(saved.config).join(", ")}` : "Not configured"}</div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(ep.id); setConfig(saved?.config || {}); }} className="flex-1 rounded-full bg-cream dark:bg-white/10 py-2 text-xs">Configure</button>
                        <button onClick={() => testProvider(ep.id)} disabled={loading} className="flex-1 rounded-full bg-forest text-white py-2 text-xs disabled:opacity-50">Test</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "queue" && (
        <div className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F6F0] dark:bg-white/5 text-xs"><tr><th className="text-left p-3">To</th><th className="text-left p-3">Subject</th><th className="text-left p-3">Provider</th><th className="text-left p-3">Status</th><th className="text-left p-3">Attempts</th><th className="text-left p-3">Next Retry</th><th className="text-right p-3">Actions</th></tr></thead>
              <tbody>
                {queue.map((q) => (
                  <tr key={q.id} className="border-t border-black/5 dark:border-white/5">
                    <td className="p-3 font-mono text-xs">{q.to}</td><td className="p-3 truncate max-w-[200px]">{q.subject}</td><td className="p-3 text-xs">{q.provider}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase ${q.status === "sent" ? "bg-emerald-100 text-emerald-700" : q.status === "failed" ? "bg-red-100 text-red-700" : q.status === "retry" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{q.status}</span></td>
                    <td className="p-3">{q.attempts}</td><td className="p-3 text-xs">{q.nextRetry ? new Date(q.nextRetry).toLocaleString() : "—"}</td>
                    <td className="p-3 text-right">{q.status !== "sent" && <button onClick={() => retry(q.id)} className="px-3 py-1 rounded-full bg-ochre text-white text-xs">Retry</button>}</td>
                  </tr>
                ))}
                {queue.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-ink/50">Queue empty — all sent</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="p-3 flex justify-end"><button onClick={loadQueue} className="text-xs text-ochre">Refresh</button></div>
        </div>
      )}

      {tab === "logs" && (
        <div className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F6F0] dark:bg-white/5 text-xs"><tr><th className="text-left p-3">To</th><th className="text-left p-3">Subject</th><th className="text-left p-3">Provider</th><th className="text-left p-3">Status</th><th className="text-left p-3">Attempts</th><th className="text-left p-3">Date</th></tr></thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-t border-black/5 dark:border-white/5">
                    <td className="p-3 font-mono text-xs">{l.to}</td><td className="p-3 truncate max-w-[200px]">{l.subject}</td><td className="p-3 text-xs">{l.provider}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase ${l.status === "sent" ? "bg-emerald-100 text-emerald-700" : l.status === "failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{l.status}</span></td>
                    <td className="p-3">{l.attempts}</td><td className="p-3 text-xs">{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {logs.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-ink/50">No logs yet — send a contact form to generate</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="p-3 flex justify-end gap-2"><button onClick={loadLogs} className="text-xs text-ochre">Refresh</button><span className="text-xs text-ink/50">Polls every 10s via worker</span></div>
        </div>
      )}

      {tab === "templates" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-ink/60">Templates use {"{{name}}, {{email}}, {{message}}"} variables. Used when replying to inquiries.</div>
            <button onClick={() => { setTmplForm({ id: "", key: "", name: "", subject: "", body: "" }); setTmplOpen(true); }} className="rounded-full bg-ochre text-white px-4 py-2 text-xs font-semibold">+ New Template</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((t) => (
              <div key={t.id} className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-5">
                <div className="flex justify-between items-start">
                  <div><div className="font-display font-medium">{t.name}</div><div className="text-xs font-mono text-ink/50">{t.key}</div></div>
                  <span className="text-xs px-2 py-1 rounded-full bg-cream dark:bg-white/10">✉ Template</span>
                </div>
                <div className="mt-3 text-sm font-medium">Subject: {t.subject}</div>
                <div className="mt-2 text-xs text-ink/60 dark:text-white/60 line-clamp-3 bg-[#F8F6F0] dark:bg-white/5 p-3 rounded-xl" dangerouslySetInnerHTML={{ __html: t.body.slice(0, 120) + "..." }} />
                <div className="mt-4 flex gap-2">
                  <button onClick={() => { setTmplForm(t); setTmplOpen(true); }} className="flex-1 rounded-full bg-cream dark:bg-white/10 py-2 text-xs">Edit</button>
                  <button onClick={async () => { if (!confirm("Delete template?")) return; await fetch(`/api/email/templates/${t.id}`, { method: "DELETE" }); loadTemplates(); }} className="px-4 rounded-full border border-red-200 text-red-600 text-xs">Delete</button>
                </div>
              </div>
            ))}
          </div>
          {templates.length === 0 && <div className="p-10 text-center text-ink/50">No templates — create inquiry_reply etc.</div>}

          {tmplOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div onClick={() => setTmplOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <div className="relative w-full max-w-2xl rounded-[1.6rem] bg-white dark:bg-[#16261C] border p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="font-display text-lg">{tmplForm.id ? "Edit Template" : "New Template"}</h3>
                <div className="mt-4 space-y-4">
                  <Field label="Key (unique, e.g. inquiry_reply)"><Input value={tmplForm.key} onChange={(e) => setTmplForm({ ...tmplForm, key: e.target.value })} placeholder="inquiry_reply" /></Field>
                  <Field label="Name"><Input value={tmplForm.name} onChange={(e) => setTmplForm({ ...tmplForm, name: e.target.value })} placeholder="Inquiry Reply" /></Field>
                  <Field label="Subject (supports {{name}})"><Input value={tmplForm.subject} onChange={(e) => setTmplForm({ ...tmplForm, subject: e.target.value })} /></Field>
                  <Field label="Body HTML (use {{name}}, {{email}}, {{message}})"><Textarea value={tmplForm.body} onChange={(e) => setTmplForm({ ...tmplForm, body: e.target.value })} rows={8} /></Field>
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      const method = tmplForm.id ? "PUT" : "POST";
                      const url = tmplForm.id ? `/api/email/templates/${tmplForm.id}` : "/api/email/templates";
                      const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(tmplForm) });
                      if (res.ok) { setTmplOpen(false); loadTemplates(); } else alert("Failed");
                    }} className="flex-1 rounded-full bg-ochre text-white py-2.5 text-sm font-semibold">Save</button>
                    <button onClick={() => setTmplOpen(false)} className="flex-1 rounded-full border py-2.5 text-sm">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
