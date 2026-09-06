/**
 * @file Sitemap — auto-generated at /sitemap.xml
 * @description Lists every static route plus one entry per room detail page
 *   (pulled live from the room catalogue, so a new room automatically gets a
 *   sitemap entry with no code change).
 */

import type { MetadataRoute } from "next";
import { getAllRooms } from "@/lib/rooms-data";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/rooms`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/dining`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/ikoyi-apartments`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/special-offers`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const roomRoutes: MetadataRoute.Sitemap = getAllRooms().map((room) => ({
    url: `${SITE_URL}/rooms/${room.slug}`,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...roomRoutes];
}
