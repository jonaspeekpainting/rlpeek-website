import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPageByPath } from "@/lib/content";
import { fetchPages } from "@/lib/pagesApi";
import { PageContent } from "@/components/PageContent";
import { SITE_URL, s3Image } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageByPath("latest-projects");
  return {
    title: page?.title ?? "Latest Projects",
    description: page?.description,
    alternates: { canonical: `${SITE_URL}/latest-projects` },
  };
}

function projectDisplayTitle(title: string): string {
  return title
    .replace(/\s*\|\s*.*$/, "")
    .replace(/\s+by RL Peek Painting$/i, "")
    .trim();
}

export default async function LatestProjectsPage() {
  const page = getPageByPath("latest-projects");
  const projects = await fetchPages({ type: "project" });

  return (
    <PageContent
      page={page ?? { path: "latest-projects", slug: "latest-projects", title: "Latest Projects", description: "" }}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Latest Projects" }]}
    >
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((proj) => {
          const imageKey = proj.image_keys?.[0];
          const title = projectDisplayTitle(proj.title);
          return (
            <Link
              key={proj.page_id}
              href={`/latest-projects/${proj.slug}`}
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
                {proj.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-zinc-600">
                    {proj.description}
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
