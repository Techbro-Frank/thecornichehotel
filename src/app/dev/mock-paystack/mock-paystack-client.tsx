"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, CreditCard } from "lucide-react";

export default function MockPaystackClient({
  reference,
  amountNaira,
  blocked,
}: {
  reference: string;
  amountNaira: number;
  /** True once Anli is live but Paystack is still mocked — a fake payment must never create a real booking. */
  blocked: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"pay" | "cancel" | null>(null);

  async function simulatePayment() {
    setLoading("pay");
    await fetch("/api/dev/simulate-paystack-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, amountNaira }),
    });
    router.push(`/booking/confirmation?reference=${reference}`);
  }

  function simulateCancel() {
    setLoading("cancel");
    router.push(`/booking/confirmation?reference=${reference}`);
  }

  return (
    <main className="min-h-screen bg-[#011b33] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-2">
          <ShieldAlert size={14} className="text-amber-700 flex-shrink-0" />
          <p className="text-[11px] text-amber-800">Local dev simulation — no real Paystack account connected.</p>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#011b33] flex items-center justify-center">
              <CreditCard size={16} className="text-white" />
            </div>
            <span className="font-semibold text-[#011b33]">Paystack (Mock)</span>
          </div>

          <p className="text-xs text-muted mb-1">Amount</p>
          <p className="text-2xl font-semibold text-[#011b33] mb-6">₦{amountNaira.toLocaleString()}</p>

          <p className="text-xs text-muted mb-6 break-all">Ref: {reference}</p>

          {blocked ? (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-3 mb-3">
              Blocked: Anli is live now, so simulating a payment here would create a real booking in the live PMS
              for a payment that never happened. Get real Paystack test keys to test this safely.
            </p>
          ) : (
            <button
              onClick={simulatePayment}
              disabled={loading !== null}
              className="w-full bg-[#011b33] text-white py-3 rounded-md text-sm font-medium hover:bg-[#022a4d] transition-colors disabled:opacity-60 mb-3"
            >
              {loading === "pay" ? "Processing…" : "Simulate Successful Payment"}
            </button>
          )}
          <button
            onClick={simulateCancel}
            disabled={loading !== null}
            className="w-full border border-border text-dark py-3 rounded-md text-sm font-medium hover:bg-beige transition-colors disabled:opacity-60"
          >
            Cancel / Simulate Failure
          </button>
        </div>
      </div>
    </main>
  );
}
