import { getGoogleReviews } from "@/lib/googleReviews";
import { ReviewsSection } from "@/components/ReviewsSection";

export async function AsyncReviewsSection() {
  const reviews = await getGoogleReviews({ minRating: 5, maxCount: 3 });
  return (
    <ReviewsSection
      reviews={reviews}
      title="What Our Clients Are Saying"
      maxItems={3}
      columns={{ base: 1, sm: 3 }}
      showViewAll
      viewAllHref="/reviews"
      viewAllLabel="See All Client Reviews"
    />
  );
}
