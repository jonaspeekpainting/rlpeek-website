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
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postalCode,
    },
    areaServed: AREAS_SERVED.map((name) => ({ "@type": "Place", name })),
    priceRange: "$$",
    image: s3Image("images/logo.png"),
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
