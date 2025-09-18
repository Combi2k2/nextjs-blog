import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Increase body size limit for file uploads
    },
  },
};

export default nextConfig;
