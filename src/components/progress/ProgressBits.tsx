"use client";

import { ProgressTracker } from "@/components/dashboard/ProgressTracker";
import { completedChapterIds, useProgress } from "@/lib/progress";

/** ✓ after a chapter title once it's completed in this browser. */
export function ChapterDoneMark({ id }: { id: string }) {
  const progress = useProgress();
  if (!progress?.chapters[id]?.completed) return null;
  return <span className="text-[#34C899] text-sm">✓</span>;
}

export function LearnProgress({ total }: { total: number }) {
  const progress = useProgress();
  return <ProgressTracker total={total} completed={progress ? completedChapterIds(progress).length : 0} />;
}
