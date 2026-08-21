export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Flora Decora",
    description:
      "Premier UAE landscaping company specializing in themed gardens, butterfly gardens, public parks and municipal landscaping since 2003.",
    url: "https://floradecora.com",
    logo: "https://cdn.aifazi.net/media/assest/StKLapP%20-%20Imgur.png",
    image: "https://cdn.aifazi.net/media/assest/Picture2-min-scaled.jpg",
    telephone: "+97137344243",
    email: "info@floradecora.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 106, Al Reef Building, Asharij",
      addressLocality: "Al Ain",
      addressRegion: "Abu Dhabi",
      addressCountry: "AE",
    },
    areaServed: [{ "@type": "City", name: "Al Ain" }, { "@type": "City", name: "Abu Dhabi" }, { "@type": "Country", name: "United Arab Emirates" }],
    foundingDate: "2003",
    priceRange: "$$",
    sameAs: [],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
