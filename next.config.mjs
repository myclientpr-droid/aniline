import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Same precedence as the URL builders in `src/lib/cloudinary.js`.
const cloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || 'demo';

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // `CLOUDINARY_CLOUD_NAME` is server-only, so in the browser the builders would fall
  // back to `demo` and produce URLs the allow-list below rejects. Inline the resolved
  // cloud name as the public variable they check first, so client and server agree.
  env: { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: cloudName },
  turbopack: {
    root: __dirname,
  },
  async headers() {
    // Bundled OG fonts are read by `next/og` and never change under the same filename.
    return [
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: `/${cloudName}/**`,
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
