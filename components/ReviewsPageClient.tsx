"use client";

import { useEffect, useState } from "react";
import { Loader, Stack, Text } from "@mantine/core";
import type { ReviewItem } from "@/lib/googleReviews";
import { ReviewsListPaginated } from "./ReviewsListPaginated";

function toRatingNumber(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return Math.min(5, Math.max(1, Math.floor(v)));
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) return Math.min(5, Math.max(1, n));
  }
  return 0;
}

function parseReviewList(data: unknown): ReviewItem[] {
  if (!Array.isArray(data)) return [];
  const minRating = 5;
  return data
    .filter((r): r is Record<string, unknown> => r != null && typeof r === "object")
    .map((r) => ({
      text: typeof r.text === "string" ? r.text : "",
      rating: toRatingNumber(r.rating),
      authorDisplayName: typeof r.authorDisplayName === "string" ? r.authorDisplayName : "Google review",
      relativeTime: typeof r.relativeTime === "string" ? r.relativeTime : undefined,
    }))
    .filter((r) => r.rating >= minRating && r.text.length > 0);
}

type Props = {
  /** Server-fetched reviews so we always show something (even if only 5). */
  initialReviews: ReviewItem[];
};

/**
 * Shows initial reviews immediately, then fetches full list from same-origin API
 * and updates if we get more (avoids cross-origin and ensures we never show empty).
 */
export function ReviewsPageClient({ initialReviews }: Props) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => {
        const list = parseReviewList(data);
        if (list.length > 0) setReviews(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (reviews.length === 0 && !loading) {
    return (
      <Text size="sm" c="dimmed">
        No reviews available right now. Please try again later.
      </Text>
    );
  }

  return (
    <Stack gap="md">
      {loading && reviews.length > 0 && (
        <Stack align="center" gap="xs" py="xs">
          <Loader size="sm" />
          <Text size="xs" c="dimmed">Loading more reviews…</Text>
        </Stack>
      )}
      <ReviewsListPaginated
        reviews={reviews}
        title="Google Reviews"
        columns={{ base: 1, sm: 2 }}
      />
    </Stack>
  );
}
