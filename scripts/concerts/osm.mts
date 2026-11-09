// OpenStreetMap Overpass API helpers. OSM data is © OpenStreetMap contributors, ODbL.

// Public Overpass servers, tried in turn when one is down or busy.
const ENDPOINTS = ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter"];
const UA = "korean-in-real-life-concert-map/1.0 (nearby places for venue pages)";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function meters(aLat: number, aLng: number, bLat: number, bLng: number) {
  const r = Math.PI / 180;
  const x = Math.sin(((bLat - aLat) * r) / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(((bLng - aLng) * r) / 2) ** 2;
  return Math.round(12742000 * Math.asin(Math.sqrt(x)));
}

export interface OsmElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export async function runOverpass(query: string): Promise<OsmElement[]> {
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
