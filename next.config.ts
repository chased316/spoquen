import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Firebase App Hosting
  output: 'standalone',
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
