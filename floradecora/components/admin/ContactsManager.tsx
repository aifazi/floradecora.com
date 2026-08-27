"use client";
import { useState, useEffect } from "react";
import { CrudModal, Field, Input, Textarea, Select } from "./CrudModal";

type Contact = { id: string; name: string; email: string; phone?: string; projectType?: string; message: string; status: string; createdAt: string };
type Template = { id: string; key: string; name: string; subject: string; body: string };

export default function ContactsManager({ initial }: { initial: Contact[] }) {
  const [items, setItems] = useState<Contact[]>(initial);
  const [search, setSearch] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<Contact | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("inquiry_reply");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const filtered = items.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));
  const byStatus = (s: string) => items.filter((c) => c.status === s).length;
  async function refresh() {
    const res = await fetch("/api/contact");
    if (res.ok) setItems(await res.json());
  }
  useEffect(() => {
    fetch("/api/email/templates").then((r) => r.json()).then((d) => Array.isArray(d) && setTemplates(d)).catch(() => {});
  }, []);
  function openReply(c: Contact) {
    setReplyTarget(c);
    const tmpl = templates.find((t) => t.key === selectedTemplate) || templates[0];
    if (tmpl) {
      setSubject(tmpl.subject.replace("{{name}}", c.name));
      setBody(tmpl.body.replaceAll("{{name}}", c.name).replaceAll("{{email}}", c.email).replaceAll("{{message}}", c.message));
    } else {
      setSubject(`Re: Your inquiry — FloraDecora`);
      setBody(`Hi ${c.name},\n\nThanks for reaching out about "${c.message.slice(0, 80)}".\n\n— FloraDecora`);
    }
    setReplyOpen(true);
  }
  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/contact/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
    if (res.ok) setItems(items.map((c) => (c.id === id ? { ...c, status } : c)));
    else alert("Failed");
  }
  async function del(id: string) {
    if (!confirm("Delete inquiry?")) return;
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "New", count: byStatus("new"), color: "bg-amber-500" },
          { label: "Contacted", count: byStatus("contacted"), color: "bg-blue-500" },
          { label: "Won", count: byStatus("won"), color: "bg-emerald-500" },
          { label: "Lost", count: byStatus("lost"), color: "bg-zinc-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 p-4 text-center">
            <div className={`w-8 h-8 rounded-lg ${s.color} mx-auto grid place-items-center text-white text-xs`}>●</div>
            <div className="text-xl font-display font-medium mt-1">{s.count}</div>
            <div className="text-xs text-ink/50">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email..." className="flex-1 rounded-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 px-4 py-2.5 text-sm outline-none focus:border-ochre" />
        <button onClick={refresh} className="px-4 rounded-full bg-cream dark:bg-white/10 text-xs">Refresh</button>
      </div>
      <div className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F6F0] dark:bg-white/5 text-xs">
              <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Message</th><th className="text-left p-3">Status</th><th className="text-left p-3">Date</th><th className="text-right p-3">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-black/5 dark:border-white/5 hover:bg-black/[0.02]">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-xs">{c.email}</td>
                  <td className="p-3 max-w-[260px] truncate text-xs" title={c.message}>{c.message}</td>
                  <td className="p-3">
                    <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value)} className="rounded-full border border-black/10 px-2 py-1 text-xs bg-white dark:bg-white/5">
                      <option value="new">new</option><option value="contacted">contacted</option><option value="won">won</option><option value="lost">lost</option>
                    </select>
                  </td>
                  <td className="p-3 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right flex justify-end gap-1">
                    <button onClick={() => openReply(c)} className="px-3 py-1 rounded-full bg-ochre text-white text-xs hover:bg-ochre-light">Reply</button>
                    <button onClick={() => del(c.id)} className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs hover:bg-red-600 hover:text-white">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-ink/50">No matches for {search}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {replyOpen && replyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setReplyOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl rounded-[1.6rem] bg-white dark:bg-[#16261C] border p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg">Reply to {replyTarget.name} &lt;{replyTarget.email}&gt;</h3>
              <button onClick={() => setReplyOpen(false)} className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 grid place-items-center">✕</button>
            </div>
            <div className="mb-4 p-3 rounded-xl bg-cream dark:bg-white/5 border text-xs">
              <div className="font-medium">Original message:</div>
              <div className="text-ink/60 dark:text-white/60 mt-1">{replyTarget.message}</div>
            </div>
            <div className="space-y-4">
              <Field label="Template">
                <Select value={selectedTemplate} onChange={(e) => {
                  const key = e.target.value;
                  setSelectedTemplate(key);
                  const tmpl = templates.find((t) => t.key === key);
                  if (tmpl && replyTarget) {
                    setSubject(tmpl.subject.replaceAll("{{name}}", replyTarget.name));
                    setBody(tmpl.body.replaceAll("{{name}}", replyTarget.name).replaceAll("{{email}}", replyTarget.email).replaceAll("{{message}}", replyTarget.message));
                  }
                }}>
                  {templates.map((t) => <option key={t.key} value={t.key}>{t.name} ({t.key})</option>)}
                  <option value="__custom">Custom</option>
                </Select>
              </Field>
              <Field label="Subject"><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
              <Field label="Body (HTML supported, {{name}} {{email}} {{message}})">
                <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
              </Field>
              <div className="text-xs text-ink/50">Variables: {"{{name}}"} {"{{email}}"} {"{{message}}"} • Will be sent via active Email provider (SMTP/Resend/Brevo) and logged in <code className="bg-black/5 px-1 rounded">Email Logs</code>. Status will auto-update to <code className="bg-black/5 px-1 rounded">contacted</code>.</div>
              <div className="flex gap-2">
                <button
                  disabled={sending}
                  onClick={async () => {
                    setSending(true);
                    const res = await fetch(`/api/contact/${replyTarget.id}/reply`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ subject, body, templateKey: selectedTemplate }) });
                    setSending(false);
                    if (res.ok) { setReplyOpen(false); alert("Reply queued — check Email Queue/Logs"); refresh(); }
                    else alert("Failed: " + (await res.text()));
                  }}
                  className="flex-1 rounded-full bg-ochre text-white py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Reply"}
                </button>
                <button onClick={() => setReplyOpen(false)} className="flex-1 rounded-full border py-2.5 text-sm">Cancel</button>
              </div>
              <div className="text-xs text-ink/50 text-center">Or manage templates in <a href="/admin/emails" className="text-ochre underline">Emails → Templates</a></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
