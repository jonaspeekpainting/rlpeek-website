import { readFileSync } from "fs";
import { join } from "path";

const CONTENT_DIR = join(process.cwd(), "content");

export type PageMeta = {
  path: string;
  slug: string;
  title: string;
  description: string;
  /** Short title for page heading (H1); full title still used for SEO/metadata. */
  displayTitle?: string;
  body?: string;
  /** Lead paragraph(s) before first H2 (service pages). */
  intro?: string;
  /** Images extracted from main content (e.g. service page hero). */
  images?: { src: string; alt: string }[];
  /** Content sections (heading + body). For service variant, each item is rendered as H2 + body. */
  faq?: { question: string; answer: string }[];
  /** Dedicated FAQ accordion items. When set, rendered under one "Frequently Asked Questions" H2. Used for JSON-LD FAQPage when present. */
  faqItems?: { question: string; answer: string }[];
}

function loadJson<T>(filename: string): T {
  const path = join(CONTENT_DIR, filename);
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

let allPages: PageMeta[] | null = null;
let services: PageMeta[] | null = null;
let serviceAreas: PageMeta[] | null = null;
let tips: PageMeta[] | null = null;
let projects: PageMeta[] | null = null;

export function getAllPages(): PageMeta[] {
  if (!allPages) allPages = loadJson<PageMeta[]>("all.json");
  return allPages;
}

export function getPageByPath(path: string): PageMeta | undefined {
  const norm = path.replace(/^\//, "").replace(/\/$/, "") || "";
  return getAllPages().find((p) => p.path === norm);
}

export function getServices(): PageMeta[] {
  if (!services) services = loadJson<PageMeta[]>("services.json");
  return services;
}

export function getServiceAreas(): PageMeta[] {
  if (!serviceAreas) serviceAreas = loadJson<PageMeta[]>("service-areas.json");
  return serviceAreas;
}

export function getTips(): PageMeta[] {
  if (!tips) tips = loadJson<PageMeta[]>("tips.json");
  return tips;
}

export function getProjects(): PageMeta[] {
  if (!projects) projects = loadJson<PageMeta[]>("projects.json");
  return projects;
}

export function getServiceBySlug(slug: string): PageMeta | undefined {
  return getServices().find((s) => s.slug === slug || s.path.endsWith("/" + slug));
}

export function getServiceAreaBySlug(slug: string): PageMeta | undefined {
  return getServiceAreas().find((a) => a.slug === slug);
}

/** Display name for a service area: title before the pipe, with " Painting Contractor" removed. */
export function getServiceAreaDisplayTitle(area: PageMeta): string {
  const beforePipe = area.title.split("|")[0].trim();
  return beforePipe.replace(/\s+Painting Contractor$/i, "").trim();
}

export function getTipBySlug(slug: string): PageMeta | undefined {
  return getTips().find((t) => t.slug === slug);
}

export function getProjectBySlug(slug: string): PageMeta | undefined {
  return getProjects().find((p) => p.slug === slug);
}

/** Resolve path to slug for services (e.g. "services/interior-services/painting" -> "painting") */
export function getServiceByPath(path: string): PageMeta | undefined {
  return getServices().find((s) => s.path === path);
}

/** Friendly heading for service pages: use displayTitle or derive from path (e.g. "interior-services/painting" → "Interior Painting"). */
export function getServiceDisplayTitle(page: PageMeta): string {
  if (page.displayTitle) return page.displayTitle;
  const path = page.path.replace(/^services\//, "");
  const segments = path.split("/").filter(Boolean);
  const toTitle = (s: string) =>
    s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  if (segments.length === 0) return "Services";
  if (segments.length === 1) return toTitle(segments[0]);
  const [parent, child] = segments;
  const parentWords = parent.split("-");
  const firstWord = parentWords[0].charAt(0).toUpperCase() + parentWords[0].slice(1);
  return `${firstWord} ${toTitle(child)}`;
}
