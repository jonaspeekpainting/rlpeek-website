import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPageByPath } from "@/lib/content";
import { fetchPages } from "@/lib/pagesApi";
import { PageContent } from "@/components/PageContent";
import { SITE_URL, s3Image } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageByPath("home-painting-tips");
  return {
    title: page?.title ?? "Home Painting Tips",
    description: page?.description,
    alternates: { canonical: `${SITE_URL}/home-painting-tips` },
  };
}

function tipDisplayTitle(title: string): string {
  return title.split("|")[0].trim();
}

export default async function HomePaintingTipsPage() {
  const page = getPageByPath("home-painting-tips");
  const tips = await fetchPages({ type: "tip" });

  return (
    <PageContent
      page={page ?? { path: "home-painting-tips", slug: "home-painting-tips", title: "Recent Articles", description: "" }}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Home Tips" }]}
    >
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip) => {
          const imageKey = tip.image_keys?.[0];
          const title = tipDisplayTitle(tip.title);
          return (
            <Link
              key={tip.page_id}
              href={`/home-painting-tips/${tip.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] w-full shrink-0 bg-zinc-100">
                {imageKey ? (
                  <Image
                    src={s3Image(imageKey)}
                    alt={title}
                    fill
                    className="object-cover transition group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                    <span className="text-sm">No image</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="font-semibold text-zinc-900 group-hover:text-sky-600">
                  {title}
                </span>
                {tip.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-zinc-600">
                    {tip.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </PageContent>
  );
}
