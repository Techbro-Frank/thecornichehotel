/**
 * @file Cart — client-side only, persisted to localStorage
 * @description No backend cart needed: a guest's in-progress selection lives
 *   entirely in the browser until they check out, at which point the whole
 *   cart is sent to /api/checkout/initialize in one go. A line is keyed by
 *   room + date-range, so the same room with different dates is two lines.
 */

"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  key: string;
  roomSlug: string;
  roomName: string;
  image: string | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomsCount: number;
  roomTypeId: number;
  nightlyRate: number;
  /** Total for ONE room across the whole stay (nights * nightlyRate) — multiply by roomsCount for the line total. */
  totalPrice: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  /** Setting roomsCount to 0 removes the line, same as removeItem. */
  updateRoomsCount: (key: string, roomsCount: number) => void;
  clear: () => void;
  itemCount: number;
  grandTotal: number;
  /** Bumps to Date.now() whenever a line's quantity increases — lets the navbar nudge "Go to Cart". */
  lastAddedAt: number | null;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "corniche-cart";

export function lineKey(roomSlug: string, checkIn: string, checkOut: string) {
  return `${roomSlug}__${checkIn}__${checkOut}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt/unavailable storage — cart just starts empty
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full/unavailable — cart still works for this page view
    }
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "key">) {
    const key = lineKey(item.roomSlug, item.checkIn, item.checkOut);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, roomsCount: i.roomsCount + item.roomsCount } : i));
      }
      return [...prev, { ...item, key }];
    });
    setLastAddedAt(Date.now());
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function updateRoomsCount(key: string, roomsCount: number) {
    const next = Math.max(0, roomsCount);
    if (next === 0) {
      removeItem(key);
      return;
    }
    const existing = items.find((i) => i.key === key);
    if (existing && next > existing.roomsCount) {
      setLastAddedAt(Date.now());
    }
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, roomsCount: next } : i)));
  }

  function clear() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.roomsCount, 0);
  const grandTotal = items.reduce((sum, i) => sum + i.totalPrice * i.roomsCount, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateRoomsCount, clear, itemCount, grandTotal, lastAddedAt }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
