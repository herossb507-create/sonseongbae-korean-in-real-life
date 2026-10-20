import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth";
import { ProGate } from "@/components/subscription/ProGate";

const LEVEL_TIERS = [
  { min: 16, label: "Advanced",     color: "#E8436F", bg: "rgba(232,67,111,0.15)",    border: "rgba(232,67,111,0.3)" },
  { min: 11, label: "Intermediate", color: "#9B7FE8", bg: "rgba(155,127,232,0.15)",   border: "rgba(155,127,232,0.3)" },
  { min: 6,  label: "Elementary",   color: "#10B981", bg: "rgba(16,185,129,0.15)",   border: "rgba(16,185,129,0.3)" },
  { min: 1,  label: "Beginner",     color: "#6B5F7A", bg: "rgba(107,95,122,0.1)",   border: "rgba(107,95,122,0.2)" },
];

function getLevelTier(level: number) {
  return LEVEL_TIERS.find((t) => level >= t.min) ?? LEVEL_TIERS[LEVEL_TIERS.length - 1];
}

function formatXP(xp: number) {
  return xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : xp.toString();
}

interface LeaderboardEntry {
  xp: number;
  level: number;
  streak_current: number;
  streak_longest: number;
  display_name: string | null;
  avatar_url: string | null;
  user_id: string;
}

export default async function LeaderboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { isPro } = await getUserAccess();
  if (!isPro) {
    return (
      <ProGate
        feature="Leaderboard is Pro"
        description="Compete with other learners on the weekly XP leaderboard. Upgrade to Pro to join the competition."
        backHref="/dashboard"
        backLabel="← Back to dashboard"
      />
    );
  }

  // Fetch top 20 by XP
  const { data: rows } = await supabase
    .from("user_gamification")
    .select("user_id, xp, level, streak_current, streak_longest")
    .gt("xp", 0)
    .order("xp", { ascending: false })
    .limit(20);

  // Always fetch current user's own stats
  const { data: myStats } = await supabase
    .from("user_gamification")
    .select("xp, level, streak_current, streak_longest")
    .eq("user_id", user.id)
    .single();

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  let entries: LeaderboardEntry[] = [];

  if (rows && rows.length > 0) {
    const userIds = rows.map((r) => r.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", userIds);

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p])
    );

    entries = rows.map((r) => {
      const profile = profileMap.get(r.user_id);
      return {
        user_id: r.user_id,
        xp: r.xp ?? 0,
        level: r.level ?? 1,
        streak_current: r.streak_current ?? 0,
        streak_longest: r.streak_longest ?? 0,
        display_name: profile?.display_name ?? null,
        avatar_url: (profile as { id: string; display_name: string | null; avatar_url?: string | null } | undefined)?.avatar_url ?? null,
      };
    });
  }

  // Current user's position in the leaderboard
  const myIndex = entries.findIndex((e) => e.user_id === user.id);
  const myRank = myIndex >= 0 ? myIndex + 1 : null;

  // If current user not in top 20, calculate their rank
  let myRankOutside: number | null = null;
  if (myRank === null && myStats && (myStats.xp ?? 0) > 0) {
    const { count } = await supabase
      .from("user_gamification")
      .select("user_id", { count: "exact", head: true })
      .gt("xp", myStats.xp ?? 0);
    myRankOutside = (count ?? 0) + 1;
  }

  const displayName = myProfile?.display_name ?? user.email?.split("@")[0] ?? "Learner";
  const myXP = myStats?.xp ?? 0;
  const myLevel = myStats?.level ?? 1;
  const myStreak = myStats?.streak_current ?? 0;
  const myLongestStreak = myStats?.streak_longest ?? 0;
  const myTier = getLevelTier(myLevel);
  const effectiveMyRank = myRank ?? myRankOutside ?? (myXP > 0 ? 1 : null);

  const hasOtherUsers = entries.some((e) => e.user_id !== user.id);

  return (
    <div className="min-h-screen" style={{ background: "#FFF5F8" }}>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-black mb-1" style={{ color: "#1E1225" }}>
            Leaderboard
          </h1>
          <p className="text-sm" style={{ color: "#6B5F7A" }}>
            Global rankings by total XP earned
          </p>
        </div>

        {/* ── My Stats Card (always shown) ──────────────────── */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(155,127,232,0.12), rgba(232,67,111,0.06))",
            border: "1px solid rgba(155,127,232,0.25)",
          }}
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black shrink-0"
              style={{
                background: "linear-gradient(135deg, #9B7FE8, #E8436F)",
                color: "white",
                boxShadow: "0 0 24px rgba(155,127,232,0.35)",
              }}
            >
              {displayName[0]?.toUpperCase() ?? "K"}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-bold" style={{ color: "#1E1225" }}>
                  {displayName}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: myTier.bg, color: myTier.color, border: `1px solid ${myTier.border}` }}
                >
                  Lv.{myLevel} {myTier.label}
                </span>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-sm">⚡</span>
                  <span className="text-sm font-bold" style={{ color: "#F4A261" }}>
                    {formatXP(myXP)} XP
                  </span>
                </div>
                {myStreak > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm">🔥</span>
                    <span className="text-sm font-semibold" style={{ color: "#E8436F" }}>
                      {myStreak} day streak
                    </span>
                  </div>
                )}
                {myLongestStreak > 0 && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: "#B0A8BB" }}>
                    Best: {myLongestStreak}d
                  </div>
                )}
              </div>
            </div>

            {/* Rank */}
            <div className="text-right shrink-0">
              {effectiveMyRank !== null ? (
                <>
                  <div className="text-2xl font-black" style={{ color: "#F4A261" }}>
                    {effectiveMyRank === 1 ? "👑" : `#${effectiveMyRank}`}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#B0A8BB" }}>
                    {effectiveMyRank === 1 && myXP > 0 ? "Top spot!" : "your rank"}
                  </div>
                </>
              ) : (
                <div className="text-xs text-center" style={{ color: "#B0A8BB" }}>
                  <div className="text-2xl mb-1">🌱</div>
                  <div>No rank yet</div>
                </div>
              )}
            </div>
          </div>

          {/* XP progress hint */}
          {myXP === 0 && (
            <div
              className="mt-4 rounded-xl px-4 py-3 text-sm text-center"
              style={{ background: "rgba(232,67,111,0.05)", border: "1px solid rgba(232,67,111,0.10)" }}
            >
              <span style={{ color: "#6B5F7A" }}>
                Complete a chapter or quiz to earn your first XP and appear on the leaderboard!
              </span>
            </div>
          )}
        </div>

        {/* ── No competition yet ─────────────────────────────── */}
        {!hasOtherUsers && myXP > 0 && (
          <div
            className="rounded-2xl p-8 text-center mb-6"
            style={{
              background: "rgba(244,162,97,0.08)",
              border: "1px solid rgba(244,162,97,0.25)",
            }}
          >
            <div className="text-4xl mb-3">🥇</div>
            <p className="font-bold text-lg mb-1" style={{ color: "#F4A261" }}>
              You&apos;re #1 right now!
            </p>
            <p className="text-sm" style={{ color: "#6B5F7A" }}>
              No one else is on the leaderboard yet. Keep studying — soon you&apos;ll have competition!
            </p>
          </div>
        )}

        {/* ── Podium (top 3) ────────────────────────────────── */}
        {entries.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-6">
            <PodiumCard entry={entries[1]} rank={2} isMe={entries[1].user_id === user.id} />
            <PodiumCard entry={entries[0]} rank={1} isMe={entries[0].user_id === user.id} />
            <PodiumCard entry={entries[2]} rank={3} isMe={entries[2].user_id === user.id} />
          </div>
        )}

        {/* ── Full rankings list ────────────────────────────── */}
        {entries.length > 0 && (
          <div className="space-y-2 mb-6">
            {entries.map((entry, idx) => {
              const rank = idx + 1;
              const isMe = entry.user_id === user.id;
              const tier = getLevelTier(entry.level);
              const initials = (entry.display_name ?? "?")[0].toUpperCase();

              const rankIcon =
                rank === 1 ? "👑" :
                rank === 2 ? "🥈" :
                rank === 3 ? "🥉" : null;

              return (
                <div
                  key={entry.user_id}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{
                    background: isMe
                      ? "rgba(155,127,232,0.10)"
                      : rank <= 3
                      ? "rgba(232,67,111,0.04)"
                      : "rgba(240,230,238,0.5)",
                    border: isMe
                      ? "1px solid rgba(155,127,232,0.30)"
                      : rank === 1 ? "1px solid rgba(244,162,97,0.30)"
                      : rank === 2 ? "1px solid rgba(192,192,192,0.3)"
                      : rank === 3 ? "1px solid rgba(205,127,50,0.25)"
                      : "1px solid rgba(240,230,238,1)",
                  }}
                >
                  {/* Rank */}
                  <div className="w-8 text-center shrink-0">
                    {rankIcon ? (
                      <span className="text-xl">{rankIcon}</span>
                    ) : (
                      <span className="text-sm font-semibold" style={{ color: "#B0A8BB" }}>
                        {rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #9B7FE8, #E8436F)",
                      color: "white",
                    }}
                  >
                    {initials}
                  </div>

                  {/* Name + level */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-semibold truncate"
                      style={{ color: isMe ? "#9B7FE8" : "#1E1225" }}
                    >
                      {entry.display_name ?? "Learner"}
                      {isMe && (
                        <span className="ml-1.5 text-xs font-normal" style={{ color: "#9B7FE8" }}>
                          (you)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: tier.bg, color: tier.color, border: `1px solid ${tier.border}` }}
                      >
                        Lv.{entry.level} {tier.label}
                      </span>
                      {entry.streak_current > 0 && (
                        <span className="text-xs" style={{ color: "#E8436F" }}>
                          🔥 {entry.streak_current}d
                        </span>
                      )}
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">⚡</span>
                      <span className="text-sm font-bold" style={{ color: "#F4A261" }}>
                        {formatXP(entry.xp)}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: "#B0A8BB" }}>XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── User outside top 20 ───────────────────────────── */}
        {myRank === null && myRankOutside !== null && (
          <div className="mt-2 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 border-t" style={{ borderColor: "rgba(240,230,238,1)" }} />
              <span className="text-xs px-2" style={{ color: "#B0A8BB" }}>your position</span>
              <div className="flex-1 border-t" style={{ borderColor: "rgba(240,230,238,1)" }} />
            </div>
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{
                background: "rgba(155,127,232,0.08)",
                border: "1px solid rgba(155,127,232,0.25)",
              }}
            >
              <div className="w-8 text-center shrink-0">
                <span className="text-sm font-bold" style={{ color: "#9B7FE8" }}>
                  #{myRankOutside}
                </span>
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #9B7FE8, #E8436F)", color: "white" }}
              >
                {displayName[0]?.toUpperCase() ?? "K"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: "#9B7FE8" }}>
                  {displayName} <span className="text-xs font-normal">(you)</span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#6B5F7A" }}>
                  Keep going to break into the top 20!
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm">⚡</span>
                  <span className="text-sm font-bold" style={{ color: "#F4A261" }}>
                    {formatXP(myXP)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Footer ───────────────────────────────────────── */}
        <div className="mt-6 text-center space-y-3">
          {entries.length > 0 && (
            <p className="text-xs" style={{ color: "#B0A8BB" }}>
              Showing top {entries.length} learners · Rankings update in real-time
            </p>
          )}

          {/* XP guide */}
          <div
            className="rounded-2xl p-4 text-left"
            style={{
              background: "rgba(240,230,238,0.5)",
              border: "1px solid rgba(240,230,238,1)",
            }}
          >
            <p className="text-xs font-semibold mb-3 text-center" style={{ color: "#6B5F7A" }}>
              ⚡ How to earn XP
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { action: "Complete a chapter", xp: "+50 XP" },
                { action: "7-day streak bonus", xp: "+100 XP" },
                { action: "Perfect quiz score", xp: "+50 XP" },
                { action: "Daily challenge", xp: "+40 XP" },
                { action: "Pass a quiz", xp: "+30 XP" },
                { action: "Flashcard set", xp: "+20 XP" },
              ].map((item) => (
                <div
                  key={item.action}
                  className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                >
                  <span className="text-xs" style={{ color: "#6B5F7A" }}>{item.action}</span>
                  <span className="text-xs font-bold ml-2" style={{ color: "#F4A261" }}>{item.xp}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Link
                href="/daily"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(244,162,97,0.12)",
                  border: "1px solid rgba(244,162,97,0.30)",
                  color: "#F4A261",
                }}
              >
                🎯 Daily Challenge
              </Link>
              <Link
                href="/learn"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(232,67,111,0.10)",
                  border: "1px solid rgba(232,67,111,0.20)",
                  color: "#E8436F",
                }}
              >
                📖 Study Chapters
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function PodiumCard({ entry, rank, isMe }: { entry: LeaderboardEntry; rank: 1 | 2 | 3; isMe: boolean }) {
  const initials = (entry.display_name ?? "?")[0].toUpperCase();

  const config = {
    1: { crown: "👑", color: "#F4A261", bg: "rgba(244,162,97,0.10)",   border: "rgba(244,162,97,0.30)",   podiumH: "h-28", size: 64, fontSize: 22, glow: "rgba(244,162,97,0.35)" },
    2: { crown: "🥈", color: "#C0C0C0", bg: "rgba(192,192,192,0.08)", border: "rgba(192,192,192,0.2)", podiumH: "h-20", size: 52, fontSize: 18, glow: "rgba(192,192,192,0.3)" },
    3: { crown: "🥉", color: "#CD7F32", bg: "rgba(205,127,50,0.08)",  border: "rgba(205,127,50,0.2)",  podiumH: "h-16", size: 44, fontSize: 16, glow: "rgba(205,127,50,0.3)" },
  }[rank];

  return (
    <div className="flex flex-col items-center gap-1.5 flex-1 max-w-[110px]">
      <div className="text-2xl">{config.crown}</div>

      <div
        className="rounded-full flex items-center justify-center font-bold overflow-hidden shrink-0"
        style={{
          width: config.size,
          height: config.size,
          fontSize: config.fontSize,
          background: "linear-gradient(135deg, #9B7FE8, #E8436F)",
          color: "white",
          boxShadow: `0 0 24px ${config.glow}`,
          border: `2px solid ${isMe ? "#9B7FE8" : config.color}`,
        }}
      >
        {initials}
      </div>

      <div className="text-center">
        <div className="text-xs font-semibold truncate max-w-[100px]" style={{ color: isMe ? "#9B7FE8" : "#1E1225" }}>
          {entry.display_name ?? "Learner"}{isMe ? " 👈" : ""}
        </div>
        <div className="text-xs font-bold" style={{ color: config.color }}>
          ⚡ {formatXP(entry.xp)}
        </div>
      </div>

      <div
        className={`w-full ${config.podiumH} rounded-t-xl flex items-end justify-center pb-2`}
        style={{ background: config.bg, border: `1px solid ${config.border}`, borderBottom: "none" }}
      >
        <span className="text-base font-black" style={{ color: config.color }}>#{rank}</span>
      </div>
    </div>
  );
}
