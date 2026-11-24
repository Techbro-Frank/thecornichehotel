"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, BedDouble, RefreshCw, XCircle, LogIn, LogOut } from "lucide-react";

interface NotificationRow {
  id: number;
  type: string;
  title: string;
  message: string;
  booking_id: string | null;
  is_read: number;
  created_at: string;
}

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  order_confirmed: BedDouble,
  order_needs_attention: XCircle,
  anli_booking_new: BedDouble,
  anli_booking_modify: RefreshCw,
  anli_booking_cancel: XCircle,
  anli_check_in: LogIn,
  anli_check_out: LogOut,
};

const POLL_MS = 4000;

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [toast, setToast] = useState<NotificationRow | null>(null);
  const lastId = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/notifications?since=${lastId.current}`);
        const data = await res.json();
        if (cancelled || !data.notifications?.length) return;

        setNotifications((prev) => [...data.notifications].reverse().concat(prev));
        lastId.current = data.notifications[data.notifications.length - 1].id;
        setToast(data.notifications[data.notifications.length - 1]);
        setTimeout(() => setToast(null), 5000);
      } catch {
        // transient fetch failure — next poll tick will retry
      }
    }

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  async function markRead(id: number) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)));
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <main className="min-h-screen bg-beige pt-10 pb-20">
      <div className="container-luxury max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Bell size={22} className="text-gold" />
          <h1 className="font-[family-name:var(--font-heading)] text-2xl text-dark tracking-[0.05em] uppercase font-light">
            Front Desk Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </div>

        {notifications.length === 0 && (
          <p className="text-muted text-sm">No notifications yet — new bookings and Anli events will appear here live.</p>
        )}

        <div className="flex flex-col gap-3">
          {notifications.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 bg-white border p-4 transition-colors ${
                  n.is_read ? "border-[#E6DED5]/40 opacity-60" : "border-gold/40 shadow-card"
                }`}
              >
                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-beige text-gold rounded-full">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark">{n.title}</p>
                  <p className="text-sm text-dark-soft/80">{n.message}</p>
                  <p className="text-xs text-muted mt-1">{n.created_at}</p>
                </div>
                {!n.is_read && (
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    className="flex-shrink-0 p-2 text-muted hover:text-gold transition-colors"
                    aria-label="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 bg-dark text-white px-5 py-3 rounded-lg shadow-2xl text-sm flex items-center gap-2"
          >
            <Bell size={14} className="text-gold" />
            {toast.title}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
