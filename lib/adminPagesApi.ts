/**
 * Admin API client for pages CRUD and upload URL.
 * Uses X-Admin-Pages-Secret header (value from localStorage after verify).
 */

import { JOBSUITE_API_BASE, JOBSUITE_CONTRACTOR_ID } from "@/lib/site";
import type { PageItem } from "@/lib/pagesApi";

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_JOBSUITE_API_BASE ?? JOBSUITE_API_BASE).replace(/\/$/, "");
}

export async function adminCreatePage(
  secret: string,
  body: { type: "tip" | "project"; slug: string; title: string; body: string; description?: string; image_keys?: string[] }
): Promise<PageItem | null> {
  const res = await fetch(
    `${getBaseUrl()}/api/v1/public-page-resources/${JOBSUITE_CONTRACTOR_ID}/pages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Pages-Secret": secret,
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  return data as PageItem;
}

export async function adminUpdatePage(
  secret: string,
  pageId: string,
  body: { type?: string; slug?: string; title?: string; body?: string; description?: string; image_keys?: string[] }
): Promise<PageItem | null> {
  const res = await fetch(
    `${getBaseUrl()}/api/v1/public-page-resources/${JOBSUITE_CONTRACTOR_ID}/pages/${pageId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Pages-Secret": secret,
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  return data as PageItem;
}

export async function adminDeletePage(secret: string, pageId: string): Promise<boolean> {
  const res = await fetch(
    `${getBaseUrl()}/api/v1/public-page-resources/${JOBSUITE_CONTRACTOR_ID}/pages/${pageId}`,
    {
      method: "DELETE",
      headers: { "X-Admin-Pages-Secret": secret },
    }
  );
  return res.status === 204;
}

/** Get a presigned S3 upload URL from job-engine (browser then PUTs directly to S3). */
export async function adminGetUploadUrl(
  secret: string,
  filename: string,
  contentType: string
): Promise<{ upload_url: string; key: string } | null> {
  const res = await fetch(
    `${getBaseUrl()}/api/v1/public-page-resources/${JOBSUITE_CONTRACTOR_ID}/pages/upload-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Pages-Secret": secret,
      },
      body: JSON.stringify({ filename, content_type: contentType }),
    }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { upload_url?: string; key?: string };
  if (typeof data.upload_url === "string" && typeof data.key === "string") {
    return { upload_url: data.upload_url, key: data.key };
  }
  return null;
}
