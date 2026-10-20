import type { Metadata } from "next";
import ConcertExplorer from "@/components/concerts/ConcertExplorer";
import ConcertsHeader from "@/components/concerts/ConcertsHeader";
import { getConcerts } from "@/lib/concerts/data";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "K-pop Concert Map — tour dates worldwide",
  description: "Every announced K-pop concert on one world map: dates, venues and where to buy tickets, from official announcements.",
  path: "/concerts",
});

export default function ConcertsMapPage() {
  return (
    <div className="flex h-dvh flex-col">
      <ConcertsHeader />
      <ConcertExplorer concerts={getConcerts()} />
    </div>
  );
}
