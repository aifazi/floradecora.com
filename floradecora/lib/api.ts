import { PROJECTS as STATIC_PROJECTS } from "./projects";
import { POSTS as STATIC_POSTS } from "./blog";

const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:3002";

async function fetchWithFallback<T>(path: string, fallback: T): Promise<T> {
  try {
    const url = `${BACKEND.replace(/\/$/, "")}/api${path}`;
    const res = await fetch(url, { next: { revalidate: 60 }, headers: {} });
    if (!res.ok) return fallback;
    const data = await res.json();
    if (Array.isArray(data) && data.length === 0) return fallback;
    return data as T;
  } catch {
    return fallback;
  }
}

export async function getProjects() {
  return fetchWithFallback("/projects", STATIC_PROJECTS);
}

export async function getProject(slug: string) {
  try {
    const url = `${BACKEND.replace(/\/$/, "")}/api/projects/${slug}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) return res.json();
  } catch {}
  return STATIC_PROJECTS.find((p) => p.slug === slug) || null;
}

export async function getPosts() {
  return fetchWithFallback("/posts", STATIC_POSTS);
}

export async function getPost(slug: string) {
  try {
    const url = `${BACKEND.replace(/\/$/, "")}/api/posts/${slug}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) return res.json();
  } catch {}
  return STATIC_POSTS.find((p) => p.slug === slug) || null;
}

export async function getServices() {
  // static fallback from app/services/page.tsx
  const STATIC_SERVICES = [
    { slug: "themed-butterfly-gardens", title: "Themed & Butterfly Gardens", body: "End-to-end delivery of touristic theme gardens and butterfly houses, from concept through construction and long-term operation.", icon: "🦋", accent: "from-amber-400/20 to-orange-500/20", order: 0, enabled: true },
    { slug: "landscaping-design", title: "Landscaping Design", body: "Concept-to-construction design for public parks, municipal landscapes and private developments.", icon: "✎", accent: "from-emerald-400/20 to-teal-500/20", order: 1, enabled: true },
    { slug: "development", title: "Development", body: "Hard and soft landscape construction delivered by in-house crews, coordinated with design and irrigation.", icon: "⬢", accent: "from-stone-400/20 to-zinc-500/20", order: 2, enabled: true },
    { slug: "commercial-nurseries", title: "Commercial Nurseries", body: "Planning, planting and ongoing management of nurseries that supply and support our projects.", icon: "🌿", accent: "from-lime-400/20 to-green-500/20", order: 3, enabled: true },
    { slug: "outdoor-sports", title: "Outdoor Sports Facilities", body: "Design and build of outdoor sports surfaces integrated with the surrounding landscape.", icon: "◎", accent: "from-sky-400/20 to-blue-500/20", order: 4, enabled: true },
    { slug: "pest-control", title: "Pest Control", body: "Licensed pest control protecting both planted landscapes and public health.", icon: "◐", accent: "from-amber-400/15 to-yellow-500/15", order: 5, enabled: true },
    { slug: "operation-maintenance", title: "Operation & Maintenance", body: "Scheduled operations, weekly inspections and monthly consumable planning to keep every site performing.", icon: "⚙", accent: "from-zinc-400/20 to-neutral-500/20", order: 6, enabled: true },
    { slug: "irrigation-systems", title: "Irrigation Systems", body: "Efficient irrigation designed for the UAE climate, sized to each site's planting and water needs.", icon: "💧", accent: "from-cyan-400/20 to-blue-500/20", order: 7, enabled: true },
    { slug: "steel-fabrication", title: "Steel Fabrication", body: "In-house fabrication for structures, shade elements and hardscape features.", icon: "◆", accent: "from-stone-400/20 to-zinc-500/20", order: 8, enabled: true },
  ];
  return fetchWithFallback("/services", STATIC_SERVICES as unknown as never) as Promise<typeof STATIC_SERVICES>;
}

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const url = `${BACKEND.replace(/\/$/, "")}/api/settings/${key}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    const data = await res.json();
    return (data.value as T) ?? fallback;
  } catch {
    return fallback;
  }
}
