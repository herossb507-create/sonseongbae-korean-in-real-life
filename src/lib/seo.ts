import type { Metadata } from "next";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";

export const SITE_NAME = "Korean in Real Life";

// 1200×630 share images in /public (generated once from the brand colours and book covers).
const OG_IMAGES = {
  default: { url: "/og-image.png", alt: "Korean in Real Life — learn practical Korean free, plus a K-pop concert map" },
  concerts: { url: "/og-concerts.png", alt: "K-pop Concert Map — tour dates worldwide, official tickets, hotels near the venue" },
  books: { url: "/og-books.jpg", alt: "Korean in Real Life books for learning Korean and visiting Korea" },
};

/** The concert and book sections get their own share image; everything else the site's. */
function ogImage(path: string) {
  const img = path.startsWith("/concerts") ? OG_IMAGES.concerts : path.startsWith("/books") ? OG_IMAGES.books : OG_IMAGES.default;
  return { ...img, width: 1200, height: 630 };
}

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
  const image = ogImage(path);
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
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image.url] },
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
