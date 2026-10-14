import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev-only route indicator defaults to bottom-left, which sits right on
  // top of the floating WhatsApp button during local development.
  devIndicators: {
    position: "bottom-right",
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
