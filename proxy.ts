import type { Redirect } from "next/dist/lib/load-custom-routes";

/** Canonical host: always use www so all traffic lands on the same domain. */
export const CANONICAL_HOST = "www.rlpeekpainting.com";

/**
 * Permanent redirect config consumed by next.config.ts redirects().
 * Redirects bare domain → www with a 301 to fix duplicate-content issues.
 */
export const wwwRedirect: Redirect = {
  source: "/:path*",
  has: [{ type: "host", value: "rlpeekpainting.com" }],
  destination: `https://${CANONICAL_HOST}/:path*`,
  permanent: true,
};
