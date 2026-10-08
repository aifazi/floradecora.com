"use client";
import { CONTENT_DEFAULTS } from "@/lib/content-defaults";
import { deepMerge, setByPath } from "@/lib/content";

const pending = new Map<string, Map<string, unknown>>();

export function queueChange(settingsKey: string, field: string, value: unknown) {
  let changes = pending.get(settingsKey);
  if (!changes) {
    changes = new Map();
    pending.set(settingsKey, changes);
  }
  changes.set(field, value);
}

export function hasPendingChanges(): boolean {
  for (const changes of pending.values()) if (changes.size > 0) return true;
  return false;
}

export async function flushChanges(): Promise<void> {
  const jobs = Array.from(pending.entries()).filter(([, changes]) => changes.size > 0);
  pending.clear();
  await Promise.all(
    jobs.map(async ([key, changes]) => {
      try {
        const res = await fetch(`/api/settings/${key}`, { cache: "no-store" });
        let saved: unknown = null;
        if (res.ok) {
          const data = await res.json();
          saved = data?.value ?? null;
        }
        const defaults = (CONTENT_DEFAULTS as Record<string, unknown>)[key] ?? {};
        let state: any = saved && typeof saved === "object" ? deepMerge(defaults, saved) : defaults;
        changes.forEach((value, field) => {
          state = setByPath(state, field, value);
        });
        await fetch(`/api/settings/${key}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: state }),
        });
      } catch {}
    })
  );
}
