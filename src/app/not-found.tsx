/**
 * @file Not Found Page
 * @description Branded 404 for any URL that doesn't exist (including old
 *   WordPress links not covered by the redirects in next.config.ts), so
 *   visitors land on a useful page instead of a bare error.
 */

import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-40 text-center">
        <p className="text-xs tracking-[0.3em] text-bronze uppercase">404</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl text-dark md:text-5xl">
          This page has moved
        </h1>
        <p className="mt-4 max-w-md text-muted">
          We&apos;ve launched a new website, so this link no longer exists. Explore our
          rooms or head back home.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/rooms"
            className="bg-gold px-8 py-4 text-sm tracking-[0.2em] text-dark uppercase transition-colors hover:bg-gold-dark"
          >
            Explore Rooms
          </Link>
          <Link
            href="/"
            className="border border-dark px-8 py-4 text-sm tracking-[0.2em] text-dark uppercase transition-colors hover:bg-dark hover:text-beige"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
