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
    content: [
      "Al Ain's parks face 45°C summers, relentless evaporation and some of the highest per-capita water consumption in the UAE. When Al Ain Municipality asked us to reduce consumption without sacrificing turf quality, we knew that simply watering less was not going to work. The solution had to be smarter, not less.",
      "Our team retrofitted eight municipal parks over a six-week period. We installed soil-moisture probes at 15 cm and 30 cm depths across every zone, connected to a central controller that reads actual plant-available water rather than relying on a fixed schedule. Each zone was then fitted with pressure-compensating drip lines and individual solenoid valves, allowing us to apply exactly the right amount of water to each area.",
      "The scheduling algorithm we developed factors in real-time evapotranspiration data, soil moisture trends, and even the type of turf grass in each zone. Parks with Bermuda grass — which tolerates higher soil moisture depletion — receive less frequent but deeper irrigation, while parks with more demanding cool-season turf receive lighter, more frequent applications.",
      "Within the first three months, we recorded a 22% reduction in total water consumption across all eight parks. More importantly, turf quality scores — measured by NDVI (Normalized Difference Vegetation Index) — actually improved by 8%, because the plants were receiving water when they actually needed it rather than on a fixed calendar schedule.",
      "The return on investment came in just 11 months, factoring in the reduced water bills and the lower maintenance costs associated with healthier, more uniformly irrigated turf. The municipality has since asked us to extend the programme to an additional 12 parks in 2025.",
    ],
  },
  {
    slug: "butterfly-garden-build",
    title: "Building a butterfly garden in the desert",
    excerpt: "From shade houses to host plants — what it takes to keep 1,200 butterflies thriving.",
    date: "2023-11-02",
    read: "5 min",
    tags: ["Themed Gardens"],
    content: [
      "The Butterfly Garden in Al Ain is one of our most complex and rewarding projects. It sounds simple — release butterflies, add flowers — but the reality of keeping 1,200+ butterflies alive and breeding in 45°C heat requires a carefully designed microclimate and a deep understanding of lepidopteran ecology.",
      "The garden is built around a 1,200 m² shade house with 70% UV-blocking shade cloth, supported by a steel frame designed to withstand the occasional desert wind storm. Inside, we maintain a temperature range of 26–32°C using a combination of natural ventilation, misting systems, and evaporative cooling pads. Humidity is kept at 60–80% through timed misters that activate when relative humidity drops below the target range.",
      "The plant palette is the real secret. We use 40% native species — including Ghaf (Prosopis cineraria), Sidr (Ziziphus spina-christi), and harmal (Rhazya stricta) — combined with 60% adapted exotics selected for their nectar production and host-plant value. Milkweed (Asclepias curassavica) is the sole host plant for our Monarch colony, while citrus trees support the Giant Swallowtail. Nectar plants are chosen to provide year-round bloom succession, so there is always something in flower regardless of season.",
      "Daily operations include monitoring butterfly counts, replacing host plants that have been stripped by caterpillars, and harvesting pupae for our breeding programme. We release approximately 200 newly emerged adults each week to maintain a stable population. The garden now hosts over 15 species and attracts more than 50,000 visitors per year.",
    ],
  },
  {
    slug: "nursery-40k-seedlings",
    title: "Inside our 12,000 m² nursery — 40k seedlings a month",
    excerpt: "Propagation, mother stock and logistics for 300+ projects.",
    date: "2024-01-18",
    read: "3 min",
    tags: ["Nurseries"],
    content: [
      "Our Abu Dhabi nursery is the backbone of every project Flora Decora delivers. Without a reliable supply of healthy, acclimatised plants, even the best landscape design fails within the first summer. The 12,000 m² facility produces 40,000 seedlings and mature plants each month, supporting more than 300 active project sites across the UAE.",
      "The nursery is divided into four distinct zones: a 4,000 m² mother stock area where we maintain over 2,000 mature specimens of more than 120 species; a 3,000 m² propagation house with automated misting and bottom-heated benches for seed germination and cutting propagation; a 2,500 m² hardening-off area where greenhouse-raised plants are gradually exposed to outdoor conditions; and a 2,500 m² dispatch zone with cold-chain logistics for same-day delivery to Al Ain and Abu Dhabi.",
      "Water efficiency is built into every stage. The propagation house uses a recirculating misting system that captures and filters 95% of water, reducing consumption by 60% compared to overhead spray benches. Mother stock areas are irrigated with pressure-compensating drip lines connected to the same soil-moisture sensor network we use in our park retrofits. Overall, the nursery uses 30% less water than a conventional facility of equivalent size.",
      "Logistics are where many nurseries fall short. We operate a fleet of eight temperature-controlled trucks that maintain 18–22°C in the cargo area, preventing heat stress during transport. Plants are delivered in biodegradable grow bags that can be planted directly, eliminating transplant shock. Our delivery window is 24 hours from order to site placement, and we have never missed a delivery deadline.",
    ],
  },
];

export function getPost(slug: string) { return POSTS.find((p) => p.slug === slug); }
