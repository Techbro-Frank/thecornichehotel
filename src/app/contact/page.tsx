/**
 * @file Contact Us Page — Server wrapper
 * @description Exports page metadata (requires a Server Component — can't
 *   coexist with "use client") and renders the interactive client page.
 */

import type { Metadata } from "next";
import ContactClient from "./contact-client";

const description =
  "Get in touch with The Corniche Hotel — reservations, dining enquiries, and directions to our Lekki Phase 1 location.";
const ogImage = "/images/View%20Photos/image%20copy%2011.png";

export const metadata: Metadata = {
  title: "Contact Us",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact Us", description, url: "/contact", images: [ogImage] },
  twitter: { images: [ogImage] },
};

export default function ContactPage() {
  return <ContactClient />;
}
