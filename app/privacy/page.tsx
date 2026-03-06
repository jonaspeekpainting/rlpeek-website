import type { Metadata } from "next";
import { getPageByPath } from "@/lib/content";
import { PageContent } from "@/components/PageContent";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageByPath("privacy");
  return {
    title: page?.title ?? "Privacy Policy",
    description: page?.description,
    alternates: { canonical: `${SITE_URL}/privacy` },
  };
}

export default function PrivacyPage() {
  const page = getPageByPath("privacy");

  return (
    <PageContent
      page={page ?? { path: "privacy", slug: "privacy", title: "Privacy Policy", description: "" }}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
    />
  );
}
