/**
 * @file POST /api/dev/simulate-paystack-webhook — LOCAL DEV ONLY
 * @description Called only by /dev/mock-paystack. Builds the same envelope a
 *   real Paystack webhook sends and signs it with PAYSTACK_MOCK_SECRET, then
 *   posts it to our own /api/webhooks/paystack — so the real webhook handler
 *   (signature check included) runs exactly as it would in production. Hard
 *   404s unless isPaystackMockMode is true, so this can never do anything if
 *   PAYSTACK_MOCK is accidentally left on without realizing a real key exists,
 *   or in any environment with a real Paystack key configured.
 *
 *   Also refuses outright once Anli is live (CHANNEL_MANAGER_MOCK off, real
 *   key set): a *simulated* payment must never be allowed to trigger a
 *   *real* booking write — that combination can only mean a real reservation
 *   is about to be created in the live PMS for a payment nobody actually
 *   made. Once both sides are real, this route is unreachable anyway (the
 *   isPaystackMockMode check above already handles that) — this second gate
 *   exists for exactly this in-between period, with Anli live and Paystack
 *   still mocked.
 */

import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { isPaystackMockMode, PAYSTACK_MOCK_SECRET } from "@/lib/paystack";
import { isChannelManagerMockMode } from "@/lib/channel-manager";

export async function POST(request: NextRequest) {
  if (!isPaystackMockMode) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!isChannelManagerMockMode) {
    return NextResponse.json(
      {
        error:
          "Refusing to simulate payment — Anli is live now (CHANNEL_MANAGER_MOCK is off), so this would create a real booking for a payment that never happened. Get real Paystack test keys to test the full flow safely, or set CHANNEL_MANAGER_MOCK=true temporarily if you only need to test the UI.",
      },
      { status: 403 }
    );
  }

  const { reference, amountNaira } = await request.json();
  if (!reference || typeof amountNaira !== "number") {
    return NextResponse.json({ error: "reference and amountNaira are required" }, { status: 400 });
  }

  const payload = JSON.stringify({
    event: "charge.success",
    data: {
      reference,
      amount: Math.round(amountNaira * 100),
      currency: "NGN",
      status: "success",
    },
  });

  const signature = createHmac("sha512", PAYSTACK_MOCK_SECRET).update(payload).digest("hex");
  const appBaseUrl = process.env.APP_BASE_URL ?? new URL(request.url).origin;

  const res = await fetch(`${appBaseUrl}/api/webhooks/paystack`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-paystack-signature": signature },
    body: payload,
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Simulated webhook was rejected" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
