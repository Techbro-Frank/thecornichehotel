/**
 * @file WhatsAppFloatButton — sitewide floating WhatsApp launcher
 * @description Fixed bottom-left bubble present on every page (mounted once
 *   in the root layout). Clicking it opens a small chat-preview card first
 *   (greeting + "Chat on WhatsApp" CTA) rather than jumping straight to
 *   wa.me, matching the pattern of hotel chat widgets guests already
 *   recognize. The CTA opens wa.me with a pre-filled message to the front
 *   desk line. Kept at a modest z-index on purpose: it sits below the
 *   mobile-menu overlay, the Bistro embedded-menu overlay, and all modals,
 *   so it never floats on top of a full-screen surface that's already open
 *   — no extra coordination needed, it's just naturally covered.
 *
 *   Draggable: visitors can click-and-drag the bubble anywhere on screen if
 *   it's blocking something. The drag container spans the full viewport, so
 *   it's constrained to stay on-screen. A click still opens the preview card
 *   as long as it wasn't released after an actual drag (tracked via
 *   onDragEnd offset).
 */

"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BRAND } from "@/lib/constants";
import WhatsAppIcon from "@/components/shared/whatsapp-icon";

const WHATSAPP_MESSAGE = "Hi, I'd like to know more about The Corniche Hotel.";
const DRAG_CLICK_THRESHOLD = 5;

export default function WhatsAppFloatButton() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const didDrag = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const url = `https://wa.me/${BRAND.phone.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div ref={constraintsRef} className="fixed inset-0 z-40 pointer-events-none">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          didDrag.current =
            Math.abs(info.offset.x) > DRAG_CLICK_THRESHOLD ||
            Math.abs(info.offset.y) > DRAG_CLICK_THRESHOLD;
        }}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="pointer-events-auto absolute bottom-6 left-6 flex flex-col items-start gap-3"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-72 overflow-hidden rounded-xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between bg-[#25D366] px-4 py-3">
                <span className="text-sm font-medium text-white">{BRAND.name}</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-white/90 hover:bg-white/20 transition-colors"
                  aria-label="Close chat preview"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="p-4">
                <div className="rounded-lg rounded-tl-none bg-beige px-3.5 py-3 text-sm leading-relaxed text-dark">
                  Hi there! 👋 How can we help you today?
                </div>

                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1fbd5a] text-white py-3 rounded-lg transition-colors duration-300 text-sm font-medium"
                >
                  <WhatsAppIcon size={18} />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => {
            if (didDrag.current) {
              didDrag.current = false;
              return;
            }
            setIsOpen((open) => !open);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl cursor-grab active:cursor-grabbing"
          aria-label="Chat with us on WhatsApp"
        >
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
          )}
          {isOpen ? <X size={26} /> : <WhatsAppIcon size={28} />}
        </motion.button>
      </motion.div>
    </div>
  );
}
