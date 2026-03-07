import type { Metadata } from "next";
import Link from "next/link";
import { getServices, getPageByPath, getTips } from "@/lib/content";
import { PageContent } from "@/components/PageContent";
import { SITE_URL, PHONE_LINK, SITE_NAME, s3Image, AREAS_SERVED } from "@/lib/site";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  const services = getServices();
  return services.map((s) => ({
    slug: s.path.replace(/^services\//, "").split("/"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = "services/" + slug.join("/");
  const page = getServices().find((s) => s.path === path) ?? getPageByPath(path);
  const title = page?.title ?? path;
  const image = page?.images?.[0];
  return {
    title,
    description: page?.description,
    alternates: { canonical: `${SITE_URL}/${path}` },
    openGraph: {
      title,
      description: page?.description ?? undefined,
      url: `${SITE_URL}/${path}`,
      ...(image && { images: [{ url: image.src.startsWith("http") ? image.src : s3Image(image.src), alt: image.alt || title }] }),
    },
  };
}

function breadcrumbsForPath(path: string): { label: string; href?: string }[] {
  const segments = path.replace(/^services\//, "").split("/").filter(Boolean);
  const items: { label: string; href?: string }[] = [{ label: "Home", href: "/" }];
  if (segments.length > 0) items.push({ label: "Services", href: "/services" });
  segments.forEach((segment, i) => {
    const label = segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const isLast = i === segments.length - 1;
    const href = isLast ? undefined : `/services/${segments.slice(0, i + 1).join("/")}`;
    items.push({ label, href });
  });
  return items;
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const path = "services/" + slug.join("/");
  const page = getServices().find((s) => s.path === path) ?? getPageByPath(path);

  if (!page) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-10">
        <p>Service not found.</p>
        <Link href="/services" className="mt-4 text-sky-600 hover:underline">Back to Services</Link>
      </article>
    );
  }

  const breadcrumbs = breadcrumbsForPath(path);
  const recentTips = getTips().slice(0, 6);
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title.replace(/\s*\|\s*RL Peek Painting$/i, "").trim(),
    description: page.description || page.intro || page.body?.slice(0, 200),
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      telephone: PHONE_LINK.replace("tel:", ""),
    },
    areaServed: [
      { "@type": "State", name: "Utah" },
      ...AREAS_SERVED.map((name) => ({ "@type": "Place" as const, name })),
    ],
    ...(page.images?.[0] && { image: page.images[0].src.startsWith("http") ? page.images[0].src : s3Image(page.images[0].src) }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <PageContent
        page={page}
        breadcrumbs={breadcrumbs}
        faqSchema={!!((page.faq && page.faq.length > 0) || (page.faqItems && page.faqItems.length > 0))}
        variant="service"
        recentTips={recentTips}
      >
        <div className="mt-6 space-y-1">
          <p className="text-sm text-zinc-600">
            Serving <Link href="/service-areas/park-city-ut-painting" className="text-sky-600 hover:underline">Park City</Link>, <Link href="/service-areas/deer-valley-ut-painting" className="text-sky-600 hover:underline">Deer Valley</Link>, <Link href="/service-areas/heber-ut-painting" className="text-sky-600 hover:underline">Heber City</Link>, and more throughout Summit & Wasatch County.
          </p>
          <Link href="/service-areas" className="text-sm text-sky-600 hover:underline">
            Explore our service areas →
          </Link>
        </div>
        <p className="mt-8 text-sm text-zinc-600">
          Call <a href={PHONE_LINK} className="font-medium text-sky-600">435-649-0158</a> or{" "}
          <Link href="/contact-us" className="font-medium text-sky-600">contact us</Link> for a free estimate.
        </p>
      </PageContent>
    </>
  );
}
