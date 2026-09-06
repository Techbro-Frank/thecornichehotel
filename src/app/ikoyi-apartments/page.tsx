/**
 * @file Ikoyi Apartments Page — Full-service apartment listings
 * @description Server component that reads each apartment's photo folder
 *   directly from /public/images/Ikoyi Apartments at render time — so adding
 *   more photos to a folder later just works, no code changes needed. Follows
 *   the same page structure as the Rooms & Suites page (banner, intro copy,
 *   card grid), plus a building-wide amenities strip in the FacilitiesGrid
 *   visual language.
 */

import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { ChefHat, Sofa, DoorOpen, ParkingCircle, ShieldCheck, Zap } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ApartmentCard from "@/components/ikoyi/apartment-card";

const ikoyiDescription =
  "Full-serviced apartments in Ikoyi — private kitchen, sitting room, and balcony, backed by 24/7 security and constant power. From ₦300,000/night.";
const ikoyiOgImage = "/images/Ikoyi%20Apartments/ground%20floor/WhatsApp%20Image%202026-08-24%20at%2014.04.56.jpeg";

export const metadata: Metadata = {
  title: "Ikoyi Apartments",
  description: ikoyiDescription,
  alternates: { canonical: "/ikoyi-apartments" },
  openGraph: {
    title: "Ikoyi Apartments",
    description: ikoyiDescription,
    url: "/ikoyi-apartments",
    images: [ikoyiOgImage],
  },
  twitter: { images: [ikoyiOgImage] },
};

interface Apartment {
  name: string;
  tagline: string;
  images: string[];
  price: string;
}

const APARTMENT_FOLDERS: { folder: string; name: string; tagline: string; price: string }[] = [
  {
    folder: "ground floor",
    name: "Ground Floor Apartment",
    tagline: "A fully serviced retreat with private lounge, kitchen & ensuite bathroom",
    price: "₦300,000 / Night",
  },
  {
    folder: "first floor",
    name: "First Floor Apartment",
    tagline: "A cozy serviced studio with private kitchenette & serene bedroom",
    price: "₦300,000 / Night",
  },
  {
    folder: "second floor",
    name: "Second Floor Apartment",
    tagline: "Our most spacious layout, complete with private balcony views",
    price: "₦300,000 / Night",
  },
];

const amenities = [
  { icon: ChefHat, name: "Private Kitchen", description: "Fully-equipped kitchen in every apartment" },
  { icon: Sofa, name: "Sitting Room", description: "Comfortable lounge area to relax or entertain" },
  { icon: DoorOpen, name: "Private Balcony", description: "Beautiful balcony with open views" },
  { icon: ParkingCircle, name: "Ample Car Park", description: "Huge, secure parking for residents & guests" },
  { icon: ShieldCheck, name: "24/7 Security", description: "Round-the-clock on-site security" },
  { icon: Zap, name: "24-Hour Light", description: "Constant electricity, day and night" },
];

/** Reads an apartment's photo folder from disk, returning public-facing paths. */
function getApartmentImages(folder: string): string[] {
  const dir = path.join(process.cwd(), "public", "images", "Ikoyi Apartments", folder);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort()
      .map((f) => `/images/Ikoyi Apartments/${folder}/${f}`);
  } catch {
    return [];
  }
}

export default function IkoyiApartmentsPage() {
  const apartments: Apartment[] = APARTMENT_FOLDERS.map(({ folder, name, tagline, price }) => ({
    name,
    tagline,
    price,
    images: getApartmentImages(folder),
  })).filter((apt) => apt.images.length > 0);

  return (
    <>
      <Navbar />

      <main className="relative w-full bg-beige pt-24 md:pt-28 pb-16 flex flex-col items-center justify-center">
        {/* Banner */}
        <div className="w-full mb-10 flex flex-col items-center justify-center">
          <div className="w-screen h-[1px] bg-dark/15" />
          <div className="py-8 flex items-center justify-center">
            <h1 className="font-[family-name:var(--font-body)] text-3xl md:text-4xl text-dark tracking-[0.25em] uppercase font-light text-center">
              Ikoyi Apartments
            </h1>
          </div>
          <div className="w-screen h-[1px] bg-dark/15" />
        </div>

        <div className="max-w-6xl w-full mx-auto px-6 md:px-12 flex flex-col items-center justify-center">
          {/* Intro copy */}
          <div className="max-w-2xl w-full text-center mb-12">
            <p className="text-sm md:text-base text-dark-soft/80 font-light leading-relaxed">
              Full-serviced apartments in the heart of Ikoyi — each with a
              private kitchen and sitting room, a beautiful balcony, and the
              comfort of a home away from home, backed by round-the-clock
              security, constant power, and ample parking.
            </p>
          </div>

          {/* Apartment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16">
            {apartments.map((apt) => (
              <ApartmentCard key={apt.name} name={apt.name} tagline={apt.tagline} images={apt.images} price={apt.price} />
            ))}
          </div>

          {/* Amenities */}
          <div className="w-full text-center mb-10">
            <p className="label-uppercase mb-4">The Ikoyi Standard</p>
            <h2 className="heading-2 text-dark">Every Comfort, Included</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
            {amenities.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.name}
                  className="group p-6 md:p-8 border border-border bg-white hover:shadow-card hover:border-gold/30 transition-all text-center"
                  style={{
                    transitionDuration: "var(--duration-normal)",
                    transitionTimingFunction: "var(--ease-luxury)",
                  }}
                >
                  <div
                    className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border border-gold/30 text-gold group-hover:bg-gold group-hover:text-dark transition-all"
                    style={{ transitionDuration: "var(--duration-normal)" }}
                  >
                    <IconComp size={20} />
                  </div>
                  <h4 className="text-sm font-medium text-dark tracking-wide mb-1">
                    {item.name}
                  </h4>
                  <p className="text-[12px] text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
