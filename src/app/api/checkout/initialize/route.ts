/**
 * @file POST /api/checkout/initialize
 * @description Takes the cart + guest details, re-verifies every line's price
 *   and availability against Anli directly (never trusts client-sent amounts
 *   — a guest could otherwise edit the cart's price in devtools before
 *   submitting), creates the order locally as "pending", then starts a
 *   Paystack transaction. Anli itself is NOT touched here — only once payment
 *   is confirmed, by the webhook in Phase 3.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRoomBySlug, getEffectiveRoomTypeId } from "@/lib/rooms-data";
import { getLiveAvailability } from "@/lib/channel-manager";
import { createPendingOrder, markOrderFailed, type NewOrderItemInput } from "@/lib/orders";
import { initializeTransaction } from "@/lib/paystack";

const itemSchema = z.object({
  roomSlug: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  adults: z.number().int().min(1),
  children: z.number().int().min(0),
  roomsCount: z.number().int().min(1),
});

const requestSchema = z.object({
  guest: z.object({
    title: z.string().min(1),
    fullName: z.string().min(2),
    email: z.email(),
    phone: z.string().min(7),
    country: z.string().min(2),
  }),
  items: z.array(itemSchema).min(1),
});

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
  }
  const { guest, items } = parsed.data;

  const verifiedItems: NewOrderItemInput[] = [];

  for (const item of items) {
    const room = getRoomBySlug(item.roomSlug);
    const roomTypeId = getEffectiveRoomTypeId(item.roomSlug);
    if (!room || roomTypeId == null) {
      return NextResponse.json({ error: `${item.roomSlug} isn't available for direct booking yet.` }, { status: 400 });
    }

    try {
      const live = await getLiveAvailability({ roomTypeId, checkInDate: item.checkIn, checkOutDate: item.checkOut });
      const match = live.roomTypes.find((rt) => rt.roomTypeId === roomTypeId) ?? live.roomTypes[0];

      if (!match || !match.available || match.roomsAvailable < item.roomsCount) {
        return NextResponse.json(
          { error: `${room.name} no longer has ${item.roomsCount} room(s) available for those dates — please update your cart.` },
          { status: 409 }
        );
      }

      verifiedItems.push({
        roomSlug: room.slug,
        roomName: room.name,
        anliRoomTypeId: roomTypeId,
        checkIn: item.checkIn,
        checkOut: item.checkOut,
        adults: item.adults,
        children: item.children,
        roomsCount: item.roomsCount,
        nightlyRate: match.nightlyRate,
        lineTotalNaira: match.totalPrice * item.roomsCount,
      });
    } catch {
      return NextResponse.json({ error: `Could not verify availability for ${room.name} right now — please try again.` }, { status: 502 });
    }
  }

  const order = createPendingOrder({
    guestTitle: guest.title,
    guestName: guest.fullName,
    guestEmail: guest.email,
    guestPhone: guest.phone,
    guestCountry: guest.country,
    items: verifiedItems,
  });

  const appBaseUrl = process.env.APP_BASE_URL ?? new URL(request.url).origin;

  try {
    const transaction = await initializeTransaction({
      email: guest.email,
      amountNaira: order.amount_naira,
      reference: order.id,
      // No "?reference=..." of our own here — Paystack always appends its own
      // ?trxref=...&reference=... to whatever callback URL we give it. Adding
      // ours too meant the final redirect had "reference" twice, which Next.js
      // resolves to an array instead of a string and broke the status lookup.
      callbackUrl: `${appBaseUrl}/booking/confirmation`,
    });

    return NextResponse.json({ authorizationUrl: transaction.authorizationUrl, reference: order.id });
  } catch {
    markOrderFailed(order.id);
    return NextResponse.json({ error: "Could not start payment — please try again." }, { status: 502 });
  }
}
