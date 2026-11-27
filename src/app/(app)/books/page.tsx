import type { Metadata } from "next";
import { BookCard } from "@/components/books/BookCard";
import { FreePdfBanner } from "@/components/books/FreePdfBanner";
import { BOOKS, FREE_PDF } from "@/lib/books";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Korean Learning Books, K-pop Romance & Korea Travel Guide",
  description:
    "Korean in Real Life Volumes 1 & 2 for beginners, Korean on Campus for natural student Korean, Shy Girl, Center Stage — a K-pop romance for intermediate learners — and Korea Unlocked, the insider's travel guide to South Korea. Plus free Korean phrase PDFs.",
  path: "/books",
});

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-[#F8F5FF]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": Object.values(BOOKS).map((b) => ({
              "@type": "Book",
              name: `${b.title}: ${b.subtitle}`,
              ...(b.pages && { numberOfPages: b.pages }),
              inLanguage: "en",
              url: b.url,
            })),
          }}
        />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#140F2D]">📚 The books</h1>
          <p className="text-[#5A5475] text-sm mt-1 max-w-2xl">
            This site follows the Korean in Real Life books. Get the full chapters with dialogues, practice exercises,
            answer keys and Listen &amp; Repeat videos — and plan your trip with Korea Unlocked.
          </p>
          <p className="text-sm mt-3">
            🐹 Start free: get Kohami&apos;s 3 Korean phrase PDFs at{" "}
            <a
              href={FREE_PDF.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#FF3D8B] underline underline-offset-2"
            >
              {FREE_PDF.displayUrl}
            </a>
          </p>
        </div>

        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A5475] mb-3">Learn Korean</h2>
        <div className="grid gap-5 md:grid-cols-2 mb-10">
          <BookCard book={BOOKS["kirl-1"]} />
          <BookCard book={BOOKS["kirl-2"]} />
          <BookCard book={BOOKS["korean-on-campus"]} />
          <BookCard book={BOOKS["shy-girl-1"]} />
        </div>

        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A5475] mb-3">Visit Korea</h2>
        <div className="grid gap-5 md:grid-cols-2 mb-10">
          <BookCard book={BOOKS["korea-unlocked"]} />
          <div className="rounded-3xl border border-dashed border-[#E0D9F2] p-6 text-sm text-[#5A5475] flex flex-col justify-center">
            <p className="font-semibold text-[#140F2D] mb-1">Not sure where to start?</p>
            <p>
              New to Korean → <strong>Volume 1</strong>. Already ordering food in Korean → <strong>Volume 2</strong>.
              Can read Hangul but sound like a textbook → <strong>Korean on Campus</strong>. Love K-pop and want to
              read a story in Korean → <strong>Shy Girl, Center Stage</strong>. Planning a trip or a K-pop concert in Seoul → <strong>Korea Unlocked</strong>.
            </p>
          </div>
        </div>

        <FreePdfBanner />
      </div>
    </div>
  );
}
