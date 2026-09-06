/**
 * @file robots.txt — auto-generated at /robots.txt
 * @description Allows all crawlers everywhere and points them at the sitemap.
 */

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
