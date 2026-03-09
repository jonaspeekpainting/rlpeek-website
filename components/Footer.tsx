import Image from "next/image";
import Link from "next/link";
import { Anchor, Box, Container, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";
import { SITE_NAME, PHONE, PHONE_LINK, ADDRESS, s3Image } from "@/lib/site";

const footerLinks = [
  { href: "/service-areas", label: "Service Areas" },
  { href: "/service-areas/park-city-ut-painting", label: "Park City" },
  { href: "/service-areas/deer-valley-ut-painting", label: "Deer Valley" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/reviews", label: "Leave a Review" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/site-map", label: "Sitemap" },
];

export function Footer() {
  const fullAddress = `${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.region} ${ADDRESS.postalCode}`;
  return (
    <Box
      component="footer"
      bg="gray.0"
      className="border-t border-gray-2"
      py="xl"
    >
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
          <Stack gap="sm">
            <Link href="/" className="inline-block">
              <Image
                src={s3Image("images/logo.png")}
                alt={SITE_NAME}
                width={140}
                height={42}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <Text size="sm" c="dimmed" maw={280}>
              Quality interior and exterior painting services for Summit and Wasatch County since 1987.
            </Text>
          </Stack>
          <Stack gap="xs">
            <Title order={6} fw={600} c="dark">
              Contact
            </Title>
            <Text size="sm" c="dimmed">
              {fullAddress}
            </Text>
            <Anchor href={PHONE_LINK} size="sm" fw={600} c="brand.6" className="no-underline hover:underline" component="a">
              {PHONE}
            </Anchor>
          </Stack>
          <Stack gap="xs">
            <Title order={6} fw={600} c="dark">
              Quick Links
            </Title>
            <Stack gap={4}>
              {footerLinks.map(({ href, label }) => (
                <Link key={href} href={href} className="no-underline hover:underline">
                  <Text size="sm" c="dimmed" className="hover:text-dark">
                    {label}
                  </Text>
                </Link>
              ))}
            </Stack>
          </Stack>
          <Stack gap="xs">
            <Title order={6} fw={600} c="dark">
              Follow Us
            </Title>
            <Group gap="sm">
              <Anchor
                href="https://www.instagram.com/peekpainting/"
                target="_blank"
                rel="noopener noreferrer"
                component="a"
                c="dimmed"
                className="hover:text-dark transition-colors"
                aria-label="Instagram"
              >
                <IconBrandInstagram size={28} stroke={1.5} />
              </Anchor>
              <Anchor
                href="https://www.facebook.com/PeekPainting"
                target="_blank"
                rel="noopener noreferrer"
                component="a"
                c="dimmed"
                className="hover:text-dark transition-colors"
                aria-label="Facebook"
              >
                <IconBrandFacebook size={28} stroke={1.5} />
              </Anchor>
            </Group>
          </Stack>
        </SimpleGrid>
        <Box mt="xl" pt="lg" style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}>
          <Text size="sm" c="dimmed" ta="center">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
