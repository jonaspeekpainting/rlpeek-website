import type { Metadata } from "next";
import { getPageByPath } from "@/lib/content";
import { PageContent } from "@/components/PageContent";
import { ReviewsPageClient } from "@/components/ReviewsPageClient";
import { getGoogleReviews } from "@/lib/googleReviews";
import { SITE_URL } from "@/lib/site";
import { Text } from "@mantine/core";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageByPath("reviews");
  return {
    title: page?.title ?? "Reviews",
    description: page?.description,
    alternates: { canonical: `${SITE_URL}/reviews` },
  };
}

export default async function ReviewsPage() {
  const page = getPageByPath("reviews");
  const initialReviews = await getGoogleReviews({ minRating: 5, maxCount: 50 });

  return (
    <PageContent
      page={page ?? { path: "reviews", slug: "reviews", title: "Client Testimonials", description: "" }}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
    >
      <Text size="md" c="dark" mt="md" mb="xl">
        We&apos;re proud of our reputation. Read what our clients say about working with RL Peek Painting. You can
        also leave a review or submit feedback via our contact page.
      </Text>
      <ReviewsPageClient initialReviews={initialReviews} />
    </PageContent>
  );
}
