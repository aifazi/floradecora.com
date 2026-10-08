"use client";
import { useState } from "react";
import { Input, Textarea } from "./CrudModal";
import { CONTENT_SECTIONS, FieldDef } from "@/lib/content-schema";
import { CONTENT_DEFAULTS } from "@/lib/content-defaults";
import { getByPath, setByPath } from "@/lib/content";

type Values = Record<string, any>;

function blankItem(fields: FieldDef[]): Record<string, unknown> {
  const item: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.kind === "list") item[f.path] = [];
    else if (f.kind === "number") item[f.path] = 0;
    else item[f.path] = "";
  }
  return item;
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-ink/60 dark:text-white/60 block mb-1.5">{label}</label>
      <div className="flex gap-2">
        <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />
        <a href="/admin/media" target="_blank" className="shrink-0 rounded-xl border border-black/10 dark:border-white/10 px-3 text-xs grid place-items-center hover:border-ochre">Media ↗</a>
      </div>
    </div>
  );
}

function FieldRenderer({ def, data, update, depth = 0 }: { def: FieldDef; data: any; update: (path: string, value: unknown) => void; depth?: number }) {
  const value = getByPath(data, def.path);

  if (def.kind === "text" || def.kind === "textarea") {
    const common = { value: value ?? "", onChange: (e: any) => update(def.path, e.target.value) };
    return (
      <div>
        <label className="text-xs font-medium text-ink/60 dark:text-white/60 block mb-1.5">{def.label}</label>
        {def.kind === "textarea" ? <Textarea {...common} rows={def.rows || 3} /> : <Input {...common} />}
      </div>
    );
  }

  if (def.kind === "number") {
    return (
      <div>
        <label className="text-xs font-medium text-ink/60 dark:text-white/60 block mb-1.5">{def.label}</label>
        <Input type="number" value={value ?? ""} onChange={(e) => update(def.path, e.target.value === "" ? undefined : Number(e.target.value))} />
      </div>
    );
  }

  if (def.kind === "image") {
    return <ImageField label={def.label} value={String(value ?? "")} onChange={(v) => update(def.path, v)} />;
  }

  // list
  const items: unknown[] = Array.isArray(value) ? value : [];
  const setItems = (next: unknown[]) => update(def.path, next);

  return (
    <div className={depth > 0 ? "rounded-xl bg-black/[0.03] dark:bg-white/5 border border-black/5 dark:border-white/10 p-3" : ""}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-ink/60 dark:text-white/60">{def.label} <span className="text-ink/40">({items.length})</span></label>
        <button
          type="button"
          onClick={() => setItems([...items, def.itemString ? "" : blankItem(def.itemFields || [])])}
          className="rounded-full bg-ochre/10 text-ochre-dark dark:text-ochre-light px-3 py-1 text-xs font-semibold hover:bg-ochre/20"
        >
          + {def.addLabel || "Add item"}
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/[0.03] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] tracking-widest uppercase text-ink/40">#{i + 1}</span>
              <div className="flex gap-1">
                <button type="button" disabled={i === 0} onClick={() => { const next = [...items]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; setItems(next); }} className="w-6 h-6 rounded-full bg-cream dark:bg-white/10 text-xs disabled:opacity-30">↑</button>
                <button type="button" disabled={i === items.length - 1} onClick={() => { const next = [...items]; [next[i], next[i + 1]] = [next[i + 1], next[i]]; setItems(next); }} className="w-6 h-6 rounded-full bg-cream dark:bg-white/10 text-xs disabled:opacity-30">↓</button>
                <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))} className="w-6 h-6 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 text-xs">✕</button>
              </div>
            </div>
            {def.itemString ? (
              <Input value={String(item ?? "")} onChange={(e) => { const next = [...items]; next[i] = e.target.value; setItems(next); }} />
            ) : (
              <div className="grid gap-3">
                {(def.itemFields || []).map((f) => (
                  <FieldRenderer key={f.path} def={{ ...f, path: `${def.path}.${i}.${f.path}` } as FieldDef} data={data} update={update} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-ink/40">Empty — click add to create items.</p>}
      </div>
    </div>
  );
}

export default function ContentEditor({ initial }: { initial: Values }) {
  const [values, setValues] = useState<Values>(initial);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set(CONTENT_SECTIONS.length ? [CONTENT_SECTIONS[0].key] : []));

  const updateSection = (key: string, updater: (section: any) => any) => {
    setValues((prev) => ({ ...prev, [key]: updater(prev[key]) }));
    setDirty((prev) => new Set(prev).add(key));
  };

  const save = async (key: string) => {
    setSaving(key);
    try {
      const res = await fetch(`/api/settings/${key}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ value: values[key] }),
      });
      if (res.ok) {
        setDirty((prev) => { const next = new Set(prev); next.delete(key); return next; });
        setSavedKey(key);
        setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 2000);
      } else {
        alert(`Failed to save ${key}`);
      }
    } catch {
      alert(`Failed to save ${key}`);
    }
    setSaving(null);
  };

  const saveAll = async () => {
    for (const key of Array.from(dirty)) await save(key);
  };

  const toggle = (key: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const dirtyCount = dirty.size;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl">Site Content</h1>
          <p className="text-sm text-ink/60">Every corner of the site — header, footer, homepage, pages, SEO. Changes apply instantly.</p>
        </div>
        <div className="flex items-center gap-3">
          {dirtyCount > 0 && <span className="rounded-full bg-amber-100 text-amber-700 px-3 py-1.5 text-xs font-medium">{dirtyCount} unsaved section{dirtyCount > 1 ? "s" : ""}</span>}
          <button
            onClick={saveAll}
            disabled={dirtyCount === 0 || saving !== null}
            className="rounded-full bg-ochre text-white px-6 py-2.5 text-sm font-semibold hover:bg-ochre-light disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save all"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {CONTENT_SECTIONS.map((section) => {
          const isOpen = open.has(section.key);
          const isDirty = dirty.has(section.key);
          return (
            <div key={section.key} className="rounded-[1.6rem] bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(section.key)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-black/[0.02] dark:hover:bg-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isDirty ? "bg-amber-400" : savedKey === section.key ? "bg-emerald-500" : "bg-black/15 dark:bg-white/20"}`} />
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{section.title}</div>
                    {section.description && <div className="text-xs text-ink/50 truncate">{section.description}</div>}
                  </div>
                </div>
                <span className="text-xs text-ink/40 shrink-0">{isOpen ? "Hide ▲" : "Edit ▼"}</span>
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-black/5 dark:border-white/10">
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    {section.fields.map((f) => (
                      <div key={f.path} className={f.kind === "list" ? "md:col-span-2" : ""}>
                        <FieldRenderer
                          def={f}
                          data={values[section.key] || {}}
                          update={(path, v) => updateSection(section.key, (sectionData) => setByPath(sectionData, path, v))}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-black/5 dark:border-white/10">
                    <button
                      onClick={() => save(section.key)}
                      disabled={saving !== null || !isDirty}
                      className="rounded-full bg-ochre text-white px-6 py-2.5 text-sm font-semibold hover:bg-ochre-light disabled:opacity-40"
                    >
                      {saving === section.key ? "Saving…" : isDirty ? "Save section" : "Saved ✓"}
                    </button>
                    <button
                      onClick={() => {
                        updateSection(section.key, () => JSON.parse(JSON.stringify(CONTENT_DEFAULTS[section.key] ?? {})));
                      }}
                      className="rounded-full border border-black/10 dark:border-white/10 px-5 py-2.5 text-sm hover:bg-black/5"
                    >
                      Reset to defaults
                    </button>
                    <span className="text-xs text-ink/40 font-mono">{section.key}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
