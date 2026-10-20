import type { Metadata } from "next";
import Link from "next/link";
import { getCities, getConcertsByCity } from "@/lib/concerts/data";
import { flag } from "@/lib/concerts/format";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "K-pop concerts by city",
  description: "Find K-pop concerts near you: every city with announced K-pop shows.",
  path: "/concerts/cities",
});

export default function CitiesPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">K-pop concerts by city</h1>
      <ul className="grid gap-2 sm:grid-cols-2">
        {getCities().map((c) => (
          <li key={c.slug}>
            <Link
              href={`/concerts/cities/${c.slug}`}
              className="flex items-center justify-between rounded-2xl border border-[#F0E6EE] bg-white px-4 py-3 transition hover:border-[#E8436F]/30 hover:shadow-sm"
            >
              <span>
                {flag(c.countryCode)} <span className="font-semibold">{c.name}</span>
                <span className="ml-2 text-sm text-[#B0A8BB]">{c.country}</span>
              </span>
              <span className="text-xs text-[#6B5F7A]">{getConcertsByCity(c.slug).length} shows</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
