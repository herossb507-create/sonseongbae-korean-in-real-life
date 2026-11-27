import Link from "next/link";
import { FREE_PDF } from "@/lib/books";

/** Promo for the free PDFs (download page /free, no sign-up). */
export function FreePdfBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-3xl border border-[#F4A261]/30 bg-gradient-to-br from-[#FFF8EF] to-[#F2ECFF] sm:flex-row sm:items-center sm:justify-between ${
        compact ? "p-5" : "p-6 sm:p-8"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl" aria-hidden>
          🐹
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#F4A261]">Free download</p>
          <p className={`font-bold text-[#140F2D] ${compact ? "text-base" : "text-xl"}`}>
            {FREE_PDF.title} <span className="font-medium text-[#5A5475]">· {FREE_PDF.subtitle}</span>
          </p>
          {!compact && <p className="mt-1 max-w-xl text-sm text-[#5A5475]">{FREE_PDF.description}</p>}
          <Link
            href={FREE_PDF.url}
            className="mt-1.5 inline-block break-all text-sm font-semibold text-[#FF3D8B] underline decoration-[#FF3D8B]/30 underline-offset-2 hover:decoration-[#FF3D8B]"
          >
            👉 {FREE_PDF.linkText}
          </Link>
          <p className="mt-1 text-[11px] text-[#9E98B8]">Instant download · no sign-up</p>
        </div>
      </div>
      <Link
        href={FREE_PDF.url}
        className="shrink-0 self-start rounded-xl bg-[#F4A261] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#F7B88A] sm:self-center"
      >
        Get the free PDFs →
      </Link>
    </div>
  );
}
