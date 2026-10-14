/**
 * @file WhatsAppFloatButton — sitewide floating WhatsApp launcher
 * @description Fixed bottom-left bubble present on every page (mounted once
 *   in the root layout). Opens wa.me with a pre-filled message to the front
 *   desk line. Kept at a modest z-index on purpose: it sits below the
 *   mobile-menu overlay, the Bistro embedded-menu overlay, and all modals,
 *   so it never floats on top of a full-screen surface that's already open
 *   — no extra coordination needed, it's just naturally covered.
 *
 *   Draggable: visitors can click-and-drag the bubble anywhere on screen if
 *   it's blocking something. The drag container spans the full viewport, so
 *   it's constrained to stay on-screen. A click still opens WhatsApp as long
 *   as it wasn't released after an actual drag (tracked via onDragEnd offset).
 */

"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import WhatsAppIcon from "@/components/shared/whatsapp-icon";

const WHATSAPP_MESSAGE = "Hi, I'd like to know more about The Corniche Hotel.";
const DRAG_CLICK_THRESHOLD = 5;

export default function WhatsAppFloatButton() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const didDrag = useRef(false);
  const url = `https://wa.me/${BRAND.phone.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div ref={constraintsRef} className="fixed inset-0 z-40 pointer-events-none">
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          didDrag.current =
            Math.abs(info.offset.x) > DRAG_CLICK_THRESHOLD ||
            Math.abs(info.offset.y) > DRAG_CLICK_THRESHOLD;
        }}
        onClick={(e) => {
          if (didDrag.current) {
            e.preventDefault();
            didDrag.current = false;
          }
        }}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto absolute bottom-6 left-6 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl cursor-grab active:cursor-grabbing"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
        <WhatsAppIcon size={28} />
      </motion.a>
    </div>
  );
}
