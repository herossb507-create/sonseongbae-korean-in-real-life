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
        <h1 className="text-2xl font-bold text-[#140F2D]">My Progress</h1>
        <p className="text-[#5A5475] text-sm mt-1">
          Saved in this browser. Keep up the streak!
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-[#EAE4F7] rounded-xl p-6 text-center shadow-sm">
          <div className="text-3xl font-bold text-[#7C5CFF]">
            {stats.chaptersCompleted}
            <span className="text-[#9E98B8] text-lg">/{stats.totalChapters}</span>
          </div>
          <div className="text-sm text-[#5A5475] mt-1">Chapters read</div>
        </div>
        <div className="bg-white border border-[#EAE4F7] rounded-xl p-6 text-center shadow-sm">
          <div className="text-3xl font-bold text-[#34C899]">
            {stats.wordsKnown}
          </div>
          <div className="text-sm text-[#5A5475] mt-1">Words known</div>
        </div>
        <div className="bg-white border border-[#EAE4F7] rounded-xl p-6 text-center shadow-sm">
          <div className="text-3xl font-bold text-[#FF3D8B]">
            {stats.streakDays}
          </div>
          <div className="text-sm text-[#5A5475] mt-1">Day streak 🔥</div>
        </div>
      </div>

      {/* 전체 진도 바 */}
      <div className="bg-white border border-[#EAE4F7] rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-[#140F2D]">Overall progress</h2>
          <span className="text-sm text-[#7C5CFF] font-medium">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-[#F0E7FF] rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-[#7C5CFF] to-[#FF3D8B] h-3 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm text-[#5A5475]">
          {stats.chaptersCompleted} of {stats.totalChapters} chapters completed
        </p>
      </div>

      {/* 최근 활동 + 주간 요약 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-[#EAE4F7] rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#5A5475] uppercase tracking-wide mb-3">
            Last read
          </h3>
          {lastReadChapterInfo ? (
            <Link
              href={`/learn/${lastReadChapterInfo.slug}`}
              className="group"
            >
              <p className="text-[#140F2D] font-medium group-hover:text-[#7C5CFF] transition-colors">
                Ch{lastReadChapterInfo.num}. {lastReadChapterInfo.title}
              </p>
              <p className="text-xs text-[#5A5475] mt-1">
                {new Date(lastRead!.last_read_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </Link>
          ) : (
            <p className="text-[#9E98B8] text-sm">No chapters read yet</p>
          )}
        </div>
        <div className="bg-white border border-[#EAE4F7] rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#5A5475] uppercase tracking-wide mb-3">
            This week
          </h3>
          <p className="text-[#140F2D] font-medium">
            <span className="text-2xl text-[#F4A261] font-bold">
              {weeklyCount}
            </span>{" "}
            <span className="text-[#5A5475] text-sm">chapters visited</span>
          </p>
        </div>
      </div>

      {/* 챕터 진도 맵 */}
      <div className="bg-white border border-[#EAE4F7] rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="font-semibold text-[#140F2D] mb-5">Chapter map</h2>
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
                    ? "bg-[#7C5CFF]/20 border-[#7C5CFF]/40 hover:bg-[#7C5CFF]/30"
                    : "bg-[#F8F5FF] border-[#EAE4F7] hover:bg-[#F2ECFF]",
                ].join(" ")}
              >
                <div
                  className={[
                    "text-xs font-bold mb-1",
                    done
                      ? "text-[#34C899]"
                      : inProgress
                      ? "text-[#7C5CFF]"
                      : "text-[#9E98B8]",
                  ].join(" ")}
                >
                  {done ? "✓" : `Ch${chapter.num}`}
                </div>
                <div className="text-[10px] text-[#5A5475] leading-tight line-clamp-2">
                  {chapter.title}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-[#5A5475]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#34C899] inline-block" />
            Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#7C5CFF] inline-block" />
            In progress
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#EAE4F7] inline-block" />
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
        className="inline-block bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-[0_4px_16px_rgba(255,61,139,0.25)]"
      >
        Continue learning →
      </Link>
    </div>
  );
}
