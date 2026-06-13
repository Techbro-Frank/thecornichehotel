import type { Metadata } from "next";
import { playfairDisplay, inter } from "@/lib/fonts";
import LenisProvider from "@/providers/lenis-provider";
import QueryProvider from "@/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Corniche Hotel | Luxury Hotel in Lekki, Lagos",
    template: "%s | The Corniche Hotel",
  },
  description:
    "Experience refined luxury at The Corniche Hotel, Lekki, Lagos. Luxury accommodation, exceptional dining, and unforgettable hospitality in the heart of Lagos.",
  keywords: [
    "luxury hotel Lagos",
    "Lekki hotel",
    "The Corniche Hotel",
    "5 star hotel Nigeria",
    "luxury accommodation Lagos",
    "hotel booking Lagos",
  ],
  authors: [{ name: "The Corniche Hotel" }],
  openGraph: {
    title: "The Corniche Hotel | Luxury Hotel in Lekki, Lagos",
    description:
      "Experience refined luxury at The Corniche Hotel. Luxury accommodation, exceptional dining, and unforgettable hospitality.",
    url: "https://thecornichehotel.com",
    siteName: "The Corniche Hotel",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Corniche Hotel | Luxury Hotel in Lekki, Lagos",
    description:
      "Experience refined luxury at The Corniche Hotel. Luxury accommodation, exceptional dining, and unforgettable hospitality.",
  },
  robots: {
    index: true,
    follow: true,
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
        <QueryProvider>
          <LenisProvider>{children}</LenisProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
