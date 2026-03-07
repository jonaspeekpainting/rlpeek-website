import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllPages,
  getTips,
  getProjects,
  getServices,
  getServiceAreas,
  getServiceAreaDisplayTitle,
} from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sitemap",
    description: "Sitemap for RL Peek Painting website.",
    alternates: { canonical: `${SITE_URL}/site-map` },
  };
}

function pageTitle(p: { title: string }) {
  return p.title.split("|")[0].trim();
}

export default function SiteMapPage() {
  const sections = getAllPages().filter(
    (p) => p.path && p.path !== "sitemap" && p.path !== "site-map" && !p.path.includes("privacy") && !p.path.includes("terms")
  );
  const tips = getTips();
  const projects = getProjects();
  const services = getServices();
  const serviceAreas = getServiceAreas();
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-zinc-900">Sitemap</h1>
      <p className="mt-3 text-zinc-600">
        This page lists all main pages. For search engines, use our{" "}
        <a href="/sitemap.xml" className="text-sky-600 hover:underline">XML sitemap</a>.
      </p>
      <ul className="mt-8 space-y-2">
        <li>
          <Link href="/" className="text-sky-600 hover:underline">Home</Link>
        </li>
        {sections.map((p) => (
          <li key={p.path}>
            <Link href={`/${p.path}`} className="text-sky-600 hover:underline">
              {pageTitle(p)}
            </Link>
          </li>
        ))}
        {tips.map((p) => (
          <li key={p.path}>
            <Link href={`/${p.path}`} className="text-sky-600 hover:underline">
              {pageTitle(p)}
            </Link>
          </li>
        ))}
        {projects.map((p) => (
          <li key={p.path}>
            <Link href={`/${p.path}`} className="text-sky-600 hover:underline">
              {pageTitle(p)}
            </Link>
          </li>
        ))}
        {services.map((p) => (
          <li key={p.path}>
            <Link href={`/${p.path}`} className="text-sky-600 hover:underline">
              {pageTitle(p)}
            </Link>
          </li>
        ))}
        {serviceAreas.map((area) => (
          <li key={area.path}>
            <Link href={`/${area.path}`} className="text-sky-600 hover:underline">
              {getServiceAreaDisplayTitle(area)}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
