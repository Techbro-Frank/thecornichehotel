/**
 * @file The Corniche Bistro — Interactive client component
 * @description Immersive single-viewport landing for the restaurant: an
 *   auto-sliding full-bleed photo background (restaurant & bar photos only),
 *   the hotel's gold monogram + wordmark treatment centered over it, and two
 *   CTAs that open the live ANLI digital menu (weareanli.com) embedded in a
 *   full-screen overlay — so ordering feels native to the site rather than a
 *   redirect. The overlay's open/closed state (and which menu) lives in the
 *   URL (`?menu=food` / `?menu=drinks`) via the router, not local state alone —
 *   so the browser's Back button steps out of the menu one level at a time
 *   (menu → landing → wherever the guest came from) instead of jumping
 *   straight past the Bistro entirely. The site nav is hidden entirely while
 *   the embedded menu is open — only the floating "Back to Bistro" button
 *   provides navigation there — and reappears on the landing view.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { BISTRO_INSTAGRAM_URL } from "@/lib/constants";

/** Lucide dropped brand icons — same hand-rolled Instagram mark used in the Footer. */
function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const P = "/images/View Photos/";

/** Restaurant & bar photos only, per brief — cycles as a full-bleed slideshow. */
const slides = [
  `${P}image copy 10.png`,
  `${P}image copy 12.png`,
  `${P}image copy 4.png`,
  `${P}image copy 14.png`,
  `${P}image copy.png`,
];

/**
 * Live digital menu — hosted on ANLI. Deep-linked straight to each category so
 * the guest lands directly on the real menu, skipping ANLI's own "Choose Menu"
 * screen (which would otherwise duplicate the picker we already show here).
 */
const MENU_URLS: Record<string, string> = {
  food: "https://www.weareanli.com/custom-menu/8/restaurant-menu/foods",
  drinks: "https://www.weareanli.com/custom-menu/8/restaurant-menu/drinks",
};

export default function DiningClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const menuParam = searchParams.get("menu");
  const activeMenuUrl = menuParam ? MENU_URLS[menuParam] ?? null : null;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeMenuUrl ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeMenuUrl]);

  const openMenu = (menu: "food" | "drinks") => {
    router.push(`/dining?menu=${menu}`);
  };

  const closeMenu = () => {
    router.back();
  };

  return (
    <>
      {/* Hidden entirely while the embedded menu is open — only the floating
          back button provides navigation there, per the client's request. */}
      {!activeMenuUrl && <Navbar />}

      <main className="relative w-full">
        <section className="relative h-screen w-full overflow-hidden bg-dark">
          {/* Sliding background */}
          <AnimatePresence>
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slides[index]}
                alt="The Corniche Bistro"
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover animate-ken-burns"
              />
            </motion.div>
          </AnimatePresence>

          {/* Brand-toned overlay */}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

          {/* Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
            }}
            className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-[150px] md:w-[180px] aspect-[100/40] mb-6"
            >
              <Image
                src="/images/Corniche-Logo.png"
                alt="The Corniche"
                fill
                className="object-cover object-top"
              />
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="heading-1 text-white tracking-[0.04em]"
            >
              The Corniche
            </motion.h1>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mt-6"
            >
              <span className="w-10 h-[1px] bg-gold" />
              <span className="text-white/70 text-xs md:text-sm tracking-[0.4em] uppercase">
                Bistro
              </span>
              <span className="w-10 h-[1px] bg-gold" />
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-12"
            >
              <button
                type="button"
                onClick={() => openMenu("food")}
                className="btn-primary min-w-[190px]"
              >
                <span>Food Menu</span>
              </button>
              <button
                type="button"
                onClick={() => openMenu("drinks")}
                className="btn-outline border-white/40 hover:border-gold hover:text-gold hover:bg-gold/5 min-w-[190px]"
              >
                <span>Drinks Menu</span>
              </button>
            </motion.div>

            <motion.a
              href={BISTRO_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-2 mt-8 text-white/60 hover:text-gold text-xs tracking-[0.15em] uppercase transition-colors"
              style={{ transitionDuration: "var(--duration-normal)" }}
            >
              <IconInstagram size={14} />
              @thecornichebistro
            </motion.a>
          </motion.div>

          {/* Slide indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "bg-gold w-6" : "bg-white/30 hover:bg-white/50 w-2"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* ─── Embedded Digital Menu Overlay ─────────────────── */}
      <AnimatePresence>
        {activeMenuUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-dark"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full h-full"
            >
              <iframe
                src={activeMenuUrl}
                title="The Corniche Bistro — Digital Menu"
                className="w-full h-full border-0"
                allow="clipboard-write"
              />
            </motion.div>

            {/* Floating back button */}
            <motion.button
              type="button"
              onClick={closeMenu}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="fixed bottom-6 left-6 z-[110] flex items-center gap-2 pl-4 pr-5 py-3 bg-dark/90 backdrop-blur-md border border-gold/40 text-white text-xs font-medium uppercase tracking-[0.15em] shadow-2xl hover:border-gold hover:bg-dark transition-colors"
              style={{ transitionDuration: "var(--duration-normal)" }}
              aria-label="Back to The Corniche Bistro"
            >
              <ArrowLeft size={15} className="text-gold" />
              Back to Bistro
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
