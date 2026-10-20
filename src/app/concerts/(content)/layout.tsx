import Link from "next/link";
import ConcertsHeader from "@/components/concerts/ConcertsHeader";

export default function ConcertsContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFF5F8] text-[#1E1225]">
      <ConcertsHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t border-[#F0E6EE] bg-white">
        <div className="mx-auto max-w-3xl space-y-2 px-4 py-6 text-xs text-[#B0A8BB]">
          <p>
            Concert dates come from official announcements and ticket sellers. Some ticket and travel links are
            affiliate links: we may earn a commission at no extra cost to you. It never changes which seller we list
            first.
          </p>
          <p className="flex flex-wrap gap-4">
            <Link href="/concerts/disclosure" className="hover:text-[#1E1225]">Affiliate disclosure</Link>
            <Link href="/" className="hover:text-[#1E1225]">Learn Korean</Link>
            <a href="mailto:hello@koreaninreallife.com" className="hover:text-[#1E1225]">Report a wrong date</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
