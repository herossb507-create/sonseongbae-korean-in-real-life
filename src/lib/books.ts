// The author's books and free lead magnet. Links are plain Amazon product URLs
// (resolved from the a.co share links); add an Associates tag here if you join.

export type BookId = "kirl-1" | "kirl-2" | "korean-on-campus" | "shy-girl-1" | "korea-unlocked";

export interface Book {
  id: BookId;
  title: string;
  subtitle: string;
  series?: string;
  url: string;
  formats: string;
  /** Print length; leave out until Amazon shows it. */
  pages?: number;
  pitch: string;
  highlights: string[];
  /** Short label on the small cover thumbnail; defaults to "Vol. N" for the series, else "Korea". */
  coverLabel?: string;
  /** Optional cover image in /public, e.g. "/books/kirl-1.jpg". A styled placeholder is shown without it. */
  cover?: string;
  coverGradient: string;
}

export const BOOKS: Record<BookId, Book> = {
  "kirl-1": {
    id: "kirl-1",
    title: "Korean in Real Life",
    subtitle: "Volume 1 · Speak from Day One",
    series: "Book 1 of 2",
    url: "https://www.amazon.com/dp/B0H64RM6Q5",
    formats: "Kindle & paperback",
    pages: 336,
    pitch: "Read Hangul in an afternoon and order dinner in Korean by the weekend — from absolute zero.",
    highlights: [
      "Hangul made simple, with a full chart to keep",
      "Greetings, numbers, transport, food, shopping, texting slang, K-pop & K-drama Korean",
      "Quick Reference Cards and free Listen & Repeat videos",
    ],
    cover: "/books/kirl-1.jpg",
    coverGradient: "from-[#FF3D8B] to-[#FF6FB1]",
  },
  "kirl-2": {
    id: "kirl-2",
    title: "Korean in Real Life",
    subtitle: "Volume 2 · Live the Culture",
    series: "Book 2 of 2",
    url: "https://www.amazon.com/dp/B0H4F11PRH",
    formats: "Kindle & paperback",
    pages: 301,
    pitch: "Go beyond survival phrases: honorifics, the workplace, friendships and the etiquette behind the words.",
    highlights: [
      "Workplace, school, hospital and pharmacy Korean",
      "Honorifics made clear, emotions, holidays and dining & drinking etiquette",
      "Verb conjugation guide and a 30-day study plan",
    ],
    cover: "/books/kirl-2.jpg",
    coverGradient: "from-[#7C5CFF] to-[#A78BFF]",
  },
  "korean-on-campus": {
    id: "korean-on-campus",
    title: "Korean on Campus",
    subtitle: "A Korean course told as a campus drama",
    series: "Season 1",
    url: "https://www.amazon.com/dp/B0HQ6VPYWV",
    formats: "Kindle · TOPIK 1–4",
    pages: 317,
    pitch:
      "Your Korean is correct, so why does everyone laugh? Follow one semester at a Korean university and learn the Korean textbooks skip.",
    highlights: [
      "반말 vs 존댓말 made clear: every line said too politely, too casually and just right",
      "Real student Korean: slang, contractions and group-chat talk (단톡, 읽씹, ㅋㅋ)",
      "18 lessons with a Core layer (TOPIK 1–2) and a Level Up layer (TOPIK 3–4), plus free companion Shorts",
    ],
    coverLabel: "Campus",
    cover: "/books/korean-on-campus.jpg",
    coverGradient: "from-[#2F6FE4] to-[#5FA8F5]",
  },
  "shy-girl-1": {
    id: "shy-girl-1",
    title: "Shy Girl, Center Stage",
    subtitle: "From the Greenhouse to the Stage",
    series: "Book 1",
    url: "https://www.amazon.com/dp/B0HS2S2FG8",
    formats: "Kindle · TOPIK 3–5",
    pitch:
      "A K-pop romance to learn intermediate Korean: a shy girl from a strawberry farm sings only when no one is listening, until one school festival changes everything.",
    highlights: [
      "English narration with every line of dialogue in natural Korean, and a translation under each line",
      "20 grammar patterns and 150 key expressions with real pronunciation",
      "K-culture notes on 선배 and 후배, fan-cams, trainee contracts and Arirang, plus a quiz in every chapter",
    ],
    coverLabel: "K-pop",
    cover: "/books/shy-girl-1.jpg",
    coverGradient: "from-[#F472B6] to-[#F59E0B]",
  },
  "korea-unlocked": {
    id: "korea-unlocked",
    title: "Korea Unlocked",
    subtitle: "The Insider's Complete Guide to South Korea",
    url: "https://www.amazon.com/dp/B0GRTZPPBQ",
    formats: "Kindle · 2026 edition",
    pages: 521,
    pitch: "The travel guide your Korean friend would write — Seoul, Busan, Jeju and beyond, from someone who lives here.",
    highlights: [
      "2026 entry rules: K-ETA and the e-Arrival Card",
      "K-pop spots, K-drama locations and K-beauty shopping done right",
      "6 ready-made itineraries and 120+ Local's Notes",
    ],
    cover: "/books/korea-unlocked.jpg",
    coverGradient: "from-[#140F2D] to-[#4A3560]",
  },
};

export const FREE_PDF = {
  title: "Kohami's Free Korean Guides",
  subtitle: "4 PDFs · 125 real Korean phrases",
  description:
    "Beginner, Intermediate and Advanced phrase guides plus a K-pop Fan Dictionary, with Hangul, easy pronunciation and a tip from Kohami the hamster teacher on every page. Instant download, no sign-up.",
  /** Download page on this site (the PDFs live in public/free/). */
  url: "/free",
  linkText: "Download the free PDFs",
};

/** The free PDFs, in the order shown on /free. Pages are the PDFs' own covers. */
export const FREE_GUIDES = [
  { file: "kohami-korean-phrases-beginner", level: "Beginner", title: "30 Survival Phrases", desc: "Real Korean for your first week in Korea.", sample: "안녕하세요! · Hello!" },
  { file: "kohami-korean-phrases-intermediate", level: "Intermediate", title: "30 Natural Phrases", desc: "Sound less like a textbook, more like a friend.", sample: "그러니까요! · I know, right?" },
  { file: "kohami-korean-phrases-advanced", level: "Advanced", title: "30 Nuance Phrases", desc: "The little endings and idioms that make you sound native.", sample: "정이 들었어요 · I've grown attached" },
  { file: "kohami-kpop-fan-dictionary", level: "K-pop fans", title: "K-pop Fan Dictionary", desc: "35 words every K-pop fan wants to know.", sample: "무대 찢었다! · That stage was amazing" },
];

// Which volume covers each site chapter (from the books' tables of contents).
const VOLUME_FOR_CHAPTER: Record<string, BookId> = {
  ch01: "kirl-1", ch02: "kirl-1", ch03: "kirl-1", ch04: "kirl-1", ch05: "kirl-1",
  ch06: "kirl-1", ch07: "kirl-1", ch08: "kirl-1", ch14: "kirl-1",
  ch09: "kirl-2", ch10: "kirl-2", ch11: "kirl-2", ch12: "kirl-2", ch13: "kirl-2",
  ch15: "kirl-2", ch16: "kirl-2",
};

export function bookForChapter(chapterId: string): Book {
  return BOOKS[VOLUME_FOR_CHAPTER[chapterId.split("-")[0]] ?? "kirl-1"];
}
