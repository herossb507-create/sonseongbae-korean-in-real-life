// TODO: Supabase에서 user_progress, user_vocab_stats fetch

import Link from "next/link";

export default function DashboardPage() {
  // TODO: 실제 데이터 fetch
  const stats = {
    chaptersCompleted: 2,
    totalChapters: 16,
    wordsKnown: 38,
    totalWords: 320,
    streakDays: 5,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Korean in Real Life
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/learn" className="text-gray-600 hover:text-gray-900">
            Chapters
          </Link>
          <Link href="/settings" className="text-gray-600 hover:text-gray-900">
            Settings
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Progress</h1>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl border p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.chaptersCompleted}
              <span className="text-gray-300 text-lg">/{stats.totalChapters}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Chapters read</div>
          </div>
          <div className="bg-white rounded-xl border p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.wordsKnown}
              <span className="text-gray-300 text-lg">/{stats.totalWords}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Words known</div>
          </div>
          <div className="bg-white rounded-xl border p-6 text-center">
            <div className="text-3xl font-bold text-orange-500">{stats.streakDays}</div>
            <div className="text-sm text-gray-500 mt-1">Day streak 🔥</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Chapter progress</h2>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${(stats.chaptersCompleted / stats.totalChapters) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">
            {stats.chaptersCompleted} of {stats.totalChapters} chapters completed
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/learn"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Continue learning →
        </Link>
      </div>
    </main>
  );
}
