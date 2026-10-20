import type { Metadata } from "next";
import ConcertExplorer from "@/components/concerts/ConcertExplorer";
import ConcertsHeader from "@/components/concerts/ConcertsHeader";
import { getConcerts } from "@/lib/concerts/data";
import { SITE_URL } from "@/lib/concerts/site";

export const metadata: Metadata = {
  title: "K-pop Concert Map — tour dates worldwide | Korean in Real Life",
  description: "Every announced K-pop concert on one world map: dates, venues and where to buy tickets, from official announcements.",
  alternates: { canonical: `${SITE_URL}/concerts` },
};

export default function ConcertsMapPage() {
  return (
    <div className="flex h-dvh flex-col">
      <ConcertsHeader />
      <ConcertExplorer concerts={getConcerts()} />
    </div>
  );
}
