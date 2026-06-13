"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "@/components/shared/section-heading";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: imageRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Content stagger
      if (contentRef.current) {
        const elements = contentRef.current.children;
        gsap.fromTo(
          elements,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="mt-20 md:mt-28 pt-20 pb-20 md:pt-24 md:pb-28 bg-white" id="about-preview">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mt-6 md:mt-10">
          {/* Image */}
          <div
            ref={imageRef}
            className="relative aspect-[4/5] bg-beige-light overflow-hidden"
          >
            <Image
              src="/images/Luxury Lobby Interior.png"
              alt="The Corniche Hotel Luxury Lobby Interior"
              fill
              className="object-cover transition-transform duration-[1.5s] hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Content */}
          <div ref={contentRef}>
            <SectionHeading
              label="Welcome to The Corniche Hotel"
              title="Best Hotel in Lekki – Affordable Luxury & Comfort"
              align="left"
              className="!mb-6"
            />

            <p className="body-large mb-6">
              Welcome to The Corniche Hotel, your top-rated hotel in Lekki Lagos. Inspired by the elegance of the 1970 Rolls Royce Corniche, we offer a blend of affordable luxury, tasteful décor, and exceptional guest service. Whether you’re on a business trip or a relaxing getaway, enjoy a seamless stay at a boutique hotel in Lekki that feels like home.
            </p>

            <p className="text-muted leading-relaxed mb-8">
              Our rooms are thoughtfully designed, and our location places you close to everything in Lekki. With premium amenities including free Wi-Fi, on-site fine dining, and outstanding hospitality, we are the go-to choice for those seeking a luxury hotel in Lagos, Lekki Phase 1 accommodation,  an hotel with restaurant in lekki, or simply where to stay in Lekki.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { number: "80+", label: "Luxury Rooms" },
                { number: "5★", label: "Service Rating" },
                { number: "24/7", label: "Concierge" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-gold mb-1">
                    {stat.number}
                  </p>
                  <p className="text-[12px] text-muted uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-dark hover:text-gold transition-colors group"
              style={{ transitionDuration: "var(--duration-normal)" }}
            >
              Discover Our Story
              <span className="w-8 h-[1px] bg-gold transition-all group-hover:w-12" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
