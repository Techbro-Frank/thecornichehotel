/**
 * @file Room Detail Page — Server wrapper
 * @description Looks up the room by its slug, 404s if it doesn't exist,
 *   generates per-room metadata (including OG images from that room's own
 *   photos, so link previews and search results show the right room), a
 *   Product/Offer JSON-LD block so the price can appear in search, and hands
 *   the room (plus every other room, for the "Explore Other Rooms" section)
 *   to the client component.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllRooms, getRoomBySlug } from "@/lib/rooms-data";
import { buildRoomSchema } from "@/lib/seo";
import JsonLd from "@/components/seo/json-ld";
import RoomDetailClient from "./room-detail-client";

export function generateStaticParams() {
  return getAllRooms().map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) return { title: "Room Not Found" };

  const ogImage = encodeURI(room.images[0]);
  const description = `${room.description.slice(0, 140)}… ${room.price} at The Corniche Hotel, Lekki.`;

  return {
    title: room.name,
    description,
    alternates: { canonical: `/rooms/${room.slug}` },
    openGraph: {
      title: `${room.name} — The Corniche Hotel`,
      description,
      url: `/rooms/${room.slug}`,
      images: [ogImage],
    },
    twitter: { images: [ogImage] },
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) notFound();

  const otherRooms = getAllRooms().filter((r) => r.slug !== slug);

  return (
    <>
      <JsonLd data={buildRoomSchema(room)} />
      <RoomDetailClient room={room} otherRooms={otherRooms} />
    </>
  );
}
