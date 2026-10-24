import type { Venue } from "./types";

// Map shortcuts. Rough boxes are enough: every venue is in a big city.
export type Region = "all" | "asia" | "europe" | "americas" | "oceania";

export const REGIONS: { id: Region; label: string }[] = [
  { id: "asia", label: "Asia" },
  { id: "europe", label: "Europe" },
  { id: "americas", label: "Americas" },
  { id: "oceania", label: "Oceania" },
  { id: "all", label: "World" },
];

export function inRegion(v: Pick<Venue, "lat" | "lng">, region: Region) {
  if (region === "all") return true;
  if (region === "americas") return v.lng < -30;
  if (region === "europe") return v.lng >= -30 && v.lng <= 60;
  if (region === "oceania") return v.lng > 100 && v.lat < -10;
  return v.lng > 60 && v.lat >= -10; // asia
}
