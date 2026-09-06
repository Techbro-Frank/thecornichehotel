/**
 * @file PhotoGalleryModal — Full-screen photo slideshow with arrow navigation
 * @description Reusable lightbox used by both the Rooms & Suites cards and the
 *   Ikoyi Apartments cards. Opens over everything, shows one photo at a time
 *   with a comfortable amount of breathing room, and lets guests step through
 *   every photo for that room/apartment via arrows, dots, or the keyboard.
 */

"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoGalleryModalProps {
  images: string[];
  alt: string;
  isOpen: boolean;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export default function PhotoGalleryModal({
  images,
  alt,
  isOpen,
  index,
  onIndexChange,
  onClose,
}: PhotoGalleryModalProps) {
  const goPrev = useCallback(() => {
    onIndexChange(index === 0 ? images.length - 1 : index - 1);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange(index === images.length - 1 ? 0 : index + 1);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, goPrev, goNext, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-10 w-10 h-10 flex items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-colors"
            style={{ transitionDuration: "var(--duration-normal)" }}
            aria-label="Close gallery"
          >
            <X size={18} />
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 text-white/50 text-xs tracking-[0.2em] uppercase">
            {index + 1} / {images.length}
          </div>

          {/* Image */}
          <div className="relative w-full h-full max-w-5xl max-h-[75vh] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src={images[index]}
                  alt={`${alt} — photo ${index + 1}`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-gold transition-colors bg-black/30"
                style={{ transitionDuration: "var(--duration-normal)" }}
                aria-label="Previous photo"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-gold transition-colors bg-black/30"
                style={{ transitionDuration: "var(--duration-normal)" }}
                aria-label="Next photo"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Dots */}
          {images.length > 1 && images.length <= 24 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-2xl">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onIndexChange(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "bg-gold w-6" : "bg-white/25 hover:bg-white/50 w-1.5"
                  }`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
