export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read: string;
  content: string[];
  tags: string[];
}

export const POSTS: Post[] = [
  {
    slug: "smart-irrigation-22-percent",
    title: "How we cut 22% water use in 8 Al Ain parks",
    excerpt: "Sensors, zoned drip and scheduling — the retrofit that saved water without losing green.",
    date: "2024-03-10",
    read: "4 min",
    tags: ["Irrigation", "Sustainability"],
    content: ["Al Ain's parks face 45°C summers. Our team retrofitted 8 sites with soil-moisture probes and smart valves.", "Result: 22% lower consumption, greener turf, weekly data reports for the municipality."],
  },
  {
    slug: "butterfly-garden-build",
    title: "Building a butterfly garden in the desert",
    excerpt: "From shade houses to host plants — what it takes to keep 1,200 butterflies thriving.",
    date: "2023-11-02",
    read: "5 min",
    tags: ["Themed Gardens"],
    content: ["Butterfly gardens need microclimate control, nectar succession and predator management.", "We share our plant palette: 40% native, 60% adapted exotics for year-round bloom."],
  },
  {
    slug: "nursery-40k-seedlings",
    title: "Inside our 12,000 m² nursery — 40k seedlings a month",
    excerpt: "Propagation, mother stock and logistics for 300+ projects.",
    date: "2024-01-18",
    read: "3 min",
    tags: ["Nurseries"],
    content: ["Our Abu Dhabi hub runs shade houses and propagation beds with 30% water saving via drip.", "Logistics: same-day delivery to Al Ain and Abu Dhabi sites."],
  },
];

export function getPost(slug: string) { return POSTS.find((p) => p.slug === slug); }
