import nearbyJson from "../../../data/concerts/nearby.json";
import type { NearbyFile, NearbyPlace, Venue } from "./types";

// Hotel searches near the venue for the night of the show (check-out next day).
// Affiliate IDs are extra query parameters, set once you're approved, e.g.
//   NEXT_PUBLIC_AFFILIATE_BOOKING_PARAMS="aid=1234567"
//   NEXT_PUBLIC_AFFILIATE_AGODA_PARAMS="cid=1234567"
//   NEXT_PUBLIC_AFFILIATE_TRIPCOM_PARAMS="Allianceid=1234567&SID=7654321"
// Unset = plain link, no tracking. NEXT_PUBLIC_* must be referenced literally.
const AFFILIATE = {
  booking: process.env.NEXT_PUBLIC_AFFILIATE_BOOKING_PARAMS,
  agoda: process.env.NEXT_PUBLIC_AFFILIATE_AGODA_PARAMS,
  tripcom: process.env.NEXT_PUBLIC_AFFILIATE_TRIPCOM_PARAMS,
};

export interface HotelLink {
  site: string;
  href: string;
  rel: string;
  sponsored: boolean;
  near: "venue" | "city"; // whether the search is centred on the venue or the whole city
}

function nextDay(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function link(site: string, url: URL, extra: string | undefined, near: HotelLink["near"]): HotelLink {
  if (extra) new URLSearchParams(extra).forEach((v, k) => url.searchParams.set(k, v));
  return { site, href: url.toString(), rel: extra ? "sponsored noopener" : "noopener noreferrer", sponsored: !!extra, near };
}

export function hotelLinks(venue: Venue, date: string): HotelLink[] {
  const checkout = nextDay(date);
  const links: HotelLink[] = [];

  const booking = new URL("https://www.booking.com/searchresults.html");
  booking.search = new URLSearchParams({
    ss: `${venue.name}, ${venue.city}`,
    checkin: date,
    checkout,
    group_adults: "2",
    no_rooms: "1",
    group_children: "0",
  }).toString();
  links.push(link("Booking.com", booking, AFFILIATE.booking, "venue"));

  const agodaIds = venue.externalIds?.agoda;
  if (agodaIds?.poi || agodaIds?.city) {
    const agoda = new URL("https://www.agoda.com/search");
    agoda.search = new URLSearchParams({
      ...(agodaIds.poi ? { poi: agodaIds.poi } : { city: agodaIds.city! }),
      checkIn: date,
      los: "1",
      rooms: "1",
      adults: "2",
      children: "0",
    }).toString();
    links.push(link("Agoda", agoda, AFFILIATE.agoda, agodaIds.poi ? "venue" : "city"));
  }

  const trip = venue.externalIds?.tripcom;
  if (trip) {
    const url = new URL("https://www.trip.com/hotels/list");
    url.search = new URLSearchParams({
      cityId: String(trip.cityId),
      ...(trip.landmarkId && {
        searchType: "LM",
        optionId: String(trip.landmarkId),
        searchValue: `13|${trip.landmarkId}*13*${trip.lat}|${trip.lng}|${trip.name}|${trip.landmarkId}|1`,
      }),
      checkin: date,
      checkout,
      crn: "1",
      adult: "2",
    }).toString();
    links.push(link("Trip.com", url, AFFILIATE.tripcom, trip.landmarkId ? "venue" : "city"));
  }

  return links;
}

// ── Nearby places (OpenStreetMap) ────────────────────────────────────────────

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
