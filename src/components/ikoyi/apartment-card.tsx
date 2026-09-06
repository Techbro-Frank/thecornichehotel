/**
 * @file ApartmentCard — Ikoyi Apartments listing card
 * @description Mirrors the RoomDetailCard pattern used on the Rooms & Suites
 *   page (bordered card, image above, content below, CTA row). The image area
 *   auto-cycles through every photo for the unit, carries the same
 *   direction-aware hover overlay as the room cards, and opens the full photo
 *   gallery on click. "Book Now" opens a contact modal (phone/email/WhatsApp)
 *   rather than the hotel's ANLI booking link — these apartments are a
 *   separate operation, booked directly with the team.
 */

"use client";

import { useState } from "react";
import HoverImageCard from "@/components/shared/hover-image-card";
import ApartmentContactModal from "@/components/ikoyi/apartment-contact-modal";

interface ApartmentCardProps {
  name: string;
  tagline: string;
  images: string[];
  price: string;
}

export default function ApartmentCard({ name, tagline, images, price }: ApartmentCardProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white border border-[#E6DED5]/40 hover:shadow-card transition-all duration-300 w-full">
      <HoverImageCard images={images} alt={name} caption="View Gallery" autoCycle />

      <div className="p-6 flex flex-col items-center text-center">
        <h3 className="font-[family-name:var(--font-heading)] text-lg text-dark tracking-[0.08em] uppercase font-light mb-2">
          {name}
        </h3>
        <p className="text-sm text-muted mb-5">{tagline}</p>

        <div className="flex gap-3 w-full justify-center">
          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="flex-1 border border-[#CFA785] hover:bg-[#CFA785] hover:text-black transition-colors duration-300 text-[11px] font-medium uppercase tracking-[0.12em] py-3"
          >
            Book Now
          </button>
          <div className="flex-1 flex items-center justify-center bg-black text-white hover:bg-gold transition-colors duration-300 text-[11px] font-bold uppercase tracking-[0.1em] py-3 cursor-default text-center px-1">
            {price}
          </div>
        </div>
      </div>

      <ApartmentContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        apartmentName={name}
      />
    </div>
  );
}
