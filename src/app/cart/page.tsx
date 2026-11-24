/**
 * @file Cart Page
 * @description Shows what's in the browser-local cart before checkout. No VAT
 *   line here — Anli's quoted totalPrice is already the full stay price per
 *   room, so the grand total is just the sum of each line.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ChevronUp, ChevronDown, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import SectionHeading from "@/components/shared/section-heading";
import { useCart } from "@/contexts/cart-context";

export default function CartPage() {
  const { items, removeItem, updateRoomsCount, grandTotal } = useCart();

  return (
    <>
      <Navbar />
      <main className="relative w-full bg-beige pt-24 md:pt-28 pb-20 min-h-[60vh]">
        <div className="container-luxury">
          <SectionHeading label="Your Selection" title="Cart" />

          {items.length === 0 ? (
            <div className="flex flex-col items-center text-center py-16">
              <ShoppingBag size={40} className="text-muted mb-4" />
              <p className="text-muted mb-6">Your cart is empty.</p>
              <Link href="/book" className="btn-primary">
                <span>Check Availability</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 flex flex-col gap-5">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-5 bg-white border border-[#E6DED5]/40 p-4 hover:shadow-card transition-shadow duration-300"
                  >
                    {item.image && (
                      <div className="relative w-32 h-32 sm:w-44 sm:h-36 flex-shrink-0 overflow-hidden bg-beige-light">
                        <Image
                          src={item.image}
                          alt={item.roomName}
                          fill
                          sizes="(max-width: 640px) 128px, 176px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-[family-name:var(--font-heading)] text-lg text-dark tracking-[0.05em] uppercase font-light mb-1">
                          {item.roomName}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          className="text-muted hover:text-red-600 transition-colors p-1 flex-shrink-0"
                          aria-label={`Remove ${item.roomName}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="text-xs text-muted mb-1">
                        {item.checkIn} &rarr; {item.checkOut}
                      </p>
                      <p className="text-xs text-muted mb-4">
                        {item.adults} Adult{item.adults === 1 ? "" : "s"}
                        {item.children > 0 ? `, ${item.children} Child${item.children === 1 ? "" : "ren"}` : ""}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            onClick={() => updateRoomsCount(item.key, item.roomsCount - 1)}
                            className="px-2 py-1.5 hover:bg-beige transition-colors"
                            aria-label="Decrease rooms"
                          >
                            <ChevronDown size={12} />
                          </button>
                          <span className="px-3 text-sm">{item.roomsCount} room{item.roomsCount === 1 ? "" : "s"}</span>
                          <button
                            type="button"
                            onClick={() => updateRoomsCount(item.key, item.roomsCount + 1)}
                            className="px-2 py-1.5 hover:bg-beige transition-colors"
                            aria-label="Increase rooms"
                          >
                            <ChevronUp size={12} />
                          </button>
                        </div>

                        <p className="text-base font-medium text-dark">
                          ₦{(item.totalPrice * item.roomsCount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-28 bg-white border border-border p-6">
                  <p className="label-uppercase mb-4">Order Summary</p>
                  <div className="flex items-center justify-between text-sm text-muted mb-2">
                    <span>Subtotal</span>
                    <span>₦{grandTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-medium text-dark border-t border-border pt-4 mt-4 mb-6">
                    <span>Total</span>
                    <span>₦{grandTotal.toLocaleString()}</span>
                  </div>
                  <Link href="/checkout" className="btn-primary w-full">
                    <span>Proceed to Checkout</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
