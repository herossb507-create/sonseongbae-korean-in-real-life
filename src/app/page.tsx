import Link from "next/link";
import { FloatingWords } from "@/components/FloatingWords";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/concerts/site";
import { BookCard } from "@/components/books/BookCard";
import { FreePdfBanner } from "@/components/books/FreePdfBanner";
import { BOOKS, FREE_PDF } from "@/lib/books";
import { getConcerts, getListedArtists } from "@/lib/concerts/data";
import { flag } from "@/lib/concerts/format";
import UpcomingShows from "@/components/landing/UpcomingShows";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = pageMeta({
  title: "Learn Korean Free — Real-Life Phrases, Audio & Flashcards",
  description:
    "Learn practical Korean for free: 16 chapters from Hangul to real conversations, native audio, flashcards, quizzes and games — no sign-up. Plus a world map of K-pop concerts.",
  path: "/",
});

const FEATURES = [
  { icon: "📖", title: "16 Structured Chapters", desc: "From Hangul basics to real conversations — organized for steady progress." },
  { icon: "🔊", title: "Pronunciation Audio",    desc: "Hear every word spoken in native Korean. No guessing required." },
  { icon: "🃏", title: "Vocab Flashcards",        desc: "Chapter-by-chapter vocabulary with flip cards and spaced repetition." },
  { icon: "🧠", title: "Chapter Quizzes",         desc: "4-choice quizzes after each chapter to cement what you learned." },
  { icon: "🔥", title: "Streak & XP System",     desc: "Daily streaks, experience points, and levels keep you motivated." },
  { icon: "✅", title: "100% Free, No Sign-up",   desc: "Every chapter, game and quiz is free. Your progress saves in your browser." },
];

const CHAPTERS = [
  { num: 1,  title: "Meet Hangul" },
  { num: 2,  title: "Grammar Overview" },
  { num: 3,  title: "Numbers & Counting" },
  { num: 4,  title: "Time & Dates" },
  { num: 5,  title: "Food & Restaurants" },
  { num: 6,  title: "Getting Around" },
  { num: 7,  title: "Shopping" },
  { num: 8,  title: "People & Family" },
  { num: 9,  title: "Work & School" },
  { num: 10, title: "Health & Body" },
  { num: 11, title: "Feelings & Opinions" },
  { num: 12, title: "Social Media & Tech" },
  { num: 13, title: "K-Drama Phrases" },
  { num: 14, title: "K-Pop & Music" },
  { num: 15, title: "Advanced Conversation" },
  { num: 16, title: "Real-Life Fluency" },
];

const COMPARISON = [
  { feature: "Teaches real spoken Korean",   us: true,  duo: false, book: false },
  { feature: "Pronunciation audio",          us: true,  duo: true,  book: false },
  { feature: "Spaced repetition (SRS)",      us: true,  duo: true,  book: false },
  { feature: "Cultural context & nuance",    us: true,  duo: false, book: true  },
  { feature: "Structured 16-chapter path",   us: true,  duo: false, book: true  },
  { feature: "Chapter quizzes",              us: true,  duo: true,  book: false },
  { feature: "Mobile-friendly",             us: true,  duo: true,  book: false },
  { feature: "Offline PDF cheat sheets",     us: true,  duo: false, book: true  },
  { feature: "Completely free, no sign-up",  us: true,  duo: false, book: false },
];

const FAQS = [
  { q: "Do I need any Korean background to start?",       a: "No. Chapter 1 teaches Hangul (the Korean alphabet) from scratch — you'll be reading Korean within an hour." },
  { q: "How is this different from Duolingo?",            a: "Korean in Real Life focuses on real-world Korean you'll actually use: conversations, social contexts, and cultural nuance — not gamified drills." },
  { q: "Is it really free?",                              a: "Yes. All 16 chapters, flashcards, audio, quizzes and games are free. There's no subscription and no account." },
  { q: "Where is my progress saved?",                     a: "In your browser on this device. Use Settings → Download backup to keep a copy or move it to another device." },
  { q: "Can I use this on mobile?",                       a: "Absolutely. The platform is fully responsive, works great on phones and tablets, and can be added to your home screen as an app." },
  { q: "How long does it take to finish all 16 chapters?",a: "At a comfortable pace of one chapter per week, you'll complete the course in about 4 months — with real conversational ability." },
];

function Check({ ok }: { ok: boolean }) {
  return ok
    ? <span className="text-[#10B981] font-bold">✓</span>
    : <span className="text-[#9E98B8]">—</span>;
}

// Twinkling dots in the stage hero: [left, top, delay seconds]
const SPARKLES: [string, string, number][] = [
  ["8%", "18%", 0], ["22%", "60%", 1.2], ["35%", "12%", 0.6], ["62%", "22%", 2.1], ["78%", "55%", 0.9],
  ["90%", "14%", 1.6], ["50%", "40%", 2.6], ["14%", "82%", 1.9], ["70%", "78%", 0.3], ["44%", "70%", 1.4],
];

export default function LandingPage() {
  const concerts = getConcerts();
  const artists = getListedArtists();
  // Shows from the build date on; UpcomingShows re-filters with the visitor's date.
  const buildDate = new Date().toISOString().slice(0, 10);
  const upcoming = concerts
    .filter((c) => c.date >= buildDate && c.status !== "cancelled")
    .slice(0, 30)
    .map((c) => ({ id: c.id, artist: c.artist.name, date: c.date, city: c.venue.city, flag: flag(c.venue.countryCode), venue: c.venue.name }));

  return (
    <main className="min-h-screen bg-[#F8F5FF] overflow-x-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Korean in Real Life",
          url: `${SITE_URL}/`,
          description: "Free practical Korean lessons with audio, flashcards and games, plus a world map of K-pop concerts.",
          inLanguage: "en",
        }}
      />

      {/* ── Stage: nav, hero, artist band, upcoming shows ── */}
      <div className="stage-bg relative overflow-hidden text-white">
        <div className="stage-beams pointer-events-none absolute inset-0" />
        {SPARKLES.map((p, i) => (
          <span key={i} className="sparkle" style={{ left: p[0], top: p[1], animationDelay: `${p[2]}s` }} />
        ))}

        <nav className="relative z-20 flex items-center justify-between px-6 py-4">
          <span className="whitespace-nowrap text-lg font-black tracking-tight sm:text-xl">
            Korean <span className="text-neon">in Real Life</span>
          </span>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/concerts" aria-label="K-pop concerts" className="text-sm text-white/75 transition-colors hover:text-white">🎤<span className="hidden sm:inline"> K-pop Concerts</span></Link>
            <Link href="/learn" className="hidden text-sm text-white/75 transition-colors hover:text-white sm:block">Chapters</Link>
            <Link href="/books" className="hidden text-sm text-white/75 transition-colors hover:text-white sm:block">Books</Link>
            <Link href="/home" className="glow-pink whitespace-nowrap rounded-full bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              Start learning
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative flex min-h-[70vh] items-center">
          <FloatingWords dark />
          <span className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[18vw] font-black leading-none text-white/[0.04]">
            한국어
          </span>
          <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs text-white/85 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
              For K-pop & K-drama fans learning Korean
            </div>
            <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-7xl">
              Learn real Korean,
              <br />
              <span className="text-neon">from fan chants to daily life</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
              16 free chapters with audio, flashcards and quizzes — plus every K-pop concert on one world map, with
              tickets and hotels near the venue.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/learn/ch01" className="glow-pink rounded-full bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] px-8 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90">
                Start with Chapter 1 →
              </Link>
              <Link href="/concerts" className="rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20">
                🎤 K-pop concert map
              </Link>
            </div>
            <div className="mt-14 flex flex-wrap justify-center gap-10 text-center">
              {[
                { n: "16", label: "Chapters" },
                { n: "300+", label: "Vocabulary words" },
                { n: `${concerts.length}`, label: "K-pop concerts mapped" },
                { n: "Free", label: "No sign-up" },
              ].map((x) => (
                <div key={x.label}>
                  <p className="text-3xl font-black">{x.n}</p>
                  <p className="mt-0.5 text-xs text-white/55">{x.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Artist band */}
        <div className="relative border-y border-white/10 bg-white/[0.04] py-3 overflow-hidden">
          <div className="marquee gap-8 whitespace-nowrap text-sm font-bold uppercase tracking-[0.2em] text-white/70">
            {[...artists, ...artists].map((a, i) => (
              <Link key={i} href={`/concerts/artists/${a.id}`} className="flex items-center gap-8 hover:text-white">
                {a.name}
                <span className="text-[#FF3D8B]">✦</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming shows */}
        <section className="relative mx-auto max-w-6xl px-6 py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#22D3EE]">On tour now</p>
              <h2 className="text-3xl font-black tracking-tight">Upcoming K-pop concerts</h2>
            </div>
            <Link href="/concerts" className="shrink-0 text-sm font-semibold text-[#FF6FB1] hover:underline">
              See all on the map →
            </Link>
          </div>
          <UpcomingShows shows={upcoming} />
        </section>
      </div>

      {/* ── Features ── */}
      <section className="py-24 relative bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#140F2D] mb-4">Everything you need to learn Korean</h2>
            <p className="text-[#5A5475] text-lg max-w-xl mx-auto">Structured, practical, and built for real-world use from day one.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="holo bg-[#F8F5FF] border border-[#EAE4F7] rounded-2xl p-6 hover:bg-white hover:-translate-y-0.5 transition-all group shadow-sm">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-[#140F2D] mb-2 group-hover:text-[#FF3D8B] transition-colors">{f.title}</h3>
                <p className="text-sm text-[#5A5475] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chapter Roadmap ── */}
      <section className="py-20 border-y border-[#EAE4F7]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#140F2D] mb-3">Your learning journey</h2>
            <p className="text-[#5A5475]">16 chapters from zero to confident — all free.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CHAPTERS.map((ch) => (
              <div
                key={ch.num}
                className="relative rounded-xl border p-3.5 transition-all bg-white border-[#EAE4F7]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#FF3D8B]">Ch {ch.num}</span>
                </div>
                <p className="text-xs text-[#5A5475] leading-snug">{ch.title}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/learn/ch01" className="inline-block bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] text-white px-7 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Start with Chapter 1 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Books ── */}
      <section className="px-6 py-20 bg-white border-y border-[#EAE4F7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-[#7C5CFF] uppercase tracking-wider mb-2">The books behind the course</p>
            <h2 className="text-3xl font-bold text-[#140F2D] mb-2">Take Korean in Real Life with you</h2>
            <p className="text-[#5A5475] max-w-2xl mx-auto">
              Every chapter here comes from the books. Get the full lessons with dialogues, practice and answer keys,
              Quick Reference Cards and free Listen &amp; Repeat videos.
            </p>
            <p className="text-sm text-[#5A5475] mt-3">
              🐹 Not ready to buy? Get Kohami&apos;s free Korean phrase PDFs at{" "}
              <a
                href={FREE_PDF.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#FF3D8B] underline underline-offset-2"
              >
                {FREE_PDF.displayUrl}
              </a>
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <BookCard book={BOOKS["kirl-1"]} />
            <BookCard book={BOOKS["kirl-2"]} />
            <BookCard book={BOOKS["korean-on-campus"]} />
            <BookCard book={BOOKS["shy-girl-1"]} />
            <BookCard book={BOOKS["korea-unlocked"]} />
          </div>
          <FreePdfBanner />
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#140F2D] mb-3">Why Korean in Real Life?</h2>
            <p className="text-[#5A5475]">See how we compare to other popular learning methods.</p>
          </div>
          <div className="bg-white border border-[#EAE4F7] rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EAE4F7]">
                  <th className="text-left px-5 py-3.5 text-[#5A5475] font-medium w-1/2">Feature</th>
                  <th className="px-4 py-3.5 text-[#140F2D] font-bold text-center bg-[#FF3D8B]/5">
                    <span className="text-[#FF3D8B]">Korean in Real Life</span>
                  </th>
                  <th className="px-4 py-3.5 text-[#5A5475] font-medium text-center">Duolingo</th>
                  <th className="px-4 py-3.5 text-[#5A5475] font-medium text-center">Textbook</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "" : "bg-[#F8F5FF]"}>
                    <td className="px-5 py-3 text-[#140F2D]">{row.feature}</td>
                    <td className="px-4 py-3 text-center bg-[#FF3D8B]/[0.03]"><Check ok={row.us} /></td>
                    <td className="px-4 py-3 text-center"><Check ok={row.duo} /></td>
                    <td className="px-4 py-3 text-center"><Check ok={row.book} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-12 border-y border-[#EAE4F7]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#9E98B8] text-xs uppercase tracking-widest mb-8">What learners say</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "I could read the subway signs after just one weekend.",       name: "Sarah K." },
              { quote: "Finally a course that teaches you to speak like an actual Korean person.", name: "James L." },
              { quote: "The flashcard system actually made vocab stick for me.",      name: "Yuki M." },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-[#EAE4F7] rounded-2xl p-5 text-left shadow-sm">
                <p className="text-[#140F2D] text-sm leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-[#5A5475] text-xs font-medium">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#140F2D] mb-12 text-center">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="space-y-1">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-[#140F2D] hover:text-[#FF3D8B]">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-[#5A5475] leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 text-center">
        <div className="max-w-xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#FF3D8B]/8 to-[#7C5CFF]/8 border border-[#EAE4F7] rounded-3xl p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-[#140F2D] mb-4">Ready to start?</h2>
            <p className="text-[#5A5475] mb-8">Every chapter is free. No account, no credit card.</p>
            <Link href="/home" className="inline-block bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] text-white px-10 py-4 rounded-xl text-base font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#FF3D8B]/20">
              Start learning →
            </Link>
          </div>
        </div>
      </section>

      <footer className="stage-bg py-12 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <p className="font-bold text-white mb-2">Korean <span className="text-neon">in Real Life</span></p>
              <p className="text-xs text-white/55 leading-relaxed">Practical Korean for real-world conversations.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Learn</p>
              <ul className="space-y-2 text-sm text-white/55">
                <li><Link href="/learn"    className="hover:text-white transition-colors">Chapters</Link></li>
                <li><Link href="/vocab/ch01" className="hover:text-white transition-colors">Vocabulary</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/concerts" className="hover:text-white transition-colors">K-pop Concerts</Link></li>
                <li><Link href="/books" className="hover:text-white transition-colors">Books</Link></li>
                <li><a href="https://kohami-abahgp.subscribepage.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Free PDFs</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Practice</p>
              <ul className="space-y-2 text-sm text-white/55">
                <li><Link href="/games"    className="hover:text-white transition-colors">Games</Link></li>
                <li><Link href="/daily"    className="hover:text-white transition-colors">Daily Challenge</Link></li>
                <li><Link href="/kdrama"   className="hover:text-white transition-colors">K-Drama Phrases</Link></li>
                <li><Link href="/settings" className="hover:text-white transition-colors">Settings</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Contact</p>
              <ul className="space-y-2 text-sm text-white/55">
                <li><a href="mailto:hello@koreaninreallife.com" className="hover:text-white transition-colors">hello@koreaninreallife.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/55">
            <p>© 2026 Korean in Real Life. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/concerts/disclosure" className="hover:text-white transition-colors">Affiliate disclosure</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
