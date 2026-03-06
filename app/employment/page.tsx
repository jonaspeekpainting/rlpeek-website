import type { Metadata } from "next";
import { getPageByPath } from "@/lib/content";
import { PageContent } from "@/components/PageContent";
import { EmploymentForm } from "@/components/EmploymentForm";
import { SITE_URL } from "@/lib/site";
import { Box, Paper, Title } from "@mantine/core";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageByPath("employment");
  return {
    title: page?.title ?? "Employment",
    description: page?.description,
    alternates: { canonical: `${SITE_URL}/employment` },
  };
}

export default function EmploymentPage() {
  const page = getPageByPath("employment");

  return (
    <PageContent
      page={
        page ?? {
          path: "employment",
          slug: "employment",
          title: "Painters Wanted",
          description: "",
        }
      }
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Employment" }]}
    >
      <Box mt="xl">
        <Paper
          shadow="sm"
          p="xl"
          radius="md"
          style={{
            border: "none",
            boxShadow:
              "0 -8px 18px -6px rgba(0,0,0,0.11), 0 1px 4px 0 rgba(0,0,0,0.04)",
          }}
        >
          <Title order={2} size="h3" mb="lg" c="brand.8">
            Please fill out our form for more info.
          </Title>
          <EmploymentForm />
        </Paper>
      </Box>
    </PageContent>
  );
}
