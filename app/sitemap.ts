import type { MetadataRoute } from "next";
import { getAllPages, getServices } from "@/lib/content";
import { fetchPages } from "@/lib/pagesApi";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;
  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];

  for (const p of getAllPages()) {
    if (!p.path || p.path === "sitemap") continue;
    entries.push({
      url: `${base}/${p.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  const [tips, projects] = await Promise.all([
    fetchPages({ type: "tip", maxCount: 200 }),
    fetchPages({ type: "project", maxCount: 200 }),
  ]);

  for (const tip of tips) {
    const lastMod = tip.updated_at || tip.created_at;
    entries.push({
      url: `${base}/home-painting-tips/${tip.slug}`,
      lastModified: lastMod ? new Date(lastMod) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const project of projects) {
    const lastMod = project.updated_at || project.created_at;
    entries.push({
      url: `${base}/latest-projects/${project.slug}`,
      lastModified: lastMod ? new Date(lastMod) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const p of getServices()) {
    entries.push({
      url: `${base}/${p.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
