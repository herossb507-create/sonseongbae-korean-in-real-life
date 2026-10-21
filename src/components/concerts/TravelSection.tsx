import Link from "next/link";
import type { ConcertWithRefs, NearbyPlace } from "@/lib/concerts/types";
import { NEARBY_ATTRIBUTION, hotelLinks, mapsLink, nearbyPlaces, walkingMinutes } from "@/lib/concerts/hotels";
import { formatDate } from "@/lib/concerts/format";

const KIND_LABEL: Record<NearbyPlace["kind"], string> = {
  restaurant: "Restaurant",
  cafe: "Café",
  fast_food: "Quick bite",
  hotel: "Hotel",
};

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
              {p.distance < 1000 ? `${p.distance} m` : `${(p.distance / 1000).toFixed(1)} km`} · ~{walkingMinutes(p)} min ↗
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
  const anySponsored = hotels.some((h) => h.sponsored);

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
      {anySponsored && (
        <p className="mt-2 text-[11px] text-[#B0A8BB]">
          Some hotel links are affiliate links.{" "}
          <Link href="/concerts/disclosure" className="underline">
            Learn more
          </Link>
        </p>
      )}

      {nearby && (nearby.food.length > 0 || nearby.hotels.length > 0) && (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {nearby.food.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold">Eat &amp; drink nearby</h3>
              <PlaceList places={nearby.food} city={c.venue.city} />
            </div>
          )}
          {nearby.hotels.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold">Places to stay within walking distance</h3>
              <PlaceList places={nearby.hotels} city={c.venue.city} />
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-[11px] text-[#B0A8BB]">
        {nearby && (
          <>
            Places within {nearby.radius / 1000} km from{" "}
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
