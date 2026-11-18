// schema.org structured data for the concert pages, so search engines can show
// event dates, breadcrumbs and tour lists. Rendered with <JsonLd>.
import type { ConcertWithRefs } from "./types";
import { ticketLinksFor } from "./affiliate";
import { startDateTime } from "./data";
import { SITE_URL } from "./site";

const EVENT_STATUS = {
  announced: "https://schema.org/EventScheduled",
  onsale: "https://schema.org/EventScheduled",
  soldout: "https://schema.org/EventScheduled",
  cancelled: "https://schema.org/EventCancelled",
};

/** schema.org MusicEvent for one show. */
export function musicEvent(c: ConcertWithRefs) {
  const primary = ticketLinksFor(c).find((l) => l.kind === "primary");
  return {
    "@type": "MusicEvent",
    name: `${c.artist.name} — ${c.tour}`,
    startDate: startDateTime(c),
    eventStatus: EVENT_STATUS[c.status],
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${SITE_URL}/concerts/${c.id}`,
    location: {
      "@type": "Place",
      name: c.venue.name,
      address: { "@type": "PostalAddress", addressLocality: c.venue.city, addressCountry: c.venue.countryCode },
      geo: { "@type": "GeoCoordinates", latitude: c.venue.lat, longitude: c.venue.lng },
    },
    performer: { "@type": "MusicGroup", name: c.artist.name, url: `${SITE_URL}/concerts/artists/${c.artist.id}` },
    ...(primary && {
      offers: {
        "@type": "Offer",
        url: primary.href,
        availability: c.status === "soldout" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        ...(c.ticketOpen && { validFrom: c.ticketOpen }),
      },
    }),
  };
}

/** Breadcrumb trail, e.g. Concerts › BTS › BTS in Seoul. Paths are site-relative. */
export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/** Summary list of shows (artist or city page), each pointing at its own event page. */
export function eventList(name: string, shows: ConcertWithRefs[]) {
  return {
    "@type": "ItemList",
    name,
    itemListElement: shows.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/concerts/${c.id}` })),
  };
}

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });
