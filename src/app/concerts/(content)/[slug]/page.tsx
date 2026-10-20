import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StatusBadge, { UnconfirmedBadge } from "@/components/concerts/StatusBadge";
import TicketLinks from "@/components/concerts/TicketLinks";
import type { ConcertWithRefs } from "@/lib/concerts/types";
import { ticketLinksFor } from "@/lib/concerts/affiliate";
import { getConcert, getConcerts, startDateTime } from "@/lib/concerts/data";
import { citySlug, flag, formatDate, sourceLabel } from "@/lib/concerts/format";
import { SITE_URL } from "@/lib/concerts/site";
import { pageMeta } from "@/lib/seo";
import { BookCover } from "@/components/books/BookCover";
import { BOOKS } from "@/lib/books";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getConcerts().map((c) => ({ slug: c.id }));
}

export const dynamicParams = false;

function title(c: ConcertWithRefs) {
  return `${c.artist.name} in ${c.venue.city} — ${formatDate(c.date, { weekday: undefined })}`;
}

export function generateMetadata({ params }: Props): Metadata {
  const c = getConcert(params.slug);
  if (!c) return {};
  return pageMeta({
    title: `${title(c)}`,
    description: `${c.artist.name} ${c.tour} at ${c.venue.name}, ${c.venue.city} on ${formatDate(c.date)}. Showtime, ticket status and where to buy.`,
    path: `/concerts/${params.slug}`,
  });
}

const EVENT_STATUS = {
  announced: "https://schema.org/EventScheduled",
  onsale: "https://schema.org/EventScheduled",
  soldout: "https://schema.org/EventScheduled",
  cancelled: "https://schema.org/EventCancelled",
};

// schema.org MusicEvent, so search engines can show the date and ticket link.
function jsonLd(c: ConcertWithRefs) {
  const primary = ticketLinksFor(c).find((l) => l.kind === "primary");
  return {
    "@context": "https://schema.org",
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

export default function ConcertPage({ params }: Props) {
  const c = getConcert(params.slug);
  if (!c) notFound();

  return (
    <article>
      <script
        type="application/ld+json"
        // JSON.stringify output is safe apart from "<", which could close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(c)).replace(/</g, "\\u003c") }}
      />
      <p className="text-sm font-semibold text-[#E8436F]">
        <Link href={`/concerts/artists/${c.artist.id}`} className="hover:underline">
          {c.artist.name}
        </Link>
      </p>
      <h1 className="mt-1 text-3xl font-bold">{title(c)}</h1>
      <p className="mt-1 text-lg text-[#6B5F7A]">{c.tour}</p>

      <div className="mt-6 rounded-3xl border border-[#F0E6EE] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Show details</h2>
          <div className="flex gap-1">
            {c.verification === "unverified" && <UnconfirmedBadge />}
            <StatusBadge status={c.status} />
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-[6rem_1fr] gap-y-2 text-sm">
          <dt className="text-[#B0A8BB]">Date</dt>
          <dd>
            {formatDate(c.date)}
            {c.time && <span className="text-[#6B5F7A]"> · {c.time} local time</span>}
          </dd>
          <dt className="text-[#B0A8BB]">Venue</dt>
          <dd>
            {c.venue.name}
            {c.venue.capacity && (
              <span className="text-[#B0A8BB]"> · ~{c.venue.capacity.toLocaleString("en-US")} capacity</span>
            )}
          </dd>
          <dt className="text-[#B0A8BB]">City</dt>
          <dd>
            <Link href={`/concerts/cities/${citySlug(c.venue)}`} className="hover:underline">
              {flag(c.venue.countryCode)} {c.venue.city}, {c.venue.country}
            </Link>
          </dd>
          {c.priceRange && (
            <>
              <dt className="text-[#B0A8BB]">Price</dt>
              <dd>{c.priceRange}</dd>
            </>
          )}
          {c.ticketOpen && (
            <>
              <dt className="text-[#B0A8BB]">Tickets open</dt>
              <dd>{formatDate(c.ticketOpen)}</dd>
            </>
          )}
          {c.idRequired && (
            <>
              <dt className="text-[#B0A8BB]">Entry</dt>
              <dd>Photo ID checked at entry — buy only from official sellers</dd>
            </>
          )}
          {c.notes && (
            <>
              <dt className="text-[#B0A8BB]">Note</dt>
              <dd>{c.notes}</dd>
            </>
          )}
        </dl>
        <TicketLinks concert={c} />
      </div>

      <section className="mt-6 text-sm text-[#6B5F7A]">
        <h2 className="mb-2 font-semibold text-[#1E1225]">Sources</h2>
        <ul className="space-y-1">
          {c.sourceRefs.map((r) => (
            <li key={r.url + r.source}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {sourceLabel(r)}
              </a>{" "}
              · checked {r.fetchedAt}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-[#B0A8BB]">
          {c.verification === "verified"
            ? "Confirmed on an official page (artist, agency, promoter, venue or official ticket seller)."
            : "Reported by news outlets but not yet confirmed on an official page. Dates or venues may change."}{" "}
          Last updated {c.updatedAt}. Always check the official announcement before buying.
        </p>
      </section>

      <div className="mt-8 rounded-3xl border border-[#F0E6EE] bg-gradient-to-br from-white to-[#FFF0F5] p-5">
        <p className="font-semibold">Going to the show? Learn the Korean you&apos;ll hear there.</p>
        <p className="mt-1 text-sm text-[#6B5F7A]">Fan chants, greetings and K-pop phrases — start with Hangul in Chapter 1, free.</p>
        <Link
          href="/learn"
          className="mt-3 inline-block rounded-xl bg-gradient-to-r from-[#E8436F] to-[#F06B8A] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Start learning Korean
        </Link>
      </div>

      {c.venue.countryCode === "KR" && (
        <a
          href={BOOKS["korea-unlocked"].url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-4 rounded-3xl border border-[#F0E6EE] bg-white p-5 transition-shadow hover:shadow-md"
        >
          <BookCover book={BOOKS["korea-unlocked"]} className="w-12" small />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Flying to Korea for the show?</p>
            <p className="mt-1 text-sm text-[#6B5F7A]">
              Korea Unlocked covers K-ETA and the e-Arrival Card, transport, where to stay and K-pop spots in Seoul.
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-[#E8436F]">Amazon ↗</span>
        </a>
      )}

      <p className="mt-8">
        <Link href="/concerts" className="text-sm text-[#E8436F] hover:underline">
          ← Back to the map
        </Link>
      </p>
    </article>
  );
}
