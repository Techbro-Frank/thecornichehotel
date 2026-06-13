"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { BRAND, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

/* Inline SVG social icons — Lucide removed brand icons */
function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function IconFacebook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconTwitter({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}
function IconLinkedin({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  twitter: IconTwitter,
  linkedin: IconLinkedin,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-luxury py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="label-uppercase !text-gold mb-4">Stay Connected</p>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-white tracking-wide">
                Subscribe to Our Newsletter
              </h3>
              <p className="mt-3 text-white/50 max-w-md">
                Receive exclusive offers, event invitations, and insider access
                to The Corniche experience.
              </p>
            </div>

            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/5 border border-white/15 px-5 py-3.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-gold transition-colors"
                style={{ transitionDuration: "var(--duration-normal)" }}
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="btn-primary !py-3.5 flex-shrink-0 group"
              >
                <span className="flex items-center gap-2">
                  Subscribe
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container-luxury py-16 md:py-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-[family-name:var(--font-heading)] text-xl tracking-[0.15em] uppercase text-white">
                The Corniche
              </span>
              <br />
              <span className="text-[10px] tracking-[0.35em] uppercase text-white/50">
                Hotel &mdash; Lekki
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              {BRAND.tagline}. Where every moment is crafted with care and every
              stay becomes a cherished memory.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border border-white/15 text-white/60 hover:text-gold hover:border-gold transition-colors"
                    style={{ transitionDuration: "var(--duration-normal)" }}
                    aria-label={social.label}
                  >
                    {Icon && <Icon size={16} />}
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[12px] font-medium tracking-[0.2em] uppercase text-gold mb-6">
              Explore
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                    style={{ transitionDuration: "var(--duration-fast)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/virtual-tour"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  Virtual Tour
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[12px] font-medium tracking-[0.2em] uppercase text-gold mb-6">
              Information
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  Book a Room
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[12px] font-medium tracking-[0.2em] uppercase text-gold mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-white/50">
                <MapPin size={16} className="text-gold flex-shrink-0 mt-0.5" />
                <span>{BRAND.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${BRAND.phone}`}
                  className="flex gap-3 text-sm text-white/50 hover:text-white transition-colors"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  <Phone size={16} className="text-gold flex-shrink-0 mt-0.5" />
                  <span>{BRAND.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex gap-3 text-sm text-white/50 hover:text-white transition-colors"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  <Mail size={16} className="text-gold flex-shrink-0 mt-0.5" />
                  <span>{BRAND.email}</span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-luxury py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/30 tracking-wide">
            &copy; {new Date().getFullYear()} The Corniche Hotel. All rights
            reserved.
          </p>
          <p className="text-[12px] text-white/30 tracking-wide">
            Designed with elegance in Lagos, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
