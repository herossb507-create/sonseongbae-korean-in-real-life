"use client";

import Link from "next/link";
import type { ConcertWithRefs } from "@/lib/concerts/types";
import { flag, formatDate } from "@/lib/concerts/format";
import { useToday } from "@/lib/concerts/useToday";
import StatusBadge, { UnconfirmedBadge } from "./StatusBadge";

interface Props {
  concerts: ConcertWithRefs[];
  show: "artist" | "venue"; // which detail to lead with on each row
}

function Row({ c, show }: { c: ConcertWithRefs; show: Props["show"] }) {
  return (
    <li>
      <Link
        href={`/concerts/${c.id}`}
        className="flex items-center gap-4 rounded-2xl border border-[#F0E6EE] bg-white px-4 py-3 transition hover:border-[#E8436F]/30 hover:shadow-sm"
      >
        <div className="w-24 shrink-0 text-sm text-[#6B5F7A]">{formatDate(c.date, { weekday: undefined })}</div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-[#1E1225]">
            {show === "artist" ? c.artist.name : `${c.venue.city}, ${c.venue.country}`}
          </div>
          <div className="truncate text-sm text-[#6B5F7A]">
            {show === "artist" ? (
              <>
                {c.tour} · {c.venue.name}
              </>
            ) : (
              <>
                {flag(c.venue.countryCode)} {c.venue.name}
              </>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
          {c.verification === "unverified" && <UnconfirmedBadge />}
          <StatusBadge status={c.status} />
        </div>
      </Link>
    </li>
  );
}

export default function ConcertList({ concerts, show }: Props) {
  const today = useToday();
  // Before hydration everything renders as upcoming, so crawlers see every show.
  const upcoming = concerts.filter((c) => !today || c.date >= today);
  const past = concerts.filter((c) => today && c.date < today).reverse();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B5F7A]">
          Upcoming ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-[#B0A8BB]">No upcoming shows announced.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((c) => (
              <Row key={c.id} c={c} show={show} />
            ))}
          </ul>
        )}
      </section>
      {past.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B5F7A]">Past ({past.length})</h2>
          <ul className="space-y-2 opacity-60">
            {past.map((c) => (
              <Row key={c.id} c={c} show={show} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
