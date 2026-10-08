import { cachedJson, CONTENT_TTL_MS } from "./server-cache";

const BACKEND = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:3002").replace(/\/$/, "");

export function deepMerge<T>(base: T, saved: unknown): T {
  if (saved === null || saved === undefined) return base;
  if (typeof base !== "object" || base === null || Array.isArray(base)) return saved as T;
  if (typeof saved !== "object" || Array.isArray(saved)) return saved as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(saved)) {
    out[k] = k in (base as Record<string, unknown>) ? deepMerge((base as Record<string, unknown>)[k], (saved as Record<string, unknown>)[k]) : (saved as Record<string, unknown>)[k];
  }
  return out as T;
}

export function getByPath(obj: any, path: string): any {
  const keys = path.split(".");
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
}

export function setByPath(obj: any, path: string, value: any): any {
  const keys = path.split(".");
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur: any = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const nextIsIndex = /^\d+$/.test(keys[i + 1]);
    let next = cur[k];
    if (next == null || typeof next !== "object") {
      next = nextIsIndex ? [] : {};
    } else if (Array.isArray(next)) {
      next = [...next];
    } else {
      next = { ...next };
    }
    cur[k] = next;
    cur = next;
  }
  cur[keys[keys.length - 1]] = value;
  return clone;
}

export async function getContent<T>(key: string, defaults: T): Promise<T> {
  try {
    const value = await cachedJson<unknown>(`set:${key}`, CONTENT_TTL_MS, async () => {
      const res = await fetch(`${BACKEND}/api/settings/${key}`, { cache: "no-store" });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.value ?? null;
    });
    if (value && typeof value === "object") return deepMerge(defaults, value);
  } catch {}
  return defaults;
}
