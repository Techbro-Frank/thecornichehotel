/**
 * @file ApartmentContactModal — Ikoyi Apartments booking modal
 * @description The Ikoyi Apartments aren't booked through the hotel's ANLI PMS —
 *   they're a separate operation — so "Book Now" here opens this modal instead
 *   of the PMS link: front desk phone, email, and a WhatsApp deep-link so the
 *   guest can complete the booking directly in a chat.
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail } from "lucide-react";
import { BRAND } from "@/lib/constants";

interface ApartmentContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartmentName: string;
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.08 1-2.37.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
    </svg>
  );
}

export default function ApartmentContactModal({
  isOpen,
  onClose,
  apartmentName,
}: ApartmentContactModalProps) {
  const whatsappNumber = BRAND.phone.replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `Hi, I'd like to book the ${apartmentName} at Ikoyi Apartments.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              onClick={onClose}
              className="absolute right-5 top-5 w-9 h-9 flex items-center justify-center border border-border text-muted hover:text-dark hover:border-dark transition-colors"
              style={{ transitionDuration: "var(--duration-normal)" }}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <p className="label-uppercase mb-3">Ikoyi Apartments</p>
            <h3 className="heading-3 text-dark mb-4">Book This Apartment</h3>
            <p className="text-sm text-muted leading-relaxed mb-8">
              Our Ikoyi Apartments are booked directly with our team —
              reach out by phone, email, or WhatsApp and we&rsquo;ll take
              it from there.
            </p>

            <div className="space-y-3 mb-8">
              <a
                href={`tel:${BRAND.phone}`}
                className="flex items-center justify-center gap-2 text-sm text-dark hover:text-gold transition-colors"
                style={{ transitionDuration: "var(--duration-fast)" }}
              >
                <Phone size={15} className="text-gold" />
                {BRAND.phone} (Front Desk)
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
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1fbd5a] text-white py-4 transition-colors duration-300 font-medium tracking-[0.1em] text-xs uppercase"
            >
              <WhatsAppIcon size={16} />
              Book via WhatsApp
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
