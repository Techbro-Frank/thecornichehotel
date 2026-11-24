#!/usr/bin/env node
/**
 * Regenerates src/lib/room-images.generated.json from the actual contents of
 * public/images/<folder> for each room. Run this after adding, removing, or
 * reordering a room's photos — rooms-data.ts reads the generated file at
 * runtime instead of the filesystem (public/** is excluded from each
 * deployed serverless function's bundle, so it isn't there to read live).
 *
 * Keep this list of { folder, coverFile } pairs in sync with ROOM_CONFIGS in
 * src/lib/rooms-data.ts.
 */
import fs from "fs";
import path from "path";

const ROOMS = [
  { folder: "Standard Room", coverFile: "IMG_8013.jpg" },
  { folder: "Executive Double ", coverFile: "IMG_8938.jpg" },
  { folder: "Signature Executive", coverFile: "IMG_0541.jpg" },
  { folder: "Studio Apartment", coverFile: "IMG_1128.jpg" },
  { folder: "Presidential Suite", coverFile: "IMG_4500.jpg" },
  { folder: "Signature Suite", coverFile: "IMG_4400.jpg" },
  { folder: "Executive Suite", coverFile: "IMG_4215.jpg" },
  { folder: "Signature Room", coverFile: "IMG_4372.jpg" },
  { folder: "King’s room", coverFile: "IMG_5596.jpg" },
];

const manifest = {};

for (const { folder, coverFile } of ROOMS) {
  const dir = path.join(process.cwd(), "public", "images", folder);
  let files;
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort();
  } catch (err) {
    console.error(`Could not read "${dir}": ${err.message}`);
    continue;
  }

  const ordered = files.includes(coverFile) ? [coverFile, ...files.filter((f) => f !== coverFile)] : files;
  manifest[folder] = ordered.map((f) => `/images/${folder}/${f}`);
  console.log(`${folder} -> ${manifest[folder].length} images`);
}

const outPath = path.join(process.cwd(), "src", "lib", "room-images.generated.json");
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${outPath}`);
