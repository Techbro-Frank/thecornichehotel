/**
 * @file Booking Confirmation — Paystack's callback_url lands here
 * @description Polls our own order-status endpoint rather than trusting the
 *   redirect alone — the webhook that actually confirms the booking can land
 *   a moment after Paystack sends the guest back here.
 */

import type { Metadata } from "next";
import ConfirmationClient from "./confirmation-client";

export const metadata: Metadata = {
  title: "Booking Confirmation",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string | string[] }>;
}) {
  const { reference } = await searchParams;
  // A duplicate ?reference= in the URL resolves to an array, not a string —
  // take the first value rather than letting it flow into a broken fetch URL.
  const normalized = Array.isArray(reference) ? reference[0] : reference;
  return <ConfirmationClient reference={normalized ?? null} />;
}
