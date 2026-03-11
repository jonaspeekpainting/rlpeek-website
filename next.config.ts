import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  async redirects() {
    // Application-level fallback. Primary redirect is in Amplify customRules.
    const wwwRedirect = {
      source: "/:path*",
      has: [{ type: "host" as const, value: "rlpeekpainting.com" }],
      destination: "https://www.rlpeekpainting.com/:path*",
      permanent: true,
    };

    // Stale/off-topic blog articles removed from the content library.
    // Redirecting to the tips index prevents 404s for any existing links or bookmarks.
    const staleArticleRedirects = [
      "paint-color-trends-for-2018",
      "coastal-color-fading-how-salt-air-impacts-exterior-paint-and-what-you-can-do-about-it",
      "tips-for-your-little-interior-painting-artist",
      "color-analysis-what-works-best-for-selling-your-home",
      "all-about-park-city-house-painting-tips-and-facts",
      "how-to-prepare-for-your-professional-interior-painting",
      "3-signs-its-time-to-update-your-exterior-paint-this-spring",
      "during-remodeling-when-do-you-paint-and-other-important-question",
      "not-all-painting-contractors-are-the-same-watching-for-red-flags",
      "how-to-choose-the-colors-for-your-interior-painting-project",
      "choosing-paint-types-for-your-park-city-home",
      "why-you-should-use-a-professional-painting-company",
      "5-tips-for-the-perfect-interior-paint-job",
      "helpful-tips-for-park-city-interior-painting",
      "prepping-for-paint-in-park-city",
      "interior-painting-ideas-for-park-city-homes",
    ].map((slug) => ({
      source: `/home-painting-tips/${slug}`,
      destination: "/home-painting-tips",
      permanent: true,
    }));

    return [wwwRedirect, ...staleArticleRedirects];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rl-peek-public-resources.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.rlpeekpainting.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
