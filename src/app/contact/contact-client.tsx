/**
 * @file Contact Us Page — Reservations, message form, and location
 * @description Compact single-section contact page: brand intro, a contact
 *   form (client-side only — no backend yet), reservation phone/email, and
 *   the hotel's address with a Google Maps link, alongside a exterior photo.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import SectionHeading from "@/components/shared/section-heading";
import { BRAND } from "@/lib/constants";

const CONTACT_IMAGE = "/images/View Photos/image copy 11.png";

const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BRAND.name}, ${BRAND.address}`
)}`;

export default function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <main className="relative w-full bg-beige pt-24 md:pt-28 pb-16 md:pb-20">
        <div className="container-luxury">
          <SectionHeading
            label="The Corniche Hotel"
            title="Top Rated Hotel in Lekki Phase 1 — An Authentic Spirit, A Unique Experience"
            className="max-w-3xl mx-auto"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-4 items-start">
            {/* Contact + Form */}
            <div>
              <p className="label-uppercase mb-4">Contact</p>
              <a
                href={`tel:${BRAND.phone}`}
                className="inline-flex flex-wrap items-baseline gap-x-2 text-dark hover:text-gold transition-colors mb-4"
                style={{ transitionDuration: "var(--duration-fast)" }}
              >
                <span className="text-base text-muted">Reservations:</span>
                <span className="text-lg md:text-xl font-[family-name:var(--font-heading)] whitespace-nowrap">
                  {BRAND.phone}
                </span>
              </a>
              <p className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed mb-8">
                Let&rsquo;s help you plan the perfect stay or dining
                experience at our top rated hotel in Lekki, Lagos.
              </p>

              {isSubmitted ? (
                <div className="border border-gold/40 bg-white p-8 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center border border-gold/40 text-gold">
                    <Check size={20} />
                  </div>
                  <h3 className="text-dark font-medium">Message Sent</h3>
                  <p className="text-sm text-muted">
                    Thank you, {name.split(" ")[0]}. Our team will be in
                    touch with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted mb-1.5 font-medium">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-white border border-border px-4 py-3.5 text-sm text-dark focus:outline-none focus:border-gold transition-colors"
                      style={{ transitionDuration: "var(--duration-fast)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted mb-1.5 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-border px-4 py-3.5 text-sm text-dark focus:outline-none focus:border-gold transition-colors"
                      style={{ transitionDuration: "var(--duration-fast)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted mb-1.5 font-medium">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can help..."
                      className="w-full bg-white border border-border px-4 py-3.5 text-sm text-dark focus:outline-none focus:border-gold transition-colors resize-none"
                      style={{ transitionDuration: "var(--duration-fast)" }}
                    />
                  </div>
                  <button type="submit" className="btn-primary group">
                    <span className="flex items-center gap-2">
                      Send
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* Location */}
            <div>
              <p className="label-uppercase mb-4">Location</p>
              <h3 className="font-[family-name:var(--font-heading)] text-xl text-dark mb-2">
                {BRAND.name}
              </h3>
              <p className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed mb-2 flex gap-2">
                <MapPin size={18} className="text-gold flex-shrink-0 mt-0.5" />
                <span>{BRAND.address}</span>
              </p>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-dark hover:text-gold transition-colors group mb-6"
                style={{ transitionDuration: "var(--duration-normal)" }}
              >
                View in Google Maps
                <span className="w-8 h-[1px] bg-gold transition-all group-hover:w-12" />
              </a>

              <div className="relative aspect-[4/3] w-full bg-beige-light overflow-hidden mb-6">
                <Image
                  src={CONTACT_IMAGE}
                  alt="The Corniche Hotel entrance"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="space-y-3 border-t border-border pt-6">
                <a
                  href={`tel:${BRAND.phone}`}
                  className="flex items-center gap-3 text-sm text-dark-soft/80 hover:text-gold transition-colors"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  <Phone size={16} className="text-gold flex-shrink-0" />
                  {BRAND.phone}
                </a>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex items-center gap-3 text-sm text-dark-soft/80 hover:text-gold transition-colors"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  <Mail size={16} className="text-gold flex-shrink-0" />
                  {BRAND.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
