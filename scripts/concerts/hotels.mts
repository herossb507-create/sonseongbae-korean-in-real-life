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

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function km(aLat: number, aLng: number, bLat: number, bLng: number) {
  const r = Math.PI / 180;
  const x = Math.sin(((bLat - aLat) * r) / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(((bLng - aLng) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
}

const STOP = new Set(["the", "and", "del", "des"]);
const words = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
/** More than half the words of each name appear in the other ("Kai Tak Stadium" ≠ "Kai Tak Cruise Terminal"). */
function sameName(a: string, b: string) {
  const wa = words(a);
  const wb = words(b);
  const shared = wa.filter((w) => wb.includes(w)).length;
  return shared / wa.length > 0.5 && shared / wb.length > 0.5;
}

// ── Agoda ────────────────────────────────────────────────────────────────────

interface AgodaItem { Name: string; ResultUrl: string; CityId: number }

async function agodaSuggest(text: string): Promise<AgodaItem[]> {
  const url = `https://www.agoda.com/api/cronos/search/GetUnifiedSuggestResult/3/1/1/0/en-us/?searchText=${encodeURIComponent(text)}&origin=KR`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Agoda ${res.status}`);
  return ((await res.json()) as { ViewModelList?: AgodaItem[] }).ViewModelList ?? [];
}

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

interface TripKeyword {
  keyword: { keywordContentInfo: { keywordId: number; keyword: string; tripType: string; coordinateItemList?: { coordinateType: string; latitude: string; longitude: string }[] } };
  controlInfo?: { regionInfo?: { basicCityModel?: { cityId: number } } };
}

async function tripSuggest(text: string): Promise<TripKeyword[]> {
  const res = await fetch("https://www.trip.com/restapi/soa2/34951/getHotelKeywords", {
    method: "POST",
    headers: { "User-Agent": UA, "Content-Type": "application/json" },
    body: JSON.stringify({
      queryInfo: { keyword: text, actionType: "destination" },
      head: { platform: "PC", cver: "0", bu: "IBU", group: "trip", locale: "en-XX", region: "XX", currency: "USD", extension: [] },
    }),
  });
  if (!res.ok) throw new Error(`Trip.com ${res.status}`);
  const json = (await res.json()) as { data?: { mainKeywordList?: { keywords?: TripKeyword[] } } };
  return json.data?.mainKeywordList?.keywords ?? [];
}

type TripIds = NonNullable<NonNullable<Venue["externalIds"]>["tripcom"]>;

function place(k: TripKeyword) {
  const info = k.keyword.keywordContentInfo;
  const c = info.coordinateItemList?.find((x) => x.coordinateType === "GOOGLE");
  const lat = Number(c?.latitude);
  const lng = Number(c?.longitude);
  return { info, cityId: k.controlInfo?.regionInfo?.basicCityModel?.cityId, lat, lng, hasCoords: !!c && lat !== -1 };
}

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
