/**
 * @file RoomCard — Shared room listing card
 * @description Used by both the Rooms & Suites listing page (full size) and the
 *   "Explore Other Rooms" section on each room's own detail page (`compact`,
 *   smaller image/padding/type so 4 fit per row without feeling oversized), so
 *   the card never has to be redesigned twice. Clicking the image navigates to
 *   the room's detail page (via HoverImageCard's `href`).
 */

"use client";

import { motion } from "framer-motion";
import HoverImageCard from "@/components/shared/hover-image-card";
import { BRAND } from "@/lib/constants";
import type { RoomDetails } from "@/lib/rooms-data";

export const roomCardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function RoomCard({ room, compact = false }: { room: RoomDetails; compact?: boolean }) {
  return (
    <motion.div variants={roomCardVariants} className="flex flex-col bg-white border border-[#E6DED5]/40 hover:shadow-card transition-all duration-300 w-full">
      <HoverImageCard
        images={room.images}
        alt={room.name}
        caption="More Details"
        aspectClass={compact ? "aspect-[4/2.6]" : "aspect-[4/3]"}
        href={`/rooms/${room.slug}`}
      />

      {/* Content Section below card */}
      <div className={compact ? "p-4 flex flex-col items-center text-center" : "p-6 flex flex-col items-center text-center"}>
        <h3
          className={
            compact
              ? "font-[family-name:var(--font-heading)] text-sm text-dark tracking-[0.06em] uppercase font-light mb-2"
              : "font-[family-name:var(--font-heading)] text-lg text-dark tracking-[0.08em] uppercase font-light mb-3"
          }
        >
          {room.name}
        </h3>

        {/* Room Specs Grid */}
        <div
          className={
            compact
              ? "flex items-center justify-center gap-3 w-full mb-3 border-t border-b border-[#E6DED5]/60 py-2"
              : "flex items-center justify-center gap-6 w-full mb-5 border-t border-b border-[#E6DED5]/60 py-3"
          }
        >
          <div className="flex flex-col items-center">
            <span className={compact ? "text-xs font-light text-dark" : "text-sm font-light text-dark"}>{room.size}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted mt-1">Size m²</span>
          </div>
          <div className={compact ? "flex flex-col items-center border-l border-r border-[#E6DED5]/60 px-3" : "flex flex-col items-center border-l border-r border-[#E6DED5]/60 px-6"}>
            <span className={compact ? "text-xs font-light text-dark" : "text-sm font-light text-dark"}>{room.maxAdults}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted mt-1">Adults</span>
          </div>
          <div className="flex flex-col items-center">
            <span className={compact ? "text-xs font-light text-dark" : "text-sm font-light text-dark"}>{room.maxChildren}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted mt-1">Children</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={compact ? "flex flex-col gap-2 w-full" : "flex gap-3 w-full justify-center"}>
          <a
            href={BRAND.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={
              compact
                ? "w-full border border-[#CFA785] hover:bg-[#CFA785] hover:text-black transition-colors duration-300 text-[10px] font-medium uppercase tracking-[0.1em] py-2"
                : "flex-1 border border-[#CFA785] hover:bg-[#CFA785] hover:text-black transition-colors duration-300 text-[11px] font-medium uppercase tracking-[0.12em] py-3"
            }
          >
            Book Now
          </a>
          <div
            className={
              compact
                ? "w-full flex items-center justify-center bg-black text-white hover:bg-gold transition-colors duration-300 text-[10px] font-bold uppercase tracking-[0.08em] py-2 cursor-default text-center px-1"
                : "flex-1 flex items-center justify-center bg-black text-white hover:bg-gold transition-colors duration-300 text-[11px] font-bold uppercase tracking-[0.1em] py-3 cursor-default text-center px-1"
            }
          >
            {room.price}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
