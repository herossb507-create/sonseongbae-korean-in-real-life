import type { Book } from "@/lib/books";
import { BookCover } from "./BookCover";

export function BookCard({ book }: { book: Book }) {
  return (
    <div className="flex flex-col rounded-3xl border border-[#F0E6EE] bg-white p-6 shadow-sm">
      <div className="flex gap-5">
        <BookCover book={book} className="w-24 sm:w-28" />
        <div className="min-w-0">
          {book.series && <p className="text-xs font-semibold uppercase tracking-wider text-[#9B7FE8]">{book.series}</p>}
          <h3 className="mt-0.5 text-lg font-bold leading-snug text-[#1E1225]">{book.title}</h3>
          <p className="text-sm font-medium text-[#E8436F]">{book.subtitle}</p>
          <p className="mt-2 text-xs text-[#B0A8BB]">
            {book.formats} · {book.pages} pages
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#6B5F7A]">{book.pitch}</p>
      <ul className="mt-3 flex-1 space-y-1.5">
        {book.highlights.map((h) => (
          <li key={h} className="flex gap-2 text-sm text-[#3D2F48]">
            <span className="text-[#E8436F]">✓</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 block rounded-xl bg-gradient-to-r from-[#E8436F] to-[#F06B8A] py-2.5 text-center text-sm font-semibold text-white shadow-[0_4px_16px_rgba(232,67,111,0.25)] transition-opacity hover:opacity-90"
      >
        Get it on Amazon ↗
      </a>
    </div>
  );
}
