/**
 * @file Database — orders, webhook log, front-desk notifications
 * @description libSQL (Turso in production, a local file in dev — same
 *   client, same SQL, just a different url). Replaced better-sqlite3 after
 *   discovering it can't work on Vercel: a deployed serverless function's
 *   filesystem is read-only, so a local .db file there throws on every
 *   write. Turso is SQLite-compatible and reachable over the network, so the
 *   schema and queries barely changed — just the client and the "await".
 */

import fs from "fs";
import path from "path";
import { createClient, type Client } from "@libsql/client";

declare global {
  // eslint-disable-next-line no-var
  var __corniche_db__: Promise<Client> | undefined;
}

async function createDb(): Promise<Client> {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const client = url
    ? createClient({ url, authToken })
    : createClient({ url: `file:${localDbPath()}` });

  const statements = [
    `CREATE TABLE IF NOT EXISTS orders (
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
    )`,
    `CREATE TABLE IF NOT EXISTS order_items (
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
    )`,
    `CREATE TABLE IF NOT EXISTS webhook_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL CHECK (source IN ('anli','paystack')),
      event_type TEXT NOT NULL,
      raw_payload TEXT NOT NULL,
      signature_valid INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      booking_id TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const sql of statements) {
    await client.execute(sql);
  }

  return client;
}

function localDbPath(): string {
  const dir = path.join(process.cwd(), ".data");
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "corniche.db");
}

export function getDb(): Promise<Client> {
  if (!global.__corniche_db__) {
    global.__corniche_db__ = createDb();
  }
  return global.__corniche_db__;
}
