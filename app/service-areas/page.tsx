import type { Metadata } from "next";
import { getPageByPath, getServiceAreas, getServiceAreaDisplayTitle } from "@/lib/content";
import { PageContent } from "@/components/PageContent";
import { ServiceAreasMapDynamic } from "@/components/ServiceAreasMapDynamic";
import { SITE_URL, SITE_NAME, AREAS_SERVED } from "@/lib/site";

const SEO_TITLE =
  "House Painting in Park City, Summit & Wasatch County, UT | RL Peek Painting";
const SEO_DESCRIPTION =
  "Professional interior and exterior painting in Park City, Heber City, Deer Valley, Kamas, Midway, and all of Summit County and Wasatch County, Utah. Free estimates. Call 435-649-0158.";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageByPath("service-areas");
  const title = page?.title ?? SEO_TITLE;
  const description = page?.description ?? SEO_DESCRIPTION;
  const canonical = `${SITE_URL}/service-areas`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/** JSON-LD for service areas page: WebPage + LocalBusiness areaServed */
function ServiceAreasJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/service-areas#webpage`,
        url: `${SITE_URL}/service-areas`,
        name: SEO_TITLE,
        description: SEO_DESCRIPTION,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        areaServed: AREAS_SERVED.map((name) => ({
          "@type": "Place",
          name,
          addressRegion: "UT",
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function ServiceAreasPage() {
  const page = getPageByPath("service-areas");
  const areas = getServiceAreas();

  return (
    <>
      <PageContent
        page={
          page ?? {
            path: "service-areas",
            slug: "service-areas",
            title: "Our Service Areas",
            description: SEO_DESCRIPTION,
          }
        }
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Service Areas" }]}
      >
        <section className="mt-8" aria-label="Service area map">
          <ServiceAreasMapDynamic areas={areas} className="mb-8" />
        </section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-800">
          Cities and areas we serve
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2" role="list">
          {areas.map((area) => (
            <li key={area.slug}>
              <span className="text-zinc-800">
                {getServiceAreaDisplayTitle(area)}
              </span>
            </li>
          ))}
        </ul>
      </PageContent>
      <ServiceAreasJsonLd />
    </>
  );
}
