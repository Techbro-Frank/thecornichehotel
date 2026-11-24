/**
 * @file POST /api/notifications/[id]/read
 */

import { NextResponse } from "next/server";
import { markNotificationRead } from "@/lib/orders";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  markNotificationRead(Number(id));
  return NextResponse.json({ ok: true });
}
