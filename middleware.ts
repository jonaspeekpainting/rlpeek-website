import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Canonical host: always use www so all traffic lands on the same domain. */
const CANONICAL_HOST = "www.rlpeekpainting.com";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";

  // Redirect non-www to www with 301 (permanent) for same-domain consistency (AEO).
  if (host === "rlpeekpainting.com") {
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on all pathnames except _next/static, _next/image, and static assets.
     * This avoids running on every static file.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)",
  ],
};
