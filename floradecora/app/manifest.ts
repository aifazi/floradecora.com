import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { SITE_MANIFEST } from "@/lib/content-defaults";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const m = await getContent("site_manifest", SITE_MANIFEST);
  return {
    name: m.name,
    short_name: m.short_name,
    description: m.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0F1B14",
    theme_color: "#16261C",
    icons: [
      { src: "/logo.png", sizes: "192x192", type: "image/png" },
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
