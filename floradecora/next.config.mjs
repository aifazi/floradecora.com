/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.aifazi.net" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },
  compress: true,
  poweredByHeader: false,
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
    ? process.env.ALLOWED_DEV_ORIGINS.split(",").map((s) => s.trim())
    : ["http://localhost:3000", "http://localhost:3001"],
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async redirects() {
    return [{ source: "/quote", destination: "/contact", permanent: true }];
  },
  async headers() {
    // Build connect-src dynamically to support Render/Supabase in production
    // NEXT_PUBLIC_API_URL or BACKEND_URL may point to *.onrender.com
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || "";
    let backendOrigin = "";
    try {
      if (backendUrl) backendOrigin = new URL(backendUrl).origin;
    } catch {}
    const connectSrc = [
      "'self'",
      "https://cdn.aifazi.net",
      "https://api.web3forms.com",
      "https://challenges.cloudflare.com",
      "https://floradecora.com",
      "https://www.floradecora.com",
      "https://*.onrender.com",
      backendOrigin,
    ]
      .filter(Boolean)
      .join(" ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
              "img-src 'self' https://cdn.aifazi.net https://images.unsplash.com data: blob:",
              "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              `connect-src ${connectSrc}`,
              "frame-src https://challenges.cloudflare.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/(.*)\\.(webp|avif|png|jpg|jpeg|svg|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;