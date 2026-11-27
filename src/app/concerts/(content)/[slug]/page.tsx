import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StatusBadge, { UnconfirmedBadge } from "@/components/concerts/StatusBadge";
import TicketLinks from "@/components/concerts/TicketLinks";
import TravelSection from "@/components/concerts/TravelSection";
import StageBanner from "@/components/concerts/StageBanner";
import DDayBadge from "@/components/concerts/DDayBadge";
import type { ConcertWithRefs } from "@/lib/concerts/types";
import { getConcert, getConcerts } from "@/lib/concerts/data";
import { breadcrumbs, graph, musicEvent } from "@/lib/concerts/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { citySlug, flag, formatDate, sourceLabel } from "@/lib/concerts/format";
import { pageMeta } from "@/lib/seo";
import { BookCover } from "@/components/books/BookCover";
import { BOOKS } from "@/lib/books";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getConcerts().map((c) => ({ slug: c.id }));
}


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

export default function ConcertPage({ params }: Props) {
  const c = getConcert(params.slug);
  if (!c) notFound();

  return (
    <article>
      <JsonLd
        data={graph(
          musicEvent(c),
          breadcrumbs([
            { name: "K-pop Concerts", path: "/concerts" },
            { name: c.artist.name, path: `/concerts/artists/${c.artist.id}` },
            { name: title(c), path: `/concerts/${c.id}` },
          ]),
        )}
      />
      <StageBanner>
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-bold uppercase tracking-widest text-[#22D3EE]">
            <Link href={`/concerts/artists/${c.artist.id}`} className="hover:underline">
              {c.artist.name}
            </Link>
          </p>
          <DDayBadge date={c.date} className="text-sm" />
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">{title(c)}</h1>
        <p className="mt-1 text-lg text-neon font-bold">{c.tour}</p>
        <p className="mt-3 text-sm text-white/70">
          {flag(c.venue.countryCode)} {c.venue.name} · {c.venue.city}
        </p>
      </StageBanner>

      <div className="mt-6 rounded-3xl border border-[#EAE4F7] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Show details</h2>
          <div className="flex gap-1">
            {c.verification === "unverified" && <UnconfirmedBadge />}
            <StatusBadge status={c.status} />
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-[6rem_1fr] gap-y-2 text-sm">
          <dt className="text-[#9E98B8]">Date</dt>
          <dd>
            {formatDate(c.date)}
            {c.time && <span className="text-[#5A5475]"> · {c.time} local time</span>}
          </dd>
          <dt className="text-[#9E98B8]">Venue</dt>
          <dd>
            {c.venue.name}
            {c.venue.capacity && (
              <span className="text-[#9E98B8]"> · ~{c.venue.capacity.toLocaleString("en-US")} capacity</span>
            )}
          </dd>
          <dt className="text-[#9E98B8]">City</dt>
          <dd>
            <Link href={`/concerts/cities/${citySlug(c.venue)}`} className="hover:underline">
              {flag(c.venue.countryCode)} {c.venue.city}, {c.venue.country}
            </Link>
          </dd>
          {c.priceRange && (
            <>
              <dt className="text-[#9E98B8]">Price</dt>
              <dd>{c.priceRange}</dd>
            </>
          )}
          {c.ticketOpen && (
            <>
              <dt className="text-[#9E98B8]">Tickets open</dt>
              <dd>{formatDate(c.ticketOpen)}</dd>
            </>
          )}
          {c.idRequired && (
            <>
              <dt className="text-[#9E98B8]">Entry</dt>
              <dd>Photo ID checked at entry — buy only from official sellers</dd>
            </>
          )}
          {c.notes && (
            <>
              <dt className="text-[#9E98B8]">Note</dt>
              <dd>{c.notes}</dd>
            </>
          )}
        </dl>
        <TicketLinks concert={c} />
      </div>

      <TravelSection concert={c} />

      <section className="mt-6 text-sm text-[#5A5475]">
        <h2 className="mb-2 font-semibold text-[#140F2D]">Sources</h2>
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
        <p className="mt-2 text-xs text-[#9E98B8]">
          {c.verification === "verified"
            ? "Confirmed on an official page (artist, agency, promoter, venue or official ticket seller)."
            : "Reported by news outlets but not yet confirmed on an official page. Dates or venues may change."}{" "}
          Last updated {c.updatedAt}. Always check the official announcement before buying.
        </p>
      </section>

      <div className="mt-8 rounded-3xl border border-[#EAE4F7] bg-gradient-to-br from-white to-[#F2ECFF] p-5">
        <p className="font-semibold">Going to the show? Learn the Korean you&apos;ll hear there.</p>
        <p className="mt-1 text-sm text-[#5A5475]">Fan chants, greetings and K-pop phrases — start with Hangul in Chapter 1, free.</p>
        <Link
          href="/learn"
          className="mt-3 inline-block rounded-xl bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Start learning Korean
        </Link>
      </div>

      <a
        href={BOOKS["shy-girl-1"].url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-4 rounded-3xl border border-[#EAE4F7] bg-white p-5 transition-shadow hover:shadow-md"
      >
        <BookCover book={BOOKS["shy-girl-1"]} className="w-12" small />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Love K-pop? Read a K-pop romance in Korean.</p>
          <p className="mt-1 text-sm text-[#5A5475]">
            Shy Girl, Center Stage follows a shy country girl to the festival stage, with every line of dialogue in
            natural Korean and an English translation under it. For intermediate learners.
          </p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-[#FF3D8B]">Amazon ↗</span>
      </a>

      {c.venue.countryCode === "KR" && (
        <a
          href={BOOKS["korea-unlocked"].url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-4 rounded-3xl border border-[#EAE4F7] bg-white p-5 transition-shadow hover:shadow-md"
        >
          <BookCover book={BOOKS["korea-unlocked"]} className="w-12" small />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Flying to Korea for the show?</p>
            <p className="mt-1 text-sm text-[#5A5475]">
              Korea Unlocked covers K-ETA and the e-Arrival Card, transport, where to stay and K-pop spots in Seoul.
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-[#FF3D8B]">Amazon ↗</span>
        </a>
      )}

      <p className="mt-8">
        <Link href="/concerts" className="text-sm text-[#FF3D8B] hover:underline">
          ← Back to the map
        </Link>
      </p>
    </article>
  );
}
