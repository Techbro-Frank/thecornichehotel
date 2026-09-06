/**
 * @file Root Layout — The Corniche Hotel
 * @description Application shell that wraps every page. Defines global SEO metadata
 *   (Open Graph, Twitter Cards, robots directives), loads custom fonts (Playfair Display
 *   for headings, Inter for body), and nests the QueryProvider (React Query) and
 *   LenisProvider (smooth-scroll) around all page content.
 */

import type { Metadata } from "next";
import { playfairDisplay, inter } from "@/lib/fonts";
import LenisProvider from "@/providers/lenis-provider";
import QueryProvider from "@/providers/query-provider";
import JsonLd from "@/components/seo/json-ld";
import { buildHotelSchema, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import "./globals.css";

const DEFAULT_TITLE = "The Corniche Hotel | Luxury Hotel in Lekki, Lagos";
const DEFAULT_DESCRIPTION =
  "Experience refined luxury at The Corniche Hotel, Lekki, Lagos. 28 rooms and suites from ₦120,000/night, on-site restaurant and bar, and full-serviced Ikoyi apartments.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | The Corniche Hotel",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "luxury hotel Lagos",
    "Lekki hotel",
    "The Corniche Hotel",
    "5 star hotel Nigeria",
    "luxury accommodation Lagos",
    "hotel booking Lagos",
    "Lekki Phase 1 hotel",
    "Ikoyi serviced apartments",
  ],
  authors: [{ name: "The Corniche Hotel" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: "The Corniche Hotel",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1024,
        height: 683,
        alt: "The Corniche Hotel exterior at night, Lekki Phase 1, Lagos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-beige text-dark font-[family-name:var(--font-body)]">
        <JsonLd data={buildHotelSchema()} />
        <QueryProvider>
          <LenisProvider>{children}</LenisProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
