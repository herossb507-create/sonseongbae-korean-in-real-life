import type { Metadata } from "next";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";

export const SITE_NAME = "Korean in Real Life";

// 1200×630 share image in /public (generated once from the brand colours).
const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Korean in Real Life — learn practical Korean free, plus a K-pop concert map",
};

/**
 * Title, description, canonical URL and social-share tags for one page.
 * Each page needs its own openGraph block: Next.js replaces (doesn't merge) it per page,
 * so without this every share preview would show the home page's title.
 */
export function pageMeta({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string; // e.g. "/learn/ch05"; resolved against metadataBase
  noindex?: boolean;
}): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

/** Per-browser pages (progress, settings): useful to visitors, empty to crawlers. */
export const PRIVATE_PAGE: Metadata = { robots: { index: false, follow: true } };

/** "Why Hangul is easier than it looks; The 21 vowels…" from the chapter's "What You'll Learn" list. */
export function chapterSummary(chapterId: string, maxItems = 2): string {
  const content = CHAPTER_CONTENT[chapterId]?.content ?? "";
  const section = content.split(/^## What You'll Learn\s*$/m)[1] ?? "";
  const bullets = section
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- "))
    .slice(0, maxItems)
    .map((l) => l.slice(2).replace(/\*\*/g, "").replace(/\s+—\s+/g, ": "));
  return bullets.join(". ");
}
