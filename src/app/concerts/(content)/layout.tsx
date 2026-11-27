import Link from "next/link";
import ConcertsHeader from "@/components/concerts/ConcertsHeader";

export default function ConcertsContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F5FF] text-[#140F2D]">
      <ConcertsHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
      <footer className="stage-bg text-white">
        <div className="mx-auto max-w-3xl space-y-2 px-4 py-8 text-xs text-white/55">
          <p>
            Concert dates come from official announcements and ticket sellers. Some ticket and travel links are
            affiliate links: we may earn a commission at no extra cost to you. It never changes which seller we list
            first.
          </p>
          <p className="flex flex-wrap gap-4">
            <Link href="/concerts/disclosure" className="hover:text-white">Affiliate disclosure</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/" className="hover:text-white">Learn Korean</Link>
            <a href="mailto:hello@koreaninreallife.com" className="hover:text-white">Report a wrong date</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
