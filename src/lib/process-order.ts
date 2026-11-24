/**
 * @file Shared "payment confirmed -> write to Anli" logic
 * @description Used by both the Paystack webhook (the authoritative path in
 *   production) and the order-status endpoint's fallback check (needed
 *   because a webhook from Paystack — or Anli — can never reach `localhost`,
 *   so local testing needs a way to confirm payment that doesn't depend on
 *   an inbound webhook actually arriving). Both paths funnel through this one
 *   function so the real behavior is identical either way, and both are
 *   protected by the same idempotency guard (only ever runs for a "pending"
 *   order).
 */

import { createBooking } from "@/lib/channel-manager";
import {
  getOrderById,
  getOrderItems,
  markOrderPaid,
  markOrderItemConfirmed,
  markOrderItemAnliSyncFailed,
  recomputeOrderStatus,
  createNotification,
} from "@/lib/orders";

/** Marks the order paid and creates one Anli booking per line item. No-op if the order isn't "pending". */
export async function confirmPaidOrder(orderId: string): Promise<void> {
  const order = getOrderById(orderId);
  if (!order || order.status !== "pending") {
    return; // unknown order, or already processed — idempotent no-op
  }

  markOrderPaid(order.id);

  const items = getOrderItems(order.id);
  for (const item of items) {
    if (item.anli_room_type_id == null) {
      markOrderItemAnliSyncFailed(item.id);
      continue;
    }
    try {
      const anliBooking = await createBooking({
        roomTypeId: item.anli_room_type_id,
        checkInDate: item.check_in,
        checkOutDate: item.check_out,
        guest: { fullName: order.guest_name, email: order.guest_email, phoneNumber: order.guest_phone },
        totalPrice: item.line_total_naira,
        currency: order.currency,
        externalConfirmId: `${order.id}-${item.id}`,
        numberOfGuests: item.adults + item.children,
      });
      markOrderItemConfirmed(item.id, anliBooking?.bookingCode ?? null);
    } catch {
      markOrderItemAnliSyncFailed(item.id);
    }
  }

  recomputeOrderStatus(order.id);
  const finalOrder = getOrderById(order.id)!;
  const roomNames = items.map((i) => i.room_name).join(", ");

  createNotification(
    finalOrder.status === "confirmed" ? "order_confirmed" : "order_needs_attention",
    finalOrder.status === "confirmed" ? "New booking confirmed" : "Booking needs front-desk attention",
    `${order.guest_name} — ${roomNames} (₦${order.amount_naira.toLocaleString()})`,
    order.id
  );
}
