import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.cdn.filesafe.space",
      },
      {
        protocol: "https",
        hostname: "dgklukamfrrig5hi.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "cdn.senja.io",
      },
    ],
  },
};

export default nextConfig;
