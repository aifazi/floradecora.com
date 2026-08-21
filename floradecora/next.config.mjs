/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.aifazi.net",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // perf
  compress: true,
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.6.76", "10.255.254.14", "localhost"],
};

export default nextConfig;
