// Search-box autocomplete of Agoda and Trip.com, shared by hotels.mts and stays.mts.
// These are the endpoints the sites' own search boxes call; keep the pace polite.

export const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function km(aLat: number, aLng: number, bLat: number, bLng: number) {
  const r = Math.PI / 180;
  const x = Math.sin(((bLat - aLat) * r) / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(((bLng - aLng) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
}

const STOP = new Set(["the", "and", "del", "des"]);
const words = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
/** More than half the words of each name appear in the other ("Kai Tak Stadium" ≠ "Kai Tak Cruise Terminal"). */
export function sameName(a: string, b: string) {
  const wa = words(a);
  const wb = words(b);
  const shared = wa.filter((w) => wb.includes(w)).length;
  return shared / wa.length > 0.5 && shared / wb.length > 0.5;
}

// ── Agoda ────────────────────────────────────────────────────────────────────

export interface AgodaItem {
  Name: string;
  ResultUrl: string;
  CityId: number;
  DisplayNames?: { Name?: string; GeoHierarchyName?: string; CategoryName?: string } | null;
}

export async function agodaSuggest(text: string): Promise<AgodaItem[]> {
  const url = `https://www.agoda.com/api/cronos/search/GetUnifiedSuggestResult/3/1/1/0/en-us/?searchText=${encodeURIComponent(text)}&origin=KR`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Agoda ${res.status}`);
  return ((await res.json()) as { ViewModelList?: AgodaItem[] }).ViewModelList ?? [];
}

// ── Trip.com ─────────────────────────────────────────────────────────────────

export interface TripKeyword {
  keyword: { keywordContentInfo: { keywordId: number; keyword: string; tripType: string; coordinateItemList?: { coordinateType: string; latitude: string; longitude: string }[] } };
  controlInfo?: { regionInfo?: { basicCityModel?: { cityId: number } } };
}

export async function tripSuggest(text: string): Promise<TripKeyword[]> {
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

export function place(k: TripKeyword) {
  const info = k.keyword.keywordContentInfo;
  const c = info.coordinateItemList?.find((x) => x.coordinateType === "GOOGLE");
  const lat = Number(c?.latitude);
  const lng = Number(c?.longitude);
  return { info, cityId: k.controlInfo?.regionInfo?.basicCityModel?.cityId, lat, lng, hasCoords: !!c && lat !== -1 };
}
