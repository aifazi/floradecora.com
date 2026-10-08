import { cdnMedia } from "./cdn";

export const SITE_HEADER = {
  nav: [
    { href: "/about", label: "About", labelAr: "من نحن" },
    { href: "/services", label: "Services", labelAr: "الخدمات" },
    { href: "/projects", label: "Projects", labelAr: "المشاريع" },
    { href: "/blog", label: "Blog", labelAr: "المدونة" },
    { href: "/contact", label: "Contact", labelAr: "اتصل بنا" },
  ],
  cta: { label: "Start a project", labelAr: "ابدأ مشروعًا" },
};

export const SITE_FOOTER = {
  blurb: "We draw the plan, then we grow it. Designing, building and operating themed gardens and public parks across the UAE since 2003. 300+ projects delivered.",
  exploreHeading: "Explore",
  exploreLinks: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Journal" },
    { href: "/contact", label: "Contact" },
  ],
  servicesHeading: "Services",
  servicesLinks: [
    { href: "/services", label: "Themed Gardens" },
    { href: "/services", label: "Landscaping Design" },
    { href: "/services", label: "Irrigation Systems" },
    { href: "/services", label: "Commercial Nurseries" },
    { href: "/services", label: "Pest Control" },
    { href: "/services", label: "Maintenance" },
  ],
  social: [
    { icon: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
    { icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/" },
    { icon: "youtube", label: "YouTube", href: "https://www.youtube.com/" },
  ],
  copyright: "© {year} Flora Decora. Crafted for the desert, built to last.",
  availability: "Available for new projects",
};

export const SITE_CONTACT = {
  addressShort: "Office 106, Al Reef Bldg, Al Ain, UAE",
  addressLines: ["Office 106, Al Reef Building,", "Asharij, Al Ain, UAE"],
  phone: "+971 3 734 4243",
  phoneDial: "+97137344243",
  email: "info@floradecora.com",
  hours: "Sunday — Thursday, 8:00 AM — 5:00 PM",
  hoursNote: "Site visits within 72h",
  replyTime: "Avg. reply — 4 hours",
  replyNote: "We'll scope your project in 24h",
};

export const SITE_WHATSAPP = {
  phone: "97137344243",
  message: "Hi Flora Decora, I have a project to discuss.",
};

export const SITE_SEO = {
  title: "Flora Decora | Landscaping, Themed Gardens & Tourist Attractions",
  description:
    "Flora Decora is a premier UAE landscaping company in Al Ain — designing, building and operating themed gardens, butterfly gardens, public parks and municipal landscapes since 2003. 300+ projects across the UAE.",
  keywords: ["Flora Decora", "landscaping UAE", "Al Ain landscaping", "themed gardens", "butterfly garden", "public parks", "irrigation systems", "nursery Abu Dhabi"],
  ogDescription: "Design, build, operate — themed gardens and public parks across the UAE since 2003. 300+ projects delivered.",
  twitterTitle: "Flora Decora | Landscaping, Themed Gardens & Tourist Attractions",
  twitterDescription: "Premier UAE landscaping — themed gardens, public parks, irrigation since 2003.",
  siteName: "Flora Decora",
};

export const SITE_JSONLD = {
  name: "Flora Decora",
  description:
    "Premier UAE landscaping company specializing in themed gardens, butterfly gardens, public parks and municipal landscaping since 2003.",
  logo: "https://cdn.aifazi.net/media/assest/StKLapP%20-%20Imgur.png",
  image: "https://cdn.aifazi.net/media/assest/Picture2-min-scaled.jpg",
  streetAddress: "Office 106, Al Reef Building, Asharij",
  locality: "Al Ain",
  region: "Abu Dhabi",
  country: "AE",
  foundingDate: "2003",
  priceRange: "$$",
};

export const PAGE_HOME = {
  hero: {
    badge: "Est. 2003 — Al Ain, UAE",
    badgeChip: "20+ Years",
    titleLine1: "We draw",
    titleLine2: "the plan,",
    titleLine3: "then we grow it.",
    subtitle:
      "Flora Decora designs, builds and operates themed gardens, public parks and tourist attractions across the UAE — from the first line on a site plan to twenty years of maintenance after.",
    primaryCta: "Start a project",
    secondaryCta: "View projects",
    trusted: "Trusted by 150+ clients",
    rating: "Rated 4.9/5 by municipal clients",
    ratingBy: "Al Ain Municipality • Abu Dhabi Parks",
    bgImage: cdnMedia("Picture2-min-scaled.jpg"),
    bgImageAlt: "Lush themed garden by Flora Decora in Al Ain, UAE",
    circleImage: cdnMedia("Picture3-min-scaled.jpg"),
    featureImage: cdnMedia("Picture3-min-scaled.jpg"),
    featureImageAlt: "Butterfly Garden Al Ain by Flora Decora",
    featureLabel: "Featured",
    featureTitle: "Butterfly Garden — Al Ain",
    irrigationImage: cdnMedia("Picture4-min.png"),
    irrigationTitle: "Irrigation Systems",
    irrigationNote: "Design & installation",
    statValue: "300+ projects",
    statNote: "Delivered on time",
    marquee: ["Themed Gardens", "Public Parks", "Irrigation", "Nurseries"],
  },
  stats: [
    { n: 20, suffix: "+", label: "Years Experience", sub: "Since 2003" },
    { n: 300, suffix: "+", label: "Projects Delivered", sub: "UAE wide" },
    { n: 150, suffix: "+", label: "Clients Served", sub: "Gov & private" },
  ],
  about: {
    eyebrow: "About Flora Decora",
    title: "Two decades of shaping the UAE's public gardens.",
    features: [
      { k: "01", v: "In-house team" },
      { k: "02", v: "End-to-end" },
      { k: "03", v: "20 yrs care" },
    ],
    p1: "We are a premier landscaping and gardening company specializing in designing, constructing and operating touristic theme gardens and public parks throughout the United Arab Emirates.",
    p2: "Design, consultancy, planning, nurseries, hard and soft landscape, irrigation and ongoing operation are all managed in-house — by the same teams from first sketch to final hedge trim.",
    cta: "More about our studio",
    image: cdnMedia("Picture4-min.png"),
    imageAlt: "Flora Decora nursery and landscape operations",
    liveChip: "Live site — Al Ain",
    teamValue: "150+",
    teamLabel: "Skilled horticulturists",
    coverageLabel: "Coverage",
    coverageValue: "Al Ain → Abu Dhabi",
  },
  gallery: {
    eyebrow: "Selected Work — Built Projects",
    title: "Concept to bloom, all in-house.",
    cta: "View all projects →",
    intro: "A selection of built work from Al Ain and Abu Dhabi — concepts available on request.",
    badge: "Built",
    items: [
      { src: cdnMedia("Picture2-min-scaled.jpg"), title: "Butterfly Garden — Al Ain", meta: "4,200 m² • Built 2023" },
      { src: cdnMedia("Picture3-min-scaled.jpg"), title: "Municipal Nursery", meta: "12,000 m² • Built 2023" },
      { src: cdnMedia("01_1 - Photo.jpg.jpeg"), title: "Central Park — Al Ain", meta: "18,000 m² • Built 2022" },
      { src: cdnMedia("05.jpg.jpeg"), title: "Desert Oasis — Abu Dhabi", meta: "9,500 m² • Built 2022" },
      { src: cdnMedia("Picture4-min.png"), title: "Irrigation Master Plan", meta: "8 parks • Built 2023" },
      { src: cdnMedia("6.png"), title: "Site Master Plan", meta: "Al Ain • Plan 2024" },
    ],
    thumbs: [
      cdnMedia("8.png"),
      cdnMedia("01_1 - Photo.jpg.jpeg"),
      cdnMedia("05.jpg.jpeg"),
      cdnMedia("Picture2-min-scaled.jpg"),
      cdnMedia("Picture3-min-scaled.jpg"),
      cdnMedia("Picture4-min.png"),
    ],
  },
  concepts: {
    eyebrow: "Preview — AI Concepts",
    title: "Design proposals before build.",
    badge: "12 AI renders • Not yet built",
    intro: "Concepts for preview — not built. Approve a direction and we’ll build it for real.",
    items: [
      { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_38_00 PM.png"), label: "Concept 01" },
      { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_38_43 PM.png"), label: "Concept 02" },
      { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_39_48 PM.png"), label: "Concept 03" },
      { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_42_38 PM.png"), label: "Concept 04" },
      { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_43_24 PM.png"), label: "Concept 05" },
      { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_46_54 PM.png"), label: "Concept 06" },
      { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_49_03 PM.png"), label: "Concept 07" },
      { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_51_18 PM.png"), label: "Concept 08" },
      { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_52_08 PM.png"), label: "Concept 09" },
      { src: cdnMedia("ChatGPT Image Jul 29, 2026, 11_58_10 PM.png"), label: "Concept 10" },
      { src: cdnMedia("ChatGPT Image Jul 30, 2026, 12_04_31 AM.png"), label: "Concept 11" },
      { src: cdnMedia("ChatGPT Image Jul 30, 2026, 12_15_15 AM.png"), label: "Concept 12" },
    ],
  },
  services: {
    eyebrow: "What we do",
    title: "Eight disciplines, one in-house team.",
    intro: "From concept render to daily maintenance — we keep it all under one roof so the garden actually matches the drawing.",
    cta: "View all services →",
    explore: "Explore",
  },
  process: {
    eyebrow: "How we work",
    title: "From handover to steady-state — in three moves.",
    steps: [
      { phase: "01 — Setup", title: "Initial Setup", points: ["Trained, experienced staff placed on site", "PPE, specialized tools and equipment", "Landscaping plan tailored to client"], color: "bg-ochre" },
      { phase: "02 — Launch", title: "Initial Operations", points: ["Day-to-day operations schedule", "Staff briefed on client requirements", "Weekly site inspections begin"], color: "bg-sage" },
      { phase: "03 — Sustain", title: "Ongoing Operations", points: ["Consumables ordered on a monthly cycle", "Colour-coded zoning for suitable use", "Advanced lawn analysis & treatment"], color: "bg-forest" },
    ],
  },
  cta: {
    chip: "✦ Let's break ground",
    title: "Have a garden, park or attraction to plan?",
    sub: "Tell us the site, the budget and the timeline — we'll bring the plan and the plants.",
    primary: "Send an inquiry",
    secondary: "Call +971 3 734 4243",
    tags: ["Avg. reply — 4 hours", "No pitch deck required", "Site visit within 72h"],
  },
};

export const PAGE_ABOUT = {
  meta: {
    title: "About Us",
    description: "Flora Decora is a premier UAE landscaping company with over 20 years of experience.",
  },
  hero: {
    badge: "About Us — CDN",
    titleLead: "A studio built to see a garden ",
    titleHighlight: "through",
    titleRest: ", not just design it.",
    image: cdnMedia("Picture2-min-scaled.jpg"),
    imageAlt: "Flora Decora public park landscape in Al Ain",
  },
  intro: {
    lead: "We are Flora Decora — Al Ain, UAE. A premier landscaping studio for touristic theme gardens and public parks.",
    p2: "With over 20 years and 300+ projects, we are one of the region's leaders in vertical gardens, theme gardens and municipal landscaping.",
    image: cdnMedia("ChatGPT Image Jul 29, 2026, 11_42_38 PM.png"),
    imageAlt: "Desert oasis garden vision by Flora Decora",
    p3: "Design, consultancy, planning, nurseries, hard & soft landscape, irrigation and operation — all managed in-house by our own technicians.",
    quote: "One team, one plan — from first sketch to the twentieth year of maintenance.",
  },
  mission: {
    eyebrow: "Our Mission",
    title: "Cost-efficient work, reputations built on it.",
    body: "To deliver the best product and service in the most cost-efficient way possible, and to build healthy business relations in an industry that comes to know us by reputation.",
    values: [
      { title: "Design that exceeds expectations", body: "We inspire our clients and the public they serve through design solutions that improve the human spirit, the public realm and biodiversity.", icon: "◐" },
      { title: "Always learning", body: "We continually learn from the natural world, other practitioners and the scientific community about new, effective techniques.", icon: "◎" },
      { title: "A place worth working", body: "We provide our staff with a challenging, respectful and exciting place of work — because gardens are only as good as the people who build them.", icon: "✦" },
    ],
  },
  principles: {
    eyebrow: "Principles",
    title: "How we judge our own designs.",
    intro: "Every design is judged against the same principles used across the fine and applied arts.",
    items: [
      { title: "Simplicity", body: "Achieved through repetition of colours, textures, plants, shapes and materials — not the opposite of complexity, but its resolution." },
      { title: "Focalization", body: "The eye is drawn first to a focal point — plant, hardscape, colour or texture — that commands attention." },
      { title: "Balance", body: "Visual balance in the landscape is a comfortable experience, the way physical balance is a comfortable state." },
      { title: "Proportion & Scale", body: "Vertical, horizontal and spatial relationships, shaped by how the viewer's eye moves through the space." },
      { title: "Rhythm & Line", body: "Rhythm repeats after separation — an arc, a shape. Line is how the eye moves through a landscape." },
      { title: "Unity", body: "Every component is valued on its own, but together they create one collective experience." },
    ],
  },
  timeline: {
    eyebrow: "Timeline",
    title: "20+ years, one project at a time.",
    events: [
      { year: "2003", title: "Founded in Al Ain", desc: "Started with municipal maintenance and private villas." },
      { year: "2009", title: "First Themed Garden", desc: "Butterfly garden prototype — later scaled to 4,200 m²." },
      { year: "2015", title: "Nursery & Steel Hub", desc: "12,000 m² nursery + in-house fabrication for shade structures." },
      { year: "2019", title: "100+ Projects", desc: "Coverage Al Ain → Abu Dhabi, 150+ skilled horticulturists." },
      { year: "2023", title: "Smart Irrigation", desc: "Retrofit 8 parks, -22% water use with sensor-driven drip." },
      { year: "2026", title: "300+ and Growing", desc: "Vertical gardens, sports fields and tourist attractions." },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What clients say.",
    chips: ["Trusted by 150+ clients", "Avg. 4.9/5 satisfaction"],
    reviews: [
      {
        name: "Al Ain Municipality",
        role: "Parks Department",
        text: "20 years of reliable maintenance — their teams are on-site before we call. The butterfly garden has become the city's most visited attraction.",
        rating: 5,
      },
      {
        name: "Abu Dhabi Parks",
        role: "Operations Division",
        text: "Nursery supply and irrigation retrofit cut water 22% without losing green cover. Their smart scheduling pays for itself every quarter.",
        rating: 5,
      },
      {
        name: "Private Developer",
        role: "Al Reef Residence",
        text: "From master plan to bloom in 14 weeks. One team, one plan — it shows. The garden doubled our property value within the first year.",
        rating: 5,
      },
      {
        name: "Ministry of Climate Change",
        role: "UAE Green Agenda 2030",
        text: "Flora Decora's native planting matrices are now the benchmark for arid-climate landscaping. Their Ghaf and Sidr survival rates exceed 95%.",
        rating: 5,
      },
      {
        name: "Tourism Authority",
        role: "Al Ain Tourism",
        text: "The themed gardens they designed for us now attract over 200,000 visitors annually. Their understanding of desert microclimates is unmatched.",
        rating: 5,
      },
      {
        name: "Education City",
        role: "Campus Landscaping",
        text: "They transformed 18,000 m² of desert into a living campus with zero additional water consumption. The outdoor classrooms are in constant use.",
        rating: 5,
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Before you visit, a few answers.",
    items: [
      {
        q: "What areas do you cover?",
        a: "We operate across the entire UAE — Al Ain, Abu Dhabi, Dubai, Sharjah and the Northern Emirates. For municipal and large-scale projects we deploy dedicated teams to any emirate within 48 hours of contract signing.",
      },
      {
        q: "Do you handle maintenance after build?",
        a: "Yes — operation & maintenance for 20+ years is our core. Weekly inspections, monthly consumable planning, irrigation tuning, seasonal replanting and pest management are all managed by our own crews. We never subcontract maintenance.",
      },
      {
        q: "How water-efficient are your designs?",
        a: "Industry-leading. Smart drip, zoned scheduling and soil-moisture sensors. Our 2023 Al Ain retrofit cut consumption 22% across 8 parks while improving turf health. We target 30% savings on all new projects.",
      },
      {
        q: "What's the typical timeline?",
        a: "Concept 2–4 weeks, construction 8–16 weeks depending on scope. Site visits within 72h of first inquiry. We deliver fixed-price quotes with no hidden costs.",
      },
      {
        q: "Can you supply plants from your nursery?",
        a: "Yes — our 12,000 m² Abu Dhabi nursery produces 40,000 seedlings per month across 120+ species. Same-day delivery to Al Ain and Abu Dhabi, 24-hour delivery to Dubai. All stock is acclimatised to UAE conditions.",
      },
      {
        q: "Do you work with international design standards?",
        a: "Yes. Our team is certified in LEED, Estidama and CEEQUAL. We follow BS 8545 for tree procurement and BS 4428 for landscape operations. All projects meet or exceed municipality technical requirements.",
      },
      {
        q: "What about extreme heat resilience?",
        a: "We select species rated for 50°C+ and use subsurface drip to reduce evaporation. Our shade structures lower soil temperature by 8–12°C. Every design includes a heat-stress protocol for July–September.",
      },
      {
        q: "How do you price — fixed or variable?",
        a: "Both. Fixed-price for defined scopes (most common), cost-plus for phased municipal work. Transparent breakdowns with every quote. No surprises.",
      },
    ],
  },
};

export const PAGE_CONTACT = {
  meta: {
    title: "Contact",
    description: "Get in touch with Flora Decora for landscaping and themed garden projects across the UAE.",
  },
  hero: {
    badge: "Contact — CDN",
    title: "Tell us about the ground you're working with.",
    image: cdnMedia("Picture4-min.png"),
    imageAlt: "Flora Decora landscape detail",
  },
  card: {
    officeLabel: "Office",
    phoneLabel: "Phone",
    emailLabel: "Email",
    hoursLabel: "Hours",
    mapImage: cdnMedia("Picture2-min-scaled.jpg"),
    mapImageAlt: "Flora Decora office location Al Ain",
    mapChip: "📍 Al Ain, UAE — via CDN",
    formTitle: "Send an inquiry",
  },
  form: {
    name: "Full name",
    email: "Email address",
    phone: "Phone (optional)",
    projectType: "Project type",
    projectTypePlaceholder: "e.g. themed garden, irrigation",
    messageLabel: "Tell us about your project",
    messagePlaceholder: "Site location, scope, and timeline...",
    submit: "Send inquiry",
    sending: "Sending...",
    success: "Thank you — your inquiry has been sent. Our team will reply within 4 hours.",
    errorFallback: "Something went wrong sending your message. Please try again, or email us directly at info@floradecora.com.",
    validationName: "Please enter your full name.",
    validationEmail: "Please enter a valid email.",
    validationMessage: "Message should be at least 10 characters.",
  },
};

export const PAGE_SERVICES = {
  meta: {
    title: "Services",
    description: "Landscaping design, themed gardens, development, nurseries, irrigation, pest control and maintenance.",
  },
  hero: {
    badge: "Services",
    title: "Nine disciplines, one in-house team.",
    subtitle:
      "Every stage of a landscape's life — design, build, plant, irrigate, protect and maintain — handled by our own technicians.",
  },
  cta: {
    title: "Not sure where to start?",
    subtitle: "Tell us what you're building — we'll scope it in 24h.",
    button: "Send an inquiry →",
  },
};

export const PAGE_PROJECTS = {
  meta: {
    title: "Projects",
    description:
      "300+ landscaping projects across the UAE — butterfly gardens, public parks, nurseries and irrigation. View case studies from Al Ain Municipality and Abu Dhabi Parks.",
  },
  hero: {
    badge: "Projects • {count} Case Studies",
    title: "Gardens, parks & nurseries built to last 20 years.",
    subtitle:
      "300+ projects for Al Ain Municipality & Abu Dhabi Parks — from butterfly houses to smart irrigation. Filter by type or view case study.",
    image: cdnMedia("ChatGPT Image Jul 30, 2026, 12_15_15 AM.png"),
    imageAlt: "Flora Decora canopy walk garden project",
  },
  stats: [
    { dynamic: "count", suffix: "", label: "Case Studies" },
    { n: 150, suffix: "+", label: "Clients" },
    { n: 20, suffix: "+", label: "Years" },
  ],
  section: {
    eyebrow: "Selected Work",
    title: "From concept to bloom — all in-house.",
    helper: "Tap a card for the full case study.",
    searchPlaceholder: "Search projects, posts...",
  },
};

export const PAGE_BLOG = {
  meta: {
    title: "Blog",
    description: "Gardening insights, irrigation and park operations from Al Ain, UAE.",
  },
  hero: {
    badge: "Journal",
    title: "What we learn in 45°C shade.",
  },
  section: {
    eyebrow: "Latest",
    title: "From nursery to park.",
    readLabel: "Read →",
  },
  newsletter: {
    badge: "Monthly newsletter",
    title: "Get monthly garden notes",
    subtitle: "Irrigation tips, plant palettes, project before/afters. No spam — unsubscribe anytime.",
    placeholder: "Enter your email",
    subscribe: "Subscribe",
    sending: "Sending...",
    subscribed: "✓ Subscribed",
    error: "Check email & try again.",
  },
};

export const SITE_MANIFEST = {
  name: "Flora Decora — Landscaping & Themed Gardens",
  short_name: "Flora Decora",
  description: "Premier UAE landscaping — themed gardens, public parks, irrigation since 2003. Al Ain, UAE.",
};

export const CONTENT_DEFAULTS: Record<string, unknown> = {
  site_header: SITE_HEADER,
  site_footer: SITE_FOOTER,
  site_contact: SITE_CONTACT,
  site_whatsapp: SITE_WHATSAPP,
  site_seo: SITE_SEO,
  site_jsonld: SITE_JSONLD,
  site_manifest: SITE_MANIFEST,
  page_home: PAGE_HOME,
  page_about: PAGE_ABOUT,
  page_contact: PAGE_CONTACT,
  page_services: PAGE_SERVICES,
  page_projects: PAGE_PROJECTS,
  page_blog: PAGE_BLOG,
};
