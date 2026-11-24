/**
 * @file GET /api/orders/[reference]/status
 * @description Lets the confirmation page poll until payment is confirmed.
 *   The Paystack webhook is the normal path, but it's a server-to-server call
 *   Paystack makes to us — it can never reach `localhost`, so local testing
 *   (and any environment where the webhook is delayed or missed) needs a
 *   fallback: while an order is still "pending", this route checks directly
 *   with Paystack's own verify-transaction endpoint and processes it itself
 *   if payment actually succeeded. Both paths funnel through the same
 *   confirmPaidOrder() so behavior is identical either way.
 */

import { NextResponse } from "next/server";
import { getOrderById, getOrderItems, markOrderFailed } from "@/lib/orders";
import { confirmPaidOrder } from "@/lib/process-order";
import { verifyTransaction, isPaystackMockMode, PaystackError } from "@/lib/paystack";

export async function GET(_request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  let order = await getOrderById(reference);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Mock mode confirms via its own simulated webhook call directly — nothing real to verify against here.
  if (order.status === "pending" && !isPaystackMockMode) {
    try {
      const verification = await verifyTransaction(reference);
      if (verification.status === "success") {
        await confirmPaidOrder(order.id);
        order = (await getOrderById(order.id))!;
      } else if (verification.status === "failed" || verification.status === "abandoned") {
        await markOrderFailed(order.id);
        order = (await getOrderById(order.id))!;
      }
    } catch (err) {
      // Not verified yet (e.g. guest hasn't finished paying) — keep polling, don't fail the request.
      if (!(err instanceof PaystackError)) throw err;
    }
  }

  const items = (await getOrderItems(order.id)).map((item) => ({
    roomName: item.room_name,
    checkIn: item.check_in,
    checkOut: item.check_out,
    roomsCount: item.rooms_count,
    status: item.status,
    anliBookingCode: item.anli_booking_code,
  }));

  return NextResponse.json({
    status: order.status,
    amountNaira: order.amount_naira,
    guestName: order.guest_name,
    items,
  });
}
