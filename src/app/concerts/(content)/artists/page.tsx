import type { Metadata } from "next";
import Link from "next/link";
import { getConcertsByArtist, getListedArtists } from "@/lib/concerts/data";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "K-pop artists on tour",
  description: "Every K-pop artist with announced concert dates, with links to each tour stop.",
  path: "/concerts/artists",
});

export default function ArtistsPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Artists on tour</h1>
      <ul className="grid gap-2 sm:grid-cols-2">
        {getListedArtists().map((a) => (
          <li key={a.id}>
            <Link
              href={`/concerts/artists/${a.id}`}
              className="flex items-center justify-between rounded-2xl border border-[#F0E6EE] bg-white px-4 py-3 transition hover:border-[#E8436F]/30 hover:shadow-sm"
            >
              <span>
                <span className="font-semibold">{a.name}</span>
                {a.nameKo && <span className="ml-2 font-noto-kr text-sm text-[#B0A8BB]">{a.nameKo}</span>}
              </span>
              <span className="text-xs text-[#6B5F7A]">{getConcertsByArtist(a.id).length} shows</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
