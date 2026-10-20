import type { ConcertStatus, ConcertWithRefs, SourceRef, Venue } from "./types";

// Pure helpers, safe to import from client components (no data imports).

// Cities are derived from venues: "seoul-kr", "los-angeles-us".
export function citySlug(v: Venue) {
  const name = v.city
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${name}-${v.countryCode.toLowerCase()}`;
}

export interface VenueGroup {
  venue: Venue;
  concerts: ConcertWithRefs[];
}

export function groupByVenue(list: ConcertWithRefs[]): VenueGroup[] {
  const groups = new Map<string, VenueGroup>();
  for (const c of list) {
    const g = groups.get(c.venue.id) ?? { venue: c.venue, concerts: [] };
    g.concerts.push(c);
    groups.set(c.venue.id, g);
  }
  return [...groups.values()];
}

export const STATUS_LABEL: Record<ConcertStatus, string> = {
  announced: "Announced",
  onsale: "On sale",
  soldout: "Sold out",
  cancelled: "Cancelled",
};

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  // Parse as a plain calendar date so the venue's local date never shifts.
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    ...opts,
  });
}

const SOURCE_KIND: Record<SourceRef["source"], string> = {
  official: "Official",
  news: "News report",
  ticketmaster: "Ticketmaster",
  seatgeek: "SeatGeek",
  manual: "Manual",
  sample: "Sample",
};

/** "Official · thekallang.com.sg" */
export function sourceLabel(r: SourceRef) {
  let host = r.url;
  try {
    host = new URL(r.url).hostname.replace(/^www\./, "");
  } catch {}
  return `${SOURCE_KIND[r.source]} · ${host}`;
}

export function flag(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65));
}
