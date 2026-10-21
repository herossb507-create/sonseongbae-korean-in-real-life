import nearbyJson from "../../../data/concerts/nearby.json";
import type { NearbyFile, NearbyPlace } from "./types";

// OpenStreetMap places near each venue (server-side only: the JSON is large).

const nearby = nearbyJson as unknown as NearbyFile;

export const NEARBY_ATTRIBUTION = nearby.attribution;

export function nearbyPlaces(venueId: string) {
  return nearby.venues[venueId] ?? null;
}

export function mapsLink(place: { name: string; lat: number; lng: number }, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${city}`)}`;
}

export function walkingMinutes(p: NearbyPlace) {
  return Math.max(1, Math.round(p.distance / 80)); // ~80 m a minute, as the crow flies
}
