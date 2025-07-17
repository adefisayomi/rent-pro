import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   async redirects() {
    return [
      {
        source: '/dashboard',    
        destination: '/dashboard/account', 
        permanent: true,
      },
      {
        source: '/dashboard/tools',    
        destination: '/dashboard/tools/details', 
        permanent: true,
      },
      {
        source: '/dashboard/settings',    
        destination: '/dashboard/settings/notifications', 
        permanent: true,
      },
    ];
  },
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

export default nextConfig