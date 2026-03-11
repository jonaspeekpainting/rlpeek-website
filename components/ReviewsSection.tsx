import Link from "next/link";
import { Box, Button, Card, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import type { ReviewItem } from "@/lib/googleReviews";

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

type ReviewsSectionProps = {
  reviews: ReviewItem[];
  title?: string;
  maxItems?: number;
  columns?: { base?: number; sm?: number };
  showViewAll?: boolean;
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function ReviewsSection({
  reviews,
  title = "What Our Clients Are Saying",
  maxItems = 5,
  columns = { base: 1, sm: 3 },
  showViewAll = false,
  viewAllHref = "/reviews",
  viewAllLabel = "See All Client Reviews",
}: ReviewsSectionProps) {
  const items = reviews.slice(0, maxItems);
  if (items.length === 0) return null;

  return (
    <Stack gap="md">
      {title ? (
        <Title order={2} size="h2" fw={700} c="dark">
          {title}
        </Title>
      ) : null}
      <SimpleGrid cols={columns} spacing="lg">
        {items.map((review, i) => (
          <Card key={i} withBorder padding="lg" radius="md">
            <Stack gap="xs">
              <StarRating rating={review.rating} />
              <Text size="sm" c="dark" fs="italic" lh={1.7} lineClamp={6}>
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
      {showViewAll && (
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <Link href={viewAllHref} style={{ display: "block", width: "100%", maxWidth: 400 }}>
            <Button
              component="span"
              color="brand"
              variant="light"
              size="md"
              style={{ width: "100%" }}
            >
              {viewAllLabel}
            </Button>
          </Link>
        </Box>
      )}
    </Stack>
  );
}
