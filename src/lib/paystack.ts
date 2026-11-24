/**
 * @file Paystack client — server-only
 * @description Initialize Transaction (redirect flow, not the inline popup —
 *   matches the checkout.paystack.com redirect the booking flow is modeled on)
 *   plus signature verification for the webhook. Amounts here are always whole
 *   naira; Paystack itself wants kobo (naira * 100), converted only at the
 *   point of calling their API so the rest of the codebase never has to think
 *   in kobo.
 */

import { createHmac, timingSafeEqual } from "crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

/**
 * Local-dev-only stand-in for real Paystack, used while there's no test key
 * yet. Routes the guest to our own mock checkout page instead of Paystack's,
 * and self-signs the simulated webhook with PAYSTACK_MOCK_SECRET so the real
 * webhook handler (signature check included) runs exactly as it would for a
 * real payment. Never active once PAYSTACK_SECRET_KEY is set.
 */
const PAYSTACK_MOCK = !SECRET_KEY && process.env.PAYSTACK_MOCK === "true";
export const isPaystackMockMode = PAYSTACK_MOCK;
export const PAYSTACK_MOCK_SECRET = "corniche-dev-mock-secret";

export class PaystackError extends Error {
  constructor(message: string, public body: unknown) {
    super(message);
    this.name = "PaystackError";
  }
}

export interface InitializeTransactionInput {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface InitializeTransactionResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export async function initializeTransaction(input: InitializeTransactionInput): Promise<InitializeTransactionResult> {
  if (PAYSTACK_MOCK) {
    const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";
    const qs = new URLSearchParams({ reference: input.reference, amount: String(input.amountNaira) });
    return {
      authorizationUrl: `${appBaseUrl}/dev/mock-paystack?${qs.toString()}`,
      accessCode: "mock",
      reference: input.reference,
    };
  }

  if (!SECRET_KEY) {
    throw new PaystackError("PAYSTACK_SECRET_KEY is not set — add it to .env.local once you have a Paystack test key.", null);
  }

  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(input.amountNaira * 100),
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });

  const body = await res.json();
  if (!res.ok || !body.status) {
    throw new PaystackError(body.message ?? "Paystack initialize failed", body);
  }

  return {
    authorizationUrl: body.data.authorization_url,
    accessCode: body.data.access_code,
    reference: body.data.reference,
  };
}

export interface VerifyTransactionResult {
  status: string; // "success" | "failed" | "abandoned" | ...
  reference: string;
  amountNaira: number;
  currency: string;
  paidAt: string | null;
}

export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  if (!SECRET_KEY) {
    throw new PaystackError("PAYSTACK_SECRET_KEY is not set.", null);
  }

  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${SECRET_KEY}` },
    cache: "no-store",
  });

  const body = await res.json();
  if (!res.ok || !body.status) {
    throw new PaystackError(body.message ?? "Paystack verify failed", body);
  }

  return {
    status: body.data.status,
    reference: body.data.reference,
    amountNaira: body.data.amount / 100,
    currency: body.data.currency,
    paidAt: body.data.paid_at ?? null,
  };
}

/** Verifies the `x-paystack-signature` header against the EXACT raw request body (must run before JSON.parse). */
export function verifyPaystackSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = PAYSTACK_MOCK ? PAYSTACK_MOCK_SECRET : SECRET_KEY;
  if (!secret || !signatureHeader) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signatureHeader, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
