/**
 * @file Homepage — The Corniche Hotel
 * @description Landing page that composes all major sections of the hotel website.
 *   Uses a sticky hero pattern where the video hero stays pinned behind scrollable
 *   content, creating a parallax-like layered scroll experience. The content container
 *   slides up over the hero with a top shadow for depth.
 */

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import BookingWidget from "@/components/booking/booking-widget";
import AboutPreview from "@/components/sections/about-preview";
import RoomShowcase from "@/components/sections/room-showcase";
import DiningSection from "@/components/sections/dining-section";
import FacilitiesGrid from "@/components/sections/facilities-grid";
import Testimonials from "@/components/sections/testimonials";
import { getAllRooms } from "@/lib/rooms-data";

/** Homepage — assembles the full landing experience with sticky hero + overlapping content. */
export default function Home() {
  const rooms = getAllRooms();

  return (
    <>
      <Navbar />

      <main className="relative w-full">
        {/* Hero Video Section - Sticky background */}
        <div className="sticky top-0 left-0 w-full h-screen z-0">
          <HeroSection />
        </div>

        {/* Overlapping Content Container */}
        <div className="relative z-10 bg-beige shadow-[0_-10px_50px_rgba(0,0,0,0.15)]">
          {/* Booking Widget — floats over hero/section transition */}
          <BookingWidget />

          {/* About Corniche */}
          <AboutPreview />

          {/* Luxury Room Showcase (Replaced Featured Rooms) */}
          <RoomShowcase rooms={rooms} />

          {/* Dining Experience */}
          <DiningSection />

          {/* Hotel Facilities */}
          <FacilitiesGrid />

          {/* Guest Testimonials */}
          <Testimonials />
          
          <Footer />
        </div>
      </main>

    </>
  );
}
