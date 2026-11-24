/**
 * @file POST /api/webhooks/paystack
 * @description The authoritative path for confirming payment and writing to
 *   Anli (see src/lib/process-order.ts for what actually happens on
 *   confirmation — shared with the fallback check in the order-status
 *   endpoint, for when this webhook can't reach us, e.g. local dev).
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackSignature } from "@/lib/paystack";
import { getOrderByReference, logWebhookEvent } from "@/lib/orders";
import { confirmPaidOrder } from "@/lib/process-order";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const signatureValid = verifyPaystackSignature(rawBody, signature);

  let body: { event?: string; data?: { reference?: string } };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await logWebhookEvent("paystack", body.event ?? "unknown", rawBody, signatureValid);

  if (!signatureValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (body.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const reference = body.data?.reference;
  const order = reference ? await getOrderByReference(reference) : undefined;
  if (order) {
    await confirmPaidOrder(order.id);
  }

  return NextResponse.json({ received: true });
}
