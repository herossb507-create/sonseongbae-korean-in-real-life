import nearbyJson from "../../../data/concerts/nearby.json";
import staysJson from "../../../data/concerts/stays.json";
import type { NearbyFile, StaysFile } from "./types";

// OpenStreetMap places and bookable hotels near each venue (server-side only: the JSON is large).

const nearby = nearbyJson as unknown as NearbyFile;

export const NEARBY_ATTRIBUTION = nearby.attribution;

export function nearbyPlaces(venueId: string) {
  return nearby.venues[venueId] ?? null;
}

export function mapsLink(place: { name: string; lat: number; lng: number }, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${city}`)}`;
}

const stays = staysJson as unknown as StaysFile;

/** Hotels closest to the venue that Agoda or Trip.com list, nearest first. */
export function staysNear(venueId: string) {
  return stays.venues[venueId] ?? null;
}

export function walkingMinutes(p: { distance: number }) {
  return Math.max(1, Math.round(p.distance / 80)); // ~80 m a minute, as the crow flies
}
