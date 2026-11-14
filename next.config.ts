import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Speaker photos and other admin uploads live in Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Keep old URLs working (bookmarks, printed QR codes, search results).
    return [
      { source: "/callforpapers", destination: "/call-for-papers", permanent: true },
      { source: "/gallery", destination: "/previous-conferences", permanent: true },
    ];
  },
  turbopack: {
    // Pin the project root: on the server a stray package-lock.json in the parent folder was being picked up.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
