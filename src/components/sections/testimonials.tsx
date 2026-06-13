"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";

const testimonials = [
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
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="section-padding bg-dark" id="testimonials">
      <div className="container-luxury">
        <SectionHeading
          label="Guest Experiences"
          title="What Our Guests Say"
          light
        />

        <div className="max-w-3xl mx-auto text-center relative">
          {/* Quote Icon */}
          <div className="flex justify-center mb-8">
            <Quote size={40} className="text-gold/30" />
          </div>

          {/* Testimonial */}
          <div className="relative min-h-[200px] flex items-center justify-center">
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
                  {Array.from({ length: testimonials[current].rating }).map(
                    (_, i) => (
                      <span key={i} className="text-gold text-sm">
                        ★
                      </span>
                    )
                  )}
                </div>

                <blockquote className="font-[family-name:var(--font-heading)] text-lg md:text-xl text-white/90 leading-relaxed italic mb-8">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                <div className="divider-gold mx-auto mb-6" />

                <p className="text-white font-medium tracking-wide">
                  {testimonials[current].name}
                </p>
                <p className="text-white/40 text-sm mt-1">
                  {testimonials[current].title}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-12 h-12 flex items-center justify-center border border-white/20 text-white/60 hover:text-gold hover:border-gold transition-colors"
              style={{ transitionDuration: "var(--duration-normal)" }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 flex items-center justify-center border border-white/20 text-white/60 hover:text-gold hover:border-gold transition-colors"
              style={{ transitionDuration: "var(--duration-normal)" }}
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current
                    ? "bg-gold w-6"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                style={{ transitionDuration: "var(--duration-normal)" }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
