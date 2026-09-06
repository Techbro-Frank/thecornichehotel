/**
 * @file About Page — Hotel story, boutique positioning, and full photo gallery
 * @description Tells the Corniche story across an animated photographic hero, a
 *   scroll-revealed welcome intro, dedicated "Rooms" and "Dining & Bar" photo
 *   teasers with direction-aware hover overlays (same interaction language as
 *   the room cards elsewhere on the site), a parallax location banner, a
 *   full-width auto-scrolling gallery marquee, and a closing newsletter CTA.
 *   Every photo in /images/View Photos is used exactly once, matched to the
 *   section its content best fits. All animations are GSAP ScrollTrigger
 *   driven so every section — not just the hero — reveals on scroll.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

gsap.registerPlugin(ScrollTrigger);

const P = "/images/View Photos/";

const heroImage = `${P}image copy 5.png`; // branded night signage — the strongest hero shot
const welcomeImage = `${P}image copy 9.png`; // reception & entrance — first-impression welcome
const boutiqueImage = `${P}image copy 3.png`; // architectural walkway — "elegant architecture"
const locationImage = `${P}image copy 15.png`; // full daytime exterior — location/context banner

const roomTeasers = [
  { src: `${P}image copy 13.png`, caption: "Rest, Reimagined" },
  { src: `${P}image copy 7.png`, caption: "Warm, Considered Interiors" },
  { src: `${P}image.png`, caption: "Comfort In Every Detail" },
];

const diningTeasers = [
  { src: `${P}image copy 10.png`, caption: "Fine Dining" },
  { src: `${P}image copy 14.png`, caption: "Cocktails & Conversation" },
  { src: `${P}image copy.png`, caption: "Al Fresco Moments" },
];

/** Remaining photos, shown in a continuous auto-scrolling marquee. */
const galleryImages = [
  `${P}image copy 2.png`,
  `${P}image copy 4.png`,
  `${P}image copy 6.png`,
  `${P}image copy 8.png`,
  `${P}image copy 11.png`,
  `${P}image copy 12.png`,
];

const boutiqueHighlights = [
  "Tranquil Lekki Phase 1 accommodation",
  "Seamless service in a top rated hotel in Lekki Lagos",
  "Amenities like free Wi-Fi and luxury finishes",
  "An atmosphere that redefines affordable hotels in Lekki without compromise",
];

/** Angle-based direction-aware hover tile — same interaction language as the room cards. */
function HoverTile({
  src,
  caption,
  href,
}: {
  src: string;
  caption: string;
  href: string;
}) {
  const [direction, setDirection] = useState<"top" | "right" | "bottom" | "left">("top");
  const [isHovered, setIsHovered] = useState(false);

  const resolveDirection = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle > -45 && angle <= 45) return "right";
    if (angle > 45 && angle <= 135) return "bottom";
    if (angle > 135 || angle <= -135) return "left";
    return "top";
  };

  return (
    <Link
      href={href}
      onMouseEnter={(e) => {
        setDirection(resolveDirection(e));
        setIsHovered(true);
      }}
      onMouseLeave={(e) => {
        setDirection(resolveDirection(e));
        setIsHovered(false);
      }}
      className="relative block overflow-hidden aspect-[4/3.2] w-full bg-dark-soft cursor-pointer group"
    >
      <Image
        src={src}
        alt={caption}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
      />

      <div
        className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center p-6 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: !isHovered
            ? `translate(${direction === "left" ? "-8%" : direction === "right" ? "8%" : "0"}, ${
                direction === "top" ? "-8%" : direction === "bottom" ? "8%" : "0"
              })`
            : "translate(0,0)",
          transitionProperty: "opacity, transform",
        }}
      >
        <div className="absolute inset-[16px] border border-gold/50 pointer-events-none" />
        <span className="relative z-10 font-[family-name:var(--font-heading)] text-white uppercase tracking-[0.2em] text-sm md:text-base text-center px-4">
          {caption}
        </span>
      </div>
    </Link>
  );
}

export default function AboutClient() {
  const heroLabelRef = useRef<HTMLParagraphElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDividerRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);

  const welcomeImageRef = useRef<HTMLDivElement>(null);
  const welcomeContentRef = useRef<HTMLDivElement>(null);
  const boutiqueImageRef = useRef<HTMLDivElement>(null);
  const boutiqueContentRef = useRef<HTMLDivElement>(null);
  const roomsGridRef = useRef<HTMLDivElement>(null);
  const diningGridRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero — staggered entrance on load */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(heroLabelRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(heroTitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.4")
        .fromTo(heroDividerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.3")
        .fromTo(heroScrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.2");

      /* Welcome — clip-path image reveal + staggered text */
      gsap.fromTo(
        welcomeImageRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.3,
          ease: "power3.inOut",
          scrollTrigger: { trigger: welcomeImageRef.current, start: "top 78%", toggleActions: "play none none none" },
        }
      );
      if (welcomeContentRef.current) {
        gsap.fromTo(
          welcomeContentRef.current.children,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: welcomeContentRef.current, start: "top 80%", toggleActions: "play none none none" },
          }
        );
      }

      /* Rooms teaser — staggered card fade-up */
      if (roomsGridRef.current) {
        gsap.fromTo(
          roomsGridRef.current.children,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: roomsGridRef.current, start: "top 82%", toggleActions: "play none none none" },
          }
        );
      }

      /* Boutique — mirrored clip-path reveal (right-to-left) + staggered text */
      gsap.fromTo(
        boutiqueImageRef.current,
        { clipPath: "inset(0 0 0 100%)" },
        {
          clipPath: "inset(0 0 0 0%)",
          duration: 1.3,
          ease: "power3.inOut",
          scrollTrigger: { trigger: boutiqueImageRef.current, start: "top 78%", toggleActions: "play none none none" },
        }
      );
      if (boutiqueContentRef.current) {
        gsap.fromTo(
          boutiqueContentRef.current.children,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: boutiqueContentRef.current, start: "top 80%", toggleActions: "play none none none" },
          }
        );
      }

      /* Dining & bar teaser — staggered card fade-up */
      if (diningGridRef.current) {
        gsap.fromTo(
          diningGridRef.current.children,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: diningGridRef.current, start: "top 82%", toggleActions: "play none none none" },
          }
        );
      }

      /* Location banner — parallax drift + text reveal */
      gsap.to(".location-image", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: locationRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.fromTo(
        ".location-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: locationRef.current, start: "top 65%", toggleActions: "play none none none" },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <Navbar />

      <main className="relative w-full bg-beige">
        {/* ─── Hero ─────────────────────────────────────────── */}
        <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
          <div className="absolute inset-0 animate-ken-burns">
            <Image
              src={heroImage}
              alt="The Corniche Hotel at night"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <p ref={heroLabelRef} className="label-uppercase !text-white/85 tracking-[0.3em] mb-5 opacity-0">
              The Corniche Hotel
            </p>
            <h1 ref={heroTitleRef} className="heading-1 text-white max-w-3xl opacity-0">
              Top Rated Hotel in Lekki Phase 1 — An Authentic Spirit, A
              Unique Experience
            </h1>
            <div className="flex justify-center mt-7">
              <div ref={heroDividerRef} className="w-[80px] h-[1px] bg-gold origin-center" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>

          <div
            ref={heroScrollRef}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-0"
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.65, behavior: "smooth" })}
            role="button"
            tabIndex={0}
            aria-label="Scroll down"
          >
            <span className="text-[10px] text-white/50 tracking-[0.3em] uppercase">Scroll</span>
            <ChevronDown size={18} className="text-white/50 scroll-indicator" />
          </div>
        </section>

        {/* ─── Welcome Intro ────────────────────────────────── */}
        <section className="pt-14 pb-14 md:pt-16 md:pb-16 bg-white">
          <div className="container-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div
                ref={welcomeImageRef}
                className="relative aspect-[4/5] bg-beige-light overflow-hidden order-2 lg:order-1 group"
              >
                <Image
                  src={welcomeImage}
                  alt="The Corniche Hotel entrance"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                />
              </div>

              <div ref={welcomeContentRef} className="order-1 lg:order-2">
                <p className="label-uppercase mb-4">Welcome</p>
                <h2 className="heading-2 text-dark mb-6">
                  Where Comfort Meets Class
                </h2>
                <p className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed mb-5">
                  Welcome to The Corniche Hotel, where comfort meets class
                  and every stay becomes a story. Nestled in the heart of
                  Lekki Phase 1, just a stone&rsquo;s throw from the state
                  of the art Lekki-Ikoyi Link Bridge, our hotel offers a
                  refined sanctuary for travelers seeking a truly luxury
                  hotel in Lagos.
                </p>
                <p className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed mb-8">
                  Whether you&rsquo;re staying in one of our 28
                  well-appointed rooms and suites, dining at our fine
                  restaurant in Lekki phase 1, or enjoying cocktails under
                  the glass roof of our bar, The Corniche Hotel promises
                  more than just elegance — it offers an immersive,
                  relaxing, and authentic experience.
                </p>
                <Link href="/rooms" className="btn-primary">
                  <span>Discover Our Rooms</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Rooms Teaser — hover to explore ──────────────── */}
        <section className="pt-14 pb-14 md:pt-16 md:pb-16 bg-beige-light/40">
          <div className="container-luxury">
            <div className="text-center mb-10">
              <p className="label-uppercase mb-4">28 Rooms &amp; Suites</p>
              <h2 className="heading-2 text-dark">A Room For Every Story</h2>
            </div>
            <div ref={roomsGridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {roomTeasers.map((room) => (
                <HoverTile key={room.src} src={room.src} caption={room.caption} href="/rooms" />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Boutique Hotel in Lekki ──────────────────────── */}
        <section className="pt-14 pb-14 md:pt-16 md:pb-16 bg-white">
          <div className="container-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div ref={boutiqueContentRef}>
                <p className="label-uppercase mb-4">Boutique Hotel in Lekki</p>
                <h2 className="heading-2 text-dark mb-6">
                  Details, Delivered With Care
                </h2>
                <p className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed mb-6">
                  At The Corniche, we believe in details — from
                  personalized service to elegant architecture. We are
                  proud to be recognized among the best hotels in Lekki,
                  offering warm, intimate hospitality for every guest.
                </p>
                <p className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed mb-4">
                  Our boutique environment ensures that you receive:
                </p>
                <ul className="space-y-3 mb-6">
                  {boutiqueHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      <span className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed">
                  We are where travelers looking for where to stay in
                  Lekki come to feel truly at home.
                </p>
              </div>

              <div
                ref={boutiqueImageRef}
                className="relative aspect-[4/5] bg-beige-light overflow-hidden group"
              >
                <Image
                  src={boutiqueImage}
                  alt="The Corniche Hotel architectural walkway"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Dining & Bar Teaser — hover to explore ───────── */}
        <section className="pt-14 pb-14 md:pt-16 md:pb-16 bg-beige-light/40">
          <div className="container-luxury">
            <div className="text-center mb-10">
              <p className="label-uppercase mb-4">Restaurant &amp; Bar</p>
              <h2 className="heading-2 text-dark">Taste The Corniche</h2>
            </div>
            <div ref={diningGridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {diningTeasers.map((item) => (
                <HoverTile key={item.src} src={item.src} caption={item.caption} href="/dining" />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Location Banner — parallax ───────────────────── */}
        <section ref={locationRef} className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden">
          <div className="location-image absolute inset-0 w-full h-[130%] -top-[15%]">
            <Image
              src={locationImage}
              alt="The Corniche Hotel exterior in Lekki Phase 1"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="location-content relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <p className="label-uppercase !text-gold-light mb-4">Prime Location</p>
            <h2 className="heading-2 text-white max-w-2xl">
              In The Heart Of Lekki Phase 1
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-xl mt-5">
              Just a stone&rsquo;s throw from the Lekki-Ikoyi Link Bridge —
              close to everything, tucked away from the noise.
            </p>
          </div>
        </section>

        {/* ─── Photo Gallery Marquee ────────────────────────── */}
        <section className="py-14 md:py-16 bg-white overflow-hidden">
          <div className="container-luxury mb-10 text-center">
            <p className="label-uppercase mb-4">The Corniche Experience</p>
            <h2 className="heading-2 text-dark">Every Corner, Considered</h2>
            <div className="flex justify-center mt-5">
              <div className="divider-gold" />
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="flex gap-4 w-max marquee-track">
              {[...galleryImages, ...galleryImages].map((src, i) => (
                <div
                  key={i}
                  className="relative w-64 h-44 md:w-80 md:h-56 flex-shrink-0 overflow-hidden bg-beige-light group cursor-pointer"
                >
                  <Image
                    src={src}
                    alt="The Corniche Hotel"
                    fill
                    sizes="320px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Stay Up To Date CTA ──────────────────────────── */}
        <section className="bg-dark py-14 md:py-16">
          <div className="container-luxury text-center max-w-xl mx-auto">
            <p className="label-uppercase !text-gold-light mb-4">
              Stay Up To Date
            </p>
            <h2 className="heading-2 text-white mb-4">
              Never Miss An Update
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8">
              Get updates from our 5-star hotel in Lekki phase 1, including
              special offers, culinary events, and exclusive content.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="flex-1 bg-white/5 border border-white/15 px-5 py-3.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-gold transition-colors"
                style={{ transitionDuration: "var(--duration-normal)" }}
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="btn-primary flex-shrink-0">
                <span>Subscribe</span>
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer hideNewsletter />
    </div>
  );
}
