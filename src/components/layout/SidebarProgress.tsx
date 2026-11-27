"use client";

import Link from "next/link";
import { EMPTY_PROGRESS, currentStreak, useProgress } from "@/lib/progress";

/** Name, XP and streak from this browser's saved progress (replaces the old account box). */
export function SidebarProgress({ onNavigate }: { onNavigate?: () => void }) {
  const progress = useProgress() ?? EMPTY_PROGRESS;
  const streak = currentStreak(progress);
  const name = progress.displayName || "Learner";

  return (
    <div className="px-4 py-4 border-t border-white/10">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF3D8B] to-[#7C5CFF] flex items-center justify-center text-white text-sm font-bold shrink-0">
          {name[0]?.toUpperCase() ?? "K"}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-white truncate">{name}</div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#22D3EE] font-semibold">⚡ {progress.xp} XP</span>
            {streak > 0 && <span className="text-[#FF6FB1] font-semibold">🔥 {streak}일</span>}
          </div>
        </div>
      </div>
      <Link
        href="/settings"
        onClick={onNavigate}
        className="block text-xs text-white/50 hover:text-white transition-colors"
      >
        Saved in this browser · Back up →
      </Link>
      <Link
        href="/privacy"
        onClick={onNavigate}
        className="mt-1 block text-xs text-white/50 hover:text-white transition-colors"
      >
        Privacy
      </Link>
    </div>
  );
}
