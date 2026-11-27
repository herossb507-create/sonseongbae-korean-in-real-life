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
              className="flex items-center justify-between rounded-2xl border border-[#EAE4F7] bg-white px-4 py-3 transition hover:border-[#FF3D8B]/30 hover:shadow-sm"
            >
              <span>
                <span className="font-semibold">{a.name}</span>
                {a.nameKo && <span className="ml-2 font-noto-kr text-sm text-[#9E98B8]">{a.nameKo}</span>}
              </span>
              <span className="text-xs text-[#5A5475]">{getConcertsByArtist(a.id).length} shows</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
