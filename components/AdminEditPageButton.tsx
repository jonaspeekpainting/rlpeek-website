"use client";

import Link from "next/link";
import { useHasAdminAccess } from "@/components/AdminNavLink";
import { IconPencil } from "@tabler/icons-react";

type Props = {
  pageId: string;
};

/**
 * Renders a small "Edit" button that links to the admin page with this page
 * opened in the edit modal. Only visible when the user has admin access
 * (admin_pages_secret in localStorage).
 */
export function AdminEditPageButton({ pageId }: Props) {
  const hasAccess = useHasAdminAccess();
  if (!hasAccess) return null;

  return (
    <Link
      href={`/admin?edit=${encodeURIComponent(pageId)}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
      aria-label="Edit this page"
    >
      <IconPencil size={16} stroke={2} />
      Edit
    </Link>
  );
}
