"use client";

import Link from "next/link";
import { dDay } from "@/lib/concerts/dday";
import { useToday } from "@/lib/concerts/useToday";

export interface UpcomingShow {
  id: string;
  artist: string;
  date: string;
  city: string;
  flag: string;
  venue: string;
}

const MONTH = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** Next shows as concert tickets in a sideways-scrolling row (stage section of the landing page). */
export default function UpcomingShows({ shows }: { shows: UpcomingShow[] }) {
  const today = useToday();
  const next = (today ? shows.filter((s) => s.date >= today) : shows).slice(0, 10);

  return (
    <div className="-mx-6 flex snap-x scroll-px-6 gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none]">
      {next.map((s) => {
        const label = dDay(s.date, today);
        return (
          <Link
            key={s.id}
            href={`/concerts/${s.id}`}
            className="ticket group flex w-72 shrink-0 snap-start overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/10 backdrop-blur transition hover:bg-white/[0.12]"
          >
            <div className="flex w-20 shrink-0 flex-col items-center justify-center border-r border-dashed border-white/20 bg-gradient-to-b from-[#FF3D8B] to-[#7C5CFF] py-4 text-white">
              <span className="text-[11px] font-bold tracking-widest opacity-90">{MONTH[Number(s.date.slice(5, 7)) - 1]}</span>
              <span className="text-3xl font-black leading-none">{Number(s.date.slice(8))}</span>
              <span className="mt-1 text-[10px] opacity-80">{s.date.slice(0, 4)}</span>
            </div>
            <div className="min-w-0 flex-1 p-4 pl-5">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-lg font-black text-white">{s.artist}</p>
                {label && <span className="shrink-0 text-[11px] font-black text-[#22D3EE]">{label}</span>}
              </div>
              <p className="mt-1 truncate text-sm text-white/80">
                {s.flag} {s.city}
              </p>
              <p className="truncate text-xs text-white/50">{s.venue}</p>
              <p className="mt-3 text-xs font-semibold text-[#FF6FB1] group-hover:underline">Tickets & hotels →</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
