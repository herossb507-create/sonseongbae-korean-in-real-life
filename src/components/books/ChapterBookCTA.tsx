import { FREE_PDF, bookForChapter } from "@/lib/books";
import { BookCover } from "./BookCover";

/** End-of-chapter pointer to the volume that covers this chapter in depth. */
export function ChapterBookCTA({ chapterId }: { chapterId: string }) {
  const book = bookForChapter(chapterId);
  return (
    <div>
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-2xl border border-[#F0E6EE] bg-white p-4 shadow-sm transition-all hover:border-[#E8436F]/30 hover:shadow-md"
      >
        <BookCover book={book} className="w-12" small />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9B7FE8]">Go deeper in the book</p>
          <p className="font-semibold text-[#1E1225]">
            {book.title} <span className="text-[#E8436F]">· {book.subtitle}</span>
          </p>
          <p className="mt-0.5 text-xs text-[#6B5F7A]">
            This chapter with full dialogues, practice + answer key and Listen &amp; Repeat videos.
          </p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-[#E8436F] group-hover:translate-x-0.5 transition-transform">
          Amazon ↗
        </span>
      </a>
      <p className="mt-2 text-center text-xs text-[#6B5F7A]">
        🐹 Free PDFs with 90 real Korean phrases:{" "}
        <a
          href={FREE_PDF.url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-semibold text-[#E8436F] underline underline-offset-2"
        >
          {FREE_PDF.displayUrl}
        </a>
      </p>
    </div>
  );
}
