import Link from "next/link";
import { FloatingWords } from "@/components/FloatingWords";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FEATURES = [
  { icon: "📖", title: "16 Structured Chapters", desc: "From Hangul basics to real conversations — organized for steady progress." },
  { icon: "🔊", title: "Pronunciation Audio",    desc: "Hear every word spoken in native Korean. No guessing required." },
  { icon: "🃏", title: "Vocab Flashcards",        desc: "Chapter-by-chapter vocabulary with flip cards and spaced repetition." },
  { icon: "🧠", title: "Chapter Quizzes",         desc: "4-choice quizzes after each chapter to cement what you learned." },
  { icon: "🔥", title: "Streak & XP System",     desc: "Daily streaks, experience points, and levels keep you motivated." },
  { icon: "✅", title: "Free Preview",            desc: "Try Chapters 1–2 and 50 vocabulary words for free — no card needed." },
];

const CHAPTERS = [
  { num: 1,  title: "Meet Hangul",          free: true  },
  { num: 2,  title: "Grammar Overview",     free: true  },
  { num: 3,  title: "Numbers & Counting",   free: false },
  { num: 4,  title: "Time & Dates",         free: false },
  { num: 5,  title: "Food & Restaurants",   free: false },
  { num: 6,  title: "Getting Around",       free: false },
  { num: 7,  title: "Shopping",             free: false },
  { num: 8,  title: "People & Family",      free: false },
  { num: 9,  title: "Work & School",        free: false },
  { num: 10, title: "Health & Body",        free: false },
  { num: 11, title: "Feelings & Opinions",  free: false },
  { num: 12, title: "Social Media & Tech",  free: false },
  { num: 13, title: "K-Drama Phrases",      free: false },
  { num: 14, title: "K-Pop & Music",        free: false },
  { num: 15, title: "Advanced Conversation",free: false },
  { num: 16, title: "Real-Life Fluency",    free: false },
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
  { feature: "Free to try",                  us: true,  duo: true,  book: false },
];

const FAQS = [
  { q: "Do I need any Korean background to start?",       a: "No. Chapter 1 teaches Hangul (the Korean alphabet) from scratch — you'll be reading Korean within an hour." },
  { q: "How is this different from Duolingo?",            a: "Korean in Real Life focuses on real-world Korean you'll actually use: conversations, social contexts, and cultural nuance — not gamified drills." },
  { q: "Can I access all chapters after subscribing?",    a: "Yes. A Pro subscription unlocks all 16 chapters, flashcards, audio, quizzes, and SRS reviews immediately." },
  { q: "Is there a refund policy?",                       a: "Yes — if you're not satisfied within 7 days of your subscription, contact us for a full refund." },
  { q: "Can I use this on mobile?",                       a: "Absolutely. The platform is fully responsive, works great on phones and tablets, and can be added to your home screen as an app." },
  { q: "How long does it take to finish all 16 chapters?",a: "At a comfortable pace of one chapter per week, you'll complete the course in about 4 months — with real conversational ability." },
];

function Check({ ok }: { ok: boolean }) {
  return ok
    ? <span className="text-[#10B981] font-bold">✓</span>
    : <span className="text-[#B0A8BB]">—</span>;
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FFF5F8] overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="relative z-20 border-b border-[#F0E6EE] bg-white/95 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-sm">
        <span className="text-xl font-bold text-[#1E1225]">
          Korean <span className="text-[#E8436F]">in Real Life</span>
        </span>
        <div className="flex gap-4 items-center">
          <Link href="/concerts" className="text-sm text-[#6B5F7A] hover:text-[#1E1225] transition-colors">🎤 <span className="hidden sm:inline">K-pop </span>Concerts</Link>
          <Link href="/pricing" className="text-sm text-[#6B5F7A] hover:text-[#1E1225] transition-colors hidden sm:block">Pricing</Link>
          <Link href="/login"   className="text-sm text-[#6B5F7A] hover:text-[#1E1225] transition-colors">Log in</Link>
          <Link href="/signup"  className="text-sm bg-gradient-to-r from-[#E8436F] to-[#F06B8A] text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity font-medium">
            Start free
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] flex items-center">
        <FloatingWords />
        <span className="absolute inset-0 flex items-center justify-center text-[18vw] font-black text-[#E8436F]/[0.04] select-none pointer-events-none leading-none">
          한국어
        </span>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center w-full">
          <div className="inline-flex items-center gap-2 bg-[#FFF0F5] border border-[#F0E6EE] rounded-full px-4 py-1.5 text-xs text-[#6B5F7A] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Join 1,000+ learners already speaking Korean
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1E1225] mb-6 leading-tight">
            Learn Korean the way
            <br />
            <span className="bg-gradient-to-r from-[#E8436F] to-[#9B7FE8] bg-clip-text text-transparent">
              real people speak it
            </span>
          </h1>
          <p className="text-xl text-[#6B5F7A] mb-10 max-w-2xl mx-auto leading-relaxed">
            16 chapters of practical Korean — with pronunciation audio, vocabulary flashcards,
            quizzes, and spaced repetition. Start free with Chapters 1 &amp; 2.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup"  className="bg-gradient-to-r from-[#E8436F] to-[#F06B8A] text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#E8436F]/20">
              Start for free →
            </Link>
            <Link href="/pricing" className="border border-[#F0E6EE] bg-white text-[#6B5F7A] px-8 py-3.5 rounded-xl text-base font-medium hover:bg-[#FFF0F5] transition-colors shadow-sm">
              See pricing
            </Link>
          </div>
          {/* Stats row */}
          <div className="mt-14 flex flex-wrap justify-center gap-8 text-center">
            {[
              { n: "16", label: "Chapters" },
              { n: "300+", label: "Vocabulary words" },
              { n: "Free", label: "Chapters 1 & 2" },
              { n: "$7.99", label: "/ month" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-[#1E1225]">{s.n}</p>
                <p className="text-xs text-[#B0A8BB] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 relative bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E1225] mb-4">Everything you need to learn Korean</h2>
            <p className="text-[#6B5F7A] text-lg max-w-xl mx-auto">Structured, practical, and built for real-world use from day one.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-[#FFF5F8] border border-[#F0E6EE] rounded-2xl p-6 hover:bg-[#FFF0F5] hover:border-[#E8D5E0] transition-all group shadow-sm">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-[#1E1225] mb-2 group-hover:text-[#E8436F] transition-colors">{f.title}</h3>
                <p className="text-sm text-[#6B5F7A] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chapter Roadmap ── */}
      <section className="py-20 border-y border-[#F0E6EE]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E1225] mb-3">Your learning journey</h2>
            <p className="text-[#6B5F7A]">16 chapters from zero to confident — Chapters 1 &amp; 2 are free.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CHAPTERS.map((ch) => (
              <div
                key={ch.num}
                className={[
                  "relative rounded-xl border p-3.5 transition-all",
                  ch.free
                    ? "bg-[#10B981]/10 border-[#10B981]/30"
                    : "bg-white border-[#F0E6EE]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold ${ch.free ? "text-[#10B981]" : "text-[#B0A8BB]"}`}>
                    Ch {ch.num}
                  </span>
                  {ch.free && (
                    <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.5 rounded-full font-semibold">
                      FREE
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B5F7A] leading-snug">{ch.title}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/signup" className="inline-block bg-gradient-to-r from-[#E8436F] to-[#F06B8A] text-white px-7 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Start with Chapter 1 — free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E1225] mb-3">Why Korean in Real Life?</h2>
            <p className="text-[#6B5F7A]">See how we compare to other popular learning methods.</p>
          </div>
          <div className="bg-white border border-[#F0E6EE] rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0E6EE]">
                  <th className="text-left px-5 py-3.5 text-[#6B5F7A] font-medium w-1/2">Feature</th>
                  <th className="px-4 py-3.5 text-[#1E1225] font-bold text-center bg-[#E8436F]/5">
                    <span className="text-[#E8436F]">Korean in Real Life</span>
                  </th>
                  <th className="px-4 py-3.5 text-[#6B5F7A] font-medium text-center">Duolingo</th>
                  <th className="px-4 py-3.5 text-[#6B5F7A] font-medium text-center">Textbook</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "" : "bg-[#FFF5F8]"}>
                    <td className="px-5 py-3 text-[#1E1225]">{row.feature}</td>
                    <td className="px-4 py-3 text-center bg-[#E8436F]/[0.03]"><Check ok={row.us} /></td>
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
      <section className="py-12 border-y border-[#F0E6EE]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#B0A8BB] text-xs uppercase tracking-widest mb-8">What learners say</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "I could read the subway signs after just one weekend.",       name: "Sarah K." },
              { quote: "Finally a course that teaches you to speak like an actual Korean person.", name: "James L." },
              { quote: "The flashcard system actually made vocab stick for me.",      name: "Yuki M." },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-[#F0E6EE] rounded-2xl p-5 text-left shadow-sm">
                <p className="text-[#1E1225] text-sm leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-[#6B5F7A] text-xs font-medium">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#1E1225] mb-12 text-center">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="space-y-1">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-[#1E1225] hover:text-[#E8436F]">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-[#6B5F7A] leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 text-center">
        <div className="max-w-xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#E8436F]/8 to-[#9B7FE8]/8 border border-[#F0E6EE] rounded-3xl p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-[#1E1225] mb-4">Ready to start?</h2>
            <p className="text-[#6B5F7A] mb-8">Free chapters 1 &amp; 2. No credit card required.</p>
            <Link href="/signup" className="inline-block bg-gradient-to-r from-[#E8436F] to-[#F06B8A] text-white px-10 py-4 rounded-xl text-base font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#E8436F]/20">
              Get started free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      {/* ── K-pop concerts ── */}
      <section className="px-6 pb-20">
        <Link
          href="/concerts"
          className="group max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-[#F0E6EE] bg-gradient-to-br from-white to-[#F3EEFF] p-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <div>
            <p className="text-xs font-semibold text-[#9B7FE8] uppercase tracking-wider mb-2">New · Free</p>
            <h2 className="text-2xl font-bold text-[#1E1225] mb-2">🎤 K-pop concerts around the world</h2>
            <p className="text-sm text-[#6B5F7A] max-w-xl">
              See every announced K-pop tour stop on one map — BTS, Stray Kids, ENHYPEN, LE SSERAFIM and more — with dates, venues and official ticket links.
            </p>
          </div>
          <span className="shrink-0 self-start md:self-center bg-gradient-to-r from-[#E8436F] to-[#F06B8A] text-white text-sm font-semibold px-5 py-2.5 rounded-xl group-hover:opacity-90">
            Open the concert map →
          </span>
        </Link>
      </section>

      <footer className="border-t border-[#F0E6EE] py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <p className="font-bold text-[#1E1225] mb-2">Korean <span className="text-[#E8436F]">in Real Life</span></p>
              <p className="text-xs text-[#B0A8BB] leading-relaxed">Practical Korean for real-world conversations.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B5F7A] uppercase tracking-wider mb-3">Learn</p>
              <ul className="space-y-2 text-sm text-[#B0A8BB]">
                <li><Link href="/learn"    className="hover:text-[#1E1225] transition-colors">Chapters</Link></li>
                <li><Link href="/vocab/ch01" className="hover:text-[#1E1225] transition-colors">Vocabulary</Link></li>
                <li><Link href="/leaderboard" className="hover:text-[#1E1225] transition-colors">Leaderboard</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#1E1225] transition-colors">Dashboard</Link></li>
                <li><Link href="/concerts" className="hover:text-[#1E1225] transition-colors">K-pop Concerts</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B5F7A] uppercase tracking-wider mb-3">Account</p>
              <ul className="space-y-2 text-sm text-[#B0A8BB]">
                <li><Link href="/signup"  className="hover:text-[#1E1225] transition-colors">Sign up</Link></li>
                <li><Link href="/login"   className="hover:text-[#1E1225] transition-colors">Log in</Link></li>
                <li><Link href="/pricing" className="hover:text-[#1E1225] transition-colors">Pricing</Link></li>
                <li><Link href="/settings" className="hover:text-[#1E1225] transition-colors">Settings</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B5F7A] uppercase tracking-wider mb-3">Contact</p>
              <ul className="space-y-2 text-sm text-[#B0A8BB]">
                <li><a href="mailto:hello@koreaninreallife.com" className="hover:text-[#1E1225] transition-colors">hello@koreaninreallife.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#F0E6EE] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B0A8BB]">
            <p>© 2026 Korean in Real Life. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/pricing" className="hover:text-[#1E1225] transition-colors">Privacy</Link>
              <Link href="/pricing" className="hover:text-[#1E1225] transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
