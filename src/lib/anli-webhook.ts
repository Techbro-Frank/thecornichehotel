/**
 * @file ANLI inbound webhook — signature verification
 * @description Anli PMS pushes event notifications straight to our webhook
 *   (separate from the Channel Manager API). Per the integration doc, these
 *   are notifications that Anli's state changed, never commands to act on —
 *   this file only verifies the signature; the route handler decides what to
 *   do with each event type.
 */

import { createHmac, timingSafeEqual } from "crypto";

const WEBHOOK_SECRET = process.env.ANLI_WEBHOOK_SECRET;

export type AnliEventType =
  | "BOOKING_NEW"
  | "BOOKING_MODIFY"
  | "BOOKING_CANCEL"
  | "CHECK_IN"
  | "CHECK_OUT"
  | "RATE_CHANGE"
  | "AVAILABILITY_CHANGE"
  | "TEST";

export interface AnliWebhookEnvelope {
  hotelId: number;
  eventType: AnliEventType;
  event: AnliEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

/** Verifies `X-Webhook-Signature` (HMAC-SHA256 hex of the EXACT raw body) — must run before JSON.parse. */
export function verifyAnliSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!WEBHOOK_SECRET || !signatureHeader) return false;
  const expected = createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signatureHeader, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
