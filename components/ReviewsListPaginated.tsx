"use client";

import { useState } from "react";
import { Box, Card, Pagination, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import type { ReviewItem } from "@/lib/googleReviews";

const PER_PAGE = 50;

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <Box component="span" style={{ display: "inline-flex", gap: 2 }} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: full }, (_, i) => (
        <span key={`f-${i}`} style={{ color: "var(--mantine-color-yellow-6)" }}>★</span>
      ))}
      {half ? <span style={{ color: "var(--mantine-color-yellow-6)" }}>★</span> : null}
      {Array.from({ length: empty }, (_, i) => (
        <span key={`e-${i}`} style={{ color: "var(--mantine-color-gray-3)" }}>★</span>
      ))}
    </Box>
  );
}

type ReviewsListPaginatedProps = {
  reviews: ReviewItem[];
  title?: string;
  columns?: { base?: number; sm?: number };
};

export function ReviewsListPaginated({
  reviews,
  title = "Google Reviews",
  columns = { base: 1, sm: 2 },
}: ReviewsListPaginatedProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(reviews.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const pageReviews = reviews.slice(start, start + PER_PAGE);

  if (reviews.length === 0) return null;

  return (
    <Stack gap="lg">
      {title ? (
        <Title order={2} size="h2" fw={700} c="dark">
          {title}
        </Title>
      ) : null}
      <SimpleGrid cols={columns} spacing="lg">
        {pageReviews.map((review, i) => (
          <Card key={start + i} withBorder padding="lg" radius="md">
            <Stack gap="xs">
              <StarRating rating={review.rating} />
              <Text size="sm" c="dark" fs="italic" lh={1.7}>
                &ldquo;{review.text}&rdquo;
              </Text>
              <Text size="xs" c="dimmed">
                — {review.authorDisplayName}
                {review.relativeTime ? ` · ${review.relativeTime}` : ""}
              </Text>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
      {totalPages > 1 && (
        <Pagination
          total={totalPages}
          value={page}
          onChange={setPage}
          color="brand"
          size="sm"
          mt="md"
          aria-label="Reviews pagination"
        />
      )}
    </Stack>
  );
}
