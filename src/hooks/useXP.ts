"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { levelFromXP } from "@/lib/xp";
import { recordActivity } from "@/lib/activity-log";

export function useXP() {
  const addXP = useCallback(async (amount: number) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // Record activity in localStorage for the heatmap
    recordActivity(amount);

    const { data: current } = await supabase
      .from("user_gamification")
      .select("xp, level, streak_current, streak_longest, last_activity, daily_goal_xp")
      .eq("user_id", user.id)
      .single();

    const oldXP = current?.xp ?? 0;
    const newXP = oldXP + amount;
    const newLevel = levelFromXP(newXP);

    await supabase.from("user_gamification").upsert(
      {
        user_id: user.id,
        xp: newXP,
        level: newLevel,
        streak_current: current?.streak_current ?? 0,
        streak_longest: current?.streak_longest ?? 0,
        last_activity: current?.last_activity ?? null,
        daily_goal_xp: current?.daily_goal_xp ?? 50,
      },
      { onConflict: "user_id" }
    );

    return {
      oldXP,
      newXP,
      newLevel,
      leveledUp: newLevel > (current?.level ?? 1),
    };
  }, []);

  return { addXP };
}
