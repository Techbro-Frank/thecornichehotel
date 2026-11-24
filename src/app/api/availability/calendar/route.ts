/**
 * @file GET /api/availability/calendar — one room's day-by-day availability for a month
 * @description Anli's live-availability endpoint only returns one number for
 *   a whole date range, not a per-day breakdown, so a month view means one
 *   call per day (done here, in parallel, server-side) for ONE room at a
 *   time. The client only calls this when a guest explicitly opens a room's
 *   calendar, and caches the result per month so flipping back and forth
 *   doesn't repeat the cost — see src/components/rooms/availability-calendar.tsx.
 */

import { NextRequest, NextResponse } from "next/server";
import { eachDayOfInterval, endOfMonth, format, isBefore, startOfDay, startOfMonth } from "date-fns";
import { getRoomBySlug, getEffectiveRoomTypeId } from "@/lib/rooms-data";
import { getLiveAvailability, ChannelManagerError } from "@/lib/channel-manager";

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  /** null = past date, or availability couldn't be checked right now */
  available: boolean | null;
  roomsAvailable: number | null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roomSlug = searchParams.get("roomSlug");
  const month = searchParams.get("month"); // YYYY-MM

  if (!roomSlug || !month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "roomSlug and month (YYYY-MM) are required" }, { status: 400 });
  }

  const room = getRoomBySlug(roomSlug);
  const roomTypeId = getEffectiveRoomTypeId(roomSlug);
  if (!room || roomTypeId == null) {
    return NextResponse.json({ error: "Live availability isn't connected for this room yet." }, { status: 404 });
  }

  const [year, monthNum] = month.split("-").map(Number);
  const monthStart = startOfMonth(new Date(year, monthNum - 1, 1));
  const monthEnd = endOfMonth(monthStart);
  const today = startOfDay(new Date());

  const days: CalendarDay[] = await Promise.all(
    eachDayOfInterval({ start: monthStart, end: monthEnd }).map(async (day): Promise<CalendarDay> => {
      const dateStr = format(day, "yyyy-MM-dd");

      if (isBefore(day, today)) {
        return { date: dateStr, available: null, roomsAvailable: null };
      }

      const nextDayStr = format(new Date(day.getTime() + 24 * 60 * 60 * 1000), "yyyy-MM-dd");
      try {
        const live = await getLiveAvailability({ roomTypeId, checkInDate: dateStr, checkOutDate: nextDayStr });
        const match = live.roomTypes.find((rt) => rt.roomTypeId === roomTypeId) ?? live.roomTypes[0];
        return { date: dateStr, available: match?.available ?? false, roomsAvailable: match?.roomsAvailable ?? 0 };
      } catch (err) {
        if (err instanceof ChannelManagerError) {
          return { date: dateStr, available: null, roomsAvailable: null };
        }
        throw err;
      }
    })
  );

  return NextResponse.json({ roomSlug, month, days });
}
