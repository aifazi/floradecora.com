import { SITE_CONTACT, SITE_JSONLD } from "@/lib/content-defaults";

export default function JsonLd({ contact = SITE_CONTACT, jsonld = SITE_JSONLD }: { contact?: typeof SITE_CONTACT; jsonld?: typeof SITE_JSONLD }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: jsonld.name,
    description: jsonld.description,
    url: "https://floradecora.com",
    logo: jsonld.logo,
    image: jsonld.image,
    telephone: contact.phoneDial,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: jsonld.streetAddress,
      addressLocality: jsonld.locality,
      addressRegion: jsonld.region,
      addressCountry: jsonld.country,
    },
    areaServed: [{ "@type": "City", name: "Al Ain" }, { "@type": "City", name: "Abu Dhabi" }, { "@type": "Country", name: "United Arab Emirates" }],
    foundingDate: jsonld.foundingDate,
    priceRange: jsonld.priceRange,
    sameAs: [],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
