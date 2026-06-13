"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";

export default function VirtualTourPreview() {
  return (
    <section className="relative overflow-hidden" id="virtual-tour-preview">
      <div className="relative h-[50vh] md:h-[60vh] bg-dark flex items-center justify-center">
        {/* Background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-soft via-dark to-dark-soft opacity-90" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 text-center px-6"
        >
          <p className="label-uppercase !text-gold mb-4">Immersive Experience</p>
          <h2 className="heading-1 text-white mb-6">
            Take a Virtual Tour
          </h2>
          <p className="text-white/50 max-w-lg mx-auto mb-10">
            Explore our hotel from the comfort of your home. Walk through our
            rooms, restaurants, and facilities in an immersive 360° experience.
          </p>

          {/* Play Button */}
          <Link
            href="/virtual-tour"
            className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-gold/50 text-gold hover:bg-gold hover:text-dark transition-all group"
            style={{
              transitionDuration: "var(--duration-normal)",
              transitionTimingFunction: "var(--ease-luxury)",
            }}
          >
            <Play
              size={28}
              className="ml-1 transition-transform group-hover:scale-110"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
