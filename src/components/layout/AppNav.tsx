import Link from "next/link";
import { logout } from "@/app/actions/logout";
import { createClient } from "@/lib/supabase/server";
import { MobileNav } from "@/components/layout/MobileNav";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { XPBar } from "@/components/gamification/XPBar";

interface Props {
  isAdmin?: boolean;
  isPro?: boolean;
}

export async function AppNav({ isAdmin, isPro }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [gamificationResult] = user
    ? await Promise.all([
        supabase
          .from("user_gamification")
          .select("xp, level, streak_current")
          .eq("user_id", user.id)
          .single(),
      ])
    : [{ data: null }];

  const gamification = gamificationResult.data;

  return (
    <nav className="sticky top-0 z-30 bg-[#0f1629]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <Link
        href={user ? "/learn" : "/"}
        className="text-lg font-bold text-white hover:opacity-90 transition-opacity"
      >
        Korean <span className="text-[#FF4757]">in Real Life</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-5 text-sm">
        {isAdmin && (
          <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">
            👑 Admin
          </span>
        )}
        {!isAdmin && isPro && (
          <span className="bg-[#4F7FE8]/20 text-[#4F7FE8] text-xs font-semibold px-2.5 py-1 rounded-full">
            ⭐ Pro
          </span>
        )}
        {user ? (
          <>
            <Link href="/learn" className="text-[#8892B0] hover:text-white transition-colors">
              Chapters
            </Link>
            <Link href="/games" className="text-[#8892B0] hover:text-white transition-colors">
              🎮 Games
            </Link>
            <Link href="/daily" className="text-[#8892B0] hover:text-white transition-colors">
              🔥 Daily
            </Link>
            <Link href="/dashboard" className="text-[#8892B0] hover:text-white transition-colors">
              Dashboard
            </Link>
            {/* 스트릭 + XP 표시 */}
            {gamification && (
              <div className="flex items-center gap-2">
                <StreakCounter streak={gamification.streak_current ?? 0} />
                <XPBar xp={gamification.xp ?? 0} level={gamification.level ?? 1} />
              </div>
            )}
            <Link href="/settings" className="text-[#8892B0] hover:text-white transition-colors">
              Settings
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="text-[#8892B0] hover:text-[#FF4757] border border-white/10 px-3 py-1.5 rounded-lg hover:border-[#FF4757]/30 transition-colors"
              >
                Log out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="text-[#8892B0] hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-[#FF4757] to-[#FF6B81] text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Start free
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <MobileNav isLoggedIn={!!user} isAdmin={isAdmin} isPro={isPro} />
    </nav>
  );
}
