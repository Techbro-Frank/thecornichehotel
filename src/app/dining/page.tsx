/**
 * @file The Corniche Bistro — Server wrapper
 * @description Exports page metadata (requires a Server Component — can't
 *   coexist with "use client") and a Restaurant JSON-LD block, then renders
 *   the interactive client page. The client component reads
 *   `useSearchParams`, which Next.js requires to be wrapped in Suspense to
 *   avoid forcing the whole route to client-render.
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { buildRestaurantSchema } from "@/lib/seo";
import JsonLd from "@/components/seo/json-ld";
import DiningClient from "./dining-client";

const description =
  "The Corniche Bistro — fine dining and cocktails in Lekki Phase 1, Lagos. View our food and drinks menu.";
const ogImage = "/images/Corniche-bistro-restaurant.png";

export const metadata: Metadata = {
  title: "The Corniche Bistro",
  description,
  alternates: { canonical: "/dining" },
  openGraph: { title: "The Corniche Bistro", description, url: "/dining", images: [ogImage] },
  twitter: { images: [ogImage] },
};

export default function DiningPage() {
  return (
    <>
      <JsonLd data={buildRestaurantSchema()} />
      <Suspense fallback={<div className="h-screen w-full bg-dark" />}>
        <DiningClient />
      </Suspense>
    </>
  );
}
