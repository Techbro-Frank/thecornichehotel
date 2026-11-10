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
  // Old WordPress URLs are still indexed by Google and bookmarked by guests.
  // Send them to the matching page on the new site instead of a 404.
  async redirects() {
    const rooms = "/rooms";
    const home = "/";
    const newRoomSlugs = [
      "standard-room",
      "executive-double",
      "signature-executive",
      "studio-apartment",
      "presidential-suite",
      "signature-suite",
      "executive-suite",
      "signature-room",
      "kings-room",
    ];
    return [
      // Individual room pages: /accommodation/<slug> -> /rooms/<slug>
      ...newRoomSlugs.map((slug) => ({
        source: `/accommodation/${slug}`,
        destination: `/rooms/${slug}`,
        permanent: true,
      })),
      // Any other old room / listing URL -> rooms overview
      { source: "/accommodation/:path*", destination: rooms, permanent: true },
      { source: "/accommodations/:path*", destination: rooms, permanent: true },
      { source: "/accommodation-category/:path*", destination: rooms, permanent: true },
      { source: "/room-and-suites/:path*", destination: rooms, permanent: true },
      { source: "/rooms-and-suites/:path*", destination: rooms, permanent: true },
      // Old booking page -> the live booking engine
      {
        source: "/check-availability/:path*",
        destination: "https://www.weareanli.com/corniche-hotel/8/booking",
        permanent: true,
      },
      // Renamed pages
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/restaurant/:path*", destination: "/dining", permanent: true },
      // WordPress/Elementor leftovers -> home
      { source: "/home-2", destination: home, permanent: true },
      { source: "/home", destination: home, permanent: true },
      { source: "/header/:path*", destination: home, permanent: true },
      { source: "/footer/:path*", destination: home, permanent: true },
      { source: "/wp-admin/:path*", destination: home, permanent: true },
      { source: "/wp-login.php", destination: home, permanent: true },
      { source: "/wp-content/:path*", destination: home, permanent: true },
      { source: "/product/:path*", destination: rooms, permanent: true },
      { source: "/shop/:path*", destination: rooms, permanent: true },
      { source: "/cart", destination: home, permanent: true },
      { source: "/checkout/:path*", destination: home, permanent: true },
      { source: "/my-account/:path*", destination: home, permanent: true },
    ];
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
