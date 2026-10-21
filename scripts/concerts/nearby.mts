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

const FILE = path.join(DATA, "nearby.json");
const RADIUS_M = 1000;
const MAX_FOOD = 8;
const MAX_HOTELS = 5;
// Public Overpass servers, tried in turn when one is down or busy.
const ENDPOINTS = ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter"];
const UA = "korean-in-real-life-concert-map/1.0 (nearby places for venue pages)";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function meters(aLat: number, aLng: number, bLat: number, bLng: number) {
  const r = Math.PI / 180;
  const x = Math.sin(((bLat - aLat) * r) / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(((bLng - aLng) * r) / 2) ** 2;
  return Math.round(12742000 * Math.asin(Math.sqrt(x)));
}

interface OsmElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

async function overpass(lat: number, lng: number): Promise<OsmElement[]> {
  const around = `(around:${RADIUS_M},${lat},${lng})`;
  const query = `[out:json][timeout:60];
(
  nwr["amenity"~"^(restaurant|cafe|fast_food)$"]["name"]${around};
  nwr["tourism"~"^(hotel|hostel|guest_house)$"]["name"]${around};
);
out center tags;`;
  let last = "";
  for (let attempt = 0; attempt < 4; attempt++) {
    const endpoint = ENDPOINTS[attempt % ENDPOINTS.length];
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(90_000),
      });
      if (res.ok) return ((await res.json()) as { elements: OsmElement[] }).elements;
      last = `${new URL(endpoint).host} ${res.status}`;
      if (res.status !== 429 && res.status < 500) break;
    } catch (e) {
      last = `${new URL(endpoint).host} ${(e as Error).name}`; // timeout or network error
    }
    await sleep(10000); // rate limited or busy
  }
  throw new Error(`Overpass failed: ${last}`);
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
