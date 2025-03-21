import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/rent-house-a2c71.appspot.com/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // Increase limit (e.g., 10MB)
    },
  },
};

export default nextConfig;
