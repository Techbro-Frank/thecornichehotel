// ─── Brand ───────────────────────────────────────────────
export const BRAND = {
  name: "The Corniche Hotel",
  tagline: "Luxury Redefined in Lekki",
  address: "2 Olaitan Senbanjo Street, Lekki Phase 1, Lagos, Nigeria",
  /** General line — rooms, reservations, and everything not dining-specific. */
  phone: "+234 903 460 0000",
  /** Restaurant line — The Corniche Bistro only. */
  restaurantPhone: "+234 903 470 0000",
  email: "cornichehotelng@gmail.com",
  website: "https://thecornichehotel.com",
  /** Live ANLI PMS booking link — every "Book Now" CTA site-wide points here. */
  bookingUrl: "https://www.weareanli.com/corniche-hotel/8/booking",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Rooms & Suites", href: "/rooms" },
  { label: "The Corniche Bistro", href: "/dining" },
  { label: "Ikoyi Apartments", href: "/ikoyi-apartments" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const CHECK_IN_TIME = "2:00 PM";
export const CHECK_OUT_TIME = "12:00 Noon";

// ─── Room Types ──────────────────────────────────────────
export const ROOM_TYPES = [
  "Standard Room",
  "Deluxe Room",
  "Executive Room",
  "Junior Suite",
  "Executive Suite",
  "Presidential Suite",
] as const;

// ─── Social Links ────────────────────────────────────────
// Instagram is their primary channel — the hotel and the Bistro each run their
// own account, and both should be reachable from the footer on every page.
// Facebook is the only other real profile. No Twitter/X or LinkedIn presence.
export const HOTEL_INSTAGRAM_URL = "https://www.instagram.com/thecornichehotel/?hl=en";
export const BISTRO_INSTAGRAM_URL = "https://www.instagram.com/thecornichebistro/?hl=en";

export const SOCIAL_LINKS = [
  { label: "Instagram — Hotel", href: HOTEL_INSTAGRAM_URL, icon: "instagram" },
  { label: "Instagram — Bistro", href: BISTRO_INSTAGRAM_URL, icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/p/The-Corniche-Hotel-100064103440689/", icon: "facebook" },
] as const;

// ─── Animation Defaults ─────────────────────────────────
export const ANIMATION = {
  ease: [0.25, 0.46, 0.45, 0.94] as const, // ease-out-quad
  easeIn: [0.55, 0.085, 0.68, 0.53] as const,
  easeOut: [0.25, 0.46, 0.45, 0.94] as const,
  easeInOut: [0.645, 0.045, 0.355, 1] as const, // cubic-bezier
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 0.9,
    slower: 1.2,
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },
} as const;
