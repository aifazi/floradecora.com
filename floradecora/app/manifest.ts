import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flora Decora — Landscaping & Themed Gardens",
    short_name: "Flora Decora",
    description: "Premier UAE landscaping — themed gardens, public parks, irrigation since 2003. Al Ain, UAE.",
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
