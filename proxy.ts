import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Canonical host: always use www so all traffic lands on the same domain. */
const CANONICAL_HOST = "www.rlpeekpainting.com";

/**
 * Edge proxy (Next.js 16 replacement for middleware.ts).
 * Redirects bare domain → www with a 301 so both www and non-www don't
 * serve duplicate content. Amplify customRules handles the CDN-level
 * redirect; this is the application-level safety net.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const rawHost = request.headers.get("host") ?? "";
  const host = rawHost.replace(/:\d+$/, "");

  if (host === "rlpeekpainting.com") {
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)",
  ],
};
