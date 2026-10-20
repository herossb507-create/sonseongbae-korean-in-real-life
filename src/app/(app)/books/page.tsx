import type { Metadata } from "next";
import { BookCard } from "@/components/books/BookCard";
import { FreePdfBanner } from "@/components/books/FreePdfBanner";
import { BOOKS } from "@/lib/books";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Korean in Real Life Books & Korea Unlocked Travel Guide",
  description:
    "Korean in Real Life Volumes 1 & 2 for beginners and Korea Unlocked, the insider's travel guide to South Korea — plus free Korean phrase PDFs.",
  path: "/books",
});

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-[#FFF5F8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": Object.values(BOOKS).map((b) => ({
              "@type": "Book",
              name: `${b.title}: ${b.subtitle}`,
              numberOfPages: b.pages,
              inLanguage: "en",
              url: b.url,
            })),
          }}
        />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1225]">📚 The books</h1>
          <p className="text-[#6B5F7A] text-sm mt-1 max-w-2xl">
            This site follows the Korean in Real Life books. Get the full chapters with dialogues, practice exercises,
            answer keys and Listen &amp; Repeat videos — and plan your trip with Korea Unlocked.
          </p>
        </div>

        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6B5F7A] mb-3">Learn Korean</h2>
        <div className="grid gap-5 md:grid-cols-2 mb-10">
          <BookCard book={BOOKS["kirl-1"]} />
          <BookCard book={BOOKS["kirl-2"]} />
        </div>

        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6B5F7A] mb-3">Visit Korea</h2>
        <div className="grid gap-5 md:grid-cols-2 mb-10">
          <BookCard book={BOOKS["korea-unlocked"]} />
          <div className="rounded-3xl border border-dashed border-[#E5DCE6] p-6 text-sm text-[#6B5F7A] flex flex-col justify-center">
            <p className="font-semibold text-[#1E1225] mb-1">Not sure where to start?</p>
            <p>
              New to Korean → <strong>Volume 1</strong>. Already ordering food in Korean → <strong>Volume 2</strong>.
              Planning a trip or a K-pop concert in Seoul → <strong>Korea Unlocked</strong>.
            </p>
          </div>
        </div>

        <FreePdfBanner />
      </div>
    </div>
  );
}
