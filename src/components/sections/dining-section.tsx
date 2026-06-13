"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function DiningSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax image
      gsap.to(".dining-image", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Content reveal
      gsap.fromTo(
        ".dining-content",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".dining-content",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" id="dining">
      {/* Full-width Image with Parallax */}
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <div className="dining-image absolute inset-0 scale-110 bg-gradient-to-br from-dark-soft to-dark flex items-center justify-center">
          <div className="text-center">
            <p className="label-uppercase !text-gold-light mb-2">Restaurant Photo</p>
            <p className="text-sm text-white/40">Fine Dining Experience</p>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="dining-content w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-40 pb-16 md:pb-20">
            <div className="container-luxury">
              <div className="max-w-2xl">
                <p className="label-uppercase !text-gold mb-4">
                  Culinary Excellence
                </p>
                <h2 className="heading-1 text-white mb-5">
                  A Dining Experience Like No Other
                </h2>
                <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                  From signature Nigerian flavours to international cuisine, our
                  restaurant and bistro offer an unforgettable culinary journey
                  curated by world-class chefs.
                </p>
                <Link
                  href="/dining"
                  className="btn-outline"
                >
                  Explore Our Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
