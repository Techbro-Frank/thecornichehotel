/**
 * @file BookingWidget — Floating booking bar with date & guest selection
 * @description Glassmorphism-styled booking widget that sits at the hero/content
 *   transition point. Provides check-in/check-out date pickers with min-date logic,
 *   and adult/child counters. "Check Availability" routes to /book with the
 *   picked dates carried in the query string, where live availability is
 *   actually checked — this no longer sends guests to the external Anli link.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Baby, Search, ChevronDown, ChevronUp } from "lucide-react";
import { todayISO, addDaysISO } from "@/lib/utils";

/** Booking widget with date pickers and guest counters, routing to /book on search. */
export default function BookingWidget() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(todayISO(1));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const minCheckIn = todayISO();
  const minCheckOut = addDaysISO(checkIn, 1);

  function goToBookingPage() {
    const qs = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
    });
    router.push(`/book?${qs.toString()}`);
  }

  return (
    <motion.section
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative z-20"
    >
      <div className="container-luxury">
        <div className="glass shadow-elevated p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
            {/* Check-in */}
            <div className="flex flex-col gap-2">
              <label className="label-uppercase text-[11px]" htmlFor="checkin-date">
                Check-in
              </label>
              <div className="relative">
                <input
                  id="checkin-date"
                  type="date"
                  value={checkIn}
                  min={minCheckIn}
                  onChange={(e) => {
                    const next = e.target.value;
                    setCheckIn(next);
                    if (checkOut <= next) setCheckOut(addDaysISO(next, 1));
                  }}
                  className="w-full px-4 py-3 bg-white border border-border text-sm text-dark focus:outline-none focus:border-gold transition-colors cursor-pointer"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="flex flex-col gap-2">
              <label className="label-uppercase text-[11px]" htmlFor="checkout-date">
                Check-out
              </label>
              <div className="relative">
                <input
                  id="checkout-date"
                  type="date"
                  value={checkOut}
                  min={minCheckOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-border text-sm text-dark focus:outline-none focus:border-gold transition-colors cursor-pointer"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                />
              </div>
            </div>

            {/* Adults */}
            <div className="flex flex-col gap-2">
              <label className="label-uppercase text-[11px]" htmlFor="adults-count">
                Adults
              </label>
              <div className="flex items-center border border-border bg-white">
                <div className="flex items-center gap-2 pl-3">
                  <Users size={16} className="text-muted" />
                </div>
                <input
                  id="adults-count"
                  type="text"
                  readOnly
                  value={adults}
                  className="flex-1 py-3 px-2 text-sm text-dark bg-transparent text-center focus:outline-none"
                />
                <div className="flex flex-col border-l border-border">
                  <button
                    onClick={() => setAdults(Math.min(adults + 1, 10))}
                    className="px-3 py-1 hover:bg-beige transition-colors"
                    style={{ transitionDuration: "var(--duration-fast)" }}
                    aria-label="Increase adults"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    onClick={() => setAdults(Math.max(adults - 1, 1))}
                    className="px-3 py-1 hover:bg-beige transition-colors border-t border-border"
                    style={{ transitionDuration: "var(--duration-fast)" }}
                    aria-label="Decrease adults"
                  >
                    <ChevronDown size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Children */}
            <div className="flex flex-col gap-2">
              <label className="label-uppercase text-[11px]" htmlFor="children-count">
                Children
              </label>
              <div className="flex items-center border border-border bg-white">
                <div className="flex items-center gap-2 pl-3">
                  <Baby size={16} className="text-muted" />
                </div>
                <input
                  id="children-count"
                  type="text"
                  readOnly
                  value={children}
                  className="flex-1 py-3 px-2 text-sm text-dark bg-transparent text-center focus:outline-none"
                />
                <div className="flex flex-col border-l border-border">
                  <button
                    onClick={() => setChildren(Math.min(children + 1, 6))}
                    className="px-3 py-1 hover:bg-beige transition-colors"
                    style={{ transitionDuration: "var(--duration-fast)" }}
                    aria-label="Increase children"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    onClick={() => setChildren(Math.max(children - 1, 0))}
                    className="px-3 py-1 hover:bg-beige transition-colors border-t border-border"
                    style={{ transitionDuration: "var(--duration-fast)" }}
                    aria-label="Decrease children"
                  >
                    <ChevronDown size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button onClick={goToBookingPage} className="btn-primary w-full !py-3 group">
              <span className="flex items-center justify-center gap-2">
                <Search size={16} />
                Check Availability
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
