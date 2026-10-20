import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConcertList from "@/components/concerts/ConcertList";
import { getArtist, getConcertsByArtist, getListedArtists } from "@/lib/concerts/data";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getListedArtists().map((a) => ({ slug: a.id }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: Props): Metadata {
  const artist = getArtist(params.slug);
  if (!artist) return {};
  const shows = getConcertsByArtist(params.slug);
  const tours = [...new Set(shows.map((c) => c.tour))].join(", ");
  return pageMeta({
    title: `${artist.name} Tour Dates 2026–2027 & Tickets`,
    description: `${artist.name}${artist.nameKo ? ` (${artist.nameKo})` : ""} concert dates: ${tours}. ${shows.length} shows with venues and ticket links.`,
    path: `/concerts/artists/${params.slug}`,
  });
}

const OFFICIAL_LABEL = { weverse: "Weverse", site: "Official site", x: "X", instagram: "Instagram", youtube: "YouTube" };

export default function ArtistPage({ params }: Props) {
  const artist = getArtist(params.slug);
  const shows = getConcertsByArtist(params.slug);
  if (!artist || shows.length === 0) notFound();
  const official = Object.entries(artist.official).filter(([, url]) => url) as [keyof typeof OFFICIAL_LABEL, string][];

  return (
    <>
      <h1 className="text-3xl font-bold">
        {artist.name}
        {artist.nameKo && <span className="ml-3 font-noto-kr text-lg font-normal text-[#B0A8BB]">{artist.nameKo}</span>}
      </h1>
      <p className="mt-1 text-[#6B5F7A]">Tour dates and tickets</p>
      {official.length > 0 && (
        <p className="mt-3 flex flex-wrap gap-3 text-sm">
          {official.map(([k, url]) => (
            <a key={k} href={url} target="_blank" rel="noopener noreferrer" className="text-[#E8436F] hover:underline">
              {OFFICIAL_LABEL[k]} ↗
            </a>
          ))}
        </p>
      )}
      <div className="mt-8">
        <ConcertList concerts={shows} show="venue" />
      </div>
    </>
  );
}
