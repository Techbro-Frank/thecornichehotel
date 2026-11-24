/**
 * @file POST /api/webhooks/anli
 * @description Receives Anli PMS event notifications (separate from the
 *   Channel Manager API — this is pushed directly to us). Per the integration
 *   doc, these are notifications that Anli's state changed, never commands to
 *   act on — this handler only logs the event and alerts the front desk when
 *   relevant, it never calls back into Anli or the Channel Manager. A guest
 *   booking through another channel (OTA, phone, walk-in) shows up here, not
 *   just bookings made through our own site.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAnliSignature, type AnliEventType, type AnliWebhookEnvelope } from "@/lib/anli-webhook";
import { logWebhookEvent, createNotification } from "@/lib/orders";

/** Which events get a front-desk notification — RATE_CHANGE/AVAILABILITY_CHANGE are still logged, just not alerted on. */
const NOTIFIABLE_EVENTS: AnliEventType[] = ["BOOKING_NEW", "BOOKING_MODIFY", "BOOKING_CANCEL", "CHECK_IN", "CHECK_OUT"];

const EVENT_LABELS: Partial<Record<AnliEventType, string>> = {
  BOOKING_NEW: "New booking (another channel)",
  BOOKING_MODIFY: "Booking updated",
  BOOKING_CANCEL: "Booking cancelled",
  CHECK_IN: "Guest checked in",
  CHECK_OUT: "Guest checked out",
};

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature");
  const signatureValid = verifyAnliSignature(rawBody, signature);

  let body: AnliWebhookEnvelope;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await logWebhookEvent("anli", body.eventType ?? body.event ?? "unknown", rawBody, signatureValid);

  if (!signatureValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const eventType = body.eventType ?? body.event;

  if (eventType === "TEST") {
    return NextResponse.json({ received: true });
  }

  if (NOTIFIABLE_EVENTS.includes(eventType)) {
    const bookingCode = typeof body.data?.bookingCode === "string" ? body.data.bookingCode : undefined;
    const label = EVENT_LABELS[eventType] ?? eventType;
    await createNotification(
      `anli_${eventType.toLowerCase()}`,
      label,
      bookingCode ? `${label} — ${bookingCode}` : label
    );
  }

  // RATE_CHANGE / AVAILABILITY_CHANGE are logged above but don't need a front-desk alert —
  // our availability is checked live on every search, so there's nothing stale to invalidate.

  return NextResponse.json({ received: true });
}
