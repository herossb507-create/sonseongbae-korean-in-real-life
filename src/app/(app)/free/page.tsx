import Link from "next/link";
import { FREE_GUIDES, FREE_PDF } from "@/lib/books";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Free Korean Phrase PDFs & K-pop Fan Dictionary",
  description:
    "Download Kohami's free Korean guides: 30 survival, natural and nuance phrases plus a K-pop Fan Dictionary, with Hangul and easy pronunciation. No sign-up.",
  path: "/free",
});

export default function FreePage() {
  return (
    <div className="min-h-screen bg-[#F8F5FF]">
      <section className="stage-bg relative overflow-hidden text-white">
        <div className="stage-beams pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-4 py-12 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#22D3EE]">Free download · no sign-up</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
            🐹 {FREE_PDF.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/75">{FREE_PDF.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FREE_GUIDES.map((g) => (
            <li key={g.file} className="holo flex flex-col overflow-hidden rounded-3xl border border-[#EAE4F7] bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/free/${g.file}.jpg`} alt={`Kohami's ${g.title} — cover`} loading="lazy" className="aspect-[3/4] w-full object-cover object-top" />
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7C5CFF]">{g.level}</p>
                <h2 className="mt-0.5 font-black text-[#140F2D]">{g.title}</h2>
                <p className="mt-1 flex-1 text-sm text-[#5A5475]">{g.desc}</p>
                <p className="mt-2 font-noto-kr text-sm font-bold text-[#FF3D8B]">{g.sample}</p>
                <a
                  href={`/free/${g.file}.pdf`}
                  download
                  className="glow-pink mt-4 block rounded-full bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] py-2.5 text-center text-sm font-bold text-white hover:opacity-90"
                >
                  Download PDF ↓
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-3xl border border-[#EAE4F7] bg-white p-6 text-center shadow-sm">
          <p className="font-bold text-[#140F2D]">Liked the guides? Learn the full course free, or get the books.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/learn" className="rounded-full bg-[#140F2D] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
              Start the free chapters →
            </Link>
            <Link href="/books" className="rounded-full border border-[#DCD2F3] px-5 py-2.5 text-sm font-semibold text-[#7C5CFF] hover:bg-[#F2ECFF]">
              See the books →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
