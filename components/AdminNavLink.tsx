"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, UnstyledButton } from "@mantine/core";
import { Text } from "@mantine/core";

const STORAGE_KEY = "admin_pages_secret";

export function getAdminSecret(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setAdminSecret(secret: string): void {
  localStorage.setItem(STORAGE_KEY, secret);
}

export function clearAdminSecret(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function useHasAdminAccess(): boolean {
  const [has, setHas] = useState(false);
  useEffect(() => {
    setHas(!!localStorage.getItem(STORAGE_KEY));
  }, []);
  return has;
}

const navLinkProps = {
  variant: "subtle" as const,
  color: "dark",
  size: "md",
  fw: 600,
};

export function AdminNavLinkDesktop() {
  const has = useHasAdminAccess();
  if (!has) return null;
  return (
    <Button
      component={Link}
      href="/admin"
      {...navLinkProps}
      classNames={{ root: "nav-link" }}
    >
      Admin
    </Button>
  );
}

export function AdminNavLinkMobile({ onLinkClick }: { onLinkClick: () => void }) {
  const has = useHasAdminAccess();
  if (!has) return null;
  return (
    <UnstyledButton
      component={Link}
      href="/admin"
      onClick={onLinkClick}
      py="sm"
      px="md"
      className="nav-drawer-link"
    >
      <Text size="sm" fw={600} c="dark.7">
        Admin
      </Text>
    </UnstyledButton>
  );
}
