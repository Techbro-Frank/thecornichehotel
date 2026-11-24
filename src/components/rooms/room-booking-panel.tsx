/**
 * @file RoomBookingPanel — inline check-availability + Add to Cart for one room
 * @description Lets a guest book this specific room without leaving its page,
 *   instead of only being able to search from the central /book page. Calls
 *   the same /api/availability proxy, scoped to this room via roomSlug.
 */

"use client";

import { useState } from "react";
import { Users, Baby, BedDouble, Search, ShoppingBag, Check, CalendarDays } from "lucide-react";
import StepperCounter from "@/components/shared/stepper-counter";
import AvailabilityCalendar from "@/components/rooms/availability-calendar";
import { useCart } from "@/contexts/cart-context";
import { todayISO, addDaysISO } from "@/lib/utils";
import type { RoomDetails } from "@/lib/rooms-data";
import type { AvailabilityResult } from "@/app/api/availability/route";

export default function RoomBookingPanel({ room }: { room: RoomDetails }) {
  const { addItem } = useCart();
  const [showCalendar, setShowCalendar] = useState(false);
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(todayISO(1));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [roomsCount, setRoomsCount] = useState(1);

  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  async function checkAvailability() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const qs = new URLSearchParams({ checkIn, checkOut, roomSlug: room.slug });
      const res = await fetch(`/api/availability?${qs.toString()}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data.rooms[0] ?? null);
    } catch {
      setError("Could not check availability — please try again.");
    } finally {
      setLoading(false);
    }
  }

  const soldOut = result?.configured && result.roomsAvailable === 0;
  const exceedsAvailable = result?.configured && result.roomsAvailable != null && roomsCount > result.roomsAvailable;
  const canAddToCart =
    result?.configured && !soldOut && !exceedsAvailable && result.roomTypeId != null && result.nightlyRate != null && result.totalPrice != null;

  function handleAddToCart() {
    if (!canAddToCart || !result) return;
    addItem({
      roomSlug: room.slug,
      roomName: room.name,
      image: room.images[0] ?? null,
      checkIn,
      checkOut,
      adults,
      children,
      roomsCount,
      roomTypeId: result.roomTypeId!,
      nightlyRate: result.nightlyRate!,
      totalPrice: result.totalPrice!,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-border p-6">
        <p className="label-uppercase mb-2">Rate</p>
      <p className="font-[family-name:var(--font-heading)] text-2xl text-dark mb-5">{room.price}</p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label className="label-uppercase text-[11px]" htmlFor="rp-checkin">Check-in</label>
            <input
              id="rp-checkin"
              type="date"
              value={checkIn}
              min={todayISO()}
              onChange={(e) => {
                const next = e.target.value;
                setCheckIn(next);
                setResult(null);
                if (checkOut <= next) setCheckOut(addDaysISO(next, 1));
              }}
              className="w-full px-3 py-2.5 bg-white border border-border text-sm text-dark focus:outline-none focus:border-gold"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="label-uppercase text-[11px]" htmlFor="rp-checkout">Check-out</label>
            <input
              id="rp-checkout"
              type="date"
              value={checkOut}
              min={addDaysISO(checkIn, 1)}
              onChange={(e) => {
                setCheckOut(e.target.value);
                setResult(null);
              }}
              className="w-full px-3 py-2.5 bg-white border border-border text-sm text-dark focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <StepperCounter label="Adults" icon={Users} value={adults} min={1} max={room.maxAdults} onChange={setAdults} />
        <StepperCounter label="Children" icon={Baby} value={children} min={0} max={room.maxChildren} onChange={setChildren} />
        <StepperCounter
          label="Rooms"
          icon={BedDouble}
          value={roomsCount}
          min={1}
          max={9}
          onChange={(v) => {
            setRoomsCount(v);
            setResult(null);
          }}
        />

        <button type="button" onClick={checkAvailability} disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-60">
          <span className="flex items-center justify-center gap-2">
            <Search size={15} />
            {loading ? "Checking…" : "Check Availability"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowCalendar((v) => !v)}
          className="flex items-center justify-center gap-2 w-full text-xs font-medium uppercase tracking-[0.1em] text-muted hover:text-gold transition-colors py-1"
        >
          <CalendarDays size={13} />
          {showCalendar ? "Hide Availability Calendar" : "View Availability Calendar"}
        </button>

        {error && <p className="text-xs text-red-600">{error}</p>}

        {result && (
          <div className="pt-4 border-t border-border">
            {result.configured ? (
              <>
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className={soldOut ? "text-red-600" : "text-emerald-700"}>
                    {soldOut ? "Fully booked for these dates" : `${result.roomsAvailable} room${result.roomsAvailable === 1 ? "" : "s"} available`}
                  </span>
                  {result.totalPrice != null && <span className="font-medium text-dark">₦{result.totalPrice.toLocaleString()} total</span>}
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    {added ? <Check size={15} /> : <ShoppingBag size={15} />}
                    {added ? "Added to Cart" : exceedsAvailable ? "Not Enough Rooms" : "Add to Cart"}
                  </span>
                </button>
              </>
            ) : (
              <p className="text-xs text-muted">Live availability isn&rsquo;t connected for this room yet — contact us to book directly.</p>
            )}
          </div>
        )}
      </div>
    </div>

    {showCalendar && <AvailabilityCalendar roomSlug={room.slug} />}
    </div>
  );
}
