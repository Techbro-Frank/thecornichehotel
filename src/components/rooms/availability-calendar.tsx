/**
 * @file AvailabilityCalendar — per-room month view with green/red day dots
 * @description Not mounted until a guest explicitly opens it (see
 *   RoomBookingPanel) — Anli's live-availability endpoint has no per-day
 *   breakdown, so painting a month costs one call per day server-side
 *   (/api/availability/calendar). Each month fetched is cached in this
 *   component's state for the rest of the session, so flipping back and
 *   forth between months a guest has already seen is free.
 */

"use client";

import { useEffect, useState } from "react";
import { addMonths, format, getDay, startOfMonth, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { CalendarDay } from "@/app/api/availability/calendar/route";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function AvailabilityCalendar({ roomSlug }: { roomSlug: string }) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [cache, setCache] = useState<Record<string, CalendarDay[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monthKey = format(cursor, "yyyy-MM");
  const days = cache[monthKey];

  useEffect(() => {
    if (cache[monthKey]) return; // already fetched this month this session

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/availability/calendar?roomSlug=${roomSlug}&month=${monthKey}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setCache((prev) => ({ ...prev, [monthKey]: data.days }));
      })
      .catch(() => {
        if (!cancelled) setError("Could not load availability for this month.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey, roomSlug]);

  const leadingBlanks = days && days.length > 0 ? getDay(new Date(days[0].date)) : 0;

  return (
    <div className="bg-white border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCursor((c) => subMonths(c, 1))}
          className="p-1.5 text-muted hover:text-gold transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-medium text-dark">{format(cursor, "MMMM yyyy")}</p>
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          className="p-1.5 text-muted hover:text-gold transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted mb-2">
        {WEEKDAY_LABELS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {loading && !days && (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={20} className="text-gold animate-spin" />
        </div>
      )}

      {error && <p className="text-xs text-red-600 text-center py-6">{error}</p>}

      {days && (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {days.map((day) => {
            const dayNum = Number(day.date.split("-")[2]);
            const dotColor =
              day.available == null ? null : day.available ? "bg-emerald-500" : "bg-red-500";
            return (
              <div key={day.date} className="flex flex-col items-center gap-1 py-1.5">
                <span className={`text-xs ${day.available == null ? "text-muted/50" : "text-dark"}`}>{dayNum}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor ?? "bg-transparent"}`} />
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-center gap-5 mt-4 pt-4 border-t border-border text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Fully Booked
        </span>
      </div>
    </div>
  );
}
