"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

interface RoomDetails {
  name: string;
  price: string;
  image: string;
  size: number;
  maxAdults: number;
  maxChildren: number;
}

const detailedRooms: RoomDetails[] = [
  {
    name: "Standard Room",
    price: "From ₦95,000 / Night",
    image: "/images/Standard Room/IMG_8013.jpg",
    size: 15,
    maxAdults: 2,
    maxChildren: 1,
  },
  {
    name: "Executive Double",
    price: "From ₦125,000 / Night",
    image: "/images/Executive Double /IMG_8938.jpg",
    size: 26,
    maxAdults: 2,
    maxChildren: 1,
  },
  {
    name: "Signature Executive",
    price: "From ₦140,000 / Night",
    image: "/images/Signature Executive/IMG_0541.jpg",
    size: 30,
    maxAdults: 2,
    maxChildren: 1,
  },
  {
    name: "Studio Apartment",
    price: "From ₦160,000 / Night",
    image: "/images/Studio Apartment/IMG_1128.jpg",
    size: 45,
    maxAdults: 4,
    maxChildren: 1,
  },
  {
    name: "Presidential Suite",
    price: "From ₦270,000 / Night",
    image: "/images/Presidential Suite/IMG_4500.jpg",
    size: 45,
    maxAdults: 4,
    maxChildren: 1,
  },
  {
    name: "Signature Suite",
    price: "From ₦250,000 / Night",
    image: "/images/Signature Suite/IMG_4400.jpg",
    size: 45,
    maxAdults: 4,
    maxChildren: 1,
  },
  {
    name: "Executive Suite",
    price: "From ₦200,000 / Night",
    image: "/images/Executive Suite/IMG_4215.jpg",
    size: 45,
    maxAdults: 4,
    maxChildren: 1,
  },
  {
    name: "Signature Room",
    price: "From ₦170,000 / Night",
    image: "/images/Signature Room/IMG_4372.jpg",
    size: 45,
    maxAdults: 4,
    maxChildren: 1,
  },
  {
    name: "Kings Room",
    price: "From ₦150,000 / Night",
    image: "/images/King’s room/IMG_5596.jpg",
    size: 45,
    maxAdults: 4,
    maxChildren: 1,
  },
];

function RoomDetailCard({ room }: { room: RoomDetails }) {
  const [hoverDirection, setHoverDirection] = useState<"top" | "right" | "bottom" | "left" | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const normalizedX = x / rect.width;
    const normalizedY = y / rect.height;
    const angle = Math.atan2(normalizedY, normalizedX) * (180 / Math.PI);
    
    let direction: "top" | "right" | "bottom" | "left" = "top";
    if (angle > -45 && angle <= 45) {
      direction = "right";
    } else if (angle > 45 && angle <= 135) {
      direction = "bottom";
    } else if (angle > 135 || angle <= -135) {
      direction = "left";
    } else {
      direction = "top";
    }
    
    setHoverDirection(direction);
    setIsHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const normalizedX = x / rect.width;
    const normalizedY = y / rect.height;
    const angle = Math.atan2(normalizedY, normalizedX) * (180 / Math.PI);
    
    let direction: "top" | "right" | "bottom" | "left" = "top";
    if (angle > -45 && angle <= 45) {
      direction = "right";
    } else if (angle > 45 && angle <= 135) {
      direction = "bottom";
    } else if (angle > 135 || angle <= -135) {
      direction = "left";
    } else {
      direction = "top";
    }
    
    setHoverDirection(direction);
    setIsHovered(false);
  };

  const overlayVariants: Variants = {
    initial: (direction: "top" | "right" | "bottom" | "left") => {
      return {
        x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
        y: direction === "top" ? "-100%" : direction === "bottom" ? "100%" : 0,
        opacity: 0,
      };
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: (direction: "top" | "right" | "bottom" | "left") => {
      return {
        x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
        y: direction === "top" ? "-100%" : direction === "bottom" ? "100%" : 0,
        opacity: 0,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
      };
    },
  };

  const frameVariants: Variants = {
    initial: {
      scale: 0.93,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      scale: 0.93,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="flex flex-col bg-white border border-[#E6DED5]/40 hover:shadow-card transition-all duration-300 w-full mb-8">
      {/* Aspect ratio set larger for double column */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden aspect-[16/10] w-full bg-dark-soft cursor-pointer group"
      >
        <Image
          src={room.image}
          alt={room.name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />

        <AnimatePresence custom={hoverDirection}>
          {isHovered && (
            <motion.div
              custom={hoverDirection}
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 z-10 bg-black/35 flex items-center justify-center p-6"
            >
              {/* Inset Triple-Line gold border */}
              <motion.div
                variants={frameVariants}
                className="absolute inset-[20px] md:inset-[26px] border border-gold/40 p-[2px] pointer-events-none"
              >
                <div className="w-full h-full border border-gold/60 p-[2px]">
                  <div className="w-full h-full border border-gold" />
                </div>
              </motion.div>

              {/* More Details Text Hover Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="relative z-20 text-center px-4"
              >
                <h3 className="font-[family-name:var(--font-heading)] text-lg md:text-xl text-[#F5F1EB] uppercase tracking-[0.25em] font-light">
                  More Details
                </h3>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Section below card */}
      <div className="p-8 flex flex-col items-center text-center">
        <h3 className="font-[family-name:var(--font-heading)] text-2xl text-dark tracking-[0.1em] uppercase font-light mb-4">
          {room.name}
        </h3>

        {/* Room Specs Grid */}
        <div className="flex items-center justify-center gap-12 w-full max-w-sm mb-6 border-t border-b border-[#E6DED5]/60 py-4">
          <div className="flex flex-col items-center">
            <span className="text-sm font-light text-dark">{room.size}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted mt-1">Size m²</span>
          </div>
          <div className="flex flex-col items-center border-l border-r border-[#E6DED5]/60 px-8">
            <span className="text-sm font-light text-dark">{room.maxAdults}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted mt-1">Max Adults</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-light text-dark">{room.maxChildren}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted mt-1">Max Children</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 w-full justify-center">
          <a
            href="/booking"
            className="flex-1 max-w-[200px] border border-[#CFA785] hover:bg-[#CFA785] hover:text-black transition-colors duration-300 text-xs font-medium uppercase tracking-[0.15em] py-3.5"
          >
            Book Now
          </a>
          <div className="flex-1 max-w-[200px] flex items-center justify-center bg-black text-white hover:bg-gold transition-colors duration-300 text-xs font-bold uppercase tracking-[0.15em] py-3.5 cursor-default">
            {room.price}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <>
      {/* Sticky Static Navigation container */}
      <div className="sticky top-0 z-50 bg-white border-b border-border-light w-full">
        <Navbar />
      </div>

      <main className="relative w-full bg-beige pt-8 pb-32 flex flex-col items-center justify-center">
        {/* Full-width screen horizontal lines with centered text */}
        <div className="w-full mb-20 flex flex-col items-center justify-center">
          {/* Top horizontal line running fully edge to edge (100vw) */}
          <div className="w-screen h-[1px] bg-dark/15" />
          
          <div className="py-14 flex items-center justify-center">
            <h1 className="font-[family-name:var(--font-body)] text-3xl md:text-4xl text-dark tracking-[0.25em] uppercase font-light text-center">
              Rooms & Suites
            </h1>
          </div>

          {/* Bottom horizontal line running fully edge to edge (100vw) */}
          <div className="w-screen h-[1px] bg-dark/15" />
        </div>

        {/* Center-aligned Cards Container with spacing */}
        <div className="max-w-6xl w-full mx-auto px-6 md:px-12 flex flex-col items-center justify-center">
          {/* 2 Column Grid for Larger Cards with generous gap spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 w-full mt-4 mb-24 justify-items-center">
            {detailedRooms.map((room, index) => (
              <RoomDetailCard key={index} room={room} />
            ))}
          </div>

          {/* Styled Share Button Block at the bottom */}
          <div className="flex items-center justify-center w-full mt-16 max-w-4xl">
            <div className="flex-1 h-[1px] bg-dark/10" />
            
            <div className="relative mx-8">
              {/* Classical notched border box for Share Button */}
              <div className="relative px-12 py-3.5 flex items-center justify-center cursor-pointer group">
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
                <span className="relative z-10 text-[11px] font-medium tracking-[0.3em] uppercase text-dark group-hover:text-gold transition-colors duration-300">
                  Share
                </span>
              </div>
            </div>

            <div className="flex-1 h-[1px] bg-dark/10" />
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
