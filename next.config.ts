import type { NextConfig } from "next";

const apiBaseUrl = (
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000"
)
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

const isLiveApi = process.env.API_MODE === "live";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: {
    // Users paste arbitrary listing image URLs (imgbb, Unsplash, or their own
    // hosting), so allow every remote host and let the optimizer fetch.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    if (!isLiveApi) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
