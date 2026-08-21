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
  built?: boolean; // true = built real project, false = concept
}

export const PROJECTS: Project[] = [
  // ——— BUILT REAL PROJECTS (prioritized first) ———
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
    description: "Touristic butterfly house and themed garden — design, build and ongoing operation by Flora Decora. Hosts 1,200+ butterflies across native and tropical zones with integrated irrigation and shaded walkways. Delivered in 14 weeks.",
    services: ["Themed Gardens", "Irrigation", "Operation & Maintenance"],
    featured: true,
    built: true,
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
    description: "Commercial nursery supplying 300+ projects — shade houses, propagation beds and mother stock. Delivers 40k seedlings/month with 30% water saving via drip irrigation. Stock includes Ghaf, Sidr, Palm.",
    services: ["Commercial Nurseries", "Irrigation Systems", "Development"],
    built: true,
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
    description: "Efficient irrigation retrofit for 8 municipal parks — soil-moisture sensors, zoned drip and smart scheduling. Cut consumption 22% while improving turf health. ROI in 11 months.",
    services: ["Irrigation Systems", "Landscaping Design"],
    built: true,
  },
  {
    slug: "al-ain-central-park",
    title: "Al Ain Central Park — Revamp",
    type: "Photo",
    year: "2022",
    location: "Al Ain, UAE",
    area: "18,000 m²",
    client: "Al Ain Municipality",
    img: cdnMedia("01_1 - Photo.jpg.jpeg"),
    gallery: [cdnMedia("01_1 - Photo.jpg.jpeg"), cdnMedia("05.jpg.jpeg"), cdnMedia("Picture2-min-scaled.jpg")],
    description: "Phased revamp of central park — play zones, sports courts and quiet gardens with steel shade structures. Added 1.2 km accessibility walk and 300 native trees. Completed on time.",
    services: ["Landscaping Design", "Steel Fabrication", "Outdoor Sports Facilities"],
    built: true,
  },
  {
    slug: "desert-oasis-abu-dhabi",
    title: "Desert Oasis — Abu Dhabi Corniche",
    type: "Photo",
    year: "2022",
    location: "Abu Dhabi, UAE",
    area: "9,500 m²",
    client: "Abu Dhabi Municipality",
    img: cdnMedia("05.jpg.jpeg"),
    gallery: [cdnMedia("05.jpg.jpeg"), cdnMedia("Picture4-min.png"), cdnMedia("01_3 - Photo.jpg.jpeg")],
    description: "Corniche greening with palm canopy, wadis and native Ghaf trees. Low-water palette for 45°C resilience, with dune-shaped earthworks and night lighting.",
    services: ["Themed Gardens", "Pest Control", "Maintenance"],
    built: true,
  },
  // ——— DOCUMENTATION / PLANS (real) ———
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
    description: "Master layout for phased park expansion — zoning for play, sports and quiet gardens with steel shade structures. Approved for 2025 build.",
    services: ["Landscaping Design", "Steel Fabrication", "Outdoor Sports Facilities"],
    built: true,
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
    description: "Planting matrix for arid climate — 40% native species, 60% adapted exotics for shade, scent and bloom succession. Basis for all park palettes.",
    services: ["Landscaping Design", "Commercial Nurseries"],
    built: true,
  },
  // ——— CONCEPTS (clearly marked, low priority) ———
  {
    slug: "desert-oasis-concept",
    title: "Desert Oasis — Concept (Proposal)",
    type: "AI Render",
    year: "2026",
    location: "Concept",
    area: "6,500 m²",
    client: "Concept",
    img: cdnMedia("ChatGPT Image Jul 29, 2026, 11_38_43 PM.png"),
    gallery: [cdnMedia("ChatGPT Image Jul 29, 2026, 11_38_43 PM.png"), cdnMedia("ChatGPT Image Jul 29, 2026, 11_38_00 PM.png")],
    description: "Concept render for a desert oasis with palm canopy, wadis and native Ghaf trees. Proposal vision — not yet built. Explores low-water planting for 45°C resilience.",
    services: ["Themed Gardens", "Landscaping Design"],
    built: false,
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
    description: "Palm-lined plaza study — vertical rhythm, shade and dura-grass for high footfall zones. Concept only.",
    services: ["Landscaping Design", "Development"],
    built: false,
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
    description: "Seasonal meadow with staggered bloom — design for pollinators and year-round color without replanting. Concept.",
    services: ["Themed Gardens", "Pest Control"],
    built: false,
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
    description: "Elevated walkway through Ghaf canopy — accessibility-first with interpretive nodes for biodiversity education. Awaiting client approval.",
    services: ["Themed Gardens", "Steel Fabrication"],
    built: false,
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export const BUILT_PROJECTS = PROJECTS.filter((p) => p.built);
export const CONCEPT_PROJECTS = PROJECTS.filter((p) => !p.built);
