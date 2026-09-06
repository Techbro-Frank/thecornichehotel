/**
 * @file RoomGallery — Inline animated photo gallery for a room detail page
 * @description A large crossfading hero image with a scrollable thumbnail
 *   strip below it — distinct from the Ikoyi/listing lightbox modal, since
 *   this lives inline in the page rather than as an overlay. Arrows, a
 *   counter, and click-any-thumbnail navigation make it easy to browse every
 *   photo for the room.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RoomGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full">
      <div className="relative w-full aspect-[2/1] bg-dark-soft overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt={`${alt} — photo ${index + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-colors"
              style={{ transitionDuration: "var(--duration-normal)" }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-colors"
              style={{ transitionDuration: "var(--duration-normal)" }}
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 tracking-wider">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative flex-shrink-0 w-20 h-16 md:w-24 md:h-20 overflow-hidden transition-all duration-300 ${
                i === index ? "ring-2 ring-gold opacity-100" : "opacity-60 hover:opacity-90"
              }`}
              aria-label={`View photo ${i + 1}`}
            >
              <Image src={img} alt="" fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
