import type { Metadata } from "next";
import { getPageByPath } from "@/lib/content";
import { PageContent } from "@/components/PageContent";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageByPath("terms");
  return {
    title: page?.title ?? "Terms of Use",
    description: page?.description,
    alternates: { canonical: `${SITE_URL}/terms` },
  };
}

export default function TermsPage() {
  const page = getPageByPath("terms");

  return (
    <PageContent
      page={page ?? { path: "terms", slug: "terms", title: "Website Terms of Use", description: "" }}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]}
    />
  );
}
