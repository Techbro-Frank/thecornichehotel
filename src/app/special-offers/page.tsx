/**
 * @file Special Offers Page — Loyalty program overview
 * @description Introduces the Corniche Loyalty Program: what it is, how it
 *   works, and a "Join Now" CTA. The join flow isn't built yet, so the button
 *   is intentionally inert (renders, but goes nowhere) per the brief — swap in
 *   a real signup link/flow when the program launches.
 */

import type { Metadata } from "next";
import { UserPlus, Wallet, Star, Gift } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import SectionHeading from "@/components/shared/section-heading";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const description =
  "The Corniche Loyalty Program — earn points, enjoy free nights, special discounts, and VIP perks at The Corniche Hotel.";

export const metadata: Metadata = {
  title: "Special Offers",
  description,
  alternates: { canonical: "/special-offers" },
  openGraph: { title: "Special Offers", description, url: "/special-offers", images: [DEFAULT_OG_IMAGE] },
  twitter: { images: [DEFAULT_OG_IMAGE] },
};

const benefits = [
  "Free or paid membership options",
  "Earn 1 point for every ₦1,000 spent",
  "Redeem points for free nights, discounts, gifts, and exclusive perks",
  "Enjoy birthday treats, early check-in, and special rates",
];

const steps = [
  { icon: UserPlus, title: "Sign Up", description: "Join for free in just a minute" },
  { icon: Wallet, title: "Stay or Spend", description: "Book a room, dine, or enjoy our amenities" },
  { icon: Star, title: "Earn Points", description: "Every naira spent adds to your balance" },
  { icon: Gift, title: "Redeem Rewards", description: "Free nights, discounts, and exclusive perks" },
];

/** Inert for now — no signup flow exists yet. */
function JoinNowButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" className={`btn-primary ${className}`} aria-disabled="true">
      <span>Join Now</span>
    </button>
  );
}

export default function SpecialOffersPage() {
  return (
    <>
      <Navbar />

      <main className="relative w-full bg-beige pt-24 md:pt-28 pb-16 md:pb-20">
        {/* Hero intro */}
        <section className="bg-dark py-16 md:py-20">
          <div className="container-luxury text-center max-w-2xl mx-auto">
            <p className="label-uppercase !text-gold-light mb-4">Corniche Loyalty</p>
            <h1 className="heading-2 text-white mb-5">Stay More. Get More.</h1>
            <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8">
              Join our exclusive Loyalty Program and earn points or enjoy
              free nights, special discounts, VIP perks, and more.
            </p>
            <JoinNowButton />
          </div>
        </section>

        {/* What is it */}
        <section className="container-luxury pt-16 md:pt-20">
          <SectionHeading
            label="About The Program"
            title="What Is The Corniche Loyalty Program?"
            className="max-w-2xl mx-auto"
          />

          <ul className="max-w-2xl mx-auto space-y-4 mb-10">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm md:text-base text-dark-soft/80 font-light leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="flex justify-center">
            <JoinNowButton />
          </div>
        </section>

        {/* How it works */}
        <section className="container-luxury pt-16 md:pt-20">
          <SectionHeading label="Getting Started" title="How It Works" className="max-w-2xl mx-auto" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-10">
            {steps.map((step, index) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.title}
                  className="p-6 md:p-8 border border-border bg-white text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border border-gold/30 text-gold">
                    <IconComp size={20} />
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-gold mb-2">
                    Step {index + 1}
                  </p>
                  <h4 className="text-sm font-medium text-dark tracking-wide mb-1">
                    {step.title}
                  </h4>
                  <p className="text-[12px] text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">
            <JoinNowButton />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
