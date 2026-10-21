// Shapes of the JSON files in /data. Scripts in /scripts read and write the
// same files, so keep this file free of runtime imports.

export type ConcertStatus = "announced" | "onsale" | "soldout" | "cancelled";

export type AffiliateProgram = "ticketmaster" | "seatgeek" | "klook";

export interface Artist {
  id: string; // also the URL slug
  name: string;
  nameKo?: string;
  official: {
    weverse?: string;
    site?: string;
    x?: string;
    instagram?: string;
    youtube?: string;
  };
  sourceIds: {
    ticketmasterAttractionId?: string;
    seatgeekPerformerSlug?: string;
  };
  watch: boolean; // on the watchlist: check official channels for new tours
  sample?: boolean; // fictional placeholder artist
}

export interface Venue {
  id: string; // also the URL slug
  name: string;
  city: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
  lat: number;
  lng: number;
  timezone: string; // IANA, e.g. "Asia/Seoul"
  capacity?: number;
  externalIds?: {
    ticketmaster?: string;
    seatgeek?: string;
    // Hotel-search IDs, filled by scripts/concerts/hotels.mts
    agoda?: { poi?: string; city?: string };
    tripcom?: { cityId: number; landmarkId?: number; name?: string; lat?: number; lng?: number };
  };
}

export interface TicketLink {
  label: string; // "Ticketmaster", "NOL World", "Fanclub presale"
  url: string; // original URL; affiliate parameters are added at render time
  kind: "primary" | "fanclub" | "presale" | "resale";
  affiliate?: AffiliateProgram;
}

export interface SourceRef {
  source: "official" | "news" | "ticketmaster" | "seatgeek" | "manual" | "sample";
  url: string;
  externalId?: string;
  fetchedAt: string; // YYYY-MM-DD
}

export interface Concert {
  id: string; // `${artistId}-${venueId}-${date}`, also the URL slug
  artistId: string;
  tour: string;
  date: string; // YYYY-MM-DD, local date at the venue
  time?: string; // HH:mm, local time at the venue
  venueId: string;
  status: ConcertStatus;
  ticketOpen?: string; // YYYY-MM-DD
  priceRange?: string;
  notes?: string;
  ticketLinks: TicketLink[];
  sourceRefs: SourceRef[];
  verification: "verified" | "unverified";
  idRequired?: boolean; // ID/passport-checked entry: never show resale links
  updatedAt: string; // YYYY-MM-DD
  lastSeenAt: string; // YYYY-MM-DD, last time a source still listed it
  sample?: boolean;
}

export interface ConcertWithRefs extends Concert {
  artist: Artist;
  venue: Venue;
}

// data/concerts/nearby.json — OpenStreetMap places near each venue (scripts/concerts/nearby.mts)
export interface NearbyPlace {
  osm: string; // "node/123", for the OSM link
  name: string; // local name
  nameEn?: string;
  kind: "restaurant" | "cafe" | "fast_food" | "hotel";
  cuisine?: string;
  lat: number;
  lng: number;
  distance: number; // metres from the venue
}

export interface NearbyFile {
  attribution: string;
  venues: Record<string, { fetchedAt: string; radius: number; food: NearbyPlace[]; hotels: NearbyPlace[] }>;
}
