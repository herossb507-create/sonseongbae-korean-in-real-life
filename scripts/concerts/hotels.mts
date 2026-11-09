// Looks up each venue on Agoda and Trip.com so hotel links can open
// "hotels near <venue>" instead of a whole-city search. Writes the IDs into
// venues.json (externalIds.agoda / externalIds.tripcom).
//
//   node scripts/concerts/hotels.mts          # only venues without IDs
//   node scripts/concerts/hotels.mts --all    # refresh every venue
//
// Both sites' search-box autocomplete endpoints are used, at a polite pace.
// Print-out lists every match so a person can eyeball wrong ones.

import path from "node:path";
import { DATA, loadData, writeJson } from "./lib.mts";
import type { Venue } from "../../src/lib/concerts/types.ts";
import { agodaSuggest, km, place, sameName, sleep, tripSuggest } from "./booking-sites.mts";

// ── Agoda ────────────────────────────────────────────────────────────────────

async function agoda(v: Venue): Promise<{ poi?: string; city?: string; match: string }> {
  // With the city first, so "Queen Elizabeth Theatre" finds the right one of two.
  for (const q of [`${v.name} ${v.city}`, v.name]) {
    const items = await agodaSuggest(q);
    const poi = items.find((i) => /[?&]poi=\d+/.test(i.ResultUrl) && sameName(v.name, i.Name));
    if (poi) return { poi: poi.ResultUrl.match(/[?&]poi=(\d+)/)![1], match: `poi ${poi.Name}` };
    await sleep(800);
  }
  await sleep(800);
  const cities = await agodaSuggest(v.city);
  const city = cities.find((i) => /[?&]city=\d+/.test(i.ResultUrl));
  if (city) return { city: city.ResultUrl.match(/[?&]city=(\d+)/)![1], match: `city ${city.Name}` };
  return { match: "none" };
}

// ── Trip.com ─────────────────────────────────────────────────────────────────

type TripIds = NonNullable<NonNullable<Venue["externalIds"]>["tripcom"]>;

async function tripcom(v: Venue): Promise<{ ids?: TripIds; match: string }> {
  let cityId: number | undefined;
  for (const q of [v.name, `${v.name} ${v.city}`]) {
    for (const p of (await tripSuggest(q)).map(place)) {
      if (!p.cityId || !p.hasCoords) continue;
      const d = km(v.lat, v.lng, p.lat, p.lng);
      if (p.info.tripType === "LM" && d <= 3)
        return {
          ids: { cityId: p.cityId, landmarkId: p.info.keywordId, name: p.info.keyword, lat: p.lat, lng: p.lng },
          match: `landmark ${p.info.keyword} (${d.toFixed(1)} km)`,
        };
      if (d <= 30) cityId ??= p.cityId; // a hotel in the same city
    }
    await sleep(800);
  }
  if (!cityId) {
    const city = (await tripSuggest(v.city)).map(place).find((p) => p.info.tripType === "CT" && sameName(v.city, p.info.keyword));
    cityId = city?.cityId;
  }
  return cityId ? { ids: { cityId }, match: `city ${cityId}` } : { match: "none" };
}

// ── Main ─────────────────────────────────────────────────────────────────────

// Matches the lookup gets wrong, checked by hand.
const OVERRIDES: Record<string, NonNullable<Venue["externalIds"]>> = {
  "qe-theatre-toronto": { agoda: { city: "4495" } }, // name-matches "Queen Elizabeth Hospital"
};

const all = process.argv.includes("--all");
const { venues } = loadData();

for (const v of venues) {
  if (!all && v.externalIds?.agoda && v.externalIds?.tripcom) continue;
  const a = await agoda(v).catch((e: Error) => ({ match: `error ${e.message}` }) as Awaited<ReturnType<typeof agoda>>);
  await sleep(800);
  const t = await tripcom(v).catch((e: Error) => ({ match: `error ${e.message}` }) as Awaited<ReturnType<typeof tripcom>>);
  await sleep(800);
  const ext = { ...v.externalIds };
  if (a.poi || a.city) ext.agoda = { ...(a.poi ? { poi: a.poi } : { city: a.city }) };
  if (t.ids) ext.tripcom = t.ids;
  v.externalIds = { ...ext, ...OVERRIDES[v.id] };
  console.log(`${v.id.padEnd(32)} agoda: ${a.match.padEnd(45)} trip: ${t.match}`);
}

writeJson(path.join(DATA, "venues.json"), venues);
