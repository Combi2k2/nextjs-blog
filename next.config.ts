import type { NextConfig } from "next";

const bucketName = process.env.AWS_S3_BUCKET_NAME || 'combi-blog';
const region = process.env.AWS_REGION || 'us-east-1';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: `${bucketName}.s3.${region}.amazonaws.com`,
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
