/**
 * @file BookingWidget — Floating booking bar with date & guest selection
 * @description Glassmorphism-styled booking widget that sits at the hero/content
 *   transition point. Provides check-in/check-out date pickers with min-date logic,
 *   and adult/child counters. Live availability search isn't wired up to a PMS
 *   yet, so "Check Availability" opens a modal explaining that, pointing guests
 *   to the phone/email or the real ANLI booking link instead of a dead search.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Baby,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Phone,
  Mail,
} from "lucide-react";
import { BRAND } from "@/lib/constants";

/** Lucide has no WhatsApp glyph — same hand-rolled mark used on the Ikoyi contact modal. */
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.08 1-2.37.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
    </svg>
  );
}

/** Booking widget with date pickers, guest counters, and a "coming soon" availability modal. */
export default function BookingWidget() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get tomorrow and day after for default min dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minCheckIn = today.toISOString().split("T")[0];
  const minCheckOut = checkIn || tomorrow.toISOString().split("T")[0];

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
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value >= checkOut) {
                      setCheckOut("");
                    }
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary w-full !py-3 group"
            >
              <span className="flex items-center justify-center gap-2">
                <Search size={16} />
                Check Availability
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* "Coming Soon" Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white max-w-md w-full p-8 sm:p-10 shadow-2xl z-10 text-center"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 w-9 h-9 flex items-center justify-center border border-border text-muted hover:text-dark hover:border-dark transition-colors"
                style={{ transitionDuration: "var(--duration-normal)" }}
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <p className="label-uppercase mb-3">Coming Soon</p>
              <h3 className="heading-3 text-dark mb-4">
                Live Availability, On Its Way
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-8">
                Our interactive room availability search isn&rsquo;t live
                just yet. In the meantime, our team is happy to help you
                directly — or you can book instantly through our official
                booking portal.
              </p>

              <div className="space-y-3 mb-8">
                <a
                  href={`tel:${BRAND.phone}`}
                  className="flex items-center justify-center gap-2 text-sm text-dark hover:text-gold transition-colors"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  <Phone size={15} className="text-gold" />
                  {BRAND.phone}
                </a>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex items-center justify-center gap-2 text-sm text-dark hover:text-gold transition-colors"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  <Mail size={15} className="text-gold" />
                  {BRAND.email}
                </a>
              </div>

              <a
                href={`https://wa.me/${BRAND.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                  "Hi, I'd like to check room availability at The Corniche Hotel."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1fbd5a] text-white py-4 transition-colors duration-300 font-medium tracking-[0.1em] text-xs uppercase mb-3"
              >
                <WhatsAppIcon size={16} />
                Chat on WhatsApp
              </a>

              <a
                href={BRAND.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                <span>Book Now Instead</span>
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
