import artistsJson from "../../../data/concerts/artists.json";
import concertsJson from "../../../data/concerts/concerts.json";
import venuesJson from "../../../data/concerts/venues.json";
import type { Artist, Concert, ConcertWithRefs, Venue } from "./types";
import { citySlug } from "./format";

const artists = artistsJson as Artist[];
const venues = venuesJson as Venue[];
const concerts = concertsJson as Concert[];

const artistById = new Map(artists.map((a) => [a.id, a]));
const venueById = new Map(venues.map((v) => [v.id, v]));

const allConcerts: ConcertWithRefs[] = concerts
  .map((c) => {
    const artist = artistById.get(c.artistId);
    const venue = venueById.get(c.venueId);
    if (!artist) throw new Error(`Unknown artist "${c.artistId}" in concert ${c.id}`);
    if (!venue) throw new Error(`Unknown venue "${c.venueId}" in concert ${c.id}`);
    return { ...c, artist, venue };
  })
  .sort((a, b) => a.date.localeCompare(b.date) || a.artist.name.localeCompare(b.artist.name));

export function getConcerts(): ConcertWithRefs[] {
  return allConcerts;
}

export function getConcert(id: string) {
  return allConcerts.find((c) => c.id === id);
}

export function getArtist(id: string) {
  return artistById.get(id);
}

/** Artists that have at least one concert — the ones that get a page. */
export function getListedArtists(): Artist[] {
  const ids = new Set(allConcerts.map((c) => c.artistId));
  return artists.filter((a) => ids.has(a.id)).sort((a, b) => a.name.localeCompare(b.name));
}

export function getConcertsByArtist(artistId: string) {
  return allConcerts.filter((c) => c.artistId === artistId);
}

export function hasSampleData() {
  return allConcerts.some((c) => c.sample);
}

export interface City {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
}

export function getCities(): City[] {
  const cities = new Map<string, City>();
  for (const c of allConcerts) {
    const slug = citySlug(c.venue);
    if (!cities.has(slug))
      cities.set(slug, { slug, name: c.venue.city, country: c.venue.country, countryCode: c.venue.countryCode });
  }
  return [...cities.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getConcertsByCity(slug: string) {
  return allConcerts.filter((c) => citySlug(c.venue) === slug);
}

/** ISO 8601 start time with the venue's UTC offset, e.g. "2027-01-10T19:00:00-08:00". */
export function startDateTime(c: ConcertWithRefs) {
  if (!c.time) return c.date;
  const [y, m, d] = c.date.split("-").map(Number);
  const [hh, mm] = c.time.split(":").map(Number);
  // Offset at (approximately) show time; good enough across DST boundaries for a calendar listing.
  const probe = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const name = new Intl.DateTimeFormat("en-US", { timeZone: c.venue.timezone, timeZoneName: "longOffset" })
    .formatToParts(probe)
    .find((p) => p.type === "timeZoneName")!.value; // "GMT-08:00" or "GMT"
  const offset = name === "GMT" ? "+00:00" : name.slice(3);
  return `${c.date}T${c.time}:00${offset}`;
}
