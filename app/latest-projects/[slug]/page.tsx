import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchPageBySlug } from "@/lib/pagesApi";
import { AdminEditPageButton } from "@/components/AdminEditPageButton";
import { PageBodyContent } from "@/components/PageBodyContent";
import { PageContent } from "@/components/PageContent";
import { ProjectGalleryLightbox } from "@/components/ProjectGalleryLightbox";
import { decodeHtmlEntities } from "@/lib/decodeHtml";
import { SITE_NAME, SITE_URL, PHONE_LINK, s3Image } from "@/lib/site";
import type { PageMeta } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function projectDisplayTitle(title: string): string {
  return title
    .replace(/\s*\|\s*.*$/, "")
    .replace(/\s+by RL Peek Painting$/i, "")
    .trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchPageBySlug(slug);
  const title = page ? decodeHtmlEntities(page.title) : slug;
  const imageKey = page?.image_keys?.[0];
  return {
    title,
    description: page?.description ?? undefined,
    alternates: { canonical: `${SITE_URL}/latest-projects/${slug}` },
    openGraph: {
      type: "article",
      ...(imageKey && { images: [{ url: s3Image(imageKey) }] }),
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const page = await fetchPageBySlug(slug);

  if (!page) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-10">
        <p>Project not found.</p>
        <Link href="/latest-projects" className="mt-4 text-sky-600 hover:underline">Back to Latest Projects</Link>
      </article>
    );
  }

  const titleDisplay = decodeHtmlEntities(page.title);
  const projectTitle = projectDisplayTitle(titleDisplay);
  const featuredImageKey = page.image_keys?.[0];
  const pageMeta: PageMeta = {
    path: `latest-projects/${slug}`,
    slug,
    title: titleDisplay,
    description: page.description ?? "",
  };

  return (
    <>
      <div className="relative">
        <div className="absolute right-4 top-4 z-10">
          <AdminEditPageButton pageId={page.page_id} />
        </div>
      {featuredImageKey && (
        <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-zinc-100">
            <Image
              src={s3Image(featuredImageKey)}
              alt={projectTitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        </div>
      )}
      <PageContent
        page={pageMeta}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Latest Projects", href: "/latest-projects" },
          { label: projectTitle },
        ]}
      >
        <PageBodyContent body={page.body} className="prose prose-zinc max-w-none mt-6" pageTitle={projectTitle} />
        {page.image_keys && page.image_keys.length > 1 && (
          <ProjectGalleryLightbox imageUrls={page.image_keys.map(s3Image)} />
        )}
      </PageContent>
      <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <p className="text-sm text-zinc-600">
          Like what you see? <Link href="/contact-us" className="font-medium text-sky-600 hover:underline">Contact us</Link> or call{" "}
          <a href={PHONE_LINK} className="font-medium text-sky-600">435-649-0158</a> for a free estimate.
        </p>
      </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: projectTitle,
            description: page.description,
            url: `${SITE_URL}/latest-projects/${slug}`,
            author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            ...(page.created_at && { datePublished: new Date(page.created_at).toISOString() }),
            ...(page.updated_at && { dateModified: new Date(page.updated_at).toISOString() }),
          }),
        }}
      />
    </>
  );
}
