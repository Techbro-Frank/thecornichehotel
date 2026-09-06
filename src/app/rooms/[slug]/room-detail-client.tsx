/**
 * @file Room Detail — Interactive client component
 * @description Full-detail view for a single room: an animated inline photo
 *   gallery, the room's characteristics and feature list, a Book Now CTA, the
 *   same booking widget used on the homepage (its "Check Availability" opens
 *   the shared "coming soon" modal), and — scrolling further — every other
 *   room type in the same card style as the main Rooms & Suites listing, so
 *   guests can keep browsing without leaving the detail-page context.
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BookingWidget from "@/components/booking/booking-widget";
import RoomGallery from "@/components/rooms/room-gallery";
import RoomCard from "@/components/rooms/room-card";
import { BRAND, CHECK_IN_TIME, CHECK_OUT_TIME } from "@/lib/constants";
import type { RoomDetails } from "@/lib/rooms-data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function RoomDetailClient({
  room,
  otherRooms,
}: {
  room: RoomDetails;
  otherRooms: RoomDetails[];
}) {
  return (
    <>
      <Navbar />

      <main className="relative w-full bg-beige pt-24 md:pt-28 pb-16">
        <div className="container-luxury mb-14 md:mb-16">
          {/* Back link */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-6">
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-muted hover:text-gold transition-colors"
              style={{ transitionDuration: "var(--duration-fast)" }}
            >
              <ArrowLeft size={14} />
              Back to Rooms &amp; Suites
            </Link>
          </motion.div>

          {/* Gallery */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}>
            <RoomGallery images={room.images} alt={room.name} />
          </motion.div>

          {/* Info + Booking */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 mt-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
              className="lg:col-span-2"
            >
              <motion.h1 variants={fadeUp} className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-dark tracking-[0.05em] uppercase font-light mb-3">
                {room.name}
              </motion.h1>

              <motion.div variants={fadeUp} className="flex items-center gap-6 mb-6 text-sm text-muted">
                <span>{room.size} m²</span>
                <span className="w-1 h-1 rounded-full bg-muted/50" />
                <span>{room.maxAdults} Max Adults</span>
                <span className="w-1 h-1 rounded-full bg-muted/50" />
                <span>{room.maxChildren} Max Children</span>
              </motion.div>

              <motion.p variants={fadeUp} className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed mb-8">
                {room.description}
              </motion.p>

              <motion.h2 variants={fadeUp} className="label-uppercase mb-4">
                Characteristics
              </motion.h2>
              <motion.ul variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
                {room.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-dark-soft/80">
                    <Check size={14} className="text-gold flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </motion.ul>

              <motion.p variants={fadeUp} className="text-sm text-muted border-t border-border pt-6">
                Check-in time: {CHECK_IN_TIME} &nbsp;/&nbsp; Check-out time: {CHECK_OUT_TIME}
              </motion.p>
            </motion.div>

            {/* Booking column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="lg:sticky lg:top-28 bg-white border border-border p-6">
                <p className="label-uppercase mb-2">Rate</p>
                <p className="font-[family-name:var(--font-heading)] text-2xl text-dark mb-5">
                  {room.price}
                </p>
                <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                  <span>Book Your Stay</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Availability widget — full width, same component as the homepage */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <p className="label-uppercase text-center mb-6">Check Availability</p>
          <BookingWidget />
        </motion.div>

        <div className="container-luxury">
          {/* Explore Other Rooms */}
          <div className="mt-14 md:mt-16">
            <div className="flex justify-center mb-6">
              <div className="divider-gold" />
            </div>
            <h2 className="heading-2 text-dark text-center mb-10">
              Explore Other Rooms
            </h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 justify-items-center"
            >
              {otherRooms.map((r) => (
                <RoomCard key={r.slug} room={r} compact />
              ))}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
