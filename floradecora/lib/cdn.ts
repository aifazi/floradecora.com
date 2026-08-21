export const CDN = "https://cdn.aifazi.net";

export function cdn(path: string) {
  // path should be like "media/assest/6.png" or "media/assest/Picture2-min-scaled.jpg"
  // Ensure no leading slash double
  const clean = path.replace(/^\/+/, "");
  return `${CDN}/${clean}`;
}

// Pre-encoded helpers for files with spaces/commas — use encodeURI for full path
export function cdnMedia(filename: string) {
  // filename is original name e.g. "ChatGPT Image Jul 29, 2026, 11_38_00 PM.png"
  return `${CDN}/media/assest/${encodeURIComponent(filename)}`;
}

// Common assets map
export const CDN_ASSETS = {
  logo: cdnMedia("StKLapP - Imgur.png"), // main logo wide
  logoAlt: cdnMedia("jluAioI - Imgur.png"),
  hero2: cdnMedia("Picture2-min-scaled.jpg"),
  hero3: cdnMedia("Picture3-min-scaled.jpg"),
  hero4: cdnMedia("Picture4-min.png"),
  six: cdnMedia("6.png"),
  eight: cdnMedia("8.png"),
  picture2: cdnMedia("Picture2-min-scaled.jpg"),
  picture3: cdnMedia("Picture3-min-scaled.jpg"),
  picture4: cdnMedia("Picture4-min.png"),
} as const;
