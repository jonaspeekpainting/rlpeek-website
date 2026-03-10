import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchPageBySlug } from "@/lib/pagesApi";
import { AdminEditPageButton } from "@/components/AdminEditPageButton";
import { PageBodyContent } from "@/components/PageBodyContent";
import { PageContent } from "@/components/PageContent";
import { decodeHtmlEntities } from "@/lib/decodeHtml";
import { SITE_NAME, SITE_URL, PHONE_LINK, s3Image } from "@/lib/site";
import type { PageMeta } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchPageBySlug(slug);
  const title = page ? decodeHtmlEntities(page.title) : slug;
  const imageKey = page?.image_keys?.[0] ?? `images/blog/${slug}.jpg`;
  return {
    title,
    description: page?.description ?? undefined,
    alternates: { canonical: `${SITE_URL}/home-painting-tips/${slug}` },
    openGraph: {
      type: "article",
      images: [{ url: s3Image(imageKey) }],
    },
  };
}

export default async function TipPage({ params }: Props) {
  const { slug } = await params;
  const page = await fetchPageBySlug(slug);

  if (!page) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-10">
        <p>Article not found.</p>
        <Link href="/home-painting-tips" className="mt-4 text-sky-600 hover:underline">Back to Home Tips</Link>
      </article>
    );
  }

  const imageKey = page.image_keys?.[0] ?? `images/blog/${slug}.jpg`;
  const titleDisplay = decodeHtmlEntities(page.title);
  const pageMeta: PageMeta = {
    path: `home-painting-tips/${slug}`,
    slug,
    title: titleDisplay,
    description: page.description ?? "",
  };

  const publishedDate = page.created_at
    ? new Date(page.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <div className="relative mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <div className="absolute right-4 top-4 z-10">
          <AdminEditPageButton pageId={page.page_id} />
        </div>
        <div className="relative mb-8 aspect-[2/1] w-full overflow-hidden rounded-lg bg-zinc-100">
          <Image
            src={s3Image(imageKey)}
            alt={titleDisplay ? titleDisplay.split("|")[0].trim() : "Painting tip"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>
      </div>
      <PageContent
        page={pageMeta}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Home Tips", href: "/home-painting-tips" },
          { label: titleDisplay.split("|")[0].trim() },
        ]}
      >
        <p className="mt-3 text-sm text-zinc-500">
          By <span className="font-medium text-zinc-700">RL Peek Painting</span>
          {publishedDate && (
            <> · <time dateTime={page.created_at}>{publishedDate}</time></>
          )}
        </p>
        <PageBodyContent body={page.body} className="prose prose-zinc max-w-none mt-6" pageTitle={titleDisplay.split("|")[0].trim()} />
      </PageContent>
      <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 mb-2">Related</h3>
          <ul className="text-sm text-zinc-600 space-y-1 list-none p-0 m-0">
            <li><Link href="/services/interior-services/drywall-repair" className="text-sky-600 hover:underline">Drywall repair</Link></li>
            <li><Link href="/services/interior-services/painting" className="text-sky-600 hover:underline">Interior painting</Link></li>
            <li><Link href="/services/exterior-services/painting" className="text-sky-600 hover:underline">Exterior painting</Link></li>
            <li><Link href="/service-areas/park-city-ut-painting" className="text-sky-600 hover:underline">Painting in Park City</Link></li>
          </ul>
        </div>
        <p className="text-sm text-zinc-600">
          Ready to get started? Call <a href={PHONE_LINK} className="font-medium text-sky-600">435-649-0158</a> or{" "}
          <Link href="/contact-us" className="font-medium text-sky-600 hover:underline">contact us</Link>.
        </p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: titleDisplay.split("|")[0].trim(),
            description: page.description,
            url: `${SITE_URL}/home-painting-tips/${slug}`,
            author: [
            { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            { "@type": "Person", name: "RL Peek Painting Team" },
          ],
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            ...(page.created_at && { datePublished: new Date(page.created_at).toISOString() }),
            ...(page.updated_at && { dateModified: new Date(page.updated_at).toISOString() }),
          }),
        }}
      />
    </>
  );
}
