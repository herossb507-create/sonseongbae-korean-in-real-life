import Link from "next/link";
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
        className="group flex items-center gap-4 rounded-2xl border border-[#EAE4F7] bg-white p-4 shadow-sm transition-all hover:border-[#FF3D8B]/30 hover:shadow-md"
      >
        <BookCover book={book} className="w-12" small />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7C5CFF]">Go deeper in the book</p>
          <p className="font-semibold text-[#140F2D]">
            {book.title} <span className="text-[#FF3D8B]">· {book.subtitle}</span>
          </p>
          <p className="mt-0.5 text-xs text-[#5A5475]">
            This chapter with full dialogues, practice + answer key and Listen &amp; Repeat videos.
          </p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-[#FF3D8B] group-hover:translate-x-0.5 transition-transform">
          Amazon ↗
        </span>
      </a>
      <p className="mt-2 text-center text-xs text-[#5A5475]">
        🐹 Free Korean phrase PDFs, no sign-up:{" "}
        <Link
          href={FREE_PDF.url}
          className="break-all font-semibold text-[#FF3D8B] underline underline-offset-2"
        >
          {FREE_PDF.linkText}
        </Link>
      </p>
    </div>
  );
}
