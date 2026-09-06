/**
 * @file Rooms Data — Server-only room catalogue
 * @description Single source of truth for every room type: its photo folder
 *   (read from disk so new photos just work), pricing/specs, and the full
 *   characteristics copy shown on each room's detail page. Shared by the
 *   Rooms & Suites listing page and each room's dynamic detail page.
 *
 *   Note: the characteristics text for Studio Apartment, Presidential Suite,
 *   Signature Suite, Executive Suite, Signature Room, and Kings Room was
 *   supplied identically for all six (verbatim from the source material,
 *   including references to "Studio Apartment" in each one's own bullet
 *   list) — that's worth revisiting with real per-room copy later.
 */

import fs from "fs";
import path from "path";

export interface RoomDetails {
  slug: string;
  name: string;
  price: string;
  images: string[];
  size: number;
  maxAdults: number;
  maxChildren: number;
  description: string;
  features: string[];
}

const SHARED_SUITE_DESCRIPTION =
  "A vast 45m² dwelling, the suite consists of a bedroom and living room. As the perfect finishing touch, the Corniche Hotel attentively welcomes you with a bottle of champagne and fine chocolates to enjoy as you curl up comfortably on your sofa… Equipped with the latest technology (Bluetooth speakers, 55’’ flat-screen TV, free WIFI access), it also has a cooker, microwave and a kettle with an unlimited selection of teas and coffees. In the bathroom, Japanese bath, separated shower, anti-fog mirror, and amenities by The Corniche.";

const sharedSuiteFeatures = (label: string): string[] => [
  `${label} of 45m² for 4 pax max`,
  "Double Queen size bed 180x200",
  "Sofa bed",
  "Computer-sized safe",
  "Hospitality tray: tea-coffee with kettle",
  "Deluxe minibar",
  "Telephone",
  "Spanish shower & Japanese bath",
  "Corniche Hospitality products",
  "Terry towel dressing gown with matching slippers",
  "Hairdryer",
  "Smart TV",
  "International channels by satellite",
  "Free WiFi",
  "Individual air-conditioning",
  "Double glazed windows with soundproofing",
  "Wake up call available on request",
  "US/UK plug adapters (on request)",
  "Room service",
  "Laundry service",
  "Free cot on request (on request)",
  "Concierge available 24 hours a day",
  "No-smoking bedroom and hotel",
];

interface RoomConfig {
  folder: string;
  coverFile: string;
  name: string;
  price: string;
  size: number;
  maxAdults: number;
  maxChildren: number;
  description: string;
  features: string[];
}

const ROOM_CONFIGS: RoomConfig[] = [
  {
    folder: "Standard Room",
    coverFile: "IMG_8013.jpg",
    name: "Standard Room",
    price: "From ₦120,000 / Night",
    size: 15,
    maxAdults: 2,
    maxChildren: 1,
    description:
      "Handsomely appointed with rounded windows, this 15m² room overlooks the inner courtyard and forms a tranquil cocoon that invites rest and relaxation. Equipped with the latest technology (Bluetooth speakers, 36’’ flat-screen TV, WIFI), it offers every modern convenience. The bathroom boasts a bathrobe, slippers, and paraben-free complimentary toiletries awaiting you as you step out of the Spanish rainfall shower.",
    features: [
      "Standard room of 15m² for 2 pax max",
      "Double Queen size bed 160x200",
      "View of the courtyard",
      "Computer-sized safe",
      "Hospitality tray: tea-coffee with kettle",
      "Deluxe minibar",
      "Telephone",
      "Spanish shower",
      "Corniche Hospitality products",
      "Hairdryer",
      "TV",
      "International channels by satellite",
      "Free WiFi",
      "Individual air-conditioning",
      "Double glazed windows with soundproofing",
      "Wake up call available on request",
      "US/UK plug adapters (on request)",
      "Room service",
      "Safe",
      "Laundry service",
      "Free cot on request (on request)",
      "Concierge available 24 hours a day",
      "No-smoking bedroom and hotel",
    ],
  },
  {
    folder: "Executive Double ",
    coverFile: "IMG_8938.jpg",
    name: "Executive Double",
    price: "From ₦145,000 / Night",
    size: 26,
    maxAdults: 2,
    maxChildren: 1,
    description:
      "With a view of the terrace, this 26m² room provides a comfortable space for living or working. Desk, chair, dressing room…each element has been specially designed or selected by the architect for the Corniche Hotel. Equipped with the latest technology (Bluetooth speakers, 36’’ flat-screen TV, WIFI), it also has a Nespresso coffee machine.",
    features: [
      "Executive Double of 26m² for 2 pax max",
      "Double Queen size bed 160x200",
      "Computer-sized safe",
      "Hospitality tray: tea-coffee with kettle",
      "Deluxe minibar",
      "Telephone",
      "Italian shower",
      "Corniche Hospitality products",
      "Terry towel dressing gown with matching slippers",
      "Hairdryer",
      "TV",
      "International channels by satellite",
      "Free WiFi",
      "Individual air-conditioning",
      "Double glazed windows with soundproofing",
      "Wake up call available on request",
      "US/UK plug adapters (on request)",
      "Room service",
      "Laundry service",
      "Free cot on request (on request)",
      "Concierge available 24 hours a day",
      "No-smoking bedroom and hotel",
    ],
  },
  {
    folder: "Signature Executive",
    coverFile: "IMG_0541.jpg",
    name: "Signature Executive",
    price: "From ₦140,000 / Night",
    size: 30,
    maxAdults: 2,
    maxChildren: 1,
    description:
      "With an average surface of 30m². This room is bathed in natural light. Soft colours and indirect lighting create a particularly soothing atmosphere. Equipped with the latest technology (Bluetooth speakers, 55’’ flat-screen TV, free WIFI), it also has an unlimited selection of coffees. In the bathroom separated shower, single vanity, anti-fog mirror, and amenities by The Corniche.",
    features: [
      "Signature Executive of 30m² for 2 pax max",
      "Double Queen size bed 180x200",
      "Computer-sized safe",
      "Hospitality tray: tea-coffee with kettle",
      "Deluxe minibar",
      "Telephone",
      "Spanish shower & Japanese bath",
      "Corniche Hospitality products",
      "Terry towel dressing gown with matching slippers",
      "Hairdryer",
      "TV",
      "International channels by satellite",
      "Free WiFi",
      "Individual air-conditioning",
      "Double glazed windows with soundproofing",
      "Wake up call available on request",
      "US/UK plug adapters (on request)",
      "Room service",
      "Laundry service",
      "Free cot on request (on request)",
      "Concierge available 24 hours a day",
      "No-smoking bedroom and hotel",
    ],
  },
  {
    folder: "Studio Apartment",
    coverFile: "IMG_1128.jpg",
    name: "Studio Apartment",
    price: "From ₦180,000 / Night",
    size: 45,
    maxAdults: 4,
    maxChildren: 1,
    description: SHARED_SUITE_DESCRIPTION,
    features: sharedSuiteFeatures("Studio Apartment"),
  },
  {
    folder: "Presidential Suite",
    coverFile: "IMG_4500.jpg",
    name: "Presidential Suite",
    price: "From ₦270,000 / Night",
    size: 45,
    maxAdults: 4,
    maxChildren: 1,
    description: SHARED_SUITE_DESCRIPTION,
    features: sharedSuiteFeatures("Presidential Suite"),
  },
  {
    folder: "Signature Suite",
    coverFile: "IMG_4400.jpg",
    name: "Signature Suite",
    price: "From ₦250,000 / Night",
    size: 45,
    maxAdults: 4,
    maxChildren: 1,
    description: SHARED_SUITE_DESCRIPTION,
    features: sharedSuiteFeatures("Signature Suite"),
  },
  {
    folder: "Executive Suite",
    coverFile: "IMG_4215.jpg",
    name: "Executive Suite",
    price: "From ₦200,000 / Night",
    size: 45,
    maxAdults: 4,
    maxChildren: 1,
    description: SHARED_SUITE_DESCRIPTION,
    features: sharedSuiteFeatures("Executive Suite"),
  },
  {
    folder: "Signature Room",
    coverFile: "IMG_4372.jpg",
    name: "Signature Room",
    price: "From ₦170,000 / Night",
    size: 45,
    maxAdults: 4,
    maxChildren: 1,
    description: SHARED_SUITE_DESCRIPTION,
    features: sharedSuiteFeatures("Signature Room"),
  },
  {
    folder: "King’s room",
    coverFile: "IMG_5596.jpg",
    name: "Kings Room",
    price: "From ₦150,000 / Night",
    size: 45,
    maxAdults: 4,
    maxChildren: 1,
    description: SHARED_SUITE_DESCRIPTION,
    features: sharedSuiteFeatures("Kings Room"),
  },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Reads a room's photo folder from disk, curated cover shot first, rest sorted after. */
function getRoomImages(folder: string, coverFile: string): string[] {
  const dir = path.join(process.cwd(), "public", "images", folder);
  try {
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort();
    const ordered = files.includes(coverFile)
      ? [coverFile, ...files.filter((f) => f !== coverFile)]
      : files;
    return ordered.map((f) => `/images/${folder}/${f}`);
  } catch {
    return [];
  }
}

export function getAllRooms(): RoomDetails[] {
  return ROOM_CONFIGS.map(({ folder, coverFile, ...rest }) => ({
    ...rest,
    slug: slugify(rest.name),
    images: getRoomImages(folder, coverFile),
  })).filter((room) => room.images.length > 0);
}

export function getRoomBySlug(slug: string): RoomDetails | undefined {
  return getAllRooms().find((room) => room.slug === slug);
}
