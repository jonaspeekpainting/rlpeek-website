import { fetchPages } from "@/lib/pagesApi";
import { RecentProjectsCarousel } from "@/components/RecentProjectsCarousel";

export async function AsyncRecentProjectsCarousel() {
  const projects = await fetchPages({ type: "project", maxCount: 3 });
  return (
    <RecentProjectsCarousel
      projects={projects}
      title="Recent Projects"
      maxItems={3}
      columns={{ base: 1, sm: 3 }}
      showViewAll
      viewAllHref="/latest-projects"
      viewAllLabel="View All Projects"
    />
  );
}
