"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  Menu,
  NavLink,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useViewportSize, useWindowScroll } from "@mantine/hooks";

import { SITE_NAME, PHONE_LINK, s3Image } from "@/lib/site";
import { AdminNavLinkDesktop, AdminNavLinkMobile } from "@/components/AdminNavLink";

const navLinks = [
  { href: "/", label: "Home" },
  {
    label: "Services",
    children: [
      {
        label: "Interior Services",
        children: [
          { href: "/services/interior-services/painting", label: "Painting" },
          { href: "/services/interior-services/staining", label: "Staining" },
          { href: "/services/interior-services/drywall-repair", label: "Drywall Repair" },
          { href: "/services/interior-services/cabinetry-wood-refinishing", label: "Cabinetry & Wood Refinishing" },
          { href: "/services/polyaspartic-garage-floors", label: "Polyaspartic Garage Floors" },
          { href: "/services/lime-and-mineral-washing", label: "Lime & Mineral Washing" },
          { href: "/services/custom-interior-plastering", label: "Custom Interior Plastering" },
        ],
      },
      {
        label: "Exterior Services",
        children: [
          { href: "/services/exterior-services/painting", label: "Painting" },
          { href: "/services/exterior-services/staining", label: "Staining" },
        ],
      },
    ],
  },
  {
    label: "About",
    children: [
      { href: "/about-us", label: "About Us" },
      { href: "/service-areas", label: "Service Areas" },
      { href: "/home-painting-tips", label: "Home Tips" },
      { href: "/meet-the-team", label: "Meet The Team" },
      { href: "/reviews", label: "Submit Feedback" },
      { href: "/employment", label: "Employment" },
      { href: "/contact-us", label: "Contact Us" },
    ],
  },
  { href: "/latest-projects", label: "Latest Projects" },
  { href: "/reviews", label: "Reviews" },
];

const navLinkProps = {
  variant: "subtle" as const,
  color: "dark",
  size: "md",
  fw: 600,
};

function ChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function DesktopNav() {
  return (
    <Group gap={2} wrap="nowrap">
      {navLinks.map((item) => {
        if ("href" in item && item.href) {
          return (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              {...navLinkProps}
              classNames={{ root: "nav-link" }}
            >
              {item.label}
            </Button>
          );
        }
        if ("children" in item) {
          return (
            <Menu
              key={item.label}
              shadow="md"
              width={280}
              position="bottom-start"
              offset={0}
              radius="md"
              trigger="hover"
              openDelay={100}
              closeDelay={200}
            >
              <Menu.Target>
                <Button
                  {...navLinkProps}
                  rightSection={<ChevronDown />}
                  classNames={{ root: "nav-link" }}
                >
                  {item.label}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {item.children!.map((sub, i) =>
                  "href" in sub ? (
                    <Menu.Item key={sub.href} component={Link} href={sub.href}>
                      {sub.label}
                    </Menu.Item>
                  ) : (
                    <Box key={(sub as { label: string }).label}>
                      {i > 0 && <Menu.Divider />}
                      <Menu.Label>{(sub as { label: string }).label}</Menu.Label>
                      {(sub as { children: { href: string; label: string }[] }).children?.map((c) => (
                        <Menu.Item key={c.href} component={Link} href={c.href}>
                          {c.label}
                        </Menu.Item>
                      ))}
                    </Box>
                  )
                )}
              </Menu.Dropdown>
            </Menu>
          );
        }
        return null;
      })}
      <AdminNavLinkDesktop />
    </Group>
  );
}

function MobileNavLinks({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <Stack gap={0}>
      {navLinks.map((item) => {
        if ("href" in item && item.href) {
          return (
            <UnstyledButton
              key={item.href}
              component={Link}
              href={item.href}
              onClick={onLinkClick}
              py="sm"
              px="md"
              className="nav-drawer-link"
            >
              <Text size="sm" fw={600} c="dark.7">
                {item.label}
              </Text>
            </UnstyledButton>
          );
        }
        if ("children" in item) {
          return (
            <NavLink
              key={item.label}
              label={item.label}
              defaultOpened={false}
              classNames={{ label: "nav-drawer-label", children: "nav-drawer-children" }}
              styles={{
                label: { fontWeight: 600 },
              }}
            >
              {item.children!.map((sub) =>
                "href" in sub ? (
                  <UnstyledButton
                    key={sub.href}
                    component={Link}
                    href={sub.href}
                    onClick={onLinkClick}
                    py="xs"
                    pl="xl"
                    pr="md"
                    className="nav-drawer-sublink"
                  >
                    <Text size="sm" c="dark.6">
                      {sub.label}
                    </Text>
                  </UnstyledButton>
                ) : (
                  <Box key={(sub as { label: string }).label} pl="xl" pr="md" pb="xs">
                    <Text size="xs" fw={700} c="dimmed" mb={4}>
                      {(sub as { label: string }).label}
                    </Text>
                    <Stack gap={0}>
                      {(sub as { children: { href: string; label: string }[] }).children?.map((c) => (
                        <UnstyledButton
                          key={c.href}
                          component={Link}
                          href={c.href}
                          onClick={onLinkClick}
                          py={6}
                          pl="md"
                          pr="md"
                          className="nav-drawer-sublink"
                        >
                          <Text size="sm" c="dark.6">
                            {c.label}
                          </Text>
                        </UnstyledButton>
                      ))}
                    </Stack>
                  </Box>
                )
              )}
            </NavLink>
          );
        }
        return null;
      })}
      <AdminNavLinkMobile onLinkClick={onLinkClick} />
    </Stack>
  );
}

const HERO_SCROLL_RATIO = 0.65; // show CTA after scrolling past ~65% of viewport (hero height)

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const [scroll] = useWindowScroll();
  const { height: viewportHeight } = useViewportSize();
  const heroThreshold = typeof viewportHeight === "number" ? viewportHeight * HERO_SCROLL_RATIO : 500;
  const isHome = pathname === "/";
  const showHeaderCta = !isHome || scroll.y >= heroThreshold;

  return (
    <>
      <Box
        component="header"
        pos="sticky"
        top={0}
        bg="white"
        style={{ borderBottom: "1px solid var(--mantine-color-gray-2)", zIndex: 200 }}
      >
        <Container size="xl">
          <Group justify="space-between" align="center" h={72} wrap="nowrap" gap="md">
            <UnstyledButton component={Link} href="/" aria-label={`${SITE_NAME} home`}>
              <Image
                src={s3Image("images/logo.png")}
                alt={SITE_NAME}
                width={160}
                height={48}
                className="h-10 w-auto sm:h-12"
                priority
              />
            </UnstyledButton>

            <Box visibleFrom="md" style={{ flex: 1 }} className="flex justify-center">
              <DesktopNav />
            </Box>

            <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
              {showHeaderCta && (
                <Button
                  component={Link}
                  href="/contact-us"
                  color="brand"
                  size="md"
                  fw={600}
                  visibleFrom="sm"
                >
                  Free Consultation
                </Button>
              )}
              <ActionIcon
                variant="subtle"
                color="dark"
                size="lg"
                aria-label="Open menu"
                onClick={() => setDrawerOpen(true)}
                hiddenFrom="md"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M2 5h16M2 10h16M2 15h16" />
                </svg>
              </ActionIcon>
            </Group>
          </Group>
        </Container>
      </Box>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="right"
        size="min(320, 100vw)"
        title={<Text fw={700} size="lg">{SITE_NAME}</Text>}
        styles={{
          header: { borderBottom: "1px solid var(--mantine-color-gray-2)", marginBottom: 0 },
          body: { paddingTop: 0 },
        }}
      >
        <Stack gap={0} pt="md">
          <MobileNavLinks onLinkClick={() => setDrawerOpen(false)} />
        </Stack>
        <Divider my="xl" />
        <Stack gap="sm">
          <Button
            component="a"
            href="/contact-us"
            color="brand"
            fullWidth
            size="md"
            fw={600}
            onClick={() => setDrawerOpen(false)}
          >
            Free Consultation
          </Button>
        </Stack>
      </Drawer>

      <style>{`
        .nav-link {
          border-radius: var(--mantine-radius-md);
        }
        .nav-link:hover {
          background-color: var(--mantine-color-gray-1);
          color: var(--mantine-color-dark-7);
        }
        .nav-drawer-link:hover,
        .nav-drawer-sublink:hover {
          background-color: var(--mantine-color-gray-1);
        }
        .nav-drawer-children {
          padding-left: 0;
        }
      `}</style>
    </>
  );
}
