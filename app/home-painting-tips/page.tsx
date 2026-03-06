import type { Metadata } from "next";
import Link from "next/link";
import { getPageByPath } from "@/lib/content";
import { fetchPages } from "@/lib/pagesApi";
import { PageContent } from "@/components/PageContent";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageByPath("home-painting-tips");
  return {
    title: page?.title ?? "Home Painting Tips",
    description: page?.description,
    alternates: { canonical: `${SITE_URL}/home-painting-tips` },
  };
}

export default async function HomePaintingTipsPage() {
  const page = getPageByPath("home-painting-tips");
  const tips = await fetchPages({ type: "tip" });

  return (
    <PageContent
      page={page ?? { path: "home-painting-tips", slug: "home-painting-tips", title: "Recent Articles", description: "" }}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Home Tips" }]}
    >
      <ul className="mt-8 space-y-4">
        {tips.map((tip) => (
          <li key={tip.page_id}>
            <Link href={`/home-painting-tips/${tip.slug}`} className="group block">
              <span className="font-medium text-zinc-900 group-hover:text-sky-600">
                {tip.title.split("|")[0].trim()}
              </span>
              {tip.description && (
                <p className="mt-1 text-sm text-zinc-600">{tip.description}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </PageContent>
  );
}
