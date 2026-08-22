export const CDN = "https://cdn.aifazi.net";

// Tiny base64 blur placeholder for smooth image loading
export const BLUR_DATAURL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='8'/%3E%3C/filter%3E%3Crect width='100' height='100' fill='%2316261C' filter='url(%23b)' opacity='0.4'/%3E%3C/svg%3E";

export function cdn(path: string) {
  // path should be like "media/assest/6.png" or "media/assest/Picture2-min-scaled.jpg"
  // Ensure no leading slash double
  const clean = path.replace(/^\/+/, "");
  return `${CDN}/${clean}`;
}

// Pre-encoded helpers for files with spaces/commas — use encodeURI for full path
export function cdnMedia(filename: string, opts?: { w?: number; q?: number }) {
  // filename is original name e.g. "ChatGPT Image Jul 29, 2026, 11_38_00 PM.png"
  // opts.w/q reserved for Cloudflare Image Resizing (?width= & ?quality=) if enabled on cdn.aifazi.net
  const base = `${CDN}/media/assest/${encodeURIComponent(filename)}`;
  if (!opts?.w && !opts?.q) return base;
  const params = new URLSearchParams();
  if (opts.w) params.set("width", String(opts.w));
  if (opts.q) params.set("quality", String(opts.q));
  return `${base}?${params.toString()}`;
}

// Common assets map - jluAioI is primary logo per latest request
export const CDN_ASSETS = {
  logo: cdnMedia("jluAioI - Imgur.png"), // primary logo (user request)
  logoAlt: cdnMedia("StKLapP - Imgur.png"), // fallback/alt
  hero2: cdnMedia("Picture2-min-scaled.jpg"),
  hero3: cdnMedia("Picture3-min-scaled.jpg"),
  hero4: cdnMedia("Picture4-min.png"),
  six: cdnMedia("6.png"),
  eight: cdnMedia("8.png"),
  picture2: cdnMedia("Picture2-min-scaled.jpg"),
  picture3: cdnMedia("Picture3-min-scaled.jpg"),
  picture4: cdnMedia("Picture4-min.png"),
} as const;
