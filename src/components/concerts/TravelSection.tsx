import Link from "next/link";
import type { ConcertWithRefs, NearbyPlace, StayHotel } from "@/lib/concerts/types";
import { hotelLinks, stayLinks } from "@/lib/concerts/hotels";
import { NEARBY_ATTRIBUTION, mapsLink, nearbyPlaces, staysNear, walkingMinutes } from "@/lib/concerts/nearby";
import { formatDate } from "@/lib/concerts/format";

const KIND_LABEL: Record<NearbyPlace["kind"], string> = {
  restaurant: "Restaurant",
  cafe: "Café",
  fast_food: "Quick bite",
  hotel: "Hotel",
};

const distanceLabel = (m: number) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`);

/** The closest bookable hotels, each with buttons straight to its Agoda / Trip.com page. */
function StayList({ hotels, date, city }: { hotels: StayHotel[]; date: string; city: string }) {
  return (
    <ul className="mt-1 divide-y divide-[#F0E6EE]">
      {hotels.map((h) => (
        <li key={h.name} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={mapsLink(h, city)}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 text-sm hover:text-[#E8436F]"
          >
            <span className="block truncate font-medium">{h.name}</span>
            <span className="block truncate text-xs text-[#6B5F7A]">
              {h.localName && <>{h.localName} · </>}
              {distanceLabel(h.distance)} from the venue · ~{walkingMinutes(h)} min walk
            </span>
          </a>
          <div className="flex shrink-0 gap-2">
            {stayLinks(h, date).map((l) => (
              <a
                key={l.site}
                href={l.href}
                target="_blank"
                rel={l.rel}
                className="rounded-lg bg-gradient-to-r from-[#E8436F] to-[#F06B8A] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
              >
                Book on {l.site}
              </a>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

function PlaceList({ places, city }: { places: NearbyPlace[]; city: string }) {
  return (
    <ul className="divide-y divide-[#F0E6EE]">
      {places.map((p) => (
        <li key={p.osm}>
          <a
            href={mapsLink(p, city)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-[#E8436F]"
          >
            <span className="min-w-0">
              <span className="block truncate font-medium">{p.nameEn ?? p.name}</span>
              <span className="block truncate text-xs text-[#6B5F7A]">
                {p.nameEn && <>{p.name} · </>}
                {KIND_LABEL[p.kind]}
                {p.cuisine && <> · {p.cuisine}</>}
              </span>
            </span>
            <span className="shrink-0 text-xs text-[#B0A8BB]">
              {distanceLabel(p.distance)} · ~{walkingMinutes(p)} min ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function TravelSection({ concert: c }: { concert: ConcertWithRefs }) {
  if (c.status === "cancelled") return null;
  const hotels = hotelLinks(c.venue, c.date);
  const nearby = nearbyPlaces(c.venue.id);
  const stays = staysNear(c.venue.id)?.hotels ?? [];
  // OSM's plain hotel list is only a fallback for venues with no bookable matches.
  const osmHotels = stays.length ? [] : (nearby?.hotels ?? []);
  const anySponsored =
    hotels.some((h) => h.sponsored) || stays.some((s) => stayLinks(s, c.date).some((l) => l.sponsored));

  return (
    <section className="mt-6 rounded-3xl border border-[#F0E6EE] bg-white p-5 shadow-sm">
      <h2 className="font-semibold">Traveling to this show?</h2>
      <p className="mt-1 text-sm text-[#6B5F7A]">
        Hotels near {c.venue.name} for the night of {formatDate(c.date, { weekday: undefined })} (check-out the next
        day). Change the dates on the booking site if you need more nights.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {hotels.map((h) => (
          <a
            key={h.site}
            href={h.href}
            target="_blank"
            rel={h.rel}
            className="flex flex-col rounded-xl border border-[#F0E6EE] bg-[#FFF5F8] px-4 py-3 text-sm transition-colors hover:border-[#E8436F]/40"
          >
            <span className="font-semibold">{h.site} ↗</span>
            <span className="text-xs text-[#6B5F7A]">{h.near === "venue" ? "Hotels near the venue" : `Hotels in ${c.venue.city}`}</span>
          </a>
        ))}
      </div>
      {stays.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold">Hotels closest to the venue</h3>
          <StayList hotels={stays} date={c.date} city={c.venue.city} />
        </div>
      )}

      {anySponsored && (
        <p className="mt-2 text-[11px] text-[#B0A8BB]">
          Some hotel links are affiliate links.{" "}
          <Link href="/concerts/disclosure" className="underline">
            Learn more
          </Link>
        </p>
      )}

      {nearby && (nearby.food.length > 0 || osmHotels.length > 0) && (
        <div className={`mt-5 grid gap-5 ${osmHotels.length ? "md:grid-cols-2" : ""}`}>
          {nearby.food.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold">Eat &amp; drink nearby</h3>
              <PlaceList places={nearby.food} city={c.venue.city} />
            </div>
          )}
          {osmHotels.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold">Places to stay within walking distance</h3>
              <PlaceList places={osmHotels} city={c.venue.city} />
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-[11px] text-[#B0A8BB]">
        {nearby && (
          <>
            Hotels and places nearby from{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">
              {NEARBY_ATTRIBUTION}
            </a>
            , listed by distance, not by rating — tap one for reviews and opening hours on Google Maps. Updated{" "}
            {nearby.fetchedAt}.{" "}
          </>
        )}
        Arenas get very busy on show days, so book early and check the venue&apos;s transport advice.
      </p>
    </section>
  );
}
