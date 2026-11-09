// Picks the hotels closest to each venue and finds each one's Agoda and Trip.com
// property ID, so concert pages can link straight to that hotel with the show
// date filled in. Candidates are the OSM hotels in nearby.json (within 1 km) and the
// hotels Trip.com suggests within 2 km; a hotel is kept only if a booking site has it.
// Run nearby.mts first for new venues.
// Writes data/concerts/stays.json.
//
//   node scripts/concerts/stays.mts          # only venues not in stays.json yet
//   node scripts/concerts/stays.mts --all    # refresh every venue
//   node scripts/concerts/stays.mts <venueId> ...

import { existsSync } from "node:fs";
import path from "node:path";
import { DATA, loadData, readJson, today, writeJson } from "./lib.mts";
import type { NearbyFile, StayHotel, StaysFile, Venue } from "../../src/lib/concerts/types.ts";
import { type AgodaItem, agodaSuggest, place, sleep, tripSuggest } from "./booking-sites.mts";
import { meters } from "./osm.mts";

const FILE = path.join(DATA, "stays.json");
const RADIUS_M = 2000;
const MAX_HOTELS = 5;
const MAX_CANDIDATES = 12;
const SAME_PLACE_M = 400; // a booking-site hotel this close to the OSM one is the same building

interface Candidate {
  name: string;
  nameEn?: string;
  lat: number;
  lng: number;
  distance: number;
  tripId?: string; // known already when Trip.com suggested it
  tripName?: string;
}

// Hotel chains share most of a name ("nine hours Suidobashi" vs "nine hours Hamamatsucho"),
// so every word of the shorter name must appear in the longer one, ignoring filler words.
const FILLER = new Set(["hotel", "hotels", "the", "and", "by", "inn"]);
const hotelWords = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter((w) => w && !FILLER.has(w));
function sameHotel(a: string, b: string) {
  const [short, long] = [hotelWords(a), hotelWords(b)].sort((x, y) => x.length - y.length);
  return short.length > 0 && short.every((w) => long.includes(w));
}
/** Stricter, for Agoda (no coordinates to check): the longer name may add only the city or country. */
function sameHotelIn(a: string, b: string, v: Venue) {
  if (!sameHotel(a, b)) return false;
  const [short, long] = [hotelWords(a), hotelWords(b)].sort((x, y) => x.length - y.length);
  const place = new Set(hotelWords(`${v.city} ${v.country}`));
  return long.every((w) => short.includes(w) || place.has(w));
}

const nearby: NearbyFile = readJson(path.join(DATA, "nearby.json"));

/** Hotels Trip.com suggests for the venue's name that are within RADIUS_M (they come with coordinates and IDs). */
async function tripNear(v: Venue): Promise<Candidate[]> {
  const out: Candidate[] = [];
  for (const q of [v.name, `${v.name} hotel`]) {
    for (const p of (await tripSuggest(q)).map(place)) {
      if (p.info.tripType !== "H" || !p.hasCoords) continue;
      const distance = meters(v.lat, v.lng, p.lat, p.lng);
      if (distance <= RADIUS_M)
        out.push({ name: p.info.keyword, lat: p.lat, lng: p.lng, distance, tripId: String(p.info.keywordId), tripName: p.info.keyword });
    }
    await sleep(700);
  }
  return out;
}

/** OSM hotels already in nearby.json (within 1 km), plus Trip.com's nearby hotels; one entry per building, nearest first. */
async function candidates(v: Venue): Promise<Candidate[]> {
  const osm: Candidate[] = (nearby.venues[v.id]?.hotels ?? []).map((h) => ({
    name: h.name,
    nameEn: h.nameEn,
    lat: h.lat,
    lng: h.lng,
    distance: h.distance,
  }));
  const all = [...osm, ...(await tripNear(v))].sort((a, b) => a.distance - b.distance);
  const kept: Candidate[] = [];
  for (const c of all) {
    const dup = kept.find((k) => meters(k.lat, k.lng, c.lat, c.lng) <= 60 || sameHotel(k.name, c.name));
    if (dup) {
      dup.tripId ??= c.tripId;
      dup.tripName ??= c.tripName;
    } else kept.push(c);
  }
  return kept.slice(0, MAX_CANDIDATES);
}

/** Trip.com hotel at the same spot (within SAME_PLACE_M), with its English name. */
async function tripHotel(c: Candidate, v: Venue) {
  for (const q of [c.nameEn, c.name, `${c.nameEn ?? c.name} ${v.city}`].filter((x, i, a): x is string => !!x && a.indexOf(x) === i)) {
    for (const p of (await tripSuggest(q)).map(place)) {
      if (p.info.tripType === "H" && p.hasCoords && meters(c.lat, c.lng, p.lat, p.lng) <= SAME_PLACE_M)
        return { id: String(p.info.keywordId), name: p.info.keyword };
    }
    await sleep(700);
  }
  return null;
}

/** Agoda property with a matching name in the venue's country (Agoda's suggest has no coordinates). */
async function agodaHotel(names: string[], v: Venue) {
  const inCountry = (i: AgodaItem) => {
    const geo = i.DisplayNames?.GeoHierarchyName ?? "";
    return geo.includes(v.country) || geo.includes(v.city);
  };
  for (const n of names) {
    const items = await agodaSuggest(`${n} ${v.city}`);
    const hit = items.find((i) => /[?&]hotel=\d+/.test(i.ResultUrl) && inCountry(i) && sameHotelIn(n, i.Name, v));
    if (hit) return { id: hit.ResultUrl.match(/[?&]hotel=(\d+)/)![1], name: hit.Name };
    await sleep(700);
  }
  return null;
}

async function staysFor(v: Venue): Promise<StayHotel[]> {
  const out: StayHotel[] = [];
  for (const c of await candidates(v)) {
    if (out.length >= MAX_HOTELS) break;
    const trip = c.tripId ? { id: c.tripId, name: c.tripName ?? c.name } : await tripHotel(c, v);
    if (!c.tripId) await sleep(700);
    // Trip.com's English name is the best key for Agoda; then OSM's names.
    const names = [trip?.name, c.nameEn, c.name].filter((x, i, a): x is string => !!x && a.indexOf(x) === i);
    const agoda = await agodaHotel(names, v);
    await sleep(700);
    if (!trip && !agoda) continue;
    if (/[|]/.test(trip?.name ?? "")) continue; // ad-style rental listings ("5-min walk | free parking")
    if (out.some((o) => (agoda && o.agodaId === agoda.id) || (trip && o.tripId === trip.id))) continue;
    // Prefer a name in Latin script; the local name is shown under it.
    const labels = [trip?.name, agoda?.name, c.nameEn, c.name].filter((x): x is string => !!x);
    const name = labels.find((n) => /^[\p{Script=Latin}\p{N}\p{P}\p{S}\s]+$/u.test(n)) ?? labels[0];
    out.push({
      name,
      ...(c.name !== name && { localName: c.name }),
      lat: Math.round(c.lat * 1e6) / 1e6,
      lng: Math.round(c.lng * 1e6) / 1e6,
      distance: c.distance,
      ...(agoda && { agodaId: agoda.id }),
      ...(trip && { tripId: trip.id }),
    });
    console.log(`  ${String(c.distance).padStart(5)} m  ${name}  agoda:${agoda ? agoda.name : "-"}  trip:${trip ? "✓" : "-"}`);
  }
  return out;
}

const args = process.argv.slice(2);
const all = args.includes("--all");
const only = args.filter((a) => !a.startsWith("--"));
const { venues } = loadData();
const data: StaysFile = existsSync(FILE) ? readJson(FILE) : { venues: {} };

for (const v of venues) {
  if (only.length ? !only.includes(v.id) : !all && data.venues[v.id]) continue;
  console.log(v.id);
  try {
    data.venues[v.id] = { fetchedAt: today(), hotels: await staysFor(v) };
  } catch (e) {
    console.log(`  ${(e as Error).message}`);
  }
  writeJson(FILE, data);
  await sleep(2000);
}
