"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // If on /rooms page, keep it permanently visible and styled from mount
    const isRoomsPage = window.location.pathname.startsWith("/rooms");
    if (isRoomsPage) {
      setIsVisible(true);
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 150);
      setIsScrolled(scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Call handler once on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-soft py-3 border-b border-border-light text-dark"
            : "bg-transparent py-5"
        )}
        style={{
          transitionTimingFunction: "var(--ease-luxury)",
        }}
      >
        <div className="container-luxury flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 block">
            <Image
              src="/images/Corniche-Logo.png"
              alt="The Corniche Hotel"
              width={180}
              height={50}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-[13px] font-medium tracking-[0.1em] uppercase transition-colors group",
                  isScrolled
                    ? "text-dark hover:text-gold"
                    : "text-white/90 hover:text-white"
                )}
                style={{ transitionDuration: "var(--duration-fast)" }}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-[1px] w-0 transition-all group-hover:w-full",
                    isScrolled ? "bg-gold" : "bg-white"
                  )}
                  style={{
                    transitionDuration: "var(--duration-normal)",
                    transitionTimingFunction: "var(--ease-luxury)",
                  }}
                />
              </Link>
            ))}
          </nav>

          {/* Book Now CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/booking"
              className={cn(
                "hidden sm:inline-flex items-center px-6 py-2.5 text-[12px] font-medium tracking-[0.15em] uppercase transition-all",
                isScrolled
                  ? "bg-gold text-dark hover:bg-bronze"
                  : "bg-white/15 text-white border border-white/30 hover:bg-white/25"
              )}
              style={{
                transitionDuration: "var(--duration-normal)",
                transitionTimingFunction: "var(--ease-luxury)",
              }}
            >
              Book Now
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "lg:hidden relative z-[60] p-2 transition-colors",
                isMobileMenuOpen
                  ? "text-white"
                  : isScrolled
                    ? "text-dark"
                    : "text-white"
              )}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[55] bg-dark"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-white/90 hover:text-gold tracking-[0.08em] uppercase transition-colors"
                    style={{ transitionDuration: "var(--duration-fast)" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: NAV_LINKS.length * 0.08,
                  duration: 0.5,
                }}
                className="mt-4"
              >
                <Link
                  href="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary"
                >
                  <span>Book Your Stay</span>
                </Link>
              </motion.div>

              {/* Decorative Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="divider-gold-wide mt-6"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed 'Contact Us' Right Side Button */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <Link
          href="/contact"
          className="block bg-black text-[#F5F1EB] hover:bg-[#CFA785] hover:text-black border-l border-t border-b border-gold/30 px-4 py-8 uppercase tracking-[0.25em] text-[12px] font-semibold transition-all duration-300 shadow-lg [writing-mode:vertical-lr]"
          style={{
            letterSpacing: "0.25em",
            boxShadow: "-6px 6px 24px rgba(0, 0, 0, 0.2)"
          }}
        >
          Contact Us
        </Link>
      </div>
    </>
  );
}
