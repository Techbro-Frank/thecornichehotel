/**
 * @file Rooms & Suites Page — Interactive client component
 * @description Renders the full room grid with a staggered entrance animation
 *   on first load (banner, intro, then cards cascading in), the shared
 *   direction-aware hover image (with click-to-open full photo gallery), room
 *   specs, pricing, and a "Share" button with notched SVG border.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import RoomCard from "@/components/rooms/room-card";
import type { RoomDetails } from "@/lib/rooms-data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function RoomsClient({ rooms }: { rooms: RoomDetails[] }) {
  const [shareLabel, setShareLabel] = useState("Share");

  const handleShare = async () => {
    const shareData = {
      title: "The Corniche Hotel — Rooms & Suites",
      text: "Explore rooms and suites at The Corniche Hotel, Lekki.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled the share sheet — no action needed
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareLabel("Link Copied");
      setTimeout(() => setShareLabel("Share"), 2000);
    } catch {
      setShareLabel("Copy Failed");
      setTimeout(() => setShareLabel("Share"), 2000);
    }
  };

  return (
    <>
      <Navbar />

      <main className="relative w-full bg-beige pt-24 md:pt-28 pb-16 flex flex-col items-center justify-center">
        {/* Full-width screen horizontal lines with centered text */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="w-full mb-10 flex flex-col items-center justify-center"
        >
          {/* Top horizontal line running fully edge to edge (100vw) */}
          <div className="w-screen h-[1px] bg-dark/15" />

          <div className="py-8 flex items-center justify-center">
            <h1 className="font-[family-name:var(--font-body)] text-3xl md:text-4xl text-dark tracking-[0.25em] uppercase font-light text-center">
              Rooms & Suites
            </h1>
          </div>

          {/* Bottom horizontal line running fully edge to edge (100vw) */}
          <div className="w-screen h-[1px] bg-dark/15" />
        </motion.div>

        {/* Center-aligned Cards Container with spacing */}
        <div className="max-w-6xl w-full mx-auto px-6 md:px-12 flex flex-col items-center justify-center">
          {/* Intro copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.15 }}
            className="max-w-2xl w-full text-center mb-10"
          >
            <p className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed">
              Explore our meticulously styled accommodation spaces through an
              editorial lens — the definitive answer to where to stay in
              Lekki and Ikoyi.
            </p>
          </motion.div>

          {/* 3 Column Grid, evenly spaced, staggered entrance */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full justify-items-center"
          >
            {rooms.map((room) => (
              <RoomCard key={room.name} room={room} />
            ))}
          </motion.div>

          {/* Closing statement */}
          <div className="max-w-2xl w-full text-center mt-14">
            <div className="flex justify-center mb-6">
              <div className="divider-gold" />
            </div>
            <p className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed">
              The Corniche Hotel is much more than comfort — it&rsquo;s the
              best hotel in Lekki for those seeking an authentic spirit,
              boutique elegance, and a unique luxury experience in Lekki
              Phase 1. Our Park View Ikoyi apartments may also suit you if
              you&rsquo;re based in that location.
            </p>
          </div>

          {/* Styled Share Button Block at the bottom */}
          <div className="flex items-center justify-center w-full mt-10 max-w-4xl">
            <div className="flex-1 h-[1px] bg-dark/10" />

            <div className="relative mx-8">
              {/* Classical notched border box for Share Button */}
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share this page"
                className="relative px-12 py-3.5 flex items-center justify-center cursor-pointer group"
              >
                <svg
                  className="absolute inset-0 w-full h-full text-dark/30 group-hover:text-gold transition-colors duration-300"
                  viewBox="0 0 160 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  preserveAspectRatio="none"
                >
                  <path d="M 6 4 L 154 4 L 154 10 L 157 10 L 157 38 L 154 38 L 154 44 L 6 44 L 6 38 L 3 38 L 3 10 L 6 10 Z" />
                </svg>
                <span className="relative z-10 text-[11px] font-medium tracking-[0.3em] uppercase text-dark group-hover:text-gold transition-colors duration-300 whitespace-nowrap">
                  {shareLabel}
                </span>
              </button>
            </div>

            <div className="flex-1 h-[1px] bg-dark/10" />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
