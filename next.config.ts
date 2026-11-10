import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev-only route indicator defaults to bottom-left, which sits right on
  // top of the floating WhatsApp button during local development.
  devIndicators: {
    position: "bottom-right",
  },
  // Room/apartment pages read public/images with fs at build time to list
  // photos. That makes Next's file tracing bundle the whole public folder
  // (350MB+) into every serverless function, which breaks Vercel's 250MB
  // limit. All pages are prerendered, so the functions never need these files
  // at runtime — they're served from the CDN instead.
  outputFileTracingExcludes: {
    "*": ["public/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
