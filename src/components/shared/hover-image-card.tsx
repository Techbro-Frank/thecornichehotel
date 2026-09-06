/**
 * @file HoverImageCard — Direction-aware hover image, gallery or click-through
 * @description Shared image treatment used by both the Rooms & Suites cards and
 *   the Ikoyi Apartments cards: a direction-aware hover overlay (gold triple-line
 *   frame + caption, entering from whichever edge the cursor approached from —
 *   the site's signature card interaction), with an optional auto-cycling
 *   slideshow for cards that have many photos. By default, clicking opens the
 *   full PhotoGalleryModal (used by Ikoyi Apartments); pass `href` to instead
 *   navigate to a page on click (used by Rooms & Suites, which now has its own
 *   detail page per room).
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion, Variants } from "framer-motion";
import PhotoGalleryModal from "@/components/shared/photo-gallery-modal";

type Direction = "top" | "right" | "bottom" | "left";

interface HoverImageCardProps {
  images: string[];
  alt: string;
  caption: string;
  /** When true, the cover image auto-cycles through `images` (for apartments). */
  autoCycle?: boolean;
  aspectClass?: string;
  /** If set, clicking navigates here instead of opening the gallery modal. */
  href?: string;
}

function resolveDirection(e: React.MouseEvent<HTMLDivElement>): Direction {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
  const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  if (angle > -45 && angle <= 45) return "right";
  if (angle > 45 && angle <= 135) return "bottom";
  if (angle > 135 || angle <= -135) return "left";
  return "top";
}

export default function HoverImageCard({
  images,
  alt,
  caption,
  autoCycle = false,
  aspectClass = "aspect-[4/3.2]",
  href,
}: HoverImageCardProps) {
  const router = useRouter();
  const [coverIndex, setCoverIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("top");
  const [isHovered, setIsHovered] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (!autoCycle || images.length < 2) return;
    const id = setInterval(() => {
      setCoverIndex((i) => (i + 1) % images.length);
    }, 3800);
    return () => clearInterval(id);
  }, [autoCycle, images.length]);

  const overlayVariants: Variants = {
    initial: (dir: Direction) => ({
      x: dir === "left" ? "-100%" : dir === "right" ? "100%" : 0,
      y: dir === "top" ? "-100%" : dir === "bottom" ? "100%" : 0,
      opacity: 0,
    }),
    animate: { x: 0, y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: (dir: Direction) => ({
      x: dir === "left" ? "-100%" : dir === "right" ? "100%" : 0,
      y: dir === "top" ? "-100%" : dir === "bottom" ? "100%" : 0,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  const frameVariants: Variants = {
    initial: { scale: 0.93, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { delay: 0.1, duration: 0.4, ease: "easeOut" } },
    exit: { scale: 0.93, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <>
      <div
        onMouseEnter={(e) => {
          setDirection(resolveDirection(e));
          setIsHovered(true);
        }}
        onMouseLeave={(e) => {
          setDirection(resolveDirection(e));
          setIsHovered(false);
        }}
        onClick={() => {
          if (href) {
            router.push(href);
            return;
          }
          setGalleryIndex(coverIndex);
          setIsGalleryOpen(true);
        }}
        className={`relative overflow-hidden ${aspectClass} w-full bg-dark-soft cursor-pointer group`}
      >
        <AnimatePresence>
          <motion.div
            key={coverIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[coverIndex]}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>

        {autoCycle && images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === coverIndex ? "bg-gold w-4" : "bg-white/50 w-1.5"
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence custom={direction}>
          {isHovered && (
            <motion.div
              custom={direction}
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 z-10 bg-black/35 flex items-center justify-center p-6"
            >
              <motion.div
                variants={frameVariants}
                className="absolute inset-[20px] md:inset-[26px] border border-gold/40 p-[2px] pointer-events-none"
              >
                <div className="w-full h-full border border-gold/60 p-[2px]">
                  <div className="w-full h-full border border-gold" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="relative z-20 text-center px-4"
              >
                <h3 className="font-[family-name:var(--font-heading)] text-lg md:text-xl text-[#F5F1EB] uppercase tracking-[0.25em] font-light">
                  {caption}
                </h3>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PhotoGalleryModal
        images={images}
        alt={alt}
        isOpen={isGalleryOpen}
        index={galleryIndex}
        onIndexChange={setGalleryIndex}
        onClose={() => setIsGalleryOpen(false)}
      />
    </>
  );
}
