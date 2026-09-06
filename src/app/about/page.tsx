/**
 * @file About Page — Server wrapper
 * @description Exports page metadata (requires a Server Component — can't
 *   coexist with "use client") and renders the interactive client page.
 */

import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import AboutClient from "./about-client";

const description =
  "The Corniche Hotel's story — a boutique hotel in Lekki Phase 1, Lagos, with an authentic spirit and a unique luxury experience.";

export const metadata: Metadata = {
  title: "About Us",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About Us", description, url: "/about", images: [DEFAULT_OG_IMAGE] },
  twitter: { images: [DEFAULT_OG_IMAGE] },
};

export default function AboutPage() {
  return <AboutClient />;
}
