import type { Metadata } from "next";
import Link from "next/link";
import { getServiceAreas, getServiceAreaBySlug, getServiceAreaDisplayTitle } from "@/lib/content";
import { PageContent } from "@/components/PageContent";
import { SITE_URL, SITE_NAME, PHONE_LINK } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const areas = getServiceAreas();
  return areas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = getServiceAreaBySlug(slug);
  if (!area) return { title: "Service Area" };
  const canonical = `${SITE_URL}/${area.path}`;
  return {
    title: area.title,
    description: area.description,
    alternates: { canonical },
    openGraph: {
      title: area.title,
      description: area.description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

function LocationPageJsonLd({
  area,
  placeName,
}: {
  area: { path: string; title: string; description: string };
  placeName: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/${area.path}#webpage`,
        url: `${SITE_URL}/${area.path}`,
        name: area.title,
        description: area.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        areaServed: { "@type": "Place", name: placeName, addressRegion: "UT" },
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

export default async function ServiceAreaSlugPage({ params }: Props) {
  const { slug } = await params;
  const area = getServiceAreaBySlug(slug);

  if (!area) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p>Service area not found.</p>
        <Link href="/service-areas" className="mt-4 text-sky-600 hover:underline">
          View all service areas
        </Link>
      </article>
    );
  }

  const displayTitle = getServiceAreaDisplayTitle(area);

  return (
    <>
      <LocationPageJsonLd area={area} placeName={displayTitle} />
      <PageContent
        page={area}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Service Areas", href: "/service-areas" },
          { label: displayTitle },
        ]}
        faqSchema={!!(area.faq?.length)}
      />
      <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <p className="text-sm text-zinc-600">
          Ready for a free estimate?{" "}
          <Link href="/contact-us" className="font-medium text-sky-600 hover:underline">
            Contact us
          </Link>{" "}
          or call <a href={PHONE_LINK} className="font-medium text-sky-600">435-649-0158</a>.
        </p>
      </div>
    </>
  );
}
