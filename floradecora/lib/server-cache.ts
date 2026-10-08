type Entry = { value: unknown; exp: number };

const store = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

export const CONTENT_TTL_MS = 5000;

export function cachedJson<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.exp > Date.now()) return Promise.resolve(hit.value as T);
  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const promise = load().then(
    (value) => {
      store.set(key, { value, exp: Date.now() + ttlMs });
      inflight.delete(key);
      return value;
    },
    (err) => {
      inflight.delete(key);
      throw err;
    }
  );
  inflight.set(key, promise);
  return promise;
}

export function invalidateContent(key?: string) {
  if (key) {
    store.delete(key);
    inflight.delete(key);
  } else {
    store.clear();
    inflight.clear();
  }
}
