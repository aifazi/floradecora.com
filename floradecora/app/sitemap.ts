import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects";
import { POSTS } from "@/lib/blog";

const siteUrl = "https://floradecora.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/about", "/services", "/projects", "/contact", "/quote", "/blog"];
  const projectSlugs = PROJECTS.map((p) => p.slug);
  const postSlugs = POSTS.map((p) => p.slug);
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
