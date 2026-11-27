import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConcertList from "@/components/concerts/ConcertList";
import StageBanner from "@/components/concerts/StageBanner";
import { getArtist, getConcertsByArtist, getListedArtists } from "@/lib/concerts/data";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs, eventList, graph } from "@/lib/concerts/schema";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getListedArtists().map((a) => ({ slug: a.id }));
}


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
      <JsonLd
        data={graph(
          eventList(`${artist.name} tour dates`, shows),
          breadcrumbs([
            { name: "K-pop Concerts", path: "/concerts" },
            { name: "Artists", path: "/concerts/artists" },
            { name: artist.name, path: `/concerts/artists/${artist.id}` },
          ]),
        )}
      />
      <StageBanner>
      <p className="text-xs font-bold uppercase tracking-widest text-[#22D3EE]">Tour dates & tickets</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
        {artist.name}
        {artist.nameKo && <span className="ml-3 font-noto-kr text-xl font-bold text-white/50">{artist.nameKo}</span>}
      </h1>
      <p className="mt-2 text-neon font-bold">{[...new Set(shows.map((c) => c.tour))].join(" · ")}</p>
      {official.length > 0 && (
        <p className="mt-3 flex flex-wrap gap-3 text-sm">
          {official.map(([k, url]) => (
            <a key={k} href={url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 px-3 py-1 text-white/85 hover:bg-white/20">
              {OFFICIAL_LABEL[k]} ↗
            </a>
          ))}
        </p>
      )}
      </StageBanner>
      <div className="mt-8">
        <ConcertList concerts={shows} show="venue" />
      </div>
    </>
  );
}
