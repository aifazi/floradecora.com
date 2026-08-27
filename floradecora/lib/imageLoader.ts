export default function cloudflareLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const isCdn = src.includes("cdn.aifazi.net");
  if (!isCdn) return src;
  // Cloudflare Image Resizing via /cdn-cgi/image/ — enable on cdn zone first (docs/CDN.md)
  // Fallback: append width/quality query for custom worker
  const q = quality || 75;
  // Use query param version until resizing enabled: ?width=800&quality=75&format=auto
  // When /cdn-cgi/image enabled, change to: `https://cdn.aifazi.net/cdn-cgi/image/width=${width},quality=${q},format=auto/${src.split("/media/")[1]}`
  if (src.includes("?")) return src;
  return `${src}?width=${width}&quality=${q}&format=auto`;
}
