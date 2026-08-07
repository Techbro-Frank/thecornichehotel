/**
 * @file LenisProvider — Smooth scroll wrapper
 * @description Initializes the Lenis smooth scroll library with custom easing (exponential
 *   decay) and touch multiplier for mobile. Wraps the app in a fragment — Lenis works by
 *   hijacking the native scroll and interpolating with requestAnimationFrame.
 */

"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Smooth scroll provider — initializes and cleans up Lenis on mount/unmount. */
export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
