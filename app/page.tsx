import type { Metadata } from "next";
import Link from "next/link";
import { Box, Container, Title, Text, Button, Card, SimpleGrid, Stack } from "@mantine/core";
import Image from "next/image";
import { PHONE_LINK, SITE_NAME, SITE_URL, s3Image } from "@/lib/site";
import { getGoogleReviews } from "@/lib/googleReviews";
import { fetchPages } from "@/lib/pagesApi";
import { RecentProjectsCarousel } from "@/components/RecentProjectsCarousel";
import { ReviewsSection } from "@/components/ReviewsSection";

const services = [
  { href: "/services/interior-services/drywall-repair", label: "Sheetrock Repair" },
  { href: "/services/interior-services/painting", label: "Interior Painting" },
  { href: "/services/exterior-services/painting", label: "Exterior Painting" },
  { href: "/services/interior-services/staining", label: "Interior Staining" },
  { href: "/services/exterior-services/staining", label: "Exterior Staining" },
  { href: "/services/interior-services/drywall-repair", label: "Drywall Repair" },
  { href: "/services/custom-interior-plastering", label: "Interior Plastering" },
  { href: "/services/interior-services/cabinetry-wood-refinishing", label: "Cabinet Refinishing" },
  { href: "/services/interior-services/cabinetry-wood-refinishing", label: "Woodwork Refinishing" },
  { href: "/services/lime-and-mineral-washing", label: "Interior Lime & Mineral Washing" },
  { href: "/services/polyaspartic-garage-floors", label: "Polyaspartic Garage Floors" },
];

const faq = [
  {
    question: "What happens when I request an estimate?",
    answer:
      "After you reach out, we'll contact you to schedule an in-home visit. Plan for about an hour: we'll discuss your goals and vision, walk the property together to evaluate what needs attention now (and what can wait), then prepare and review your estimate with you before we leave so you have everything in hand.",
  },
  {
    question: "How long have you been in business, and where do you serve?",
    answer:
      "RL Peek Painting has been a trusted local painting company since 1987. We serve homeowners and businesses throughout Summit and Wasatch County with professional interior and exterior painting, staining, and wood refinishing—with meticulous attention to detail and long-lasting results.",
  },
  {
    question: "When does your exterior painting season start?",
    answer:
      "Our exterior season usually starts around mid-April. We typically book projects in the first several weeks after we can start exterior work. Because weather can affect the exact start date, we hold off on firm dates until we're closer; we'll be in touch about a month before your scheduling window with a solid date. If you'd prefer a later slot in the summer, just let us know.",
  },
  {
    question: "How does scheduling work after I accept my estimate?",
    answer:
      "We'll work with you to find a time frame that fits your schedule. You'll get an estimated window for when your project will begin; about a month out, we'll follow up with a more solidified date. Weather and other factors keep the schedule slightly flexible. We'll keep you informed when our painters will be on site and check in throughout to ensure you're satisfied.",
  },
  {
    question: "When do I need to choose my colors?",
    answer:
      "We'll reach out about two weeks before your start date to gather your color selections. If you'd like help, our color consultant is available to help you choose the right palette for your home.",
  },
  {
    question: "What can I expect at the end of the project?",
    answer:
      "One to two days before we finish, we'll do a walkthrough with you to make sure everything looks great and address any final details. We want you to be thrilled with the results.",
  },
  {
    question: "What's the best time of year for exterior painting?",
    answer:
      "In Summit and Wasatch Counties, the ideal window is late spring through early fall—typically when our exterior season is in full swing from mid-April onward. We monitor conditions to ensure optimal adhesion and durability.",
  },
  {
    question: "What services do you offer?",
    answer:
      "We offer interior and exterior painting, staining, and wood refinishing—including drywall repair, cabinetry and woodwork refinishing, interior plastering, lime and mineral washing, and polyaspartic garage floors. We focus on quality craftsmanship and reliable, long-lasting results.",
  },
  {
    question: "How much does house painting cost in Park City?",
    answer:
      "House painting cost in Park City depends on the scope—interior vs. exterior, square footage, number of rooms, and prep work (e.g., drywall repair). We provide free, detailed estimates after an in-home visit so you know exactly what you're getting. Contact us for a no-obligation quote.",
  },
  {
    question: "When is the best time to paint a house in Utah?",
    answer:
      "In Utah, the best time to paint a house is late spring through early fall—typically mid-April through September in Summit and Wasatch Counties. Weather is more stable for adhesion and drying. We schedule exterior work within this window and can discuss interior projects year-round.",
  },
  {
    question: "How long does exterior paint last in mountain climates?",
    answer:
      "In mountain climates like Park City, quality exterior paint with proper prep typically lasts 7–10 years or more. Harsh UV, freeze-thaw cycles, and snow can shorten lifespan if lower-grade products are used. We use durable, climate-appropriate paints and thorough preparation to maximize longevity.",
  },
  {
    question: "What is the best exterior paint for Park City winters?",
    answer:
      "In high-altitude climates like Park City, exterior paint must withstand UV exposure, freeze-thaw cycles, and heavy snow. High-quality acrylic latex paints with UV inhibitors and flexibility for temperature swings perform best. We select products suited to our local conditions for lasting results.",
  },
];

const recentTips = [
  {
    href: "/home-painting-tips/drywall-repair-after-ice-dams-what-painters-wish-homeowners-knew",
    title: "Drywall Repair After Ice Dams: What Painters Wish Homeowners Knew",
    excerpt:
      "Heavy snow, sunny afternoons, and cold nights make ice dams a regular guest in Park City, UT. When they show up, water sneaks under shingles and finds its way to the nearest ceiling seam...",
  },
  {
    href: "/home-painting-tips/stain-or-paint-best-exterior-wood-treatments-for-high-uv-high-elevation-homes",
    title: "Stain or Paint? Best Exterior Wood Treatments for High-UV, High-Elevation Homes",
    excerpt:
      "At 7,000 feet and higher, Park City's intense sun, big temperature swings, and long winters are hard on exterior wood. If you are weighing stain versus paint...",
  },
  {
    href: "/home-painting-tips/exterior-paint-that-survives-park-city-winters",
    title: "Exterior Paint That Survives Park City Winters",
    excerpt:
      "When you live in the mountains, your home faces challenges that go far beyond normal wear and tear. In Park City, freezing temperatures, intense UV exposure...",
  },
];

// Revalidate every hour to improve response time while keeping content fresh (AEO).
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = `${SITE_URL}/`;
  return {
    title: "Park City Painting Contractor | Interior & Exterior House Painters",
    description:
      "Interior & exterior painting, staining, and more in Summit & Wasatch Counties. Free estimates - request yours today.",
    alternates: { canonical: canonicalUrl },
    openGraph: { url: canonicalUrl },
  };
}

export default async function HomePage() {
  const [reviews, projects] = await Promise.all([
    getGoogleReviews({ minRating: 5, maxCount: 3 }),
    fetchPages({ type: "project", maxCount: 3 }),
  ]);
  return (
    <>
      {/* Hero: full-width image + dark overlay + headline + CTA */}
      <Box pos="relative" className="min-h-[70vh] w-full overflow-hidden sm:min-h-[85vh]">
        <Image
          src={s3Image("images/banners/rl-peek-banner-updated.jpg")}
          alt="RL Peek Painting team and finished interior in Park City"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <Box
          pos="absolute"
          inset={0}
          bg="dark.9"
          style={{ opacity: 0.65 }}
          aria-hidden
        />
        <Box pos="absolute" inset={0} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} px="md">
          <Container size="xl" style={{ position: "relative" }}>
            <Title
              order={1}
              maw={640}
              className="text-3xl font-bold leading-tight text-white drop-shadow-md sm:text-4xl md:text-5xl"
            >
              Park City Painting Contractor | Interior & Exterior House Painters
            </Title>
            <Link href="/contact-us" className="inline-block mt-6">
              <Button
                component="span"
                color="brand"
                size="xl"
                className="w-fit font-semibold uppercase tracking-wide"
              >
                Request an Estimate
              </Button>
            </Link>
          </Container>
        </Box>
      </Box>

      {/* Intro + services list */}
      <Box py={{ base: "xl", sm: "2xl" }}>
        <Container size="lg">
          <Title order={2} className="text-3xl font-bold sm:text-4xl" c="dark">
            Trusted Painting in Park City, Summit & Wasatch County
          </Title>
          <Stack gap="md" mt="lg">
            <Text size="lg" c="dark" lh={1.7}>
              At {SITE_NAME}, we&apos;re your trusted <strong>Park City house painters</strong> and <strong>painting contractor Park City UT</strong> residents rely on. Since <strong>1987</strong>, we&apos;ve provided professional interior and exterior painting, staining, and <strong>cabinet refinishing Park City</strong> homeowners count on—with exceptional craftsmanship and dependable customer service. Whether you need <strong>exterior painting Park City</strong> to protect your home or interior refresh and woodwork updates, our team is committed to a clean process and a flawless finish.
            </Text>
            <Text size="lg" c="dark" lh={1.7}>
              We use high-quality paints, stains, and materials paired with detailed surface preparation and careful
              application to ensure a beautiful, long-lasting result. Beyond appearance, our work is focused on
              durability and protection—helping your home maintain its value and charm for years to come.
            </Text>
          </Stack>

          <Stack gap="sm" mt="xl" align="center">
            <Link href="/about-us" style={{ width: "100%", maxWidth: 500, display: "flex", justifyContent: "center" }}>
              <Button
                component="span"
                variant="light"
                color="brand"
                size="md"
                style={{ width: "100%", maxWidth: 400 }}
              >
                Learn More About Us
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>

      {/* YouTube video */}
      <Box py={{ base: "xl", sm: "2xl" }} bg="gray.0">
        <Container size="lg">
          <Title order={2} size="h2" fw={700} c="dark" mb="lg">
            See Us in Action
          </Title>
          <Box
            component="div"
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              maxWidth: "100%",
              borderRadius: 8,
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/yRXdkSUL4Ps"
              title="RL Peek Painting"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Explore Our Services */}
      <Box py={{ base: "xl", sm: "2xl" }}>
        <Container size="lg">
          <Title order={2} size="h2" fw={700} c="dark">
            Explore Our Services
          </Title>
          <Text size="lg" c="dark" mt="md">
            {SITE_NAME} proudly offers a wide range of professional painting services designed to enhance the beauty
            and value of your home. We have impeccable follow through and when we say we will, we will! No matter what
            you need, {SITE_NAME} delivers quality, precision, and craftsmanship you can trust.
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm" mt="lg">
            {services.map(({ href, label }) => (
              <Link key={href + label} href={href} className="no-underline hover:underline">
                <Text size="sm" c="brand.6">{label}</Text>
              </Link>
            ))}
          </SimpleGrid>
          <Text size="sm" c="dimmed" mt="md">
            Serving <Link href="/service-areas" className="text-brand.6 hover:underline">Park City, Deer Valley, Heber City, Midway, Kamas</Link>, and all of Summit & Wasatch County.
          </Text>
          <Stack gap="sm" mt="xl" align="center">
            <Link href="/services" style={{ width: "100%", maxWidth: 500, display: "flex", justifyContent: "center" }}>
              <Button
                component="span"
                variant="light"
                color="brand"
                size="md"
                style={{ width: "100%", maxWidth: 400 }}
              >
                More About Our Services
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>

      {/* CTA strip */}
      <Box bg="brand.6" py="xl" c="white">
        <Container size="lg">
          <Stack align="center" gap="lg">
            <Title order={2} size="h3" fw={700} c="white" ta="center">
              Ready for a Color Change? Contact Us!
            </Title>
            <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
              <Button component="a" href={PHONE_LINK} variant="white" color="dark" size="md" fw={600}>
                Call Us: 435-649-0158
              </Button>
              <Link href="/contact-us">
                <Button component="span" variant="outline" color="white" size="md">
                  Schedule a Free Estimate
                </Button>
              </Link>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Reviews */}
      <Box py={{ base: "xl", sm: "2xl" }}>
        <Container size="lg">
          <ReviewsSection
            reviews={reviews}
            title="What Our Clients Are Saying"
            maxItems={3}
            columns={{ base: 1, sm: 3 }}
            showViewAll
            viewAllHref="/reviews"
            viewAllLabel="Read More Reviews"
          />
        </Container>
      </Box>

      {/* Recent Projects carousel */}
      <Box py={{ base: "xl", sm: "2xl" }} bg="gray.0">
        <Container size="lg">
          <RecentProjectsCarousel
            projects={projects}
            title="Recent Projects"
            maxItems={3}
            columns={{ base: 1, sm: 3 }}
            showViewAll
            viewAllHref="/latest-projects"
            viewAllLabel="View All Projects"
          />
        </Container>
      </Box>

      {/* Recent Tips */}
      <Box py={{ base: "xl", sm: "2xl" }} bg="gray.0">
        <Container size="lg">
          <Title order={2} size="h2" fw={700} c="dark">
            Recent Painting Tips & Tricks
          </Title>
          <Stack gap="lg" mt="xl">
            {recentTips.map(({ href, title, excerpt }) => (
              <Card key={href} withBorder className="transition hover:shadow-md [&:hover_h3]:text-[var(--mantine-color-brand-6)]">
                <Title order={3} size="h4" c="dark">
                  <Link href={href} className="no-underline">
                    {title}
                  </Link>
                </Title>
                <Text size="sm" c="dimmed" mt="xs">
                  {excerpt}
                </Text>
              </Card>
            ))}
          </Stack>
          <Box mt="xl" style={{ display: "flex", justifyContent: "center" }}>
            <Link href="/home-painting-tips" style={{ display: "block", width: "100%", maxWidth: 400 }}>
              <Button
                component="span"
                color="brand"
                variant="light"
                size="md"
                style={{ width: "100%" }}
              >
                Read Our Home Tips
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* FAQ */}
      <Box py={{ base: "xl", sm: "2xl" }}>
        <Container size="lg">
          <Title order={2} size="h2" fw={700} c="dark">
            Common Questions
          </Title>
          <Stack gap="md" mt="xl">
            {faq.map(({ question, answer }) => (
              <Card key={question} withBorder padding="lg" radius="md">
                <Text fw={600} c="dark" size="md">
                  {question}
                </Text>
                <Text size="sm" c="dimmed" mt="xs" lh={1.6}>
                  {answer}
                </Text>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box py="xl" bg="brand.6" c="white">
        <Container size="lg">
          <Stack align="center" gap="lg">
            <Text size="lg" fw={600} c="white" ta="center">
              Ready to get started? Contact RL Peek Painting today!
            </Text>
            <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
              <Link href="/contact-us">
                <Button component="span" variant="white" color="dark" size="md">
                  Get Your Free Estimate
                </Button>
              </Link>
              <Button component="a" href={PHONE_LINK} variant="outline" color="white" size="md">
                Call Us Today
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            })),
          }),
        }}
      />
    </>
  );
}
