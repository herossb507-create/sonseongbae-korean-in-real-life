import type { MetadataRoute } from "next";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import { DIALOGUE_SCENARIOS } from "@/lib/dialogue-data";
import { CHAPTER_VOCAB } from "@/lib/vocab-data";
import { getCities, getConcerts, getListedArtists } from "@/lib/concerts/data";
import { SITE_URL } from "@/lib/concerts/site";

// Public, indexable pages. Progress pages (home, stats, settings) are per-browser and left out.
export default function sitemap(): MetadataRoute.Sitemap {
  const concerts = getConcerts();
  const latest = (list: { updatedAt: string }[]) =>
    list.reduce((max, c) => (c.updatedAt > max ? c.updatedAt : max), "1970-01-01");

  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/learn`, changeFrequency: "monthly", priority: 0.9 },
    ...Object.keys(CHAPTER_CONTENT).map((id) => ({ url: `${SITE_URL}/learn/${id}`, changeFrequency: "monthly" as const })),
    { url: `${SITE_URL}/books`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/games`, changeFrequency: "monthly" },
    { url: `${SITE_URL}/kdrama`, changeFrequency: "monthly" },
    ...Object.keys(CHAPTER_VOCAB)
      .filter((id) => CHAPTER_CONTENT[id])
      .map((id) => ({ url: `${SITE_URL}/vocab/${id}`, changeFrequency: "monthly" as const })),
    { url: `${SITE_URL}/daily`, changeFrequency: "daily" },
    { url: `${SITE_URL}/dialogues`, changeFrequency: "monthly" },
    ...DIALOGUE_SCENARIOS.map((d) => ({ url: `${SITE_URL}/dialogues/${d.id}`, changeFrequency: "monthly" as const })),
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
