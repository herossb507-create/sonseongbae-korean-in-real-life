"use client";

import Link from "next/link";
import { getTodayString } from "@/lib/daily-challenge";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import {
  EMPTY_PROGRESS,
  completedChapterIds,
  currentStreak,
  knownWordCount,
  lastReadChapter,
  useProgress,
} from "@/lib/progress";

export default function HomePage() {
  const progress = useProgress() ?? EMPTY_PROGRESS;

  const displayName = progress.displayName;
  const completedChapters = completedChapterIds(progress).length;
  const totalChapters = 16;
  const masteredWords = knownWordCount(progress);

  // Last read chapter (for "Continue" section)
  const lastRead = lastReadChapter(progress);
  const lastChapterData = lastRead ? CHAPTER_CONTENT[lastRead.slug] : null;

  const todayStr = getTodayString();

  // Stats
  const streak = currentStreak(progress);
  const xp = progress.xp;

  return (
    <div className="min-h-screen bg-[#FFF5F8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Section 1: Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1225] mb-1">
            {displayName ? `Welcome back, ${displayName}!` : "Welcome!"}
          </h1>
          <p className="text-[#6B5F7A] text-sm">
            오늘도 한국어 학습을 시작해볼까요?
          </p>
        </div>

        {/* Section 2: Daily Challenge (prominent) */}
        <div className="mb-8">
          <Link href="/daily" className="block group">
            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#F4A261]/20 via-[#F4A261]/10 to-[#E8436F]/10 border border-[#F4A261]/30 hover:border-[#F4A261]/50 transition-all duration-300">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F4A261]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#F4A261]/20 border border-[#F4A261]/30 rounded-full px-3 py-1 mb-3">
                    <span className="text-xs font-bold text-[#F4A261] uppercase tracking-widest">
                      🔥 Today&apos;s Daily Challenge
                    </span>
                  </div>
                  <p className="text-[#1E1225] font-semibold text-lg mb-1">
                    Complete today&apos;s quiz and earn XP!
                  </p>
                  <p className="text-[#6B5F7A] text-sm">{todayStr}</p>
                </div>
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  🎯
                </div>
              </div>

              <div className="relative mt-4">
                <span className="inline-flex items-center gap-2 bg-[#F4A261] text-white text-sm font-bold px-5 py-2.5 rounded-xl group-hover:bg-[#F7B88A] transition-colors">
                  Start Challenge →
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Section 3: Stats Grid (2x2) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-[#FFF5F8] border border-[#F0E6EE] rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#E8436F] mb-1">
              {streak > 0 ? `${streak}` : "0"}
            </div>
            <div className="text-xs text-[#6B5F7A]">🔥 Streak</div>
            <div className="text-xs text-[#B0A8BB] mt-0.5">days</div>
          </div>
          <div className="bg-[#FFF5F8] border border-[#F0E6EE] rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#9B7FE8] mb-1">{xp}</div>
            <div className="text-xs text-[#6B5F7A]">⚡ Total XP</div>
            <div className="text-xs text-[#B0A8BB] mt-0.5">points</div>
          </div>
          <div className="bg-[#FFF5F8] border border-[#F0E6EE] rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#34C899] mb-1">
              {completedChapters}
              <span className="text-base text-[#B0A8BB]">/{totalChapters}</span>
            </div>
            <div className="text-xs text-[#6B5F7A]">📖 Chapters</div>
            <div className="text-xs text-[#B0A8BB] mt-0.5">completed</div>
          </div>
          <div className="bg-[#FFF5F8] border border-[#F0E6EE] rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#F4A261] mb-1">
              {masteredWords}
            </div>
            <div className="text-xs text-[#6B5F7A]">🎯 Words</div>
            <div className="text-xs text-[#B0A8BB] mt-0.5">known</div>
          </div>
        </div>

        {/* Section 4: Continue Learning */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-[#1E1225] mb-3">
            Continue Learning
          </h2>
          {lastRead ? (
            <Link
              href={`/learn/${lastRead.slug}`}
              className="flex items-center gap-4 p-4 bg-[#FFF5F8] border border-[#F0E6EE] rounded-xl hover:bg-[#FFF0F5] hover:border-[#E8D5E0] transition-all group shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-[#9B7FE8]/20 flex items-center justify-center text-[#9B7FE8] text-lg shrink-0">
                📖
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#1E1225] font-medium text-sm group-hover:text-[#9B7FE8] transition-colors truncate">
                  {lastChapterData
                    ? `Ch${lastChapterData.num}. ${lastChapterData.title}`
                    : "Resume Chapter"}
                </p>
                <p className="text-xs text-[#6B5F7A] mt-0.5">
                  Last read{" "}
                  {new Date(lastRead.lastReadAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span className="text-[#9B7FE8] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          ) : (
            <Link
              href="/learn/ch01"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#9B7FE8]/10 to-[#E8436F]/10 border border-[#9B7FE8]/20 rounded-xl hover:border-[#9B7FE8]/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-[#9B7FE8]/20 flex items-center justify-center text-2xl shrink-0">
                🔤
              </div>
              <div className="flex-1">
                <p className="text-[#1E1225] font-medium text-sm">
                  Start from Chapter 1
                </p>
                <p className="text-xs text-[#6B5F7A] mt-0.5">
                  Meet Hangul — The Korean Alphabet
                </p>
              </div>
              <span className="text-[#9B7FE8] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          )}
        </div>

        {/* Section 5: Quick Game Access */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#1E1225] mb-3">
            Quick Games
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/games/memory/ch01"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#9B7FE8]/10 to-[#9B7FE8]/5 border border-[#9B7FE8]/20 rounded-xl hover:border-[#9B7FE8]/40 hover:bg-[#9B7FE8]/15 transition-all"
            >
              <span className="text-2xl">🃏</span>
              <div>
                <div className="text-sm font-semibold text-[#1E1225]">Memory Match</div>
                <div className="text-xs text-[#6B5F7A]">Match Korean words</div>
              </div>
            </Link>
            <Link
              href="/games/listening/ch01"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#E8436F]/10 to-[#E8436F]/5 border border-[#E8436F]/20 rounded-xl hover:border-[#E8436F]/40 hover:bg-[#E8436F]/15 transition-all"
            >
              <span className="text-2xl">🔊</span>
              <div>
                <div className="text-sm font-semibold text-[#1E1225]">Listening Quiz</div>
                <div className="text-xs text-[#6B5F7A]">Hear & identify</div>
              </div>
            </Link>
            <Link
              href="/daily"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#F4A261]/10 to-[#F4A261]/5 border border-[#F4A261]/20 rounded-xl hover:border-[#F4A261]/40 hover:bg-[#F4A261]/15 transition-all"
            >
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-sm font-semibold text-[#1E1225]">Daily Challenge</div>
                <div className="text-xs text-[#6B5F7A]">10 questions today</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Section 6: K-pop concerts */}
        <div>
          <h2 className="text-base font-semibold text-[#1E1225] mb-3">
            K-pop Concerts
          </h2>
          <Link
            href="/concerts"
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#9B7FE8]/10 to-[#E8436F]/5 border border-[#9B7FE8]/20 rounded-xl hover:border-[#9B7FE8]/40 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-[#9B7FE8]/20 flex items-center justify-center text-lg shrink-0">
              🎤
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[#1E1225] font-medium text-sm group-hover:text-[#9B7FE8] transition-colors">
                Find a K-pop show near you
              </div>
              <div className="text-xs text-[#6B5F7A] mt-0.5">
                Tour dates worldwide, on one map
              </div>
            </div>
            <span className="text-[#9B7FE8] group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
