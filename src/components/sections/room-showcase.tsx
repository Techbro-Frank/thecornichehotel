"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import SectionHeading from "@/components/shared/section-heading";

interface Room {
  name: string;
  price: string;
  image: string;
}

const showcaseRooms: Room[] = [
  {
    name: "Standard Room",
    price: "From ₦95,000 / Night",
    image: "/images/Standard Room/IMG_8013.jpg",
  },
  {
    name: "Executive Double",
    price: "From ₦125,000 / Night",
    image: "/images/Executive Double /IMG_8938.jpg",
  },
  {
    name: "Signature Executive",
    price: "From ₦140,000 / Night",
    image: "/images/Signature Executive/IMG_0541.jpg",
  },
  {
    name: "Kings Room",
    price: "From ₦150,000 / Night",
    image: "/images/King’s room/IMG_5596.jpg",
  },
  {
    name: "Studio Apartment",
    price: "From ₦160,000 / Night",
    image: "/images/Studio Apartment/IMG_1128.jpg",
  },
  {
    name: "Signature Room",
    price: "From ₦170,000 / Night",
    image: "/images/Signature Room/IMG_4372.jpg",
  },
  {
    name: "Executive Suite",
    price: "From ₦200,000 / Night",
    image: "/images/Executive Suite/IMG_4215.jpg",
  },
  {
    name: "Signature Suite",
    price: "From ₦250,000 / Night",
    image: "/images/Signature Suite/IMG_4400.jpg",
  },
  {
    name: "Presidential Suite",
    price: "From ₦270,000 / Night",
    image: "/images/Presidential Suite/IMG_4500.jpg",
  },
];

function ShowcaseCard({ room }: { room: Room }) {
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
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden aspect-[4/3.2] w-full bg-dark-soft cursor-pointer group"
    >
      <Image
        src={room.image}
        alt={room.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

            {/* Room Name & Price */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="relative z-20 text-center px-4"
            >
              <h3 className="font-[family-name:var(--font-heading)] text-lg md:text-xl lg:text-2xl text-[#F5F1EB] uppercase tracking-[0.2em] leading-snug mb-2">
                {room.name}
              </h3>
              <p className="text-[12px] md:text-xs text-gold uppercase tracking-[0.15em] font-bold">
                {room.price}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoomShowcase() {
  return (
    <section className="section-padding bg-beige-light/30 flex flex-col items-center justify-center w-full" id="room-showcase">
      <div className="max-w-5xl w-full mx-auto px-6 md:px-8 flex flex-col items-center justify-center">
        {/* Siam Hotel Style Classical Stepped-Notch Header Box */}
        <div className="flex flex-col items-center justify-center text-center mb-12 w-full">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-6">
            Visual Gallery
          </span>
          
          {/* Custom SVG Stepped-Notch Double-Border Frame */}
          <div className="relative w-[340px] max-w-full aspect-[340/90] flex items-center justify-center mb-4 px-8">
            <svg
              className="absolute inset-0 w-full h-full text-gold/60"
              viewBox="0 0 340 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              preserveAspectRatio="none"
            >
              {/* Outer Stepped-Notch Border */}
              <path d="M 10 5 L 330 5 L 330 15 L 335 15 L 335 75 L 330 75 L 330 85 L 10 85 L 10 75 L 5 75 L 5 15 L 10 15 Z" />
              {/* Inner Stepped-Notch Border */}
              <path d="M 14 9 L 326 9 L 326 19 L 331 19 L 331 71 L 326 71 L 326 81 L 14 81 L 14 71 L 9 71 L 9 19 L 14 19 Z" />
            </svg>
            <h2 className="relative z-10 font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-dark tracking-[0.18em] uppercase font-light pt-1">
              Rooms & Suites
            </h2>
          </div>

          <div className="mt-6 text-center w-full flex flex-col items-center">
            <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl text-dark tracking-[0.05em] font-normal mb-3">
              The Luxury Showcase
            </h3>
            <p className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed max-w-2xl whitespace-normal md:whitespace-nowrap">
              Explore our meticulously styled accommodation spaces through an editorial lens.
            </p>
          </div>
        </div>

        {/* 3x3 Grid: Centered container with gap-3 for margins/whitespace between cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-12 w-full">
          {showcaseRooms.map((room, index) => (
            <ShowcaseCard key={index} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
}
