"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";

const labelText = "The Corniche Hotel";
const headlineText = "Experience Refined Luxury in Lekki";
const subheadingText = "Luxury accommodation, exceptional dining, and unforgettable hospitality.";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const [displayedLabel, setDisplayedLabel] = useState("");
  const [displayedHeadline, setDisplayedHeadline] = useState("");
  const [displayedSubheading, setDisplayedSubheading] = useState("");
  const [activeCursor, setActiveCursor] = useState<"label" | "headline" | "subheading" | null>("label");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const typeLabel = (index: number) => {
      if (index <= labelText.length) {
        setDisplayedLabel(labelText.substring(0, index));
        timer = setTimeout(() => typeLabel(index + 1), 40);
      } else {
        setActiveCursor("headline");
        timer = setTimeout(() => typeHeadline(0), 300);
      }
    };

    const typeHeadline = (index: number) => {
      if (index <= headlineText.length) {
        setDisplayedHeadline(headlineText.substring(0, index));
        timer = setTimeout(() => typeHeadline(index + 1), 50);
      } else {
        setActiveCursor("subheading");
        timer = setTimeout(() => typeSubheading(0), 300);
      }
    };

    const typeSubheading = (index: number) => {
      if (index <= subheadingText.length) {
        setDisplayedSubheading(subheadingText.substring(0, index));
        timer = setTimeout(() => typeSubheading(index + 1), 25);
      } else {
        setActiveCursor(null);
        setIsTypingComplete(true);
      }
    };

    timer = setTimeout(() => typeLabel(0), 600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isTypingComplete) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      if (dividerRef.current) {
        tl.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power2.inOut" }
        );
      }

      if (ctaRef.current) {
        const buttons = ctaRef.current.children;
        tl.fromTo(
          buttons,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
          },
          "-=0.4"
        );
      }

      if (scrollIndicatorRef.current) {
        tl.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.2"
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isTypingComplete]);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden"
      id="hero"
    >
      {/* Video Background — NO overlays, NO gradients, NO tint */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/corniche-hero.MOV" type="video/quicktime" />
          <source src="/videos/corniche-hero.MOV" type="video/mp4" />
        </video>
      </div>

      {/* Subtle bottom gradient ONLY for text legibility — almost invisible */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
          {/* Label */}
          <p className="label-uppercase !text-white/80 mb-6 tracking-[0.3em] min-h-[24px] text-center w-full">
            {displayedLabel}
            {activeCursor === "label" && (
              <span className="inline-block w-[2px] h-[1.1em] bg-gold ml-1 animate-[pulse_0.8s_infinite] align-middle" />
            )}
          </p>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="font-[family-name:var(--font-heading)] text-white leading-[1.15] tracking-[0.04em] uppercase min-h-[140px] md:min-h-[180px] text-center block w-full"
            style={{ fontSize: "var(--text-display)" }}
          >
            {displayedHeadline}
            {activeCursor === "headline" && (
              <span className="inline-block w-[3px] h-[0.9em] bg-gold ml-2 animate-[pulse_0.8s_infinite] align-middle" />
            )}
          </h1>

          {/* Divider */}
          <div className="flex justify-center my-6 md:my-8 min-h-[1px] w-full">
            <div
              ref={dividerRef}
              className={`w-[80px] h-[1px] bg-gold origin-center transition-all duration-700 ${
                isTypingComplete ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
              }`}
            />
          </div>

          {/* Subheading */}
          <p
            ref={subheadingRef}
            className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed tracking-wide min-h-[60px] text-center w-full"
          >
            {displayedSubheading}
            {activeCursor === "subheading" && (
              <span className="inline-block w-[2px] h-[1.1em] bg-gold ml-1 animate-[pulse_0.8s_infinite] align-middle" />
            )}
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 md:mt-12 transition-opacity duration-1000 ${
              isTypingComplete ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Link href="/booking" className="btn-primary">
              <span>Book Your Stay</span>
            </Link>
            <Link 
              href="/rooms" 
              className="btn-outline border-white/30 hover:border-gold hover:text-gold hover:bg-gold/5 relative overflow-hidden group/btn transition-colors duration-300"
            >
              <span className="relative z-10">Explore Rooms</span>
              <span className="absolute inset-0 bg-gold/5 transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover/btn:scale-x-100" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer transition-opacity duration-1000 ${
            isTypingComplete ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
          }}
          role="button"
          tabIndex={0}
          aria-label="Scroll down"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
            }
          }}
        >
          <span className="text-[10px] text-white/50 tracking-[0.3em] uppercase">
            Scroll
          </span>
          <ChevronDown size={18} className="text-white/50 scroll-indicator" />
        </div>
      </div>
    </section>
  );
}
