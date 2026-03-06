/**
 * Google Place reviews for display on the site.
 *
 * Prefer Jobsuite job-engine public endpoint when JOBSUITE_API_BASE and JOBSUITE_CONTRACTOR_ID
 * are set (reviews are cached ~24h there to limit Google API calls). Otherwise uses Places API
 * (New) directly if GOOGLE_PLACES_API_KEY is set, or static fallback reviews.
 */

import { JOBSUITE_API_BASE, JOBSUITE_CONTRACTOR_ID } from "@/lib/site";

export type ReviewItem = {
  text: string;
  rating: number;
  authorDisplayName: string;
  relativeTime?: string;
};

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    text: "You turned my house into a warm and inviting place for my family and friends to spend time together. Thank you to the most responsible and knowledgeable contractor I have ever worked with.",
    rating: 5,
    authorDisplayName: "Google review",
  },
  {
    text: "There is an old time approach to the way you do business… appreciated the professional quality, friendly and honest service.",
    rating: 5,
    authorDisplayName: "Google review",
  },
  {
    text: "We were very impressed with the outcome of the job you did for us. It was a pleasure to work with you and would highly recommend you to anyone looking for a high quality, detail oriented painter.",
    rating: 5,
    authorDisplayName: "Google review",
  },
];

const DEFAULT_TEXT_QUERY = "RL Peek Painting Park City";

/** In-memory cache for resolved Place ID from Text Search (per process). */
let cachedPlaceId: string | null = null;
let cachedPlaceIdExpiry = 0;
const PLACE_ID_CACHE_MS = 60 * 60 * 1000; // 1 hour

/** Response shape from Places API (New) Place.reviews */
type GoogleReview = {
  name?: string;
  rating?: number;
  text?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
};

type PlaceDetailsResponse = {
  id?: string;
  displayName?: { text?: string };
  reviews?: GoogleReview[];
};

type TextSearchResponse = {
  places?: Array<{ id?: string; displayName?: { text?: string }; formattedAddress?: string }>;
};

/**
 * Resolves a Place ID from a text query using Places API (New) Text Search.
 * https://developers.google.com/maps/documentation/places/web-service/text-search
 */
export async function getPlaceIdFromTextQuery(
  apiKey: string,
  textQuery: string = DEFAULT_TEXT_QUERY
): Promise<string | null> {
  if (Date.now() < cachedPlaceIdExpiry && cachedPlaceId) return cachedPlaceId;

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
      },
      body: JSON.stringify({ textQuery }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const body = await res.text();
      const keyStatus = apiKey ? `key present (length ${apiKey.length})` : "key missing";
      console.warn(
        `Google Places Text Search failed: ${res.status}. Env GOOGLE_PLACES_API_KEY: ${keyStatus}.`,
        body
      );
      return null;
    }

    const data = (await res.json()) as TextSearchResponse;
    const first = data.places?.[0];
    const id = first?.id ?? null;
    if (id) {
      cachedPlaceId = id;
      cachedPlaceIdExpiry = Date.now() + PLACE_ID_CACHE_MS;
    }
    return id;
  } catch (err) {
    const keyStatus = apiKey ? `key present (length ${apiKey.length})` : "key missing";
    console.warn(`Google Places Text Search error. Env GOOGLE_PLACES_API_KEY: ${keyStatus}.`, err);
    return null;
  }
}

function toRatingNumber(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return Math.min(5, Math.max(1, Math.floor(v)));
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) return Math.min(5, Math.max(1, n));
  }
  return 0;
}

/**
 * Fetches reviews from Jobsuite job-engine public endpoint when configured.
 * Returns null if not configured or request fails (caller should fall back to direct Google or fallbacks).
 */
export async function fetchReviewsFromJobEngine(minRating: number, maxCount: number): Promise<ReviewItem[] | null> {
  try {
    const base = process.env.NEXT_PUBLIC_JOBSUITE_API_BASE ?? JOBSUITE_API_BASE;
    const url = `${base.replace(/\/$/, "")}/api/v1/public/reviews?contractor_id=${encodeURIComponent(JOBSUITE_CONTRACTOR_ID)}&min_rating=${minRating}&max_count=${maxCount}`;
    // Skip Next.js Data Cache so we always get current list (job-engine has its own ~24h cache).
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) return null;
    const parsed: ReviewItem[] = data
      .filter((r): r is Record<string, unknown> => r != null && typeof r === "object")
      .map((r) => ({
        text: typeof r.text === "string" ? r.text : "",
        rating: toRatingNumber(r.rating),
        authorDisplayName: typeof r.authorDisplayName === "string" ? r.authorDisplayName : "Google review",
        relativeTime: typeof r.relativeTime === "string" ? r.relativeTime : undefined,
      }))
      .filter((r) => r.rating >= minRating && r.text.length > 0)
      .slice(0, maxCount);
    return parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Fetches the most recent Google Place reviews. Prefers the Jobsuite job-engine public
 * endpoint (when NEXT_PUBLIC_JOBSUITE_API_BASE and NEXT_PUBLIC_JOBSUITE_CONTRACTOR_ID are set)
 * so Google API is called at most ~once per day. Otherwise uses GOOGLE_PLACES_API_KEY and
 * GOOGLE_PLACE_ID / GOOGLE_PLACES_TEXT_QUERY, or static fallback reviews.
 */
export async function getGoogleReviews(options?: {
  minRating?: number;
  maxCount?: number;
  contractorId?: string;
}): Promise<ReviewItem[]> {
  const { minRating = 5, maxCount = 5, contractorId } = options ?? {};
  const effectiveContractorId = contractorId ?? process.env.NEXT_PUBLIC_JOBSUITE_CONTRACTOR_ID ?? JOBSUITE_CONTRACTOR_ID;

  if (effectiveContractorId) {
    const fromJobEngine = await fetchReviewsFromJobEngine(
      minRating,
      maxCount
    );
    if (fromJobEngine) return fromJobEngine;
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  let placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey) {
    return FALLBACK_REVIEWS.slice(0, maxCount).filter((r) => r.rating >= minRating);
  }

  if (!placeId) {
    const textQuery = process.env.GOOGLE_PLACES_TEXT_QUERY ?? DEFAULT_TEXT_QUERY;
    placeId = (await getPlaceIdFromTextQuery(apiKey, textQuery)) ?? undefined;
  }

  if (!placeId) {
    return FALLBACK_REVIEWS.slice(0, maxCount).filter((r) => r.rating >= minRating);
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?fields=reviews`;
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews",
      },
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) {
      console.warn("Google Places reviews fetch failed:", res.status, await res.text());
      return FALLBACK_REVIEWS.slice(0, maxCount).filter((r) => r.rating >= minRating);
    }

    const data = (await res.json()) as PlaceDetailsResponse;
    const raw = data.reviews ?? [];
    const parsed: ReviewItem[] = raw
      .map((r) => {
        const rating = typeof r.rating === "number" ? r.rating : 0;
        const text = r.text?.text?.trim() ?? "";
        const authorDisplayName = r.authorAttribution?.displayName?.trim() ?? "Google review";
        const relativeTime = r.relativePublishTimeDescription?.trim();
        return { text, rating, authorDisplayName, relativeTime };
      })
      .filter((r) => r.rating >= minRating && r.text.length > 0)
      .slice(0, maxCount);

    return parsed.length > 0 ? parsed : FALLBACK_REVIEWS.slice(0, maxCount).filter((r) => r.rating >= minRating);
  } catch (err) {
    console.warn("Google Places reviews error:", err);
    return FALLBACK_REVIEWS.slice(0, maxCount).filter((r) => r.rating >= minRating);
  }
}
