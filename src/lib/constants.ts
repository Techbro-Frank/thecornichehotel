// ─── Brand ───────────────────────────────────────────────
export const BRAND = {
  name: "The Corniche Hotel",
  tagline: "Luxury Redefined in Lekki",
  address: "Lekki, Lagos, Nigeria",
  phone: "+234 (0) 800 000 0000",
  email: "reservations@thecornichehotel.com",
  website: "https://thecornichehotel.com",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Rooms & Suites", href: "/rooms" },
  { label: "The Corniche Bistro", href: "/dining" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
] as const;

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
export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/thecornichehotel", icon: "instagram" },
  { label: "Facebook", href: "https://facebook.com/thecornichehotel", icon: "facebook" },
  { label: "X (Twitter)", href: "https://x.com/thecornichehotel", icon: "twitter" },
  { label: "LinkedIn", href: "https://linkedin.com/company/thecornichehotel", icon: "linkedin" },
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
