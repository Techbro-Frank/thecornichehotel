/**
 * @file BookClient — direct booking search page
 * @description Replaces the external Anli booking link. Guest picks dates and
 *   party size, we check live availability per room type through our own
 *   /api/availability proxy, and show results with a "Discover More" link
 *   into the room's own detail page. No cart/checkout here yet (Phase 2) —
 *   this phase is read-only: search in, availability out.
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Users, Baby, BedDouble, ShoppingBag, Plus, Minus } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import SectionHeading from "@/components/shared/section-heading";
import StepperCounter from "@/components/shared/stepper-counter";
import { useCart, lineKey } from "@/contexts/cart-context";
import { todayISO, addDaysISO } from "@/lib/utils";
import type { RoomDetails } from "@/lib/rooms-data";
import type { AvailabilityResult } from "@/app/api/availability/route";

function ResultCard({
  result: r,
  room,
  checkIn,
  checkOut,
  adults,
  childrenCount,
  roomsCount,
}: {
  result: AvailabilityResult;
  room: RoomDetails | undefined;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenCount: number;
  roomsCount: number;
}) {
  const { items, addItem, updateRoomsCount } = useCart();

  const soldOut = r.configured && r.roomsAvailable === 0;
  const exceedsAvailable = r.configured && r.roomsAvailable != null && roomsCount > r.roomsAvailable;
  const canAddToCart = r.configured && !soldOut && !exceedsAvailable && r.roomTypeId != null && r.nightlyRate != null && r.totalPrice != null;

  const key = lineKey(r.slug, checkIn, checkOut);
  const inCart = items.find((i) => i.key === key);
  const qty = inCart?.roomsCount ?? 0;
  const atCap = r.configured && r.roomsAvailable != null && qty >= r.roomsAvailable;

  function handleAddToCart() {
    if (!canAddToCart || !room) return;
    addItem({
      roomSlug: r.slug,
      roomName: r.name,
      image: room.images[0] ?? null,
      checkIn,
      checkOut,
      adults,
      children: childrenCount,
      roomsCount,
      roomTypeId: r.roomTypeId!,
      nightlyRate: r.nightlyRate!,
      totalPrice: r.totalPrice!,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col bg-white border border-[#E6DED5]/40 hover:shadow-card transition-all duration-300"
    >
      {room?.images[0] && (
        <div className="relative aspect-[4/3] bg-beige-light">
          <Image src={room.images[0]} alt={r.name} fill sizes="400px" className="object-cover" />
          {r.configured && (
            <span
              className={`absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full text-white ${
                soldOut ? "bg-red-600" : "bg-emerald-600"
              }`}
            >
              {soldOut ? "Fully Booked" : `${r.roomsAvailable} Room${r.roomsAvailable === 1 ? "" : "s"} Left`}
            </span>
          )}
        </div>
      )}

      <div className="p-6 flex flex-col items-center text-center flex-1">
        <h3 className="font-[family-name:var(--font-heading)] text-lg text-dark tracking-[0.08em] uppercase font-light mb-3">
          {r.name}
        </h3>
        <p className="text-sm text-muted mb-5">
          {r.configured && r.totalPrice ? `₦${r.totalPrice.toLocaleString()} total` : r.price}
        </p>

        <div className="w-full mt-auto space-y-2">
          {qty > 0 ? (
            <div className="flex items-center justify-between w-full bg-beige border border-gold text-dark py-2 pl-4 pr-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
                Added to Cart
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateRoomsCount(key, qty - 1)}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-border hover:bg-[#CFA785] hover:text-white transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{qty}</span>
                <button
                  type="button"
                  onClick={() => updateRoomsCount(key, qty + 1)}
                  disabled={atCap}
                  aria-label="Increase quantity"
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-border hover:bg-[#CFA785] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-inherit"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingBag size={15} />
                {exceedsAvailable ? "Not Enough Rooms" : "Add to Cart"}
              </span>
            </button>
          )}
          <Link
            href={`/rooms/${r.slug}`}
            className="flex items-center justify-center w-full border border-[#CFA785] hover:bg-[#CFA785] hover:text-black transition-colors duration-300 text-[11px] font-medium uppercase tracking-[0.12em] py-3"
          >
            Discover More
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function BookSearch({ rooms }: { rooms: RoomDetails[] }) {
  const searchParams = useSearchParams();

  const roomSlugFilter = searchParams.get("roomSlug");

  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || todayISO());
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || todayISO(1));
  const [adults, setAdults] = useState(Number(searchParams.get("adults")) || 1);
  const [children, setChildren] = useState(Number(searchParams.get("children")) || 0);
  const [roomsCount, setRoomsCount] = useState(1);

  const [results, setResults] = useState<AvailabilityResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function runSearch() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ checkIn, checkOut });
      if (roomSlugFilter) qs.set("roomSlug", roomSlugFilter);
      const res = await fetch(`/api/availability?${qs.toString()}`);
      if (!res.ok) throw new Error("Could not check availability right now.");
      const data = await res.json();
      setResults(data.rooms as AvailabilityResult[]);
      setSearched(true);
    } catch {
      setError("Could not check availability right now — please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  }

  // Show every room with live availability for the default (or URL-provided) dates
  // the moment the page loads — "Check Availability" is just for re-querying a
  // changed date range, not a gate guests have to clear before seeing anything.
  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roomsBySlug = new Map(rooms.map((r) => [r.slug, r]));

  return (
    <>
      <div className="glass shadow-elevated p-5 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="flex flex-col gap-2">
            <label className="label-uppercase text-[11px]" htmlFor="book-checkin">Check-in</label>
            <input
              id="book-checkin"
              type="date"
              value={checkIn}
              min={todayISO()}
              onChange={(e) => {
                const next = e.target.value;
                setCheckIn(next);
                if (checkOut <= next) setCheckOut(addDaysISO(next, 1));
              }}
              className="w-full px-4 py-3 bg-white border border-border text-sm text-dark focus:outline-none focus:border-gold transition-colors cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="label-uppercase text-[11px]" htmlFor="book-checkout">Check-out</label>
            <input
              id="book-checkout"
              type="date"
              value={checkOut}
              min={addDaysISO(checkIn, 1)}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-border text-sm text-dark focus:outline-none focus:border-gold transition-colors cursor-pointer"
            />
          </div>

          <StepperCounter label="Adults" icon={Users} value={adults} min={1} max={10} onChange={setAdults} />
          <StepperCounter label="Children" icon={Baby} value={children} min={0} max={6} onChange={setChildren} />
          <StepperCounter label="Rooms" icon={BedDouble} value={roomsCount} min={1} max={9} onChange={setRoomsCount} />
        </div>

        <button
          type="button"
          onClick={runSearch}
          disabled={loading}
          className="btn-primary w-full !py-3 mt-4 group disabled:opacity-60"
        >
          <span className="flex items-center justify-center gap-2">
            <Search size={16} />
            {loading ? "Checking Availability…" : "Check Availability"}
          </span>
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mt-4 text-center">{error}</p>}

      {loading && !results && (
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(280px,340px))] justify-center gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-[#E6DED5]/40">
              <div className="aspect-[4/3] bg-beige-light" />
              <div className="p-6 flex flex-col items-center gap-3">
                <div className="h-4 w-2/3 bg-beige-light rounded" />
                <div className="h-3 w-1/3 bg-beige-light rounded" />
                <div className="h-10 w-full bg-beige-light rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {searched && !error && results && (
        <div className="mt-6">
          <p className="label-uppercase text-center mb-6">
            {results.some((r) => r.configured)
              ? `Availability for ${checkIn} → ${checkOut}`
              : "Live availability isn't connected yet — showing standard rates"}
          </p>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,340px))] justify-center gap-6">
            {results.map((r) => (
              <ResultCard
                key={r.slug}
                result={r}
                room={roomsBySlug.get(r.slug)}
                checkIn={checkIn}
                checkOut={checkOut}
                adults={adults}
                childrenCount={children}
                roomsCount={roomsCount}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function BookClient({ rooms }: { rooms: RoomDetails[] }) {
  return (
    <>
      <Navbar />
      <main className="relative w-full bg-beige pt-20 md:pt-24 pb-16">
        <div className="container-luxury">
          <SectionHeading
            label="Direct Booking"
            title="Book Your Stay"
            description="Check real-time availability and book directly with us — no third-party redirect."
            compact
            className="mb-4 md:mb-6"
          />

          <Suspense fallback={null}>
            <BookSearch rooms={rooms} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
