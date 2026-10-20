"use client";

import Link from "next/link";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import { EMPTY_PROGRESS, currentStreak, knownWordCount, lastReadChapter, useProgress } from "@/lib/progress";

export default function DashboardPage() {
  const progress = useProgress() ?? EMPTY_PROGRESS;

  // Build chapter list from static data
  const chapterList = Object.entries(CHAPTER_CONTENT)
    .map(([slug, ch]) => ({ slug, num: ch.num, title: ch.title }))
    .sort((a, b) => a.num - b.num);

  const progressRows = Object.entries(progress.chapters).map(([chapter_id, c]) => ({
    chapter_id,
    is_completed: c.completed,
    last_read_at: c.lastReadAt,
  }));

  const completedIds = new Set(
    (progressRows ?? [])
      .filter((p) => p.is_completed)
      .map((p) => p.chapter_id)
  );

  const last = lastReadChapter(progress);
  const lastRead = last ? { chapter_id: last.slug, last_read_at: last.lastReadAt } : null;
  const lastReadChapterInfo = lastRead ? chapterList.find((c) => c.slug === lastRead.chapter_id) : null;

  // 이번 주 읽은 챕터 수
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyCount = (progressRows ?? []).filter(
    (p) => new Date(p.last_read_at) >= oneWeekAgo
  ).length;

  const stats = {
    chaptersCompleted: completedIds.size,
    totalChapters: chapterList.length,
    wordsKnown: knownWordCount(progress),
    streakDays: currentStreak(progress),
  };

  const progressPercent = Math.round(
    (stats.chaptersCompleted / stats.totalChapters) * 100
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E1225]">My Progress</h1>
        <p className="text-[#6B5F7A] text-sm mt-1">
          Saved in this browser. Keep up the streak!
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-[#F0E6EE] rounded-xl p-6 text-center shadow-sm">
          <div className="text-3xl font-bold text-[#9B7FE8]">
            {stats.chaptersCompleted}
            <span className="text-[#B0A8BB] text-lg">/{stats.totalChapters}</span>
          </div>
          <div className="text-sm text-[#6B5F7A] mt-1">Chapters read</div>
        </div>
        <div className="bg-white border border-[#F0E6EE] rounded-xl p-6 text-center shadow-sm">
          <div className="text-3xl font-bold text-[#34C899]">
            {stats.wordsKnown}
          </div>
          <div className="text-sm text-[#6B5F7A] mt-1">Words known</div>
        </div>
        <div className="bg-white border border-[#F0E6EE] rounded-xl p-6 text-center shadow-sm">
          <div className="text-3xl font-bold text-[#E8436F]">
            {stats.streakDays}
          </div>
          <div className="text-sm text-[#6B5F7A] mt-1">Day streak 🔥</div>
        </div>
      </div>

      {/* 전체 진도 바 */}
      <div className="bg-white border border-[#F0E6EE] rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-[#1E1225]">Overall progress</h2>
          <span className="text-sm text-[#9B7FE8] font-medium">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-[#FFE8F0] rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-[#9B7FE8] to-[#E8436F] h-3 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm text-[#6B5F7A]">
          {stats.chaptersCompleted} of {stats.totalChapters} chapters completed
        </p>
      </div>

      {/* 최근 활동 + 주간 요약 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-[#F0E6EE] rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#6B5F7A] uppercase tracking-wide mb-3">
            Last read
          </h3>
          {lastReadChapterInfo ? (
            <Link
              href={`/learn/${lastReadChapterInfo.slug}`}
              className="group"
            >
              <p className="text-[#1E1225] font-medium group-hover:text-[#9B7FE8] transition-colors">
                Ch{lastReadChapterInfo.num}. {lastReadChapterInfo.title}
              </p>
              <p className="text-xs text-[#6B5F7A] mt-1">
                {new Date(lastRead!.last_read_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </Link>
          ) : (
            <p className="text-[#B0A8BB] text-sm">No chapters read yet</p>
          )}
        </div>
        <div className="bg-white border border-[#F0E6EE] rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#6B5F7A] uppercase tracking-wide mb-3">
            This week
          </h3>
          <p className="text-[#1E1225] font-medium">
            <span className="text-2xl text-[#F4A261] font-bold">
              {weeklyCount}
            </span>{" "}
            <span className="text-[#6B5F7A] text-sm">chapters visited</span>
          </p>
        </div>
      </div>

      {/* 챕터 진도 맵 */}
      <div className="bg-white border border-[#F0E6EE] rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="font-semibold text-[#1E1225] mb-5">Chapter map</h2>
        <div className="grid grid-cols-4 gap-3">
          {chapterList.map((chapter) => {
            const done = completedIds.has(chapter.slug);
            const inProgress = (progressRows ?? []).some(
              (p) => p.chapter_id === chapter.slug && !p.is_completed
            );
            return (
              <Link
                key={chapter.slug}
                href={`/learn/${chapter.slug}`}
                className={[
                  "rounded-lg p-3 text-center transition-all duration-200 border",
                  done
                    ? "bg-[#34C899]/20 border-[#34C899]/40 hover:bg-[#34C899]/30"
                    : inProgress
                    ? "bg-[#9B7FE8]/20 border-[#9B7FE8]/40 hover:bg-[#9B7FE8]/30"
                    : "bg-[#FFF5F8] border-[#F0E6EE] hover:bg-[#FFF0F5]",
                ].join(" ")}
              >
                <div
                  className={[
                    "text-xs font-bold mb-1",
                    done
                      ? "text-[#34C899]"
                      : inProgress
                      ? "text-[#9B7FE8]"
                      : "text-[#B0A8BB]",
                  ].join(" ")}
                >
                  {done ? "✓" : `Ch${chapter.num}`}
                </div>
                <div className="text-[10px] text-[#6B5F7A] leading-tight line-clamp-2">
                  {chapter.title}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-[#6B5F7A]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#34C899] inline-block" />
            Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#9B7FE8] inline-block" />
            In progress
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#F0E6EE] inline-block" />
            Not started
          </span>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="mb-8">
        <ActivityHeatmap days={182} />
      </div>

      {/* CTA */}
      <Link
        href="/learn"
        className="inline-block bg-gradient-to-r from-[#E8436F] to-[#F06B8A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-[0_4px_16px_rgba(232,67,111,0.25)]"
      >
        Continue learning →
      </Link>
    </div>
  );
}
