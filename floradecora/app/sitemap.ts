import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects";
import { POSTS } from "@/lib/blog";

const siteUrl = "https://floradecora.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/about", "/services", "/projects", "/contact", "/blog"];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/projects" ? 0.9 : 0.7,
    alternates: {
      languages: {
        en: `${siteUrl}${route}`,
        ar: `${siteUrl}${route}?lang=ar`,
        "x-default": `${siteUrl}${route}`,
      },
    },
  }));

  const projectEntries: MetadataRoute.Sitemap = PROJECTS.map((p) => {
    // Use year as proxy for lastModified; concepts 2026 are newer
    const d = new Date(`${p.year}-01-15T00:00:00Z`);
    return {
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: isNaN(d.getTime()) ? now : d,
      changeFrequency: "monthly" as const,
      priority: p.featured ? 0.85 : 0.7,
      alternates: {
        languages: {
          en: `${siteUrl}/projects/${p.slug}`,
          ar: `${siteUrl}/projects/${p.slug}?lang=ar`,
          "x-default": `${siteUrl}/projects/${p.slug}`,
        },
      },
    };
  });

  const postEntries: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
    alternates: {
      languages: {
        en: `${siteUrl}/blog/${p.slug}`,
        ar: `${siteUrl}/blog/${p.slug}?lang=ar`,
        "x-default": `${siteUrl}/blog/${p.slug}`,
      },
    },
  }));

  return [...staticEntries, ...projectEntries, ...postEntries];
}
