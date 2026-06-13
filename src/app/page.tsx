import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import BookingWidget from "@/components/booking/booking-widget";
import AboutPreview from "@/components/sections/about-preview";
import FeaturedRooms from "@/components/sections/featured-rooms";
import DiningSection from "@/components/sections/dining-section";
import FacilitiesGrid from "@/components/sections/facilities-grid";
import Testimonials from "@/components/sections/testimonials";
import VirtualTourPreview from "@/components/sections/virtual-tour-preview";
import GalleryPreview from "@/components/sections/gallery-preview";
import OffersPreview from "@/components/sections/offers-preview";
import InstagramPlaceholder from "@/components/sections/instagram-placeholder";

export default function Home() {
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

          {/* Featured Rooms & Suites */}
          <FeaturedRooms />

          {/* Dining Experience */}
          <DiningSection />

          {/* Hotel Facilities */}
          <FacilitiesGrid />

          {/* Guest Testimonials */}
          <Testimonials />

          {/* Virtual Tour Preview */}
          <VirtualTourPreview />

          {/* Photo Gallery */}
          <GalleryPreview />

          {/* Special Offers */}
          <OffersPreview />

          {/* Instagram Feed */}
          <InstagramPlaceholder />
          
          <Footer />
        </div>
      </main>

    </>
  );
}
