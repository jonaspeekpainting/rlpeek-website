import Link from "next/link";
import Image from "next/image";
import { Box, Button, Card, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import type { PageItem } from "@/lib/pagesApi";
import { s3Image } from "@/lib/site";

function projectDisplayTitle(title: string): string {
  return title
    .replace(/\s*\|\s*.*$/, "")
    .replace(/\s+by RL Peek Painting$/i, "")
    .trim();
}

type RecentProjectsCarouselProps = {
  projects: PageItem[];
  title?: string;
  maxItems?: number;
  columns?: { base?: number; sm?: number };
  showViewAll?: boolean;
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function RecentProjectsCarousel({
  projects,
  title = "Recent Projects",
  maxItems = 3,
  columns = { base: 1, sm: 3 },
  showViewAll = true,
  viewAllHref = "/latest-projects",
  viewAllLabel = "View All Projects",
}: RecentProjectsCarouselProps) {
  const items = projects.slice(0, maxItems);
  if (items.length === 0) return null;

  return (
    <Stack gap="md">
      {title ? (
        <Title order={2} size="h2" fw={700} c="dark">
          {title}
        </Title>
      ) : null}
      <SimpleGrid cols={columns} spacing="lg">
        {items.map((proj) => {
          const imageKey = proj.image_keys?.[0];
          const displayTitle = projectDisplayTitle(proj.title);
          return (
            <Link
              key={proj.page_id}
              href={`/latest-projects/${proj.slug}`}
              className="no-underline [&:hover_.project-title]:text-[var(--mantine-color-brand-6)]"
            >
              <Card withBorder padding="lg" radius="md" className="h-full transition hover:shadow-md">
                <Stack gap="xs">
                  {imageKey ? (
                    <Box pos="relative" style={{ aspectRatio: "16/10", borderRadius: 4, overflow: "hidden" }}>
                      <Image
                        src={s3Image(imageKey)}
                        alt={displayTitle}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </Box>
                  ) : null}
                  <Text size="sm" fw={600} c="dark" lineClamp={2} className="project-title">
                    {displayTitle}
                  </Text>
                  {proj.description ? (
                    <Text size="xs" c="dimmed" lh={1.6} lineClamp={3}>
                      {proj.description}
                    </Text>
                  ) : null}
                </Stack>
              </Card>
            </Link>
          );
        })}
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
