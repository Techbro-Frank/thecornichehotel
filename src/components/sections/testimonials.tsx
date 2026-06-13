"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Plus, Star, X } from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";

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

        {/* Floating Rate Us Trigger */}
        <div className="absolute right-6 top-6 md:right-8 md:top-8">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#CFA785] text-black hover:bg-[#b89370] transition-colors font-medium tracking-wide text-xs uppercase shadow-lg"
          >
            <Plus size={14} />
            Rate Us
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
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-[#171E2B] border border-[#CFA785]/20 max-w-lg w-full p-6 md:p-8 shadow-2xl z-10 text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsPopupOpen(false)}
                className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#CFA785] font-medium block mb-2">
                  Share Your Experience
                </span>
                <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl text-white">
                  Rate The Corniche Hotel
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1 to 5 Stars Input */}
                <div className="flex flex-col items-center justify-center py-2">
                  <span className="text-xs text-white/60 mb-2 uppercase tracking-[0.1em]">Your Rating</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-2xl transition-colors focus:outline-none"
                      >
                        <Star
                          size={28}
                          fill={star <= (hoverRating ?? rating) ? "#CFA785" : "transparent"}
                          className={
                            star <= (hoverRating ?? rating)
                              ? "text-[#CFA785]"
                              : "text-white/20 hover:text-white"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Adewale Johnson"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[#CFA785] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5 font-medium">
                      Title / Type of Stay
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Business Stay"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[#CFA785] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5 font-medium">
                    Your Review *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the service, dining, or suite comfort..."
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[#CFA785] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#CFA785] hover:bg-[#b89370] text-black py-4 transition-colors font-medium tracking-[0.15em] text-xs uppercase shadow-lg mt-2"
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
