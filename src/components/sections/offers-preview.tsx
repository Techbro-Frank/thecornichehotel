"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Tag } from "lucide-react";
import Link from "next/link";
import SectionHeading from "@/components/shared/section-heading";

const offers = [
  {
    title: "Weekend Escape Package",
    description: "Two nights in a Deluxe Room with complimentary breakfast, spa access, and late checkout.",
    discount: "25% Off",
    validUntil: "Valid until Dec 2026",
    slug: "weekend-escape",
  },
  {
    title: "Honeymoon Suite Special",
    description: "A romantic stay in the Executive Suite with champagne, rose petal turndown, and couples spa.",
    discount: "30% Off",
    validUntil: "Valid until Mar 2027",
    slug: "honeymoon-special",
  },
  {
    title: "Business Traveller Rate",
    description: "Executive Room with airport transfer, express laundry, and access to the business lounge.",
    discount: "15% Off",
    validUntil: "Ongoing",
    slug: "business-rate",
  },
];

export default function OffersPreview() {
  return (
    <section className="section-padding bg-white" id="special-offers">
      <div className="container-luxury">
        <SectionHeading
          label="Special Offers"
          title="Exclusive Packages"
          description="Indulge in our curated hotel packages designed to elevate every aspect of your stay."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.slug}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.15,
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="group border border-border hover:border-gold/40 hover:shadow-card p-7 md:p-8 transition-all"
              style={{
                transitionDuration: "var(--duration-normal)",
                transitionTimingFunction: "var(--ease-luxury)",
              }}
            >
              {/* Discount Badge */}
              <div className="inline-flex items-center gap-1.5 bg-gold/10 text-gold px-3 py-1.5 mb-5">
                <Tag size={13} />
                <span className="text-[12px] font-medium tracking-wider uppercase">
                  {offer.discount}
                </span>
              </div>

              <h3 className="heading-3 mb-3">{offer.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-5">
                {offer.description}
              </p>

              <div className="flex items-center gap-1.5 text-[12px] text-muted mb-6">
                <Clock size={13} className="text-gold" />
                {offer.validUntil}
              </div>

              <Link
                href={`/offers#${offer.slug}`}
                className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.15em] text-gold group-hover:gap-3 transition-all"
                style={{ transitionDuration: "var(--duration-normal)" }}
              >
                Learn More
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
