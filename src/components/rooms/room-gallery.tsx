/**
 * @file RoomGallery — Continuously sliding photo strip for a room detail page
 * @description Every photo for the room scrolls past in one continuous,
 *   looping strip (not capped at 3 with a "+N Photos" overlay) — it keeps
 *   moving the whole time the guest is on the page, including while they're
 *   working through dates/guests in the booking panel alongside it. Clicking
 *   any tile opens the same PhotoGalleryModal lightbox (used by Rooms &
 *   Suites and Ikoyi Apartments too) to browse the full set at full size.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import PhotoGalleryModal from "@/components/shared/photo-gallery-modal";

export default function RoomGallery({ images, alt }: { images: string[]; alt: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  function openAt(i: number) {
    setIndex(i);
    setIsOpen(true);
  }

  // Duplicated once so the loop can wrap seamlessly: animating the track from
  // 0% to -50% scrolls exactly one full pass of the real photos before the
  // (identical) second copy takes over, so the seam is invisible.
  const track = images.length > 1 ? [...images, ...images] : images;
  const durationSeconds = Math.max(images.length, 2) * 5;

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-2 md:gap-3 w-max"
          animate={images.length > 1 ? { x: ["0%", "-50%"] } : undefined}
          transition={{ duration: durationSeconds, ease: "linear", repeat: Infinity }}
        >
          {track.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => openAt(i % images.length)}
              className="relative flex-shrink-0 w-[260px] sm:w-[340px] md:w-[420px] aspect-[16/11] overflow-hidden bg-beige-light group"
            >
              <Image
                src={img}
                alt={`${alt} — photo ${(i % images.length) + 1}`}
                fill
                sizes="(max-width: 768px) 340px, 420px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority={i === 0}
              />
            </button>
          ))}
        </motion.div>

        {/* Edge fades so tiles read as continuously sliding past rather than cut off mid-frame. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-16 bg-gradient-to-r from-beige to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-16 bg-gradient-to-l from-beige to-transparent" />
      </div>

      <PhotoGalleryModal
        images={images}
        alt={alt}
        isOpen={isOpen}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
