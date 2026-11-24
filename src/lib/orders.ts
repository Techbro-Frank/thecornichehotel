/**
 * @file Order repository — the only place that touches the local DB directly
 * @description An order is one Paystack payment, possibly covering several
 *   room/date-range lines (order_items) from the cart. Lifecycle: created
 *   "pending" the moment checkout starts, "paid" once Paystack confirms, then
 *   each item is individually written to Anli as its own reservation — one
 *   item failing to sync doesn't block the others, so the order's own status
 *   becomes "confirmed" only once every item is, or "partially_confirmed" if
 *   some items need manual front-desk follow-up.
 */

import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";

export type OrderStatus = "pending" | "paid" | "confirmed" | "partially_confirmed" | "failed" | "cancelled";
export type OrderItemStatus = "pending" | "confirmed" | "anli_sync_failed";

export interface OrderItem {
  id: number;
  order_id: string;
  room_slug: string;
  room_name: string;
  anli_room_type_id: number | null;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  rooms_count: number;
  nightly_rate: number;
  line_total_naira: number;
  status: OrderItemStatus;
  anli_booking_code: string | null;
}

export interface Order {
  id: string;
  amount_naira: number;
  currency: string;
  guest_title: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_country: string | null;
  status: OrderStatus;
  paystack_reference: string;
  created_at: string;
  updated_at: string;
}

export interface NewOrderItemInput {
  roomSlug: string;
  roomName: string;
  anliRoomTypeId: number | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomsCount: number;
  nightlyRate: number;
  lineTotalNaira: number;
}

export interface NewOrderInput {
  guestTitle?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry?: string;
  currency?: string;
  items: NewOrderItemInput[];
}

/** Creates an order + its line items in "pending" state — called the moment checkout starts, before any payment. */
export function createPendingOrder(input: NewOrderInput): Order {
  const id = `CORNICHE-${randomUUID()}`;
  const amountNaira = input.items.reduce((sum, item) => sum + item.lineTotalNaira, 0);
  const db = getDb();

  const insertOrder = db.prepare(
    `INSERT INTO orders (
      id, amount_naira, currency, guest_title, guest_name, guest_email,
      guest_phone, guest_country, status, paystack_reference
    ) VALUES (
      @id, @amountNaira, @currency, @guestTitle, @guestName, @guestEmail,
      @guestPhone, @guestCountry, 'pending', @id
    )`
  );

  const insertItem = db.prepare(
    `INSERT INTO order_items (
      order_id, room_slug, room_name, anli_room_type_id, check_in, check_out,
      adults, children, rooms_count, nightly_rate, line_total_naira, status
    ) VALUES (
      @orderId, @roomSlug, @roomName, @anliRoomTypeId, @checkIn, @checkOut,
      @adults, @children, @roomsCount, @nightlyRate, @lineTotalNaira, 'pending'
    )`
  );

  const run = db.transaction(() => {
    insertOrder.run({
      id,
      amountNaira,
      currency: input.currency ?? "NGN",
      guestTitle: input.guestTitle ?? null,
      guestName: input.guestName,
      guestEmail: input.guestEmail,
      guestPhone: input.guestPhone,
      guestCountry: input.guestCountry ?? null,
    });

    for (const item of input.items) {
      insertItem.run({
        orderId: id,
        roomSlug: item.roomSlug,
        roomName: item.roomName,
        anliRoomTypeId: item.anliRoomTypeId,
        checkIn: item.checkIn,
        checkOut: item.checkOut,
        adults: item.adults,
        children: item.children,
        roomsCount: item.roomsCount,
        nightlyRate: item.nightlyRate,
        lineTotalNaira: item.lineTotalNaira,
      });
    }
  });
  run();

  return getOrderById(id)!;
}

export function getOrderById(id: string): Order | undefined {
  return getDb().prepare("SELECT * FROM orders WHERE id = ?").get(id) as Order | undefined;
}

export function getOrderByReference(paystackReference: string): Order | undefined {
  return getDb()
    .prepare("SELECT * FROM orders WHERE paystack_reference = ?")
    .get(paystackReference) as Order | undefined;
}

export function getOrderItems(orderId: string): OrderItem[] {
  return getDb().prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC").all(orderId) as OrderItem[];
}

function touchOrder(id: string, fields: Record<string, unknown>) {
  const sets = Object.keys(fields).map((k) => `${k} = @${k}`).join(", ");
  getDb()
    .prepare(`UPDATE orders SET ${sets}, updated_at = CURRENT_TIMESTAMP WHERE id = @id`)
    .run({ ...fields, id });
}

export function markOrderPaid(id: string) {
  touchOrder(id, { status: "paid" });
}

export function markOrderFailed(id: string) {
  touchOrder(id, { status: "failed" });
}

export function markOrderItemConfirmed(itemId: number, anliBookingCode: string | null) {
  getDb()
    .prepare("UPDATE order_items SET status = 'confirmed', anli_booking_code = ? WHERE id = ?")
    .run(anliBookingCode, itemId);
}

export function markOrderItemAnliSyncFailed(itemId: number) {
  getDb().prepare("UPDATE order_items SET status = 'anli_sync_failed' WHERE id = ?").run(itemId);
}

/** Rolls the order's own status up from its items' statuses — call after processing all items for an order. */
export function recomputeOrderStatus(orderId: string) {
  const items = getOrderItems(orderId);
  const allConfirmed = items.every((i) => i.status === "confirmed");
  const noneConfirmed = items.every((i) => i.status !== "confirmed");
  touchOrder(orderId, { status: allConfirmed ? "confirmed" : noneConfirmed ? "paid" : "partially_confirmed" });
}

export function logWebhookEvent(source: "anli" | "paystack", eventType: string, rawPayload: string, signatureValid: boolean) {
  getDb()
    .prepare(
      `INSERT INTO webhook_events (source, event_type, raw_payload, signature_valid) VALUES (?, ?, ?, ?)`
    )
    .run(source, eventType, rawPayload, signatureValid ? 1 : 0);
}

export interface NotificationRow {
  id: number;
  type: string;
  title: string;
  message: string;
  booking_id: string | null;
  is_read: number;
  created_at: string;
}

export function createNotification(type: string, title: string, message: string, orderId?: string) {
  getDb()
    .prepare(`INSERT INTO notifications (type, title, message, booking_id) VALUES (?, ?, ?, ?)`)
    .run(type, title, message, orderId ?? null);
}

export function listNotifications(sinceId = 0): NotificationRow[] {
  return getDb()
    .prepare("SELECT * FROM notifications WHERE id > ? ORDER BY id ASC")
    .all(sinceId) as NotificationRow[];
}

export function markNotificationRead(id: number) {
  getDb().prepare("UPDATE notifications SET is_read = 1 WHERE id = ?").run(id);
}
