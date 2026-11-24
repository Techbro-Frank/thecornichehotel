/**
 * @file GET /api/availability — live room availability for a stay
 * @description Proxies the Channel Manager's live-availability endpoint per
 *   room (keeps the API key server-side). Rooms not yet mapped to a real Anli
 *   room-type id (or if the Channel Manager isn't reachable/configured) come
 *   back with `configured: false` and no live count, so the UI can still show
 *   the room with its static marketing price instead of breaking outright.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllRooms, getEffectiveRoomTypeId } from "@/lib/rooms-data";
import { getLiveAvailability, ChannelManagerError } from "@/lib/channel-manager";

export interface AvailabilityResult {
  slug: string;
  name: string;
  price: string;
  configured: boolean;
  /** The Anli room-type id actually used for this result (real once mapped, or a stable local one while CHANNEL_MANAGER_MOCK is on) — needed downstream to create the booking. */
  roomTypeId: number | null;
  roomsAvailable: number | null;
  nightlyRate: number | null;
  totalPrice: number | null;
  available: boolean | null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const roomSlug = searchParams.get("roomSlug");

  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "checkIn and checkOut (YYYY-MM-DD) are required" }, { status: 400 });
  }

  const rooms = getAllRooms().filter((r) => !roomSlug || r.slug === roomSlug);

  const results: AvailabilityResult[] = await Promise.all(
    rooms.map(async (room): Promise<AvailabilityResult> => {
      const base = { slug: room.slug, name: room.name, price: room.price };
      const effectiveRoomTypeId = getEffectiveRoomTypeId(room.slug);

      if (effectiveRoomTypeId == null) {
        return { ...base, configured: false, roomTypeId: null, roomsAvailable: null, nightlyRate: null, totalPrice: null, available: null };
      }

      try {
        const live = await getLiveAvailability({
          roomTypeId: effectiveRoomTypeId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        });
        const match = live.roomTypes.find((rt) => rt.roomTypeId === effectiveRoomTypeId) ?? live.roomTypes[0];
        return {
          ...base,
          configured: true,
          roomTypeId: effectiveRoomTypeId,
          roomsAvailable: match?.roomsAvailable ?? 0,
          nightlyRate: match?.nightlyRate ?? null,
          totalPrice: match?.totalPrice ?? null,
          available: match?.available ?? false,
        };
      } catch (err) {
        if (err instanceof ChannelManagerError) {
          return { ...base, configured: false, roomTypeId: null, roomsAvailable: null, nightlyRate: null, totalPrice: null, available: null };
        }
        throw err;
      }
    })
  );

  return NextResponse.json({ checkIn, checkOut, rooms: results });
}
