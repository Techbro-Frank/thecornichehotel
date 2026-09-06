/**
 * @file SEO helpers — structured data + shared Open Graph defaults
 * @description Single source of truth for the site's SEO surface: the base
 *   URL, default OG image, and builders for the JSON-LD schemas Google uses
 *   to power rich results — Hotel (address, phone, price range, amenities,
 *   photos, hero video), Restaurant (for the Bistro), and per-room Product
 *   offers (so individual room prices can appear in search).
 *
 *   Note: `geo` (lat/long) is intentionally omitted — we don't have verified
 *   coordinates for the property, and a wrong pin is worse than no pin. Add
 *   `geo: { "@type": "GeoCoordinates", latitude, longitude }` to HOTEL_SCHEMA
 *   below once you have the real coordinates (e.g. from Google Maps → Share
 *   → "Copy coordinates").
 *
 *   Also note: the hero video is a .MOV (QuickTime) file. That plays fine in
 *   the browser, but search engines and social platforms index video far
 *   more reliably from standard MP4 (H.264). Converting
 *   /public/videos/corniche-hero.MOV to .mp4 would meaningfully improve the
 *   odds of it surfacing as a video result.
 */

import { getAllRooms } from "@/lib/rooms-data";
import { BRAND, CHECK_IN_TIME, CHECK_OUT_TIME, HOTEL_INSTAGRAM_URL, SOCIAL_LINKS } from "@/lib/constants";

export const SITE_URL = "https://thecornichehotel.com";

/** Default social-preview image — the branded night exterior shot used across the site. */
export const DEFAULT_OG_IMAGE = "/images/View%20Photos/image%20copy%205.png";

const HOTEL_EXTERIOR_IMAGES = [
  "/images/View%20Photos/image%20copy%205.png",
  "/images/View%20Photos/image%20copy%2015.png",
  "/images/View%20Photos/image%20copy%2011.png",
];

/** Google Maps deep-link built from the verified street address — same pattern as the Contact page. */
export function googleMapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${BRAND.name}, ${BRAND.address}`)}`;
}

/**
 * Hotel schema (schema.org/Hotel) — the main structured-data block for the
 * whole site. Price range is computed live from the room catalogue, so it
 * can't drift out of sync the way the old hardcoded homepage prices did.
 */
export function buildHotelSchema() {
  const rooms = getAllRooms();
  const prices = rooms.map((r) => Number(r.price.replace(/[^\d]/g, "")));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: BRAND.name,
    description:
      "The Corniche Hotel — a boutique luxury hotel in Lekki Phase 1, Lagos, with 28 rooms and suites, an on-site restaurant and bar, and full-serviced Ikoyi apartments.",
    url: SITE_URL,
    telephone: BRAND.phone,
    email: BRAND.email,
    priceRange: `₦${minPrice.toLocaleString()} - ₦${maxPrice.toLocaleString()}`,
    checkinTime: CHECK_IN_TIME,
    checkoutTime: CHECK_OUT_TIME,
    address: {
      "@type": "PostalAddress",
      streetAddress: "2 Olaitan Senbanjo Street, Lekki Phase 1",
      addressLocality: "Lagos",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    hasMap: googleMapsUrl(),
    image: HOTEL_EXTERIOR_IMAGES.map((path) => `${SITE_URL}${path}`),
    video: {
      "@type": "VideoObject",
      name: "The Corniche Hotel — Brand Film",
      description: "A cinematic look at The Corniche Hotel in Lekki Phase 1, Lagos.",
      thumbnailUrl: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      contentUrl: `${SITE_URL}/videos/corniche-hero.MOV`,
      uploadDate: "2026-01-01",
    },
    amenityFeature: [
      "Fine Dining Restaurant",
      "Lounge & Bar",
      "High-Speed WiFi",
      "24/7 Security",
      "Spa & Wellness",
      "24-Hour Concierge",
    ].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    starRating: { "@type": "Rating", ratingValue: "5" },
    sameAs: SOCIAL_LINKS.map((s) => s.href),
    makesOffer: rooms.map((room) => ({
      "@type": "Offer",
      name: room.name,
      price: room.price.replace(/[^\d]/g, ""),
      priceCurrency: "NGN",
      url: `${SITE_URL}/rooms/${room.slug}`,
    })),
  };
}

/** Restaurant schema (schema.org/Restaurant) for The Corniche Bistro. */
export function buildRestaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "The Corniche Bistro",
    description:
      "Fine dining and cocktails at The Corniche Bistro, inside The Corniche Hotel, Lekki Phase 1, Lagos.",
    url: `${SITE_URL}/dining`,
    telephone: BRAND.restaurantPhone,
    servesCuisine: ["Nigerian", "International", "Contemporary"],
    priceRange: "₦₦₦",
    address: {
      "@type": "PostalAddress",
      streetAddress: "2 Olaitan Senbanjo Street, Lekki Phase 1",
      addressLocality: "Lagos",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    hasMap: googleMapsUrl(),
    image: `${SITE_URL}/images/Corniche-bistro-restaurant.png`,
    sameAs: [HOTEL_INSTAGRAM_URL],
    menu: `${SITE_URL}/dining`,
  };
}

/** Product/Offer schema for a single room type's detail page. */
export function buildRoomSchema(room: {
  name: string;
  slug: string;
  price: string;
  description: string;
  images: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${room.name} — The Corniche Hotel`,
    description: room.description,
    image: room.images.slice(0, 5).map((path) => `${SITE_URL}${encodeURI(path)}`),
    brand: { "@type": "Brand", name: BRAND.name },
    offers: {
      "@type": "Offer",
      price: room.price.replace(/[^\d]/g, ""),
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/rooms/${room.slug}`,
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
