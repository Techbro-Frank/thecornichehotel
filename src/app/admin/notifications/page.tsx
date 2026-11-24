/**
 * @file /admin/notifications — Server wrapper
 * @description Front-desk feed: every booking made through our own site, plus
 *   every booking/check-in/check-out event Anli pushes from other channels
 *   (OTAs, phone, walk-ins). Not linked from public nav. No login yet — this
 *   is a local/dev-phase view; add real access control before this is ever
 *   exposed beyond localhost.
 */

import type { Metadata } from "next";
import NotificationsClient from "./notifications-client";

export const metadata: Metadata = {
  title: "Front Desk Notifications",
  robots: { index: false, follow: false },
};

export default function AdminNotificationsPage() {
  return <NotificationsClient />;
}
