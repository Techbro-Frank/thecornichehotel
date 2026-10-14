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
import WhatsAppIcon from "@/components/shared/whatsapp-icon";

interface ApartmentContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartmentName: string;
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
