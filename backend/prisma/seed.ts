import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  // Admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@floradecora.com';
  const adminPass = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail.toLowerCase() } });
  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPass, 10);
    await prisma.user.create({ data: { email: adminEmail.toLowerCase(), password: hash, role: 'admin' } });
    console.log(`Admin created: ${adminEmail}`);
  } else console.log('Admin exists');

  // Services — 9 from static
  const services = [
    { slug: 'themed-butterfly-gardens', title: 'Themed & Butterfly Gardens', body: 'End-to-end delivery of touristic theme gardens and butterfly houses, from concept through construction and long-term operation.', icon: '🦋', accent: 'from-amber-400/20 to-orange-500/20', order: 0 },
    { slug: 'landscaping-design', title: 'Landscaping Design', body: 'Concept-to-construction design for public parks, municipal landscapes and private developments.', icon: '✎', accent: 'from-emerald-400/20 to-teal-500/20', order: 1 },
    { slug: 'development', title: 'Development', body: 'Hard and soft landscape construction delivered by in-house crews, coordinated with design and irrigation.', icon: '⬢', accent: 'from-stone-400/20 to-zinc-500/20', order: 2 },
    { slug: 'commercial-nurseries', title: 'Commercial Nurseries', body: 'Planning, planting and ongoing management of nurseries that supply and support our projects.', icon: '🌿', accent: 'from-lime-400/20 to-green-500/20', order: 3 },
    { slug: 'outdoor-sports', title: 'Outdoor Sports Facilities', body: 'Design and build of outdoor sports surfaces integrated with the surrounding landscape.', icon: '◎', accent: 'from-sky-400/20 to-blue-500/20', order: 4 },
    { slug: 'pest-control', title: 'Pest Control', body: 'Licensed pest control protecting both planted landscapes and public health.', icon: '◐', accent: 'from-amber-400/15 to-yellow-500/15', order: 5 },
    { slug: 'operation-maintenance', title: 'Operation & Maintenance', body: 'Scheduled operations, weekly inspections and monthly consumable planning to keep every site performing.', icon: '⚙', accent: 'from-zinc-400/20 to-neutral-500/20', order: 6 },
    { slug: 'irrigation-systems', title: 'Irrigation Systems', body: 'Efficient irrigation designed for the UAE climate, sized to each site\'s planting and water needs.', icon: '💧', accent: 'from-cyan-400/20 to-blue-500/20', order: 7 },
    { slug: 'steel-fabrication', title: 'Steel Fabrication', body: 'In-house fabrication for structures, shade elements and hardscape features.', icon: '◆', accent: 'from-stone-400/20 to-zinc-500/20', order: 8 },
  ];
  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, create: s, update: s });
  }
  console.log(`Services seeded: ${services.length}`);

  // Posts — 3 from static
  const posts = [
    {
      slug: 'smart-irrigation-22-percent',
      title: 'How we cut 22% water use in 8 Al Ain parks',
      excerpt: 'Sensors, zoned drip and scheduling — the retrofit that saved water without losing green.',
      content: [
        "Al Ain's parks face 45°C summers, relentless evaporation and some of the highest per-capita water consumption in the UAE. When Al Ain Municipality asked us to reduce consumption without sacrificing turf quality, we knew that simply watering less was not going to work. The solution had to be smarter, not less.",
        "Our team retrofitted eight municipal parks over a six-week period. We installed soil-moisture probes at 15 cm and 30 cm depths across every zone, connected to a central controller that reads actual plant-available water rather than relying on a fixed schedule. Each zone was then fitted with pressure-compensating drip lines and individual solenoid valves, allowing us to apply exactly the right amount of water to each area.",
        "The scheduling algorithm we developed factors in real-time evapotranspiration data, soil moisture trends, and even the type of turf grass in each zone. Parks with Bermuda grass — which tolerates higher soil moisture depletion — receive less frequent but deeper irrigation, while parks with more demanding cool-season turf receive lighter, more frequent applications.",
        "Within the first three months, we recorded a 22% reduction in total water consumption across all eight parks. More importantly, turf quality scores — measured by NDVI (Normalized Difference Vegetation Index) — actually improved by 8%, because the plants were receiving water when they actually needed it rather than on a fixed calendar schedule.",
        "The return on investment came in just 11 months, factoring in the reduced water bills and the lower maintenance costs associated with healthier, more uniformly irrigated turf. The municipality has since asked us to extend the programme to an additional 12 parks in 2025.",
      ],
      date: '2024-03-10',
      read: '4 min',
      tags: ['Irrigation', 'Sustainability'],
      cover: '',
      published: true,
    },
    {
      slug: 'butterfly-garden-build',
      title: 'Building a butterfly garden in the desert',
      excerpt: 'From shade houses to host plants — what it takes to keep 1,200 butterflies thriving.',
      content: [
        "The Butterfly Garden in Al Ain is one of our most complex and rewarding projects. It sounds simple — release butterflies, add flowers — but the reality of keeping 1,200+ butterflies alive and breeding in 45°C heat requires a carefully designed microclimate and a deep understanding of lepidopteran ecology.",
        "The garden is built around a 1,200 m² shade house with 70% UV-blocking shade cloth, supported by a steel frame designed to withstand the occasional desert wind storm. Inside, we maintain a temperature range of 26–32°C using a combination of natural ventilation, misting systems, and evaporative cooling pads. Humidity is kept at 60–80% through timed misters that activate when relative humidity drops below the target range.",
        "The plant palette is the real secret. We use 40% native species — including Ghaf (Prosopis cineraria), Sidr (Ziziphus spina-christi), and harmal (Rhazya stricta) — combined with 60% adapted exotics selected for their nectar production and host-plant value. Milkweed (Asclepias curassavica) is the sole host plant for our Monarch colony, while citrus trees support the Giant Swallowtail. Nectar plants are chosen to provide year-round bloom succession, so there is always something in flower regardless of season.",
        "Daily operations include monitoring butterfly counts, replacing host plants that have been stripped by caterpillars, and harvesting pupae for our breeding programme. We release approximately 200 newly emerged adults each week to maintain a stable population. The garden now hosts over 15 species and attracts more than 50,000 visitors per year.",
      ],
      date: '2023-11-02',
      read: '5 min',
      tags: ['Themed Gardens'],
      cover: '',
      published: true,
    },
    {
      slug: 'nursery-40k-seedlings',
      title: 'Inside our 12,000 m² nursery — 40k seedlings a month',
      excerpt: 'Propagation, mother stock and logistics for 300+ projects.',
      content: [
        "Our Abu Dhabi nursery is the backbone of every project Flora Decora delivers. Without a reliable supply of healthy, acclimatised plants, even the best landscape design fails within the first summer. The 12,000 m² facility produces 40,000 seedlings and mature plants each month, supporting more than 300 active project sites across the UAE.",
        "The nursery is divided into four distinct zones: a 4,000 m² mother stock area where we maintain over 2,000 mature specimens of more than 120 species; a 3,000 m² propagation house with automated misting and bottom-heated benches for seed germination and cutting propagation; a 2,500 m² hardening-off area where greenhouse-raised plants are gradually exposed to outdoor conditions; and a 2,500 m² dispatch zone with cold-chain logistics for same-day delivery to Al Ain and Abu Dhabi.",
        "Water efficiency is built into every stage. The propagation house uses a recirculating misting system that captures and filters 95% of water, reducing consumption by 60% compared to overhead spray benches. Mother stock areas are irrigated with pressure-compensating drip lines connected to the same soil-moisture sensor network we use in our park retrofits. Overall, the nursery uses 30% less water than a conventional facility of equivalent size.",
        "Logistics are where many nurseries fall short. We operate a fleet of eight temperature-controlled trucks that maintain 18–22°C in the cargo area, preventing heat stress during transport. Plants are delivered in biodegradable grow bags that can be planted directly, eliminating transplant shock. Our delivery window is 24 hours from order to site placement, and we have never missed a delivery deadline.",
      ],
      date: '2024-01-18',
      read: '3 min',
      tags: ['Nurseries'],
      cover: '',
      published: true,
    },
  ];
  for (const p of posts) {
    await prisma.post.upsert({ where: { slug: p.slug }, create: p as never, update: p as never });
  }
  console.log(`Posts seeded: ${posts.length}`);

  // Projects — minimal seed (3 built)
  const cdn = 'https://cdn.aifazi.net/media/assest';
  const projects = [
    { slug: 'butterfly-garden-al-ain', title: 'Butterfly Garden — Al Ain', type: 'Photo', year: '2023', location: 'Al Ain, UAE', area: '4,200 m²', client: 'Al Ain Municipality', img: `${cdn}/Picture2-min-scaled.jpg`, gallery: [`${cdn}/Picture2-min-scaled.jpg`, `${cdn}/Picture3-min-scaled.jpg`, `${cdn}/Picture4-min.png`], description: 'Touristic butterfly house and themed garden — design, build and ongoing operation by Flora Decora. Hosts 1,200+ butterflies across native and tropical zones with integrated irrigation and shaded walkways. Delivered in 14 weeks.', services: ['Themed Gardens', 'Irrigation', 'Operation & Maintenance'], featured: true, built: true },
    { slug: 'municipal-nursery-abu-dhabi', title: 'Municipal Nursery — Abu Dhabi', type: 'Photo', year: '2023', location: 'Abu Dhabi, UAE', area: '12,000 m²', client: 'Abu Dhabi Parks', img: `${cdn}/Picture3-min-scaled.jpg`, gallery: [`${cdn}/Picture3-min-scaled.jpg`, `${cdn}/Picture2-min-scaled.jpg`, `${cdn}/6.png`], description: 'Commercial nursery supplying 300+ projects — shade houses, propagation beds and mother stock. Delivers 40k seedlings/month with 30% water saving via drip irrigation. Stock includes Ghaf, Sidr, Palm.', services: ['Commercial Nurseries', 'Irrigation Systems', 'Development'], featured: true, built: true },
    { slug: 'irrigation-master-plan', title: 'Irrigation Master Plan — Al Ain Parks', type: 'Photo', year: '2023', location: 'Al Ain, UAE', area: '8 parks', client: 'Al Ain Municipality', img: `${cdn}/Picture4-min.png`, gallery: [`${cdn}/Picture4-min.png`, `${cdn}/8.png`, `${cdn}/6.png`], description: 'Efficient irrigation retrofit for 8 municipal parks — soil-moisture sensors, zoned drip and smart scheduling. Cut consumption 22% while improving turf health. ROI in 11 months.', services: ['Irrigation Systems', 'Landscaping Design'], featured: false, built: true },
  ];
  for (const pr of projects) {
    await prisma.project.upsert({ where: { slug: pr.slug }, create: pr, update: pr });
  }
  console.log(`Projects seeded: ${projects.length}`);

  // Site settings
  const settings = [
    { key: 'site.name', value: 'FloraDecora' },
    { key: 'site.tagline', value: 'We draw the plan, then we grow it.' },
    { key: 'contact.phone', value: '+971 3 734 4243' },
    { key: 'contact.email', value: 'info@floradecora.com' },
    { key: 'contact.address', value: 'Office 106, Al Reef Bldg, Al Ain, UAE' },
    { key: 'seo.title', value: 'FloraDecora | Landscaping, Themed Gardens & Tourist Attractions' },
    { key: 'home.stats', value: [{ n: 20, suffix: '+', label: 'Years Experience' }, { n: 300, suffix: '+', label: 'Projects Delivered' }, { n: 150, suffix: '+', label: 'Clients Served' }] },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, create: { key: s.key, value: s.value as never }, update: { value: s.value as never } });
  }
  console.log(`Settings seeded: ${settings.length}`);

  // Email providers defaults (inactive until configured)
  const emailProviders = [
    { provider: 'smtp', config: { host: '', port: '587', user: '', pass: '', from: 'noreply@floradecora.com' }, active: false },
    { provider: 'resend', config: { apiKey: '', from: 'onboarding@resend.dev' }, active: false },
    { provider: 'brevo', config: { apiKey: '', from: 'noreply@floradecora.com' }, active: false },
  ];
  for (const ep of emailProviders) {
    await prisma.emailProvider.upsert({ where: { provider: ep.provider }, create: ep as never, update: {} });
  }
  console.log(`Email providers seeded: ${emailProviders.length}`);

  // CDN providers defaults
  const cdnProviders = [
    { provider: 'r2', config: { endpoint: process.env.R2_ENDPOINT || '', accessKeyId: process.env.R2_ACCESS_KEY_ID || '', secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '', bucket: process.env.R2_BUCKET || 'floradecora', cdnUrl: process.env.CDN_URL || 'https://cdn.aifazi.net' }, active: true },
    { provider: 'cloudinary', config: { url: process.env.CLOUDINARY_URL || '' }, active: false },
    { provider: 'bunny', config: { storageZone: '', apiKey: '', pullZone: '' }, active: false },
    { provider: 'local', config: {}, active: false },
  ];
  for (const cp of cdnProviders) {
    const existing = await prisma.cdnProvider.findUnique({ where: { provider: cp.provider } });
    if (!existing) await prisma.cdnProvider.create({ data: cp as never });
  }
  console.log(`CDN providers seeded: ${cdnProviders.length}`);

  // Email templates defaults
  const templates = [
    {
      key: 'inquiry_reply',
      name: 'Inquiry Reply',
      subject: 'Re: Your inquiry — FloraDecora',
      body: `<p>Hi {{name}},</p><p>Thanks for reaching out about <em>{{message}}</em>.</p><p>Our team will review and reply within 4 hours. In the meantime, see our <a href="https://floradecora.com/projects">projects</a>.</p><p>— FloraDecora<br/>info@floradecora.com • +971 3 734 4243</p>`,
    },
    {
      key: 'inquiry_followup',
      name: 'Follow-up',
      subject: 'Quick follow-up — FloraDecora',
      body: `<p>Hi {{name}},</p><p>Just following up on your inquiry: "{{message}}". Would you like to schedule a site visit this week?</p><p>— FloraDecora</p>`,
    },
    {
      key: 'welcome',
      name: 'Welcome',
      subject: 'Welcome to FloraDecora',
      body: `<p>Hi {{name}},</p><p>Welcome! Thanks for subscribing. You will receive monthly garden notes.</p><p>— FloraDecora</p>`,
    },
  ];
  for (const t of templates) {
    await prisma.emailTemplate.upsert({ where: { key: t.key }, create: t, update: { name: t.name, subject: t.subject, body: t.body } });
  }
  console.log(`Templates seeded: ${templates.length}`);

  console.log('Seeding complete');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
