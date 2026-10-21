import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConcertList from "@/components/concerts/ConcertList";
import { getCities, getConcertsByCity } from "@/lib/concerts/data";
import { flag } from "@/lib/concerts/format";
import { pageMeta } from "@/lib/seo";

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
  const artists = [...new Set(getConcertsByCity(params.slug).map((c) => c.artist.name))];
  return pageMeta({
    title: `K-pop concerts in ${city.name}`,
    description: `Upcoming K-pop concerts in ${city.name}, ${city.country}: ${artists.slice(0, 6).join(", ")}. Dates, venues and tickets.`,
    path: `/concerts/cities/${params.slug}`,
  });
}

export default function CityPage({ params }: Props) {
  const city = findCity(params.slug);
  if (!city) notFound();
  return (
    <>
      <h1 className="text-3xl font-bold">
        {flag(city.countryCode)} K-pop concerts in {city.name}
      </h1>
      <p className="mt-1 text-[#6B5F7A]">{city.country}</p>
      <div className="mt-8">
        <ConcertList concerts={getConcertsByCity(params.slug)} show="artist" />
      </div>
    </>
  );
}
