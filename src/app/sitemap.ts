import type { MetadataRoute } from "next";
import { getCities, getConcerts, getListedArtists } from "@/lib/concerts/data";
import { SITE_URL } from "@/lib/concerts/site";

// Public pages only; app pages behind login are left out.
export default function sitemap(): MetadataRoute.Sitemap {
  const concerts = getConcerts();
  const latest = (list: { updatedAt: string }[]) =>
    list.reduce((max, c) => (c.updatedAt > max ? c.updatedAt : max), "1970-01-01");

  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly" },
    { url: `${SITE_URL}/concerts`, lastModified: latest(concerts), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/concerts/artists`, lastModified: latest(concerts), changeFrequency: "daily" },
    { url: `${SITE_URL}/concerts/cities`, lastModified: latest(concerts), changeFrequency: "daily" },
    ...getListedArtists().map((a) => ({
      url: `${SITE_URL}/concerts/artists/${a.id}`,
      lastModified: latest(concerts.filter((c) => c.artistId === a.id)),
      changeFrequency: "daily" as const,
    })),
    ...getCities().map((city) => ({
      url: `${SITE_URL}/concerts/cities/${city.slug}`,
      changeFrequency: "daily" as const,
    })),
    ...concerts.map((c) => ({
      url: `${SITE_URL}/concerts/${c.id}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
    })),
  ];
}
