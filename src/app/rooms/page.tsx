/**
 * @file Rooms & Suites Page — Server wrapper
 * @description Reads the full room catalogue (photos, pricing, specs) from
 *   the shared rooms-data module and hands it to the client component that
 *   renders the interactive grid. Exports page metadata — this file must
 *   stay a Server Component for that (metadata can't be exported alongside
 *   "use client").
 */

import type { Metadata } from "next";
import { getAllRooms } from "@/lib/rooms-data";
import RoomsClient from "./rooms-client";

const description =
  "Explore all 9 room types at The Corniche Hotel, Lekki — from the Standard Room (from ₦120,000/night) to the Presidential Suite.";
const ogImage = "/images/Standard%20Room/IMG_8013.jpg";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description,
  alternates: { canonical: "/rooms" },
  openGraph: { title: "Rooms & Suites", description, url: "/rooms", images: [ogImage] },
  twitter: { images: [ogImage] },
};

export default function RoomsPage() {
  return <RoomsClient rooms={getAllRooms()} />;
}
