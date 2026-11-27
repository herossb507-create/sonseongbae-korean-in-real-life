import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConcertList from "@/components/concerts/ConcertList";
import StageBanner from "@/components/concerts/StageBanner";
import { getCities, getConcertsByCity } from "@/lib/concerts/data";
import { flag } from "@/lib/concerts/format";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs, eventList, graph } from "@/lib/concerts/schema";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getCities().map((c) => ({ slug: c.slug }));
}


function findCity(slug: string) {
  return getCities().find((c) => c.slug === slug);
}

export function generateMetadata({ params }: Props): Metadata {
  const city = findCity(params.slug);
  if (!city) return {};
  const shows = getConcertsByCity(params.slug);
  const artists = [...new Set(shows.map((c) => c.artist.name))];
  const venues = [...new Set(shows.map((c) => c.venue.name))];
  const years = [...new Set(shows.map((c) => c.date.slice(0, 4)))].sort().join("–");
  return pageMeta({
    title: `K-pop Concerts in ${city.name} ${years}: Dates, Venues & Tickets`,
    description: `${shows.length} K-pop concert${shows.length > 1 ? "s" : ""} in ${city.name}, ${city.country}: ${artists.slice(0, 6).join(", ")} at ${venues.slice(0, 3).join(", ")}. Dates, tickets and hotels near the venue.`,
    path: `/concerts/cities/${params.slug}`,
  });
}

export default function CityPage({ params }: Props) {
  const city = findCity(params.slug);
  if (!city) notFound();
  const shows = getConcertsByCity(params.slug);
  return (
    <>
      <JsonLd
        data={graph(
          eventList(`K-pop concerts in ${city.name}`, shows),
          breadcrumbs([
            { name: "K-pop Concerts", path: "/concerts" },
            { name: "Cities", path: "/concerts/cities" },
            { name: city.name, path: `/concerts/cities/${city.slug}` },
          ]),
        )}
      />
      <StageBanner>
        <p className="text-xs font-bold uppercase tracking-widest text-[#22D3EE]">
          {flag(city.countryCode)} {city.country}
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
          K-pop concerts in <span className="text-neon">{city.name}</span>
        </h1>
        <p className="mt-2 text-white/70">
          {shows.length} show{shows.length > 1 ? "s" : ""} · {[...new Set(shows.map((c) => c.artist.name))].slice(0, 5).join(", ")}
        </p>
      </StageBanner>
      <div className="mt-8">
        <ConcertList concerts={shows} show="artist" />
      </div>
    </>
  );
}
