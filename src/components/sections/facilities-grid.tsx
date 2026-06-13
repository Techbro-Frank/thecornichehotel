"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Waves,
  Dumbbell,
  Utensils,
  Wine,
  Car,
  Wifi,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";

gsap.registerPlugin(ScrollTrigger);

const facilities = [
  { icon: Utensils, name: "Fine Dining", description: "Award-winning restaurant & private dining" },
  { icon: Wine, name: "Lounge & Bar", description: "Curated cocktails in an elegant atmosphere" },
  { icon: Wifi, name: "High-Speed WiFi", description: "Complimentary fibre connection throughout" },
  { icon: ShieldCheck, name: "24/7 Security", description: "Advanced security & in-room safe" },
  { icon: Sparkles, name: "Spa & Wellness", description: "Signature treatments & relaxation therapies" },
];

export default function FacilitiesGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".facility-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.08,
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
    <section className="section-padding bg-white" id="facilities">
      <div className="container-luxury">
        <SectionHeading
          label="Hotel Facilities"
          title="World-Class Amenities"
          description="Every aspect of your stay has been considered. From wellness to dining, we ensure an experience of uncompromising quality."
        />

        {/* Split Rows: Row 1 has 2 centered cards, Row 2 has 3 centered cards */}
        <div ref={gridRef} className="flex flex-col gap-4 md:gap-6 mt-12 w-full max-w-4xl mx-auto">
          {/* Top Row: 2 Centered Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl mx-auto">
            {facilities.slice(0, 2).map((facility) => {
              const IconComp = facility.icon;
              return (
                <div
                  key={facility.name}
                  className="facility-card group p-6 md:p-8 border border-border bg-beige/50 hover:bg-white hover:shadow-card hover:border-gold/30 transition-all text-center cursor-default w-full"
                  style={{
                    transitionDuration: "var(--duration-normal)",
                    transitionTimingFunction: "var(--ease-luxury)",
                  }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border border-gold/30 text-gold group-hover:bg-gold group-hover:text-dark transition-all"
                       style={{ transitionDuration: "var(--duration-normal)" }}>
                    <IconComp size={20} />
                  </div>
                  <h4 className="text-sm font-medium text-dark tracking-wide mb-1">
                    {facility.name}
                  </h4>
                  <p className="text-[12px] text-muted leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Row: 3 Centered Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full">
            {facilities.slice(2).map((facility) => {
              const IconComp = facility.icon;
              return (
                <div
                  key={facility.name}
                  className="facility-card group p-6 md:p-8 border border-border bg-beige/50 hover:bg-white hover:shadow-card hover:border-gold/30 transition-all text-center cursor-default w-full"
                  style={{
                    transitionDuration: "var(--duration-normal)",
                    transitionTimingFunction: "var(--ease-luxury)",
                  }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border border-gold/30 text-gold group-hover:bg-gold group-hover:text-dark transition-all"
                       style={{ transitionDuration: "var(--duration-normal)" }}>
                    <IconComp size={20} />
                  </div>
                  <h4 className="text-sm font-medium text-dark tracking-wide mb-1">
                    {facility.name}
                  </h4>
                  <p className="text-[12px] text-muted leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
