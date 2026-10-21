"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ConcertStatus, ConcertWithRefs } from "@/lib/concerts/types";
import { STATUS_LABEL, flag, formatDate, groupByVenue, sourceLabel } from "@/lib/concerts/format";
import { useToday } from "@/lib/concerts/useToday";
import StatusBadge, { UnconfirmedBadge } from "./StatusBadge";
import TicketLinks from "./TicketLinks";
import { hotelLinks } from "@/lib/concerts/hotels";

const ConcertMap = dynamic(() => import("./ConcertMap"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm text-[#B0A8BB]">Loading map…</div>,
});

interface Props {
  concerts: ConcertWithRefs[];
}

const selectCls =
  "w-full rounded-xl border border-[#F0E6EE] bg-white px-3 py-2 text-sm text-[#1E1225] focus:border-[#E8436F] focus:outline-none focus:ring-2 focus:ring-[#E8436F]/20";

export default function ConcertExplorer({ concerts }: Props) {
  const today = useToday();
  const [query, setQuery] = useState("");
  const [artist, setArtist] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<ConcertStatus | "">("");
  const [showPast, setShowPast] = useState(false);
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

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#FFF5F8] text-[#1E1225] md:flex-row">
      {/* Sidebar */}
      <aside className="order-2 flex min-h-0 flex-1 flex-col border-[#F0E6EE] bg-white md:order-1 md:w-96 md:flex-none md:border-r">
        <div className="hidden border-b border-[#F0E6EE] px-5 py-4 md:block">
          <h1 className="text-lg font-bold tracking-tight">K-pop concerts worldwide</h1>
          <p className="mt-0.5 text-xs text-[#6B5F7A]">Tour dates from official announcements, on one map</p>
        </div>

        <div className="space-y-2 border-b border-[#F0E6EE] p-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artist, city, venue…"
            className={selectCls}
          />
          <div className="grid grid-cols-3 gap-2">
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
          <div className="flex items-center justify-between text-xs text-[#6B5F7A]">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="accent-[#E8436F]" />
              Include past shows
            </label>
            {hasFilters && (
              <button onClick={resetFilters} className="text-[#E8436F] hover:underline">
                Reset
              </button>
            )}
          </div>
        </div>

        <p className="px-4 pt-3 text-xs text-[#B0A8BB]">
          {filtered.length} shows · {groups.length} venues · {countryCount} countries
        </p>

        <ul className="min-h-0 flex-1 overflow-y-auto p-2">
          {filtered.length === 0 && <li className="p-6 text-center text-sm text-[#B0A8BB]">No shows match these filters.</li>}
          {filtered.map((c) => {
            const active = c.venue.id === selectedVenueId;
            return (
              <li key={c.id}>
                <button
                  onClick={() => selectVenue(c.venue.id, c.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#FFF5F8] ${
                    active ? "bg-[#FFF0F5] ring-1 ring-[#E8436F]/30" : ""
                  }`}
                >
                  <div className="w-11 shrink-0 text-center leading-tight">
                    <div className="text-[10px] font-semibold uppercase text-[#E8436F]">{formatDate(c.date, { weekday: undefined, day: undefined, year: undefined })}</div>
                    <div className="text-lg font-semibold">{Number(c.date.slice(8))}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{c.artist.name}</div>
                    <div className="truncate text-xs text-[#6B5F7A]">
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

      {/* Map */}
      <main className="relative order-1 h-[45dvh] md:order-2 md:h-auto md:flex-1">
        <ConcertMap groups={groups} selectedVenueId={selectedVenueId} onSelectVenue={(id) => selectVenue(id)} />

        {/* Detail panel */}
        {selected && (
          <section className="absolute inset-x-0 bottom-0 z-[600] max-h-[70%] overflow-y-auto rounded-t-3xl border border-[#F0E6EE] bg-white/95 p-5 shadow-[0_8px_32px_rgba(30,18,37,0.15)] backdrop-blur md:inset-x-auto md:bottom-auto md:right-4 md:top-4 md:max-h-[calc(100%-2rem)] md:w-[380px] md:rounded-3xl">
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
                className="rounded-full p-1.5 text-[#B0A8BB] hover:bg-[#FFF0F5] hover:text-[#1E1225]"
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
                  {c.status !== "cancelled" && (
                    <div className="mt-3">
                      <p className="text-xs text-[#6B5F7A]">Hotels near the venue for this night</p>
                      <div className="mt-1 grid grid-cols-3 gap-1.5">
                        {hotelLinks(c.venue, c.date).map((h) => (
                          <a
                            key={h.site}
                            href={h.href}
                            target="_blank"
                            rel={h.rel}
                            className="rounded-lg border border-[#F0E6EE] bg-white px-2 py-1.5 text-center text-xs font-semibold hover:border-[#E8436F]/40"
                          >
                            {h.site}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  <Link
                    href={`/concerts/${c.id}`}
                    className="mt-3 block text-center text-xs text-[#6B5F7A] hover:text-[#E8436F]"
                  >
                    Full details, places to eat nearby →
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
