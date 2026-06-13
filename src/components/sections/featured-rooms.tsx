"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight, Bed, Maximize, Users } from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const rooms = [
  {
    name: "Deluxe Room",
    slug: "deluxe-room",
    price: "85,000",
    size: "35m²",
    guests: 2,
    bed: "King",
    description:
      "Elegant comfort with panoramic views of the Lekki skyline and premium amenities.",
  },
  {
    name: "Executive Suite",
    slug: "executive-suite",
    price: "150,000",
    size: "55m²",
    guests: 3,
    bed: "King",
    description:
      "Spacious luxury with a separate living area, premium bath, and personalized service.",
  },
  {
    name: "Presidential Suite",
    slug: "presidential-suite",
    price: "350,000",
    size: "120m²",
    guests: 4,
    bed: "King",
    description:
      "The pinnacle of opulence featuring a private terrace, dining room, and butler service.",
  },
];

export default function FeaturedRooms() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".room-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-beige" id="featured-rooms">
      <div className="container-luxury">
        <SectionHeading
          label="Accommodation"
          title="Rooms & Suites"
          description="Each space has been thoughtfully designed to offer the perfect blend of luxury, comfort, and modern sophistication."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {rooms.map((room) => (
            <motion.div
              key={room.slug}
              className="room-card group cursor-pointer"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link href={`/rooms/${room.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-beige-light mb-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-beige-light to-border flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105">
                    <div className="text-center">
                      <p className="label-uppercase !text-bronze mb-1">
                        Room Photo
                      </p>
                      <p className="text-sm text-muted">{room.name}</p>
                    </div>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2">
                    <p className="text-[11px] text-muted uppercase tracking-wider">
                      From
                    </p>
                    <p className="font-[family-name:var(--font-heading)] text-lg text-dark">
                      ₦{room.price}
                    </p>
                    <p className="text-[10px] text-muted">/ night</p>
                  </div>
                </div>

                {/* Content */}
                <h3 className="heading-3 mb-2 group-hover:text-gold transition-colors"
                    style={{ transitionDuration: "var(--duration-normal)" }}>
                  {room.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  {room.description}
                </p>

                {/* Room Details */}
                <div className="flex items-center gap-5 text-[12px] text-muted mb-4">
                  <span className="flex items-center gap-1.5">
                    <Maximize size={13} className="text-gold" />
                    {room.size}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={13} className="text-gold" />
                    {room.guests} Guests
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bed size={13} className="text-gold" />
                    {room.bed}
                  </span>
                </div>

                {/* CTA */}
                <span className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.15em] text-gold group-hover:gap-3 transition-all"
                      style={{ transitionDuration: "var(--duration-normal)" }}>
                  View Details
                  <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Rooms */}
        <div className="text-center mt-12">
          <Link
            href="/rooms"
            className="btn-primary"
          >
            <span>View All Rooms & Suites</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
