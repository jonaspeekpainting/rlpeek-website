import type { Metadata } from "next";
import { getPageByPath } from "@/lib/content";
import { PageContent } from "@/components/PageContent";
import { ContactForm } from "@/components/ContactForm";
import { ReviewsSection } from "@/components/ReviewsSection";
import { getGoogleReviews } from "@/lib/googleReviews";
import { SITE_URL, SITE_NAME, PHONE, PHONE_LINK } from "@/lib/site";
import { Anchor, Box, Button, Grid, GridCol, Paper, Text, Title } from "@mantine/core";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageByPath("contact-us");
  return {
    title: page?.title ?? "Contact Us",
    description: page?.description ?? "Request a free estimate from RL Peek Painting. Contact us by phone or form for interior and exterior painting in Summit and Wasatch County.",
    alternates: { canonical: `${SITE_URL}/contact-us` },
  };
}

export default async function ContactUsPage() {
  const page = getPageByPath("contact-us");
  const reviews = await getGoogleReviews({ minRating: 5, maxCount: 3 });

  return (
    <PageContent
      page={
        page ?? {
          path: "contact-us",
          slug: "contact-us",
          title: `Contact ${SITE_NAME}`,
          description: "",
        }
      }
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
    >
      <Box mt="xl">
        {/* What to expect + About us */}
        <Grid gutter="lg" mb="lg">
          <GridCol span={{ base: 12, lg: 8 }}>
            <Paper
              shadow="sm"
              p="xl"
              radius="md"
              style={{
                border: "none",
                boxShadow: "0 -8px 18px -6px rgba(0,0,0,0.11), 0 1px 4px 0 rgba(0,0,0,0.04)",
              }}
            >
              <ContactForm />
            </Paper>
          </GridCol>
          <GridCol span={{ base: 12, lg: 4 }}>
            <ReviewsSection
              reviews={reviews}
              title="Recent 5-Star Reviews"
              maxItems={3}
              columns={{ base: 1 }}
              showViewAll
              viewAllHref="/reviews"
              viewAllLabel="Read More Reviews"
            />
          </GridCol>
        </Grid>
        {/* Call us */}
        <Anchor
          href={PHONE_LINK}
          component="a"
          style={{
            display: "block",
            marginBottom: 24,
            width: "100%",
            textDecoration: "none",
          }}
          className="no-underline"
        >
          <Button
            component="span"
            variant="light"
            color="brand"
            size="md"
            radius="md"
            fullWidth
            style={{
              fontWeight: 600,
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              gap: 8,
              pointerEvents: "none", // avoids double navigation since Anchor already wraps
            }}
            tabIndex={-1} // prevent tab stop on this element (since the Anchor is the interactive one)
          >
            Call Us: {PHONE}
          </Button>
        </Anchor>
        <Box
          bg="brand.0"
          p="xl"
          mb="xl"
          style={{
            borderRadius: "var(--mantine-radius-md)",
          }}
        >
          <Box mb="xl">
            <Title order={4} fw={600} mb="sm" c="brand.8" size="sm" tt="uppercase">
              What happens during the visit?
            </Title>
            <Box component="ul" mb="md" pl="lg" style={{ listStyleType: "disc", listStylePosition: "outside" }}>
              <Text component="li" size="sm" c="dimmed" mb="xs">
                We&apos;ll begin by discussing exactly what you&apos;re looking for and how we can help make your home shine.
              </Text>
              <Text component="li" size="sm" c="dimmed" mb="xs">
                Next, we&apos;ll walk around the property together to evaluate the areas that need attention now and identify any that can be addressed at a later time.
              </Text>
              <Text component="li" size="sm" c="dimmed" mb="xs">
                Before we leave, we&apos;ll prepare your estimate and review it with you so you have everything in hand.
              </Text>
              <Text component="li" size="sm" c="dimmed">
                Please plan for about an hour for this appointment.
              </Text>
            </Box>
          </Box>
          <Box>
            <Title order={4} fw={600} mb="sm" c="brand.8" size="sm" tt="uppercase">
              About us
            </Title>
            <Text size="sm" c="dimmed">
              At RL Peek Painting, we take pride in being a trusted local painting company known for quality
              craftsmanship, reliable service, and long-lasting results. Since 1987, we have proudly served homeowners
              and businesses throughout Summit and Wasatch County, delivering professional interior and exterior
              painting, staining, and wood refinishing services with meticulous attention to detail.
            </Text>
          </Box>
        </Box>
      </Box>
    </PageContent>
  );
}
