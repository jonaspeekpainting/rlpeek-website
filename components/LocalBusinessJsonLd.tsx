import { SITE_URL, SITE_NAME, PHONE, ADDRESS, AREAS_SERVED, s3Image } from "@/lib/site";
import { getGoogleReviews } from "@/lib/googleReviews";

export async function LocalBusinessJsonLd() {
  const reviews = await getGoogleReviews({ maxCount: 50 });
  const reviewCount = reviews.length;
  const ratingValue =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    telephone: PHONE,
    description:
      "RL Peek Painting is a Park City, Utah painting contractor serving Summit and Wasatch County since 1987. We provide interior and exterior painting, staining, drywall repair, cabinet refinishing, interior plastering, and specialty finishes.",
    foundingDate: "1987",
    founder: {
      "@type": "Person",
      name: "Bob Peek",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postalCode,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.6461,
      longitude: -111.498,
    },
    areaServed: AREAS_SERVED.map((name) => ({ "@type": "Place", name })),
    priceRange: "$$",
    image: {
      "@type": "ImageObject",
      url: s3Image("images/logo.png"),
    },
    logo: {
      "@type": "ImageObject",
      url: s3Image("images/logo.png"),
    },
    sameAs: [
      "https://www.facebook.com/PeekPainting",
      "https://www.instagram.com/peekpainting/",
      "https://www.linkedin.com/company/rl-peek-painting",
      "https://www.houzz.com/pro/jonas-peek/rl-peek-painting"
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
  };

  if (reviewCount > 0 && ratingValue !== null) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Math.round(ratingValue * 10) / 10,
      reviewCount,
      bestRating: 5,
    };
    schema.review = reviews.slice(0, 10).map((r) => ({
      "@type": "Review" as const,
      author: { "@type": "Person" as const, name: r.authorDisplayName },
      reviewRating: { "@type": "Rating" as const, ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
