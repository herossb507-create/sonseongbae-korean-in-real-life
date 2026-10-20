import Link from "next/link";
import type { ConcertWithRefs } from "@/lib/concerts/types";
import { ticketLinksFor } from "@/lib/concerts/affiliate";

const KIND_NOTE = {
  primary: "",
  fanclub: "Fanclub",
  presale: "Presale",
  resale: "Resale · entry may be refused",
};

export default function TicketLinks({ concert }: { concert: ConcertWithRefs }) {
  if (concert.status === "cancelled") return null;
  const links = ticketLinksFor(concert);
  if (links.length === 0) return null;
  const anySponsored = links.some((l) => l.sponsored);

  return (
    <div className="mt-3 space-y-2">
      {links.map((l, i) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel={l.rel}
          className={`flex items-center justify-between rounded-xl px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 ${
            i === 0 && l.kind !== "resale"
              ? "bg-gradient-to-r from-[#E8436F] to-[#F06B8A] text-white shadow-[0_4px_16px_rgba(232,67,111,0.25)]"
              : "border border-[#F0E6EE] bg-white text-[#1E1225]"
          }`}
        >
          <span>{l.label} ↗</span>
          {KIND_NOTE[l.kind] && <span className="text-xs font-normal opacity-80">{KIND_NOTE[l.kind]}</span>}
        </a>
      ))}
      {anySponsored && (
        <p className="text-[11px] text-[#B0A8BB]">
          Some links are affiliate links.{" "}
          <Link href="/concerts/disclosure" className="underline">
            Learn more
          </Link>
        </p>
      )}
    </div>
  );
}
