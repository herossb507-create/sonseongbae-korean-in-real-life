import Link from "next/link";
import type { Book } from "@/lib/books";
import { BookCover } from "./BookCover";

export function BookCard({ book }: { book: Book }) {
  return (
    <div className="holo flex flex-col rounded-3xl border border-[#EAE4F7] bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
      <div className="flex gap-5">
        <Link href={`/books/${book.id}`} aria-label={`${book.title}: story, pictures and contents`} className="shrink-0">
          <BookCover book={book} className="w-24 sm:w-28" />
        </Link>
        <div className="min-w-0">
          {book.series && <p className="text-xs font-semibold uppercase tracking-wider text-[#7C5CFF]">{book.series}</p>}
          <h3 className="mt-0.5 text-lg font-bold leading-snug text-[#140F2D]">
            <Link href={`/books/${book.id}`} className="hover:text-[#FF3D8B]">
              {book.title}
            </Link>
          </h3>
          <p className="text-sm font-medium text-[#FF3D8B]">{book.subtitle}</p>
          <p className="mt-2 text-xs text-[#9E98B8]">
            {book.formats}
            {book.pages && <> · {book.pages} pages</>}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#5A5475]">{book.pitch}</p>
      <ul className="mt-3 flex-1 space-y-1.5">
        {book.highlights.map((h) => (
          <li key={h} className="flex gap-2 text-sm text-[#2C2548]">
            <span className="text-[#FF3D8B]">✓</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/books/${book.id}`}
        className="mt-5 block rounded-xl border border-[#DCD2F3] py-2.5 text-center text-sm font-semibold text-[#7C5CFF] transition-colors hover:bg-[#F2ECFF]"
      >
        See inside: story & pictures →
      </Link>
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 block rounded-xl bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] py-2.5 text-center text-sm font-semibold text-white shadow-[0_4px_16px_rgba(255,61,139,0.25)] transition-opacity hover:opacity-90"
      >
        Get it on Amazon ↗
      </a>
    </div>
  );
}
