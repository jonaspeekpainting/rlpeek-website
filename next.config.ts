import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  async redirects() {
    // Application-level fallback. Primary redirect is in Amplify customRules.
    return [
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "rlpeekpainting.com" }],
        destination: "https://www.rlpeekpainting.com/:path*",
        permanent: true,
      },
    ];
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
