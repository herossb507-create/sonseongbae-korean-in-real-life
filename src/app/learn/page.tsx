// TODO: Supabase에서 챕터 목록 + 유저 진도 fetch
// 유료 회원은 전체 챕터, 무료 회원은 Ch01~Ch02만 접근 가능

import Link from "next/link";
import { ProgressTracker } from "@/components/ProgressTracker";
import { SubscriptionGate } from "@/components/SubscriptionGate";

// 임시 데이터 (실제는 Supabase에서 fetch)
const CHAPTERS = [
  { id: "ch01", num: 1, title: "Hangul — The Korean Alphabet", isFree: true, wordCount: 320 },
  { id: "ch02", num: 2, title: "Greetings & Introductions", isFree: true, wordCount: 410 },
  { id: "ch03", num: 3, title: "Numbers & Counting", isFree: false, wordCount: 390 },
  { id: "ch04", num: 4, title: "Time & Dates", isFree: false, wordCount: 450 },
  { id: "ch05", num: 5, title: "Food & Ordering", isFree: false, wordCount: 480 },
  { id: "ch06", num: 6, title: "Shopping & Money", isFree: false, wordCount: 420 },
  { id: "ch07", num: 7, title: "Directions & Transportation", isFree: false, wordCount: 460 },
  { id: "ch08", num: 8, title: "Family & Relationships", isFree: false, wordCount: 400 },
  { id: "ch09", num: 9, title: "Work & Daily Routine", isFree: false, wordCount: 470 },
  { id: "ch10", num: 10, title: "Health & Body", isFree: false, wordCount: 430 },
  { id: "ch11", num: 11, title: "Weather & Seasons", isFree: false, wordCount: 380 },
  { id: "ch12", num: 12, title: "Hobbies & Free Time", isFree: false, wordCount: 440 },
  { id: "ch13", num: 13, title: "Travel & Tourism", isFree: false, wordCount: 500 },
  { id: "ch14", num: 14, title: "Culture & Customs", isFree: false, wordCount: 460 },
  { id: "ch15", num: 15, title: "Media & Technology", isFree: false, wordCount: 420 },
  { id: "ch16", num: 16, title: "Advanced Conversations", isFree: false, wordCount: 510 },
];

export default function LearnPage() {
  // TODO: 실제 구독 상태 + 진도 Supabase에서 가져오기
  const isPro = false;
  const completedChapterIds: string[] = [];

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Korean in Real Life
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/settings" className="text-gray-600 hover:text-gray-900">
            Settings
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chapters</h1>
            <p className="text-gray-500 text-sm mt-1">
              {isPro ? "Full access · 16 chapters" : "Free tier · 2 chapters available"}
            </p>
          </div>
          <ProgressTracker
            total={CHAPTERS.length}
            completed={completedChapterIds.length}
          />
        </div>

        <div className="space-y-3">
          {CHAPTERS.map((ch) => {
            const locked = !ch.isFree && !isPro;
            const completed = completedChapterIds.includes(ch.id);

            return (
              <div key={ch.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                  {ch.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">{ch.title}</span>
                    {ch.isFree && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Free
                      </span>
                    )}
                    {completed && <span className="text-green-500 text-sm">✓</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{ch.wordCount} words</p>
                </div>

                {locked ? (
                  <SubscriptionGate />
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href={`/vocab/${ch.id}`}
                      className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                    >
                      Vocab
                    </Link>
                    <Link
                      href={`/learn/${ch.id}`}
                      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                    >
                      Read
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
