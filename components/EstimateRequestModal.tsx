"use client";

import { useEffect } from "react";
import { Box, Button, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, s3Image } from "@/lib/site";

const STORAGE_KEY = "rlpeek-last-visit";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function shouldShowModal(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const last = parseInt(raw, 10);
    if (Number.isNaN(last)) return true;
    return Date.now() - last >= ONE_DAY_MS;
  } catch {
    return false;
  }
}

function setLastVisit(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

export function EstimateRequestModal() {
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const id = setTimeout(() => {
      if (shouldShowModal()) {
        open();
      }
    }, 0);
    return () => clearTimeout(id);
  }, [open]);

  const handleClose = () => {
    setLastVisit();
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={null}
      centered
      size="lg"
      radius="md"
      withCloseButton
      closeButtonProps={{ "aria-label": "Close" }}
      styles={{
        content: { overflow: "hidden" },
      }}
    >
      <Stack gap={0}>
        {/* Header with logo and brand color */}
        <Box
          bg="brand.0"
          py="xl"
          px="md"
          style={{ borderRadius: "16px" }}
        >
          <Stack align="center" gap="md">
            <Image
              src={s3Image("images/logo.png")}
              alt={SITE_NAME}
              width={180}
              height={54}
              style={{ height: "auto", width: "auto", maxWidth: 200 }}
            />
            <Title order={3} fw={700} c="brand.8" ta="center" style={{ lineHeight: 1.2 }}>
              Need a painting estimate?
            </Title>
            <Text size="sm" c="brand.7" ta="center" maw={400}>
              Get a free, no-obligation quote.
            </Text>

            <Text size="sm" c="brand.7" ta="center" maw={400}>
              At RL Peek Painting, we take pride in being a trusted local painting company known for quality craftsmanship, reliable service, and long-lasting results since 1987.
            </Text>
          </Stack>
        </Box>

        <Stack gap="md" p="md">
          <Button
            component={Link}
            href="/contact-us"
            color="brand"
            size="md"
            fullWidth
            onClick={handleClose}
            fw={600}
          >
            Get a free estimate
          </Button>
          <Button variant="subtle" color="gray" size="sm" fullWidth onClick={handleClose}>
            Maybe later
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
