"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

interface OrderStatus {
  status: string;
  amountNaira: number;
  guestName: string;
  items: { roomName: string; checkIn: string; checkOut: string; roomsCount: number; status: string }[];
}

export default function ConfirmationClient({ reference }: { reference: string | null }) {
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const attempts = useRef(0);

  useEffect(() => {
    if (!reference) {
      setError("No booking reference was provided.");
      return;
    }

    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/orders/${reference}/status`);
        if (!res.ok) throw new Error();
        const data: OrderStatus = await res.json();
        if (cancelled) return;
        setOrder(data);

        attempts.current += 1;
        if (data.status === "pending" || (data.status === "paid" && attempts.current < 15)) {
          setTimeout(poll, 2000);
        }
      } catch {
        if (!cancelled) setError("Could not load your booking status — please contact us with your reference.");
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  const stillProcessing = order && (order.status === "pending" || order.status === "paid");
  const confirmed = order?.status === "confirmed";
  const needsAttention = order?.status === "partially_confirmed" || order?.status === "failed";

  return (
    <>
      <Navbar />
      <main className="relative w-full bg-beige pt-24 md:pt-28 pb-20 min-h-[70vh] flex items-center">
        <div className="container-luxury max-w-xl mx-auto text-center">
          {error && (
            <>
              <AlertTriangle size={40} className="text-red-600 mx-auto mb-4" />
              <p className="text-dark mb-6">{error}</p>
            </>
          )}

          {!error && !order && (
            <>
              <Loader2 size={40} className="text-gold mx-auto mb-4 animate-spin" />
              <p className="text-muted">Confirming your payment…</p>
            </>
          )}

          {!error && order && stillProcessing && (
            <>
              <Loader2 size={40} className="text-gold mx-auto mb-4 animate-spin" />
              <p className="text-dark mb-2">Finalizing your reservation…</p>
              <p className="text-sm text-muted">This usually takes a few seconds. Please don&rsquo;t close this page.</p>
            </>
          )}

          {!error && confirmed && (
            <>
              <CheckCircle2 size={44} className="text-emerald-600 mx-auto mb-4" />
              <p className="label-uppercase mb-2">Booking Confirmed</p>
              <h1 className="heading-2 text-dark mb-6">Thank You, {order.guestName.split(" ")[0]}</h1>
              <div className="bg-white border border-border p-6 text-left mb-6">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                    <span>{item.roomName} × {item.roomsCount} — {item.checkIn} → {item.checkOut}</span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-medium text-dark pt-4 mt-2">
                  <span>Total Paid</span>
                  <span>₦{order.amountNaira.toLocaleString()}</span>
                </div>
              </div>
              <Link href="/" className="btn-primary">
                <span>Back to Home</span>
              </Link>
            </>
          )}

          {!error && needsAttention && (
            <>
              <AlertTriangle size={40} className="text-amber-600 mx-auto mb-4" />
              <p className="label-uppercase mb-2">Payment Received</p>
              <h1 className="heading-2 text-dark mb-4">We&rsquo;re Finalizing Your Reservation</h1>
              <p className="text-sm text-muted mb-6">
                Your payment of ₦{order.amountNaira.toLocaleString()} was received. Our front desk is completing the
                reservation on our system and will confirm with you shortly by phone or email.
              </p>
              <Link href="/contact" className="btn-primary">
                <span>Contact Us</span>
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
