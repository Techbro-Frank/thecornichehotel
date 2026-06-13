"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SectionHeading from "@/components/shared/section-heading";

gsap.registerPlugin(ScrollTrigger);

const galleryItems = [
  { label: "Hotel Lobby", aspect: "aspect-[4/5]" },
  { label: "Executive Suite", aspect: "aspect-square" },
  { label: "Pool & Terrace", aspect: "aspect-[4/3]" },
  { label: "Restaurant", aspect: "aspect-square" },
  { label: "Presidential Suite", aspect: "aspect-[4/5]" },
  { label: "Spa & Wellness", aspect: "aspect-[4/3]" },
];

export default function GalleryPreview() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section-padding bg-beige" id="gallery-preview">
      <div className="container-luxury">
        <SectionHeading
          label="Photo Gallery"
          title="Explore The Corniche"
          description="A visual journey through our spaces, designed to inspire and captivate."
        />

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        >
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className={`gallery-item ${item.aspect} relative overflow-hidden bg-beige-light group cursor-pointer`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-beige-light to-border flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-110">
                <p className="text-sm text-muted">{item.label}</p>
              </div>
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors duration-500" />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.15em] text-dark hover:text-gold transition-colors group"
            style={{ transitionDuration: "var(--duration-normal)" }}
          >
            View Full Gallery
            <span className="w-8 h-[1px] bg-gold transition-all group-hover:w-12" />
          </Link>
        </div>
      </div>
    </section>
  );
}
