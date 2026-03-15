import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex justify-between items-center">
        <span className="text-xl font-bold text-blue-600">Korean in Real Life</span>
        <div className="flex gap-4">
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Learn Korean the way
          <br />
          <span className="text-blue-600">real people speak it</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          16 chapters of practical Korean — with pronunciation audio, vocabulary flashcards,
          and progress tracking. Start free with Chapters 1 &amp; 2.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700"
          >
            Start for free
          </Link>
          <Link
            href="/pricing"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50"
          >
            See pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to learn Korean
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📖",
                title: "16 Chapters",
                desc: "Structured lessons from Hangul basics to real conversations",
              },
              {
                icon: "🔊",
                title: "Pronunciation Audio",
                desc: "Hear every word and sentence spoken in native Korean",
              },
              {
                icon: "🃏",
                title: "Vocab Flashcards",
                desc: "Chapter-by-chapter vocabulary with flip cards",
              },
              {
                icon: "📊",
                title: "Progress Tracking",
                desc: "See which chapters you've read and words you've learned",
              },
              {
                icon: "📄",
                title: "PDF Cheat Sheets",
                desc: "Download key phrases for each chapter to study offline",
              },
              {
                icon: "✅",
                title: "Free Preview",
                desc: "Try Chapters 1–2 and 50 vocabulary words at no cost",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to start?</h2>
        <p className="text-gray-500 mb-8">No credit card required for the free tier.</p>
        <Link
          href="/signup"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700"
        >
          Get started free
        </Link>
      </section>

      <footer className="border-t py-8 text-center text-sm text-gray-400">
        © 2026 Korean in Real Life. All rights reserved.
      </footer>
    </main>
  );
}
