// The author's books and free lead magnet. Links are plain Amazon product URLs
// (resolved from the a.co share links); add an Associates tag here if you join.

export type BookId = "kirl-1" | "kirl-2" | "korea-unlocked";

export interface Book {
  id: BookId;
  title: string;
  subtitle: string;
  series?: string;
  url: string;
  formats: string;
  pages: number;
  pitch: string;
  highlights: string[];
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
    coverGradient: "from-[#E8436F] to-[#F06B8A]",
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
    coverGradient: "from-[#9B7FE8] to-[#B099FF]",
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
    coverGradient: "from-[#1E1225] to-[#4A3560]",
  },
};

export const FREE_PDF = {
  title: "Kohami's Free Korean Guides",
  subtitle: "3 levels · 90 real Korean phrases",
  description:
    "Beginner, Intermediate and Advanced PDFs with Hangul, easy pronunciation and a tip from Kohami the hamster teacher on every page.",
  url: "https://kohami-abahgp.subscribepage.io",
};

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
