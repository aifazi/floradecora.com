import { cdnMedia } from "./cdn";

export type ProjectType = "Photo" | "AI Render" | "Site Plan" | "Brand";

export interface Project {
  slug: string;
  title: string;
  type: ProjectType;
  year: string;
  location: string;
  area: string;
  client: string;
  img: string;
  gallery: string[];
  description: string;
  services: string[];
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "butterfly-garden-al-ain",
    title: "Butterfly Garden — Al Ain",
    type: "Photo",
    year: "2023",
    location: "Al Ain, UAE",
    area: "4,200 m²",
    client: "Al Ain Municipality",
    img: cdnMedia("Picture2-min-scaled.jpg"),
    gallery: [cdnMedia("Picture2-min-scaled.jpg"), cdnMedia("Picture3-min-scaled.jpg"), cdnMedia("Picture4-min.png")],
    description: "Touristic butterfly house and themed garden — design, build and ongoing operation by Flora Decora. Hosts 1,200+ butterflies across native and tropical zones with integrated irrigation and shaded walkways.",
    services: ["Themed Gardens", "Irrigation", "Operation & Maintenance"],
    featured: true,
  },
  {
    slug: "municipal-nursery-abu-dhabi",
    title: "Municipal Nursery — Abu Dhabi",
    type: "Photo",
    year: "2023",
    location: "Abu Dhabi, UAE",
    area: "12,000 m²",
    client: "Abu Dhabi Parks",
    img: cdnMedia("Picture3-min-scaled.jpg"),
    gallery: [cdnMedia("Picture3-min-scaled.jpg"), cdnMedia("Picture2-min-scaled.jpg"), cdnMedia("6.png")],
    description: "Commercial nursery supplying 300+ projects — shade houses, propagation beds and mother stock. Delivers 40k seedlings/month with 30% water saving via drip irrigation.",
    services: ["Commercial Nurseries", "Irrigation Systems", "Development"],
  },
  {
    slug: "irrigation-master-plan",
    title: "Irrigation Master Plan — Al Ain Parks",
    type: "Photo",
    year: "2023",
    location: "Al Ain, UAE",
    area: "8 parks",
    client: "Al Ain Municipality",
    img: cdnMedia("Picture4-min.png"),
    gallery: [cdnMedia("Picture4-min.png"), cdnMedia("8.png"), cdnMedia("6.png")],
    description: "Efficient irrigation retrofit for 8 municipal parks — soil-moisture sensors, zoned drip and smart scheduling. Cut consumption 22% while improving turf health.",
    services: ["Irrigation Systems", "Landscaping Design"],
  },
  {
    slug: "desert-oasis-concept",
    title: "Desert Oasis — Concept",
    type: "AI Render",
    year: "2026",
    location: "Concept",
    area: "6,500 m²",
    client: "Concept",
    img: cdnMedia("ChatGPT Image Jul 29, 2026, 11_38_43 PM.png"),
    gallery: [cdnMedia("ChatGPT Image Jul 29, 2026, 11_38_43 PM.png"), cdnMedia("ChatGPT Image Jul 29, 2026, 11_38_00 PM.png")],
    description: "Concept render for a desert oasis with palm canopy, wadis and native Ghaf trees. Explores low-water planting for 45°C resilience.",
    services: ["Themed Gardens", "Landscaping Design"],
  },
  {
    slug: "palm-plaza-concept",
    title: "Palm Plaza — Concept",
    type: "AI Render",
    year: "2026",
    location: "Concept",
    area: "3,800 m²",
    client: "Concept",
    img: cdnMedia("ChatGPT Image Jul 29, 2026, 11_39_48 PM.png"),
    gallery: [cdnMedia("ChatGPT Image Jul 29, 2026, 11_39_48 PM.png")],
    description: "Palm-lined plaza study — vertical rhythm, shade and dura-grass for high footfall zones.",
    services: ["Landscaping Design", "Development"],
  },
  {
    slug: "wildflower-meadow-concept",
    title: "Wildflower Meadow — Concept",
    type: "AI Render",
    year: "2026",
    location: "Concept",
    area: "5,100 m²",
    client: "Concept",
    img: cdnMedia("ChatGPT Image Jul 29, 2026, 11_42_38 PM.png"),
    gallery: [cdnMedia("ChatGPT Image Jul 29, 2026, 11_42_38 PM.png")],
    description: "Seasonal meadow with staggered bloom — design for pollinators and year-round color without replanting.",
    services: ["Themed Gardens", "Pest Control"],
  },
  {
    slug: "site-master-plan-6",
    title: "Site Master — Al Ain Central Park",
    type: "Site Plan",
    year: "2024",
    location: "Al Ain, UAE",
    area: "18,000 m²",
    client: "Al Ain Municipality",
    img: cdnMedia("6.png"),
    gallery: [cdnMedia("6.png"), cdnMedia("8.png")],
    description: "Master layout for phased park expansion — zoning for play, sports and quiet gardens with steel shade structures.",
    services: ["Landscaping Design", "Steel Fabrication", "Outdoor Sports Facilities"],
  },
  {
    slug: "planting-study-8",
    title: "Planting Study — Native Palette",
    type: "Site Plan",
    year: "2024",
    location: "UAE",
    area: "—",
    client: "Internal",
    img: cdnMedia("8.png"),
    gallery: [cdnMedia("8.png"), cdnMedia("6.png")],
    description: "Planting matrix for arid climate — 40% native species, 60% adapted exotics for shade, scent and bloom succession.",
    services: ["Landscaping Design", "Commercial Nurseries"],
  },
  {
    slug: "canopy-walk-concept",
    title: "Canopy Walk — Concept",
    type: "AI Render",
    year: "2026",
    location: "Concept",
    area: "1.2 km",
    client: "Concept",
    img: cdnMedia("ChatGPT Image Jul 30, 2026, 12_15_15 AM.png"),
    gallery: [cdnMedia("ChatGPT Image Jul 30, 2026, 12_15_15 AM.png")],
    description: "Elevated walkway through Ghaf canopy — accessibility-first with interpretive nodes for biodiversity education.",
    services: ["Themed Gardens", "Steel Fabrication"],
    featured: true,
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
