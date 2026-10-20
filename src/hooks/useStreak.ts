"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useStreak() {
  const checkAndUpdateStreak = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const { data: gamification } = await supabase
      .from("user_gamification")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!gamification) {
      await supabase.from("user_gamification").insert({
        user_id: user.id,
        streak_current: 1,
        streak_longest: 1,
        last_activity: today,
        xp: 0,
        level: 1,
        daily_goal_xp: 50,
      });
      return { streak: 1, bonus7Day: false };
    }

    // 오늘 이미 활동했으면 변경 없음
    if (gamification.last_activity === today) {
      return { streak: gamification.streak_current, bonus7Day: false };
    }

    const lastDate = gamification.last_activity
      ? new Date(gamification.last_activity)
      : null;
    const todayDate = new Date(today);
    const diffDays = lastDate
      ? Math.floor(
          (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 999;

    // 연속 학습: 어제면 +1, 그 이상이면 1로 리셋
    const newStreak = diffDays === 1 ? gamification.streak_current + 1 : 1;
    const newLongest = Math.max(newStreak, gamification.streak_longest ?? 0);
    const bonus7Day = newStreak % 7 === 0;

    await supabase
      .from("user_gamification")
      .update({
        streak_current: newStreak,
        streak_longest: newLongest,
        last_activity: today,
      })
      .eq("user_id", user.id);

    return { streak: newStreak, bonus7Day };
  }, []);

  return { checkAndUpdateStreak };
}
