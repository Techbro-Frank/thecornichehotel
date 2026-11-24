/**
 * @file Order repository — the only place that touches the DB directly
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
export async function createPendingOrder(input: NewOrderInput): Promise<Order> {
  const id = `CORNICHE-${randomUUID()}`;
  const amountNaira = input.items.reduce((sum, item) => sum + item.lineTotalNaira, 0);
  const db = await getDb();

  const tx = await db.transaction("write");
  try {
    await tx.execute({
      sql: `INSERT INTO orders (
        id, amount_naira, currency, guest_title, guest_name, guest_email,
        guest_phone, guest_country, status, paystack_reference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      args: [
        id,
        amountNaira,
        input.currency ?? "NGN",
        input.guestTitle ?? null,
        input.guestName,
        input.guestEmail,
        input.guestPhone,
        input.guestCountry ?? null,
        id,
      ],
    });

    for (const item of input.items) {
      await tx.execute({
        sql: `INSERT INTO order_items (
          order_id, room_slug, room_name, anli_room_type_id, check_in, check_out,
          adults, children, rooms_count, nightly_rate, line_total_naira, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        args: [
          id,
          item.roomSlug,
          item.roomName,
          item.anliRoomTypeId,
          item.checkIn,
          item.checkOut,
          item.adults,
          item.children,
          item.roomsCount,
          item.nightlyRate,
          item.lineTotalNaira,
        ],
      });
    }

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }

  return (await getOrderById(id))!;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const db = await getDb();
  const res = await db.execute({ sql: "SELECT * FROM orders WHERE id = ?", args: [id] });
  return res.rows[0] ? (res.rows[0] as unknown as Order) : undefined;
}

export async function getOrderByReference(paystackReference: string): Promise<Order | undefined> {
  const db = await getDb();
  const res = await db.execute({
    sql: "SELECT * FROM orders WHERE paystack_reference = ?",
    args: [paystackReference],
  });
  return res.rows[0] ? (res.rows[0] as unknown as Order) : undefined;
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const db = await getDb();
  const res = await db.execute({
    sql: "SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC",
    args: [orderId],
  });
  return res.rows as unknown as OrderItem[];
}

async function touchOrder(id: string, fields: Record<string, unknown>) {
  const db = await getDb();
  const keys = Object.keys(fields);
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  await db.execute({
    sql: `UPDATE orders SET ${sets}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [...keys.map((k) => fields[k] as string | number | null), id],
  });
}

export async function markOrderPaid(id: string) {
  await touchOrder(id, { status: "paid" });
}

export async function markOrderFailed(id: string) {
  await touchOrder(id, { status: "failed" });
}

export async function markOrderItemConfirmed(itemId: number, anliBookingCode: string | null) {
  const db = await getDb();
  await db.execute({
    sql: "UPDATE order_items SET status = 'confirmed', anli_booking_code = ? WHERE id = ?",
    args: [anliBookingCode, itemId],
  });
}

export async function markOrderItemAnliSyncFailed(itemId: number) {
  const db = await getDb();
  await db.execute({ sql: "UPDATE order_items SET status = 'anli_sync_failed' WHERE id = ?", args: [itemId] });
}

/** Rolls the order's own status up from its items' statuses — call after processing all items for an order. */
export async function recomputeOrderStatus(orderId: string) {
  const items = await getOrderItems(orderId);
  const allConfirmed = items.every((i) => i.status === "confirmed");
  const noneConfirmed = items.every((i) => i.status !== "confirmed");
  await touchOrder(orderId, { status: allConfirmed ? "confirmed" : noneConfirmed ? "paid" : "partially_confirmed" });
}

export async function logWebhookEvent(
  source: "anli" | "paystack",
  eventType: string,
  rawPayload: string,
  signatureValid: boolean
) {
  const db = await getDb();
  await db.execute({
    sql: `INSERT INTO webhook_events (source, event_type, raw_payload, signature_valid) VALUES (?, ?, ?, ?)`,
    args: [source, eventType, rawPayload, signatureValid ? 1 : 0],
  });
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

export async function createNotification(type: string, title: string, message: string, orderId?: string) {
  const db = await getDb();
  await db.execute({
    sql: `INSERT INTO notifications (type, title, message, booking_id) VALUES (?, ?, ?, ?)`,
    args: [type, title, message, orderId ?? null],
  });
}

export async function listNotifications(sinceId = 0): Promise<NotificationRow[]> {
  const db = await getDb();
  const res = await db.execute({ sql: "SELECT * FROM notifications WHERE id > ? ORDER BY id ASC", args: [sinceId] });
  return res.rows as unknown as NotificationRow[];
}

export async function markNotificationRead(id: number) {
  const db = await getDb();
  await db.execute({ sql: "UPDATE notifications SET is_read = 1 WHERE id = ?", args: [id] });
}
