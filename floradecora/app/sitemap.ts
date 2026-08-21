import type { MetadataRoute } from "next";

const siteUrl = "https://floradecora.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/about", "/services", "/projects", "/contact", "/quote", "/blog"];
  // dynamic — generated at build time, no async needed here (static import would break)
  // For full dynamic, import in next build; keeping simple with static list + known slugs
  const projectSlugs = [
    "butterfly-garden-al-ain",
    "municipal-nursery-abu-dhabi",
    "irrigation-master-plan",
    "al-ain-central-park",
    "desert-oasis-abu-dhabi",
    "site-master-plan-6",
    "planting-study-8",
    "desert-oasis-concept",
    "palm-plaza-concept",
    "wildflower-meadow-concept",
    "canopy-walk-concept",
  ];
  const postSlugs = ["smart-irrigation-22-percent", "butterfly-garden-build", "nursery-40k-seedlings"];
  const routes = [
    ...staticRoutes,
    ...projectSlugs.map((s) => `/projects/${s}`),
    ...postSlugs.map((s) => `/blog/${s}`),
  ];
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : route.startsWith("/projects") || route.startsWith("/blog") ? "monthly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/projects/") ? 0.8 : route === "/projects" ? 0.9 : 0.7,
  }));
}
