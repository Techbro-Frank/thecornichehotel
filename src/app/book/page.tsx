/**
 * @file Book Page — Server wrapper
 * @description Replaces the external Anli booking link site-wide. Reads the
 *   room catalogue and hands it to the client component that drives the
 *   date/guest search and live-availability results.
 */

import type { Metadata } from "next";
import { getAllRooms } from "@/lib/rooms-data";
import BookClient from "./book-client";

const description = "Check live availability and book your stay at The Corniche Hotel, Lekki — directly, no third-party redirect.";

export const metadata: Metadata = {
  title: "Book Your Stay",
  description,
  alternates: { canonical: "/book" },
  openGraph: { title: "Book Your Stay", description, url: "/book" },
};

export default function BookPage() {
  return <BookClient rooms={getAllRooms()} />;
}
