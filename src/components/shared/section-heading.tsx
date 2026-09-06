/**
 * @file SectionHeading — Reusable animated section header component
 * @description Renders a consistent label + title + optional description pattern used
 *   across all major sections. Supports left/center alignment and light (dark bg) /
 *   dark (light bg) color themes. Child elements animate in via GSAP ScrollTrigger
 *   with staggered fade-up on first scroll into viewport.
 */

"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/** Props for the SectionHeading component. */
interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  label,
  title,
  description,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = containerRef.current?.children;
      if (!elements) return;

      gsap.fromTo(
        elements,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "mb-8 md:mb-10",
        align === "center" && "text-center",
        className
      )}
    >
      {label && (
        <p
          className={cn(
            "label-uppercase mb-4",
            light ? "!text-gold-light" : "!text-gold"
          )}
        >
          {label}
        </p>
      )}

      <h2
        className={cn(
          "heading-2",
          light ? "text-white" : "text-dark"
        )}
      >
        {title}
      </h2>

      {align === "center" && (
        <div className="flex justify-center mt-5">
          <div className="divider-gold" />
        </div>
      )}

      {description && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-relaxed",
            align === "center" && "mx-auto",
            light ? "text-white/60" : "text-muted"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
