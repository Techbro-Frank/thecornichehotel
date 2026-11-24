/**
 * @file GET /api/notifications — polled by the front-desk admin page
 */

import { NextRequest, NextResponse } from "next/server";
import { listNotifications } from "@/lib/orders";

export async function GET(request: NextRequest) {
  const since = Number(request.nextUrl.searchParams.get("since") ?? "0");
  return NextResponse.json({ notifications: await listNotifications(since) });
}
