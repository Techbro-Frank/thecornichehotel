/**
 * @file ANLI Channel Manager client — server-only
 * @description Thin typed wrapper around the 8 documented Channel Manager
 *   routes (never calls Anli PMS directly — the Channel Manager is the only
 *   gateway, per the integration doc). Response shapes marked "per doc sample"
 *   are copied from the handoff document's examples, not a published schema —
 *   Swagger didn't define one for several of these, so treat unexpected extra
 *   fields as normal and don't assume a field always exists.
 */

const BASE_URL = process.env.CHANNEL_MANAGER_BASE_URL ?? "https://channel-manager-8rq4.onrender.com/api/v1";
const API_KEY = process.env.CHANNEL_MANAGER_API_KEY;
const HOTEL_ID = 8;

/**
 * Local-dev-only stand-in for the real Channel Manager, used while we have no
 * API key yet. Lets the whole booking flow (search -> cart -> checkout ->
 * Paystack -> "Anli booking created") be exercised end to end locally without
 * ever faking a real ANLI response — this never runs once CHANNEL_MANAGER_API_KEY
 * is set, regardless of this flag.
 */
const MOCK_MODE = !API_KEY && process.env.CHANNEL_MANAGER_MOCK === "true";

/** True only while there's no real API key AND mock mode was explicitly opted into — lets callers route mock-eligible rooms through the same code path as real ones. */
export const isChannelManagerMockMode = MOCK_MODE;

/** Small deterministic hash so mock availability is stable for a given room+date, not random noise. */
function stableHash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

export class ChannelManagerError extends Error {
  constructor(message: string, public status: number, public body: unknown) {
    super(message);
    this.name = "ChannelManagerError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_KEY) {
    throw new ChannelManagerError(
      "CHANNEL_MANAGER_API_KEY is not set — add it to .env.local once ANLI shares it.",
      0,
      null
    );
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ChannelManagerError(`Channel Manager ${path} failed (${res.status})`, res.status, body);
  }

  return body as T;
}

// ─── Room Types ──────────────────────────────────────────

export interface AnliRoomTypeRoom {
  id: number;
  roomNumber: string;
  status: string;
  price: number;
  floor: number;
  roomCapacity: number;
}

export interface AnliRoomType {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  rooms: AnliRoomTypeRoom[];
}

export interface RoomTypesResponse {
  hotelId: number;
  count: number;
  roomTypes: AnliRoomType[];
}

/** GET /channel-manager/hotels/8/roomtypes — the real Anli room types/IDs behind our marketing room names. */
export function getRoomTypes(): Promise<RoomTypesResponse> {
  return request<RoomTypesResponse>(`/channel-manager/hotels/${HOTEL_ID}/roomtypes`);
}

// ─── Live Availability ───────────────────────────────────

export interface LiveAvailabilityRoomType {
  roomTypeId: number;
  name: string;
  roomsAvailable: number;
  nightlyRate: number;
  nights: number;
  totalPrice: number;
  maxGuests: number;
  photos: string[];
  amenities: string[];
  available: boolean;
}

export interface LiveAvailabilityResponse {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  roomTypes: LiveAvailabilityRoomType[];
}

/** GET /channel-manager/availability/live — checkIn inclusive, checkOut exclusive, dates as YYYY-MM-DD. */
export async function getLiveAvailability(params: {
  roomTypeId: number;
  checkInDate: string;
  checkOutDate: string;
}): Promise<LiveAvailabilityResponse> {
  if (MOCK_MODE) {
    const nights = Math.max(
      1,
      Math.round((new Date(params.checkOutDate).getTime() - new Date(params.checkInDate).getTime()) / 86400000)
    );
    const seed = stableHash(`${params.roomTypeId}-${params.checkInDate}-${params.checkOutDate}`);
    const roomsAvailable = seed % 6; // 0 = sold out, so the "fully booked" UI path gets exercised too
    const nightlyRate = 100000 + (params.roomTypeId % 10) * 10000;
    return {
      hotelId: HOTEL_ID,
      checkIn: params.checkInDate,
      checkOut: params.checkOutDate,
      nights,
      adults: 1,
      children: 0,
      roomTypes: [
        {
          roomTypeId: params.roomTypeId,
          name: `Mock Room ${params.roomTypeId}`,
          roomsAvailable,
          nightlyRate,
          nights,
          totalPrice: nightlyRate * nights,
          maxGuests: 2,
          photos: [],
          amenities: [],
          available: roomsAvailable > 0,
        },
      ],
    };
  }

  const qs = new URLSearchParams({
    hotelId: String(HOTEL_ID),
    roomtypeId: String(params.roomTypeId),
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
  });
  return request<LiveAvailabilityResponse>(`/channel-manager/availability/live?${qs.toString()}`);
}

// ─── Bookings — read ──────────────────────────────────────

/** Shape per doc's list-response sample — Swagger calls each item "Guest" without publishing its fields. */
export interface AnliBookingListItem {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  startDate: string;
  endDate: string;
  bookingCode: string;
  otaBookingCode: string | null;
  bookingStatus: string | null;
  hotelId: number;
  roomtypeId: number;
  roomNumber: string | null;
  roomId: number | null;
  numberOfGuests: number;
  amountPaid: string;
  outstanding: string;
  createdAt: string;
  [extra: string]: unknown;
}

/**
 * Shape per doc's get/create/update sample. Verified live (2026-11-20) that
 * the real GET-by-code and PUT responses for this hotel actually come back
 * shaped like `AnliBookingListItem` (field is `bookingStatus`, not `status`;
 * `phoneNumber`/`roomtypeId` not `phone`/`roomTypeId`) — this type's `status`
 * field is per the doc's generic Swagger sample, not what we've actually
 * observed, so don't rely on it without checking live first. The create
 * response is its own undocumented shape again (has both `status` AND
 * `bookingStatus`, plus extras like `oreonBookingCode`/`oreonForwarded`).
 * The index signature below exists because of this — don't assume any field
 * here is present without checking.
 */
export interface AnliBookingDetail {
  id: number;
  bookingCode: string;
  otaBookingCode: string | null;
  fullName: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  source: string;
  status: string;
  hotelId: number;
  roomTypeId: number;
  createdAt: string;
  updatedAt: string;
  [extra: string]: unknown;
}

export function listBookings(params?: { limit?: number; offset?: number; status?: string }) {
  const qs = new URLSearchParams({
    hotelId: String(HOTEL_ID),
    limit: String(params?.limit ?? 100),
    offset: String(params?.offset ?? 0),
    ...(params?.status ? { status: params.status } : {}),
  });
  return request<{ bookings: AnliBookingListItem[]; total: number }>(`/channel-manager/bookings?${qs.toString()}`);
}

export function getBooking(bookingCode: string) {
  return request<AnliBookingDetail>(`/channel-manager/bookings/${encodeURIComponent(bookingCode)}`);
}

// ─── Bookings — write (ONLY called after payment is confirmed) ─────────

export interface CreateBookingInput {
  roomTypeId: number;
  checkInDate: string;
  checkOutDate: string;
  roomNumber?: string;
  guest: { fullName: string; email: string; phoneNumber?: string };
  totalPrice: number;
  currency: string;
  /** Our own booking id — lets us reconcile Anli's record back to ours. */
  externalConfirmId: string;
  numberOfGuests?: number;
}

/**
 * POST /channel-manager/bookings — creates the reservation in Anli PMS.
 * Per the integration doc, this must only be called once payment has been
 * confirmed (Paystack webhook), never before — there should be no abandoned
 * reservation sitting in the PMS for a cart that was never paid for.
 */
export async function createBooking(input: CreateBookingInput): Promise<AnliBookingDetail | null> {
  if (MOCK_MODE) {
    return {
      id: stableHash(input.externalConfirmId),
      bookingCode: `MOCK-${input.externalConfirmId}`,
      otaBookingCode: input.externalConfirmId,
      fullName: input.guest.fullName,
      email: input.guest.email,
      phone: input.guest.phoneNumber ?? "",
      startDate: input.checkInDate,
      endDate: input.checkOutDate,
      amount: input.totalPrice,
      currency: input.currency,
      source: "CORNICHE",
      status: "CONFIRMED",
      hotelId: HOTEL_ID,
      roomTypeId: input.roomTypeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return request<AnliBookingDetail | null>(`/channel-manager/bookings`, {
    method: "POST",
    body: JSON.stringify({
      hotelId: HOTEL_ID,
      roomTypeId: String(input.roomTypeId),
      checkInDate: input.checkInDate,
      checkOutDate: input.checkOutDate,
      roomNumber: input.roomNumber,
      guest: input.guest,
      totalPrice: input.totalPrice,
      currency: input.currency,
      externalConfirmId: input.externalConfirmId,
      source: "CORNICHE",
      otaBookingCode: input.externalConfirmId,
      status: "CONFIRMED",
      numberOfGuests: input.numberOfGuests,
    }),
  });
}

export function updateBooking(
  bookingCode: string,
  input: Partial<{
    fullName: string;
    email: string;
    phoneNumber: string;
    status: "PENDING" | "CONFIRMED";
    amount: number;
    numberOfGuests: number;
    startDate: string;
    endDate: string;
    cancelReason: string;
  }>
) {
  return request<AnliBookingDetail>(`/channel-manager/bookings/${encodeURIComponent(bookingCode)}`, {
    method: "PUT",
    body: JSON.stringify({ hotelId: HOTEL_ID, ...input }),
  });
}

export function cancelBooking(bookingCode: string, reason?: string) {
  return request<void>(`/channel-manager/bookings/${encodeURIComponent(bookingCode)}/cancel`, {
    method: "POST",
    body: JSON.stringify({ hotelId: HOTEL_ID, reason }),
  });
}

/** Returns the raw invoice PDF bytes — a binary response, so it bypasses the JSON-parsing `request()` helper. */
export async function getBookingInvoice(bookingCode: string): Promise<ArrayBuffer> {
  if (!API_KEY) {
    throw new ChannelManagerError("CHANNEL_MANAGER_API_KEY is not set.", 0, null);
  }
  const res = await fetch(`${BASE_URL}/channel-manager/bookings/${encodeURIComponent(bookingCode)}/invoice`, {
    method: "POST",
    cache: "no-store",
    headers: { "x-api-key": API_KEY, "Content-Type": "application/json", Accept: "application/pdf" },
    body: JSON.stringify({ hotelId: HOTEL_ID }),
  });
  if (!res.ok) {
    throw new ChannelManagerError(`Channel Manager invoice request failed (${res.status})`, res.status, await res.text());
  }
  return res.arrayBuffer();
}
