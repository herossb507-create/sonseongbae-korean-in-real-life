import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/logout";
import { SidebarActiveLink } from "./SidebarActiveLink";
import { SidebarMobile } from "./SidebarMobile";
import { getUserAccess } from "@/lib/auth";

export async function Sidebar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [gamificationResult, profileResult, accessResult] = user
    ? await Promise.all([
        supabase
          .from("user_gamification")
          .select("xp, level, streak_current")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single(),
        getUserAccess(),
      ])
    : [{ data: null }, { data: null }, { isPro: false, isAdmin: false, userId: null, accessLevel: "free" as const }];

  const isPro = accessResult.isPro;

  const gamification = gamificationResult.data;
  const displayName =
    profileResult.data?.display_name ??
    user?.email?.split("@")[0] ??
    "Learner";

  const navItems = [
    { href: "/home", label: "Home", icon: "🏠", exact: true },
    { href: "/learn", label: "Chapters", icon: "📖" },
    { href: "/games", label: "Games", icon: "🎮", proOnly: true },
    { href: "/kdrama", label: "K-Drama", icon: "🎬", proOnly: true },
    { href: "/dialogues", label: "Dialogues", icon: "💬", proOnly: true },
    { href: "/concerts", label: "K-pop Concerts", icon: "🎤" },
    { href: "/daily", label: "Daily Challenge", icon: "🔥", gold: true },
    { href: "/leaderboard", label: "Leaderboard", icon: "🏆", proOnly: true },
    { href: "/dashboard", label: "Stats", icon: "📊" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <SidebarMobile navItems={navItems} displayName={displayName} isPro={isPro} />

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] min-h-screen bg-white border-r border-[#F0E6EE] sticky top-0 h-screen overflow-y-auto shrink-0 shadow-[2px_0_12px_rgba(232,67,111,0.06)]">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#F0E6EE]">
          <Link
            href="/home"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E8436F] to-[#9B7FE8] flex items-center justify-center text-white text-sm font-bold shadow-md">
              한
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-[#1E1225]">Korean</div>
              <div className="text-xs text-[#E8436F] font-semibold">in Real Life</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <SidebarActiveLink
              key={item.href}
              href={item.href}
              exact={item.exact}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className={item.gold ? "text-[#F4A261] font-semibold" : undefined}>
                {item.label}
              </span>
              {item.badge !== null && item.badge !== undefined && (
                <span className="ml-auto bg-[#9B7FE8] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
              {item.proOnly && !isPro && (
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "linear-gradient(to right, #E8436F, #9B7FE8)", color: "white" }}>
                  PRO
                </span>
              )}
            </SidebarActiveLink>
          ))}
        </nav>

        {/* User info */}
        {user && (
          <div className="px-4 py-4 border-t border-[#F0E6EE]">
            {/* Avatar + name */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8436F] to-[#9B7FE8] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {displayName[0]?.toUpperCase() ?? "K"}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-[#1E1225] truncate">
                  {displayName}
                </div>
                <div className="text-xs text-[#B0A8BB] truncate">
                  {user.email}
                </div>
              </div>
            </div>

            {/* XP + Streak */}
            {gamification && (
              <div className="flex items-center gap-3 mb-3 px-1">
                <div className="flex items-center gap-1 text-xs">
                  <span>⚡</span>
                  <span className="text-[#9B7FE8] font-semibold">
                    {gamification.xp ?? 0} XP
                  </span>
                </div>
                {(gamification.streak_current ?? 0) > 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    <span>🔥</span>
                    <span className="text-[#E8436F] font-semibold">
                      {gamification.streak_current}일
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Logout */}
            <form action={logout}>
              <button
                type="submit"
                className="w-full text-sm text-[#6B5F7A] hover:text-[#E8436F] border border-[#F0E6EE] hover:border-[#E8436F]/30 px-3 py-2 rounded-lg transition-colors text-left"
              >
                Log out
              </button>
            </form>
          </div>
        )}
      </aside>
    </>
  );
}
