import Image from "next/image";
import type { Book } from "@/lib/books";

/** Cover image when one is configured; otherwise a styled stand-in with the title. */
export function BookCover({
  book,
  className = "w-24",
  small = false,
}: {
  book: Book;
  className?: string;
  /** Thumbnail size: show a short label instead of the full title. */
  small?: boolean;
}) {
  if (book.cover) {
    return (
      <Image
        src={book.cover}
        alt={`${book.title} — ${book.subtitle}`}
        width={240}
        height={360}
        className={`${className} aspect-[2/3] rounded-lg object-cover shadow-[0_8px_24px_rgba(30,18,37,0.18)]`}
      />
    );
  }
  if (small) {
    return (
      <div
        aria-hidden
        className={`${className} aspect-[2/3] shrink-0 rounded-md bg-gradient-to-br ${book.coverGradient} flex items-center justify-center text-center text-[10px] font-black leading-tight text-white shadow-[0_4px_12px_rgba(30,18,37,0.18)]`}
      >
        {book.series ? `Vol. ${book.series.match(/\d/)?.[0]}` : "Korea"}
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className={`${className} aspect-[2/3] shrink-0 rounded-lg bg-gradient-to-br ${book.coverGradient} p-2.5 flex flex-col justify-between text-white shadow-[0_8px_24px_rgba(30,18,37,0.18)]`}
    >
      <span className="text-[9px] font-semibold uppercase tracking-wider opacity-80">{book.series ?? "Travel guide"}</span>
      <span className="text-sm font-black leading-tight">{book.title}</span>
      <span className="text-[9px] leading-tight opacity-90">{book.subtitle}</span>
    </div>
  );
}
