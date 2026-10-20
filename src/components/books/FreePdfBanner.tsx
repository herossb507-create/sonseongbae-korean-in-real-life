import Link from "next/link";
import { FREE_PDF } from "@/lib/books";

/** Email sign-up for the free PDFs (hosted on MailerLite). */
export function FreePdfBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-3xl border border-[#F4A261]/30 bg-gradient-to-br from-[#FFF8EF] to-[#FFF0F5] sm:flex-row sm:items-center sm:justify-between ${
        compact ? "p-5" : "p-6 sm:p-8"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl" aria-hidden>
          🐹
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#F4A261]">Free download</p>
          <p className={`font-bold text-[#1E1225] ${compact ? "text-base" : "text-xl"}`}>
            {FREE_PDF.title} <span className="font-medium text-[#6B5F7A]">· {FREE_PDF.subtitle}</span>
          </p>
          {!compact && <p className="mt-1 max-w-xl text-sm text-[#6B5F7A]">{FREE_PDF.description}</p>}
          <p className="mt-1 text-[11px] text-[#B0A8BB]">
            Sign-up by email via MailerLite ·{" "}
            <Link href="/privacy" className="underline">
              Privacy
            </Link>
          </p>
        </div>
      </div>
      <a
        href={FREE_PDF.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 self-start rounded-xl bg-[#F4A261] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#F7B88A] sm:self-center"
      >
        Get the free PDFs ↗
      </a>
    </div>
  );
}
