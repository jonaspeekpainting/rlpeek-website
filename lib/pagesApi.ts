/**
 * Fetch tips and project pages from job-engine public pages API.
 */

import { JOBSUITE_API_BASE, JOBSUITE_CONTRACTOR_ID } from "@/lib/site";

export type PageItem = {
  page_id: string;
  type: "tip" | "project";
  slug: string;
  title: string;
  description?: string | null;
  body: string;
  image_keys: string[];
  created_at: string;
  updated_at: string;
};

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_JOBSUITE_API_BASE ?? JOBSUITE_API_BASE).replace(/\/$/, "");
}

function getContractorId(): string {
  return process.env.NEXT_PUBLIC_JOBSUITE_CONTRACTOR_ID ?? JOBSUITE_CONTRACTOR_ID;
}

function parsePage(raw: unknown): PageItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const page_id = typeof r.page_id === "string" ? r.page_id : "";
  const type = r.type === "tip" || r.type === "project" ? r.type : "tip";
  const slug = typeof r.slug === "string" ? r.slug : "";
  const title = typeof r.title === "string" ? r.title : "";
  const body = typeof r.body === "string" ? r.body : "";
  const description = typeof r.description === "string" ? r.description : null;
  const image_keys = Array.isArray(r.image_keys)
    ? (r.image_keys as unknown[]).filter((k): k is string => typeof k === "string")
    : [];
  const created_at = typeof r.created_at === "string" ? r.created_at : "";
  const updated_at = typeof r.updated_at === "string" ? r.updated_at : "";
  if (!page_id || !slug || !title) return null;
  return {
    page_id,
    type,
    slug,
    title,
    description: description || undefined,
    body,
    image_keys,
    created_at,
    updated_at,
  };
}

/**
 * Fetch list of pages (tips or projects) from job-engine, newest first.
 */
export async function fetchPages(options: {
  type: "tip" | "project";
  maxCount?: number;
}): Promise<PageItem[]> {
  try {
    const base = getBaseUrl();
    const contractorId = getContractorId();
    const maxCount = options.maxCount ?? 100;
    const url = `${base}/api/v1/public/pages?contractor_id=${encodeURIComponent(contractorId)}&type=${options.type}&max_count=${maxCount}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) return [];
    const parsed: PageItem[] = [];
    for (const item of data) {
      const p = parsePage(item);
      if (p) parsed.push(p);
    }
    return parsed;
  } catch {
    return [];
  }
}

/**
 * Fetch a single page by slug.
 */
export async function fetchPageBySlug(slug: string): Promise<PageItem | null> {
  try {
    const base = getBaseUrl();
    const contractorId = getContractorId();
    const url = `${base}/api/v1/public/pages/${encodeURIComponent(slug)}?contractor_id=${encodeURIComponent(contractorId)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    return parsePage(data);
  } catch {
    return null;
  }
}
