/**
 * @file Local dev database — orders, webhook log, front-desk notifications
 * @description SQLite file at .data/corniche.db, used only while the booking
 *   engine is developed locally. One `orders` row per Paystack payment (covers
 *   the whole lifecycle: pending -> paid -> confirmed/failed), with one
 *   `order_items` row per room line in the cart — a guest can book several
 *   different rooms/date-ranges under a single payment, and each line becomes
 *   its own Anli reservation (Anli's create-booking call only takes one room
 *   type at a time). Kept behind this one file so swapping to Postgres later
 *   only means rewriting the functions in orders.ts, not every call site.
 */

import path from "path";
import fs from "fs";
import Database from "better-sqlite3";

const DB_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DB_DIR, "corniche.db");

declare global {
  // eslint-disable-next-line no-var
  var __corniche_db__: Database.Database | undefined;
}

function createDb(): Database.Database {
  fs.mkdirSync(DB_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      amount_naira INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'NGN',
      guest_title TEXT,
      guest_name TEXT NOT NULL,
      guest_email TEXT NOT NULL,
      guest_phone TEXT NOT NULL,
      guest_country TEXT,
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','paid','confirmed','partially_confirmed','failed','cancelled')),
      paystack_reference TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL REFERENCES orders(id),
      room_slug TEXT NOT NULL,
      room_name TEXT NOT NULL,
      anli_room_type_id INTEGER,
      check_in TEXT NOT NULL,
      check_out TEXT NOT NULL,
      adults INTEGER NOT NULL,
      children INTEGER NOT NULL,
      rooms_count INTEGER NOT NULL,
      nightly_rate INTEGER NOT NULL,
      line_total_naira INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','confirmed','anli_sync_failed')),
      anli_booking_code TEXT
    );

    CREATE TABLE IF NOT EXISTS webhook_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL CHECK (source IN ('anli','paystack')),
      event_type TEXT NOT NULL,
      raw_payload TEXT NOT NULL,
      signature_valid INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      booking_id TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

export function getDb(): Database.Database {
  if (!global.__corniche_db__) {
    global.__corniche_db__ = createDb();
  }
  return global.__corniche_db__;
}
