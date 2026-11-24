/**
 * @file CheckoutClient — guest details form, then off to Paystack
 * @description First real use of the react-hook-form + zod + @hookform/resolvers
 *   stack that's been sitting installed-but-unused in this project. On submit,
 *   the whole cart + guest details go to /api/checkout/initialize, which
 *   creates the pending order locally and returns a Paystack authorization
 *   URL to redirect to — nothing is written to Anli at this point.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import SectionHeading from "@/components/shared/section-heading";
import { useCart } from "@/contexts/cart-context";

const TITLES = ["Mr", "Mrs", "Ms", "Dr", "Chief"] as const;
const COUNTRIES = ["Nigeria", "Ghana", "United Kingdom", "United States", "Canada", "South Africa", "Other"];

const checkoutSchema = z.object({
  title: z.enum(TITLES),
  fullName: z.string().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  country: z.string().min(2, "Select your country"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutClient() {
  const { items, grandTotal, clear } = useCart();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { title: "Mr", country: "Nigeria" },
  });

  async function onSubmit(guest: CheckoutForm) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest, items }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Could not start checkout — please try again.");
        return;
      }

      clear();
      window.location.href = data.authorizationUrl;
    } catch {
      setSubmitError("Could not reach checkout — please check your connection and try again.");
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="relative w-full bg-beige pt-24 md:pt-28 pb-20 min-h-[60vh]">
          <div className="container-luxury text-center py-16">
            <p className="text-muted mb-6">Your cart is empty — add a room before checking out.</p>
            <Link href="/book" className="btn-primary">
              <span>Check Availability</span>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="relative w-full bg-beige pt-24 md:pt-28 pb-20">
        <div className="container-luxury">
          <SectionHeading label="Almost There" title="Checkout" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 bg-white border border-border p-6 md:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="label-uppercase text-[11px]" htmlFor="title">Title</label>
                  <select
                    id="title"
                    {...register("title")}
                    className="w-full px-4 py-3 bg-white border border-border text-sm text-dark focus:outline-none focus:border-gold"
                  >
                    {TITLES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="label-uppercase text-[11px]" htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    {...register("fullName")}
                    className="w-full px-4 py-3 bg-white border border-border text-sm text-dark focus:outline-none focus:border-gold"
                  />
                  {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="label-uppercase text-[11px]" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-3 bg-white border border-border text-sm text-dark focus:outline-none focus:border-gold"
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="label-uppercase text-[11px]" htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    className="w-full px-4 py-3 bg-white border border-border text-sm text-dark focus:outline-none focus:border-gold"
                  />
                  {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label-uppercase text-[11px]" htmlFor="country">Country</label>
                  <select
                    id="country"
                    {...register("country")}
                    className="w-full px-4 py-3 bg-white border border-border text-sm text-dark focus:outline-none focus:border-gold"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full !py-3 disabled:opacity-60">
                <span>{isSubmitting ? "Redirecting to Payment…" : `Pay ₦${grandTotal.toLocaleString()}`}</span>
              </button>
            </form>

            <div className="lg:col-span-1">
              <div className="bg-white border border-border p-6">
                <p className="label-uppercase mb-4">Order Summary</p>
                {items.map((item) => (
                  <div key={item.key} className="flex justify-between text-sm text-dark-soft/80 py-2 border-b border-border last:border-0">
                    <span>
                      {item.roomName} × {item.roomsCount}
                      <br />
                      <span className="text-xs text-muted">{item.checkIn} → {item.checkOut}</span>
                    </span>
                    <span className="whitespace-nowrap">₦{(item.totalPrice * item.roomsCount).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-medium text-dark pt-4 mt-2">
                  <span>Total</span>
                  <span>₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
