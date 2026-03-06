import type { Metadata } from "next";
import Link from "next/link";
import { getPageByPath, getServices, getServiceDisplayTitle } from "@/lib/content";
import { PageContent } from "@/components/PageContent";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageByPath("services");
  return {
    title: page?.title ?? "Our Services",
    description: page?.description,
    alternates: { canonical: `${SITE_URL}/services` },
  };
}

export default function ServicesPage() {
  const page = getPageByPath("services");
  const services = getServices();

  return (
    <PageContent
      page={page ?? { path: "services", slug: "services", title: "Professional Painting Services", description: "" }}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
    >
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-900">Interior Services</h2>
        <ul className="mt-3 space-y-2">
          {services
            .filter((s) => s.path.startsWith("services/interior"))
            .map((s) => (
              <li key={s.path}>
                <Link href={`/${s.path}`} className="text-sky-600 hover:underline">
                  {getServiceDisplayTitle(s)}
                </Link>
              </li>
            ))}
        </ul>
        <h2 className="mt-8 text-xl font-semibold text-zinc-900">Exterior Services</h2>
        <ul className="mt-3 space-y-2">
          {services
            .filter((s) => s.path.startsWith("services/exterior"))
            .map((s) => (
              <li key={s.path}>
                <Link href={`/${s.path}`} className="text-sky-600 hover:underline">
                  {getServiceDisplayTitle(s)}
                </Link>
              </li>
            ))}
        </ul>
        <h2 className="mt-8 text-xl font-semibold text-zinc-900">More Services</h2>
        <ul className="mt-3 space-y-2">
          {services
            .filter((s) => s.path === "services/polyaspartic-garage-floors" || s.path === "services/lime-and-mineral-washing" || s.path === "services/custom-interior-plastering")
            .map((s) => (
              <li key={s.path}>
                <Link href={`/${s.path}`} className="text-sky-600 hover:underline">
                  {getServiceDisplayTitle(s)}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </PageContent>
  );
}
