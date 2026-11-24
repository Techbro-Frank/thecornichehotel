/**
 * @file /dev/mock-paystack — LOCAL DEV ONLY simulated checkout
 * @description Stands in for the real checkout.paystack.com page while there's
 *   no Paystack key yet, so the full cart -> checkout -> payment -> webhook ->
 *   Anli booking flow can be clicked through locally. Server-gated: redirects
 *   to the homepage if isPaystackMockMode isn't actually true.
 */

import { redirect } from "next/navigation";
import { isPaystackMockMode } from "@/lib/paystack";
import { isChannelManagerMockMode } from "@/lib/channel-manager";
import MockPaystackClient from "./mock-paystack-client";

export default async function MockPaystackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; amount?: string }>;
}) {
  if (!isPaystackMockMode) {
    redirect("/");
  }

  const { reference, amount } = await searchParams;
  if (!reference || !amount) {
    redirect("/");
  }

  return (
    <MockPaystackClient
      reference={reference}
      amountNaira={Number(amount)}
      blocked={!isChannelManagerMockMode}
    />
  );
}
