/**
 * @file Testimonials — Guest reviews carousel with rating modal
 * @description Dark-themed section with an animated testimonial carousel (Framer Motion).
 *   Features navigation arrows, dot indicators, and a "Rate Us" popup modal where guests
 *   can submit star ratings and written reviews. New reviews are prepended to the
 *   carousel list (client-side only — no backend persistence yet).
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, X } from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";

/** Shape of a single guest testimonial. */
interface TestimonialItem {
  quote: string;
  name: string;
  title: string;
  rating: number;
}

const initialTestimonials: TestimonialItem[] = [
  {
    quote:
      "An extraordinary experience from check-in to check-out. The attention to detail and warmth of the staff made our anniversary truly unforgettable. This is luxury hospitality at its finest.",
    name: "Adewale & Folake Johnson",
    title: "Anniversary Stay",
    rating: 5,
  },
  {
    quote:
      "The Corniche sets a new standard for hotels in Lagos. The Presidential Suite is simply stunning, and the dining experience rivals any I've had across Europe. Impeccable service.",
    name: "Chief Emeka Okafor",
    title: "Business Executive",
    rating: 5,
  },
  {
    quote:
      "We chose The Corniche for our corporate retreat and could not have been more impressed. The facilities are world-class, the food exceptional, and the team went above and beyond.",
    name: "Sarah Olumide-Williams",
    title: "Corporate Retreat",
    rating: 5,
  },
  {
    quote:
      "From the moment our car pulled up, every detail felt considered. Our honeymoon suite overlooked the water beautifully, and the staff remembered our names for the entire stay.",
    name: "Tunde & Chioma Bakare",
    title: "Honeymoon Stay",
    rating: 5,
  },
  {
    quote:
      "I travel for work across three continents, and The Corniche is now my benchmark for what a business hotel should feel like. Fast WiFi, a serene lounge, and staff that anticipate your needs.",
    name: "Dr. Ifeanyi Nwosu",
    title: "Business Executive",
    rating: 5,
  },
  {
    quote:
      "Our family reunion needed a venue that could host twenty people in comfort and style. The Corniche delivered on every front, from the suites to the private dining arrangements.",
    name: "The Adeyemi Family",
    title: "Family Celebration",
    rating: 5,
  },
  {
    quote:
      "As a diplomat hosting visiting delegations, discretion and polish matter enormously. The Corniche's team handled every logistical detail with quiet professionalism.",
    name: "Ambassador Grace Effiong",
    title: "Diplomatic Visit",
    rating: 5,
  },
  {
    quote:
      "Booked a solo staycation to unwind, and left feeling completely restored. The spa treatments were exceptional, and the quiet, elegant atmosphere made all the difference.",
    name: "Ngozi Chukwuemeka",
    title: "Solo Staycation",
    rating: 5,
  },
  {
    quote:
      "We hosted our wedding reception at The Corniche and guests are still talking about it months later. The ballroom, the cuisine, the coordination — flawless from start to finish.",
    name: "Kunle & Amara Adeleke",
    title: "Wedding Celebration",
    rating: 5,
  },
  {
    quote:
      "A three-week stay for a project in Lagos could have felt impersonal, but the team treated me like a long-time resident. Housekeeping, dining, everything stayed consistently excellent.",
    name: "Robert Ashworth",
    title: "Extended Business Stay",
    rating: 5,
  },
];

export default function Testimonials() {
  const [items, setItems] = useState<TestimonialItem[]>(initialTestimonials);
  const [current, setCurrent] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // Form States
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const prev = () =>
    setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newTestimonial: TestimonialItem = {
      quote: comment,
      name,
      title: title || "Verified Guest",
      rating,
    };

    const updatedList = [newTestimonial, ...items];
    setItems(updatedList);
    setCurrent(0); // Show newest immediately
    
    // Reset fields & close
    setName("");
    setTitle("");
    setRating(5);
    setComment("");
    setIsPopupOpen(false);
  };

  return (
    <section className="section-padding bg-gradient-to-br from-[#0F141D] to-[#171E2B] border-b border-[#CFA785]/10" id="testimonials">
      <div className="container-luxury relative">
        <SectionHeading
          label="Guest Experiences"
          title="What Our Guests Say"
          light
        />

        {/* Rate Us Trigger — centered beneath the heading, never collides with it */}
        <div className="flex justify-center -mt-6 mb-4">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="group flex items-center gap-2.5 px-7 py-3 border border-[#CFA785]/40 text-[#CFA785] hover:bg-[#CFA785] hover:text-[#0F141D] transition-all font-medium tracking-[0.15em] text-xs uppercase"
            style={{ transitionDuration: "var(--duration-normal)" }}
          >
            <Star size={13} className="transition-transform group-hover:scale-110" style={{ transitionDuration: "var(--duration-normal)" }} />
            Rate Your Stay
          </button>
        </div>

        <div className="max-w-3xl mx-auto text-center relative mt-12">
          {/* Quote Icon */}
          <div className="flex justify-center mb-8">
            <Quote size={40} className="text-[#CFA785]/30" />
          </div>

          {/* Testimonial */}
          <div className="relative min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: items[current].rating }).map(
                    (_, i) => (
                      <span key={i} className="text-[#CFA785] text-sm">
                        ★
                      </span>
                    )
                  )}
                </div>

                <blockquote className="font-[family-name:var(--font-heading)] text-lg md:text-xl text-white/90 leading-relaxed italic mb-8">
                  &ldquo;{items[current].quote}&rdquo;
                </blockquote>

                <div className="divider-gold mx-auto mb-6" />

                <p className="text-white font-medium tracking-wide">
                  {items[current].name}
                </p>
                <p className="text-white/40 text-sm mt-1">
                  {items[current].title}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-12 h-12 flex items-center justify-center border border-white/20 text-white/60 hover:text-[#CFA785] hover:border-[#CFA785] transition-colors"
              style={{ transitionDuration: "var(--duration-normal)" }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 flex items-center justify-center border border-white/20 text-white/60 hover:text-[#CFA785] hover:border-[#CFA785] transition-colors"
              style={{ transitionDuration: "var(--duration-normal)" }}
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current
                    ? "bg-[#CFA785] w-6"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                style={{ transitionDuration: "var(--duration-normal)" }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Premium Rating Popup Modal */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative my-auto bg-[#171E2B] border border-[#CFA785]/20 max-w-xl w-full p-8 sm:p-10 md:p-12 shadow-2xl z-10 text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsPopupOpen(false)}
                className="absolute right-5 top-5 w-9 h-9 flex items-center justify-center border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-colors"
                style={{ transitionDuration: "var(--duration-normal)" }}
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="text-center mb-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#CFA785] font-medium block mb-3">
                  Share Your Experience
                </span>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-white">
                  Rate The Corniche Hotel
                </h3>
                <div className="flex justify-center mt-5">
                  <div className="divider-gold" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1 to 5 Stars Input */}
                <div className="flex flex-col items-center justify-center py-2">
                  <span className="text-xs text-white/60 mb-3 uppercase tracking-[0.15em]">Your Rating</span>
                  <div className="flex gap-2.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                        style={{ transitionDuration: "var(--duration-fast)" }}
                      >
                        <Star
                          size={32}
                          fill={star <= (hoverRating ?? rating) ? "#CFA785" : "transparent"}
                          className={
                            star <= (hoverRating ?? rating)
                              ? "text-[#CFA785]"
                              : "text-white/20 hover:text-white/50"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Adewale Johnson"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3.5 text-sm focus:outline-none focus:border-[#CFA785] transition-colors"
                      style={{ transitionDuration: "var(--duration-normal)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">
                      Title / Type of Stay
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Business Stay"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3.5 text-sm focus:outline-none focus:border-[#CFA785] transition-colors"
                      style={{ transitionDuration: "var(--duration-normal)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">
                    Your Review *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the service, dining, or suite comfort..."
                    className="w-full bg-white/5 border border-white/10 px-4 py-3.5 text-sm focus:outline-none focus:border-[#CFA785] transition-colors resize-none"
                    style={{ transitionDuration: "var(--duration-normal)" }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#CFA785] hover:bg-[#b89370] text-black py-4 transition-colors font-medium tracking-[0.15em] text-xs uppercase shadow-lg mt-2"
                  style={{ transitionDuration: "var(--duration-normal)" }}
                >
                  Submit Review
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
