// Fetches named restaurants, cafés and hotels around each venue from
// OpenStreetMap (Overpass API) into data/concerts/nearby.json.
// OSM data is © OpenStreetMap contributors, ODbL — the concert page shows that credit.
//
//   node scripts/concerts/nearby.mts          # only venues not in nearby.json yet
//   node scripts/concerts/nearby.mts --all    # refresh every venue

import { existsSync } from "node:fs";
import path from "node:path";
import { DATA, loadData, readJson, today, writeJson } from "./lib.mts";
import type { NearbyFile, NearbyPlace } from "../../src/lib/concerts/types.ts";
import { type OsmElement, meters, runOverpass, sleep } from "./osm.mts";

const FILE = path.join(DATA, "nearby.json");
const RADIUS_M = 1000;
const MAX_FOOD = 8;
const MAX_HOTELS = 5;

async function overpass(lat: number, lng: number): Promise<OsmElement[]> {
  const around = `(around:${RADIUS_M},${lat},${lng})`;
  return runOverpass(`[out:json][timeout:60];
(
  nwr["amenity"~"^(restaurant|cafe|fast_food)$"]["name"]${around};
  nwr["tourism"~"^(hotel|hostel|guest_house)$"]["name"]${around};
);
out center tags;`);
}

function toPlace(e: OsmElement, vLat: number, vLng: number): NearbyPlace | null {
  const t = e.tags ?? {};
  const lat = e.lat ?? e.center?.lat;
  const lng = e.lon ?? e.center?.lon;
  if (lat == null || lng == null || !t.name) return null;
  const kind: NearbyPlace["kind"] =
    t.amenity === "restaurant" ? "restaurant" : t.amenity === "cafe" ? "cafe" : t.amenity === "fast_food" ? "fast_food" : "hotel";
  const nameEn = t["name:en"] && t["name:en"] !== t.name ? t["name:en"] : undefined;
  const cuisine = t.cuisine?.split(";").map((c) => c.trim().replace(/_/g, " ")).filter(Boolean).slice(0, 2).join(", ");
  return {
    osm: `${e.type}/${e.id}`,
    name: t.name,
    ...(nameEn && { nameEn }),
    kind,
    ...(cuisine && { cuisine }),
    lat: Math.round(lat * 1e6) / 1e6,
    lng: Math.round(lng * 1e6) / 1e6,
    distance: meters(vLat, vLng, lat, lng),
  };
}

// Prefer places with more detail (likely real, maintained entries), then the closest.
const detail = (p: NearbyPlace) => (p.cuisine ? 1 : 0) + (p.nameEn ? 1 : 0);
function pick(places: NearbyPlace[], max: number) {
  const seen = new Set<string>();
  return places
    .filter((p) => !seen.has(p.name) && seen.add(p.name))
    .sort((a, b) => detail(b) - detail(a) || a.distance - b.distance)
    .slice(0, max)
    .sort((a, b) => a.distance - b.distance);
}

const all = process.argv.includes("--all");
const { venues } = loadData();
const out: NearbyFile = existsSync(FILE) ? readJson(FILE) : { attribution: "© OpenStreetMap contributors (ODbL)", venues: {} };

for (const v of venues) {
  if (!all && out.venues[v.id]) continue;
  try {
    const places = (await overpass(v.lat, v.lng)).map((e) => toPlace(e, v.lat, v.lng)).filter((p): p is NearbyPlace => !!p);
    const food = pick(places.filter((p) => p.kind !== "hotel"), MAX_FOOD);
    const hotels = pick(places.filter((p) => p.kind === "hotel"), MAX_HOTELS);
    out.venues[v.id] = { fetchedAt: today(), radius: RADIUS_M, food, hotels };
    console.log(`${v.id.padEnd(32)} ${String(places.length).padStart(4)} found → ${food.length} food, ${hotels.length} hotels`);
  } catch (e) {
    console.log(`${v.id.padEnd(32)} ${(e as Error).message}`);
  }
  writeJson(FILE, out);
  await sleep(3000);
}
