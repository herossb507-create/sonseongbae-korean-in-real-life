"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ConcertStatus, ConcertWithRefs } from "@/lib/concerts/types";
import { STATUS_LABEL, flag, formatDate, groupByVenue, sourceLabel } from "@/lib/concerts/format";
import { useToday } from "@/lib/concerts/useToday";
import StatusBadge, { UnconfirmedBadge } from "./StatusBadge";
import TicketLinks from "./TicketLinks";

const ConcertMap = dynamic(() => import("./ConcertMap"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm text-[#B0A8BB]">Loading map…</div>,
});

interface Props {
  concerts: ConcertWithRefs[];
}

const selectCls =
  "w-full min-h-11 rounded-xl border border-[#F0E6EE] bg-white px-3 py-2 text-base text-[#1E1225] focus:border-[#E8436F] focus:outline-none focus:ring-2 focus:ring-[#E8436F]/20 md:min-h-0 md:text-sm";

export default function ConcertExplorer({ concerts }: Props) {
  const today = useToday();
  const [query, setQuery] = useState("");
  const [artist, setArtist] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<ConcertStatus | "">("");
  const [showPast, setShowPast] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const artists = useMemo(() => [...new Set(concerts.map((c) => c.artist.name))].sort(), [concerts]);
  const countries = useMemo(
    () =>
      [...new Map(concerts.map((c) => [c.venue.countryCode, c.venue.country])).entries()].sort((a, b) =>
        a[1].localeCompare(b[1]),
      ),
    [concerts],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return concerts.filter(
      (c) =>
        (showPast || !today || c.date >= today) &&
        (!artist || c.artist.name === artist) &&
        (!country || c.venue.countryCode === country) &&
        (!status || c.status === status) &&
        (!q ||
          [c.artist.name, c.artist.nameKo ?? "", c.tour, c.venue.name, c.venue.city, c.venue.country].some((s) =>
            s.toLowerCase().includes(q),
          )),
    );
  }, [concerts, query, artist, country, status, showPast, today]);

  const groups = useMemo(() => groupByVenue(filtered), [filtered]);
  const selected = groups.find((g) => g.venue.id === selectedVenueId) ?? null;
  const countryCount = new Set(filtered.map((c) => c.venue.countryCode)).size;
  const hasFilters = query || artist || country || status || showPast;

  function selectVenue(venueId: string, concertId?: string) {
    setSelectedVenueId(venueId);
    setHighlightId(concertId ?? null);
  }

  function resetFilters() {
    setQuery("");
    setArtist("");
    setCountry("");
    setStatus("");
    setShowPast(false);
  }

  const advancedFiltered = Boolean(artist || country || status || showPast);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#FFF5F8] text-[#1E1225] md:flex-row">
      {/* Sidebar. On phones this is a sheet under a short map; filters collapse so the first shows are on screen. */}
      <aside className="order-2 flex min-h-0 flex-1 flex-col rounded-t-3xl border-t border-[#F0E6EE] bg-white shadow-[0_-8px_24px_rgba(30,18,37,0.08)] md:order-1 md:w-96 md:flex-none md:rounded-none md:border-t-0 md:border-r md:shadow-none">
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[#E4D9E2] md:hidden" aria-hidden />
        <div className="hidden border-b border-[#F0E6EE] px-5 py-4 md:block">
          <h1 className="text-lg font-bold tracking-tight">K-pop concerts worldwide</h1>
          <p className="mt-0.5 text-xs text-[#6B5F7A]">Tour dates from official announcements, on one map</p>
        </div>

        <div className="border-b border-[#F0E6EE] px-3 py-2 md:space-y-2 md:p-4">
          <div className="flex items-center gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artist, city, venue…"
              className={`${selectCls} min-w-0 flex-1`}
            />
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="concert-filters"
              className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold md:hidden ${
                filtersOpen || advancedFiltered
                  ? "border-[#E8436F]/40 bg-[#FFF0F5] text-[#E8436F]"
                  : "border-[#F0E6EE] bg-white text-[#1E1225]"
              }`}
            >
              Filters
              {advancedFiltered && <span className="h-1.5 w-1.5 rounded-full bg-[#E8436F]" aria-hidden />}
            </button>
            {hasFilters && !filtersOpen && (
              <button type="button" onClick={resetFilters} className="min-h-11 shrink-0 px-1 text-sm font-semibold text-[#E8436F] md:hidden">
                Reset
              </button>
            )}
          </div>
          <div id="concert-filters" className={`${filtersOpen ? "mt-2 grid grid-cols-1 gap-2" : "hidden"} md:grid md:grid-cols-3 md:gap-2`}>
            <select value={artist} onChange={(e) => setArtist(e.target.value)} className={selectCls} aria-label="Artist">
              <option value="">All artists</option>
              {artists.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectCls} aria-label="Country">
              <option value="">All countries</option>
              {countries.map(([code, name]) => (
                <option key={code} value={code}>
                  {flag(code)} {name}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ConcertStatus | "")}
              className={selectCls}
              aria-label="Status"
            >
              <option value="">Any status</option>
              {(Object.keys(STATUS_LABEL) as ConcertStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          <div className={`${filtersOpen ? "mt-2 flex" : "hidden"} items-center justify-between text-sm text-[#3E3450] md:flex md:text-xs md:text-[#6B5F7A]`}>
            <label className="flex min-h-11 items-center gap-2 md:min-h-0">
              <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="accent-[#E8436F] max-md:h-5 max-md:w-5" />
              Include past shows
            </label>
            {hasFilters && (
              <button type="button" onClick={resetFilters} className="min-h-11 px-1 text-sm font-semibold text-[#E8436F] hover:underline md:min-h-0 md:text-xs md:font-normal">
                Reset
              </button>
            )}
          </div>
        </div>

        <p className="px-3 pb-1 pt-2.5 text-sm font-semibold text-[#1E1225] md:px-4 md:pb-0 md:pt-3 md:text-xs md:font-normal md:text-[#B0A8BB]">
          {filtered.length} shows · {groups.length} venues · {countryCount} countries
        </p>

        <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-3 pt-1 overscroll-contain md:p-2 md:overscroll-auto">
          {filtered.length === 0 && <li className="p-6 text-center text-base text-[#5C5368] md:text-sm md:text-[#B0A8BB]">No shows match these filters.</li>}
          {filtered.map((c) => {
            const active = c.venue.id === selectedVenueId;
            return (
              <li key={c.id} className="border-b border-[#F3E8EE] last:border-b-0 md:border-b-0">
                <button
                  onClick={() => selectVenue(c.venue.id, c.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-3 text-left transition hover:bg-[#FFF5F8] md:px-3 md:py-2.5 ${
                    active ? "bg-[#FFF0F5] ring-1 ring-[#E8436F]/30" : ""
                  }`}
                >
                  <div className="w-12 shrink-0 text-center leading-tight md:w-11">
                    <div className="text-xs font-semibold uppercase text-[#C42B56] md:text-[10px] md:text-[#E8436F]">{formatDate(c.date, { weekday: undefined, day: undefined, year: undefined })}</div>
                    <div className="text-xl font-semibold md:text-lg">{Number(c.date.slice(8))}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-semibold leading-tight md:text-sm">{c.artist.name}</div>
                    <div className="truncate text-[15px] leading-snug text-[#3E3450] md:text-xs md:text-[#6B5F7A]">
                      {flag(c.venue.countryCode)} {c.venue.city} · {c.venue.name}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {c.verification === "unverified" && <UnconfirmedBadge />}
                    <StatusBadge status={c.status} />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Map — short on phones so the show list sits in the first screen. */}
      <main className="relative order-1 h-[40dvh] shrink-0 md:order-2 md:h-auto md:shrink md:flex-1">
        <ConcertMap groups={groups} selectedVenueId={selectedVenueId} onSelectVenue={(id) => selectVenue(id)} />

        {/* Detail panel */}
        {selected && (
          <section className="absolute inset-x-0 bottom-0 z-[600] max-h-[90%] overflow-y-auto rounded-t-3xl border border-[#F0E6EE] bg-white/95 p-5 shadow-[0_8px_32px_rgba(30,18,37,0.15)] backdrop-blur md:inset-x-auto md:bottom-auto md:right-4 md:top-4 md:max-h-[calc(100%-2rem)] md:w-[380px] md:rounded-3xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-[#6B5F7A]">
                  {flag(selected.venue.countryCode)} {selected.venue.city}, {selected.venue.country}
                </p>
                <h2 className="text-xl font-bold">{selected.venue.name}</h2>
                {selected.venue.capacity && (
                  <p className="text-xs text-[#B0A8BB]">Capacity ~{selected.venue.capacity.toLocaleString("en-US")}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedVenueId(null)}
                className="rounded-full p-1.5 text-[#B0A8BB] hover:bg-[#FFF0F5] hover:text-[#1E1225] max-md:grid max-md:h-11 max-md:w-11 max-md:place-items-center max-md:p-0 max-md:text-lg max-md:text-[#5C5368]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <ul className="mt-4 space-y-3">
              {selected.concerts.map((c) => (
                <li
                  key={c.id}
                  className={`rounded-2xl bg-[#FFF5F8] p-4 ring-1 ${c.id === highlightId ? "ring-[#E8436F]/50" : "ring-[#F0E6EE]"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">
                      <Link href={`/concerts/artists/${c.artist.id}`} className="hover:underline">
                        {c.artist.name}
                      </Link>
                    </h3>
                    <div className="flex gap-1">
                      {c.verification === "unverified" && <UnconfirmedBadge />}
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                  <p className="text-sm text-[#E8436F]">{c.tour}</p>
                  <dl className="mt-3 grid grid-cols-[5rem_1fr] gap-y-1 text-sm">
                    <dt className="text-[#B0A8BB]">Date</dt>
                    <dd>
                      {formatDate(c.date)}
                      {c.time && <span className="text-[#6B5F7A]"> · {c.time} local</span>}
                    </dd>
                    {c.priceRange && (
                      <>
                        <dt className="text-[#B0A8BB]">Price</dt>
                        <dd>{c.priceRange}</dd>
                      </>
                    )}
                    {c.ticketOpen && (
                      <>
                        <dt className="text-[#B0A8BB]">Tickets</dt>
                        <dd>Opens {formatDate(c.ticketOpen)}</dd>
                      </>
                    )}
                    {c.notes && (
                      <>
                        <dt className="text-[#B0A8BB]">Note</dt>
                        <dd>{c.notes}</dd>
                      </>
                    )}
                    <dt className="text-[#B0A8BB]">Source</dt>
                    <dd className="text-[#6B5F7A]">
                      {c.sourceRefs.map((r) => (
                        <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="block hover:underline">
                          {sourceLabel(r)}
                        </a>
                      ))}
                      <span className="text-[#B0A8BB]">updated {c.updatedAt}</span>
                    </dd>
                  </dl>
                  <TicketLinks concert={c} />
                  <Link
                    href={`/concerts/${c.id}`}
                    className="mt-3 block text-center text-xs text-[#6B5F7A] hover:text-[#E8436F]"
                  >
                    Full details →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
