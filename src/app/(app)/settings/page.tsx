import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth";
import { updateDisplayName, updatePassword } from "./actions";

interface Props {
  searchParams: { error?: string; success?: string };
}

export default async function SettingsPage({ searchParams }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { isPro, isAdmin } = await getUserAccess();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#FFF5F8]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-[#1E1225] mb-8">Account Settings</h1>

        {/* 성공/에러 메시지 */}
        {searchParams.success === "profile" && (
          <div className="mb-4 p-3 bg-[#34C899]/10 border border-[#34C899]/30 rounded-lg text-sm text-[#34C899]">
            ✓ Display name updated successfully.
          </div>
        )}
        {searchParams.success === "password" && (
          <div className="mb-4 p-3 bg-[#34C899]/10 border border-[#34C899]/30 rounded-lg text-sm text-[#34C899]">
            ✓ Password changed successfully.
          </div>
        )}
        {searchParams.error && (
          <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-sm text-[#EF4444]">
            {searchParams.error}
          </div>
        )}

        {/* Plan badge */}
        <div className="mb-6">
          {isAdmin && (
            <span className="bg-purple-500/20 text-purple-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              👑 Admin
            </span>
          )}
          {!isAdmin && isPro && (
            <span className="bg-[#9B7FE8]/20 text-[#9B7FE8] text-xs font-semibold px-2.5 py-1 rounded-full">
              ⭐ Pro
            </span>
          )}
        </div>

        {/* Profile */}
        <section className="bg-white border border-[#F0E6EE] rounded-xl p-6 mb-4 shadow-sm">
          <h2 className="font-semibold text-[#1E1225] mb-4">Profile</h2>
          <form action={updateDisplayName} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#6B5F7A] mb-1">Display name</label>
              <input
                name="display_name"
                type="text"
                required
                defaultValue={profile?.display_name ?? ""}
                className="w-full bg-white border border-[#F0E6EE] rounded-lg px-3 py-2 text-sm text-[#1E1225] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E8436F]/20 focus:border-[#E8436F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B5F7A] mb-1">Email</label>
              <input
                type="email"
                value={user.email ?? ""}
                readOnly
                className="w-full bg-[#FFF5F8] border border-[#F0E6EE] rounded-lg px-3 py-2 text-sm text-[#B0A8BB]"
              />
            </div>
            <button
              type="submit"
              className="text-sm bg-gradient-to-r from-[#9B7FE8] to-[#B099FF] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Save changes
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className="bg-white border border-[#F0E6EE] rounded-xl p-6 mb-4 shadow-sm">
          <h2 className="font-semibold text-[#1E1225] mb-4">Change Password</h2>
          <form action={updatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#6B5F7A] mb-1">New password</label>
              <input
                name="new_password"
                type="password"
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full bg-white border border-[#F0E6EE] rounded-lg px-3 py-2 text-sm text-[#1E1225] placeholder:text-[#B0A8BB] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E8436F]/20 focus:border-[#E8436F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B5F7A] mb-1">Confirm new password</label>
              <input
                name="confirm_password"
                type="password"
                required
                minLength={8}
                placeholder="Re-enter new password"
                className="w-full bg-white border border-[#F0E6EE] rounded-lg px-3 py-2 text-sm text-[#1E1225] placeholder:text-[#B0A8BB] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E8436F]/20 focus:border-[#E8436F] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="text-sm bg-[#FFF5F8] border border-[#F0E6EE] text-[#6B5F7A] px-4 py-2 rounded-lg hover:bg-[#FFF0F5] transition-colors"
            >
              Update password
            </button>
          </form>
        </section>

        {/* Subscription */}
        <section className="bg-white border border-[#F0E6EE] rounded-xl p-6 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1E1225]">Subscription</h2>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={
                isAdmin
                  ? { background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }
                  : isPro
                  ? { background: "rgba(155,127,232,0.15)", color: "#9B7FE8" }
                  : { background: "rgba(176,168,187,0.15)", color: "#6B5F7A" }
              }
            >
              {isAdmin ? "👑 Admin" : isPro ? "⭐ Pro" : "Free"}
            </span>
          </div>

          {/* Feature comparison */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Free column */}
            <div
              className="rounded-xl p-4"
              style={{
                background: isPro ? "rgba(240,230,238,0.3)" : "rgba(232,67,111,0.04)",
                border: isPro ? "1px solid rgba(240,230,238,0.8)" : "1px solid rgba(232,67,111,0.15)",
              }}
            >
              <p className="text-xs font-bold mb-3" style={{ color: isPro ? "#B0A8BB" : "#1E1225" }}>
                Free {!isPro && <span className="ml-1">← current</span>}
              </p>
              {[
                "Ch01–02 reading",
                "Ch01–02 flashcards",
                "Ch01–02 quiz",
                "Basic TTS audio",
                "Streak tracking",
                "Basic dashboard",
              ].map((f) => (
                <div key={f} className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-xs" style={{ color: "#34C899" }}>✓</span>
                  <span className="text-xs" style={{ color: isPro ? "#B0A8BB" : "#6B5F7A" }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Pro column */}
            <div
              className="rounded-xl p-4"
              style={{
                background: isPro
                  ? "linear-gradient(135deg, rgba(232,67,111,0.06), rgba(155,127,232,0.06))"
                  : "rgba(240,230,238,0.4)",
                border: isPro
                  ? "1px solid rgba(232,67,111,0.2)"
                  : "1px solid rgba(240,230,238,0.8)",
              }}
            >
              <p className="text-xs font-bold mb-3" style={{ color: isPro ? "#E8436F" : "#B0A8BB" }}>
                Pro {isPro && <span className="ml-1">← current</span>}
              </p>
              {[
                "All 16 chapters",
                "All flashcards & quizzes",
                "5 interactive games",
                "SRS spaced review",
                "K-Drama phrases",
                "Conversation dialogues",
                "Leaderboard & full XP",
              ].map((f) => (
                <div key={f} className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-xs" style={{ color: isPro ? "#E8436F" : "#B0A8BB" }}>
                    {isPro ? "✓" : "🔒"}
                  </span>
                  <span className="text-xs" style={{ color: isPro ? "#6B5F7A" : "#B0A8BB" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          {!isPro && !isAdmin && (
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(to right, #E8436F, #F06B8A)",
                boxShadow: "0 4px 16px rgba(232,67,111,0.25)",
              }}
            >
              <span>👑</span>
              <span>Upgrade to Pro — from $7.99/mo</span>
            </Link>
          )}
          {isPro && !isAdmin && (
            <Link
              href="/api/billing/portal"
              className="inline-block text-sm border border-[#F0E6EE] text-[#6B5F7A] px-4 py-2 rounded-lg hover:bg-[#FFF5F8] transition-colors"
            >
              Manage billing
            </Link>
          )}
        </section>

        {/* Danger zone */}
        <section className="bg-white border border-[#EF4444]/20 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-[#EF4444] mb-2">Danger zone</h2>
          <p className="text-sm text-[#6B5F7A] mb-4">
            Permanently delete your account and all associated data.
          </p>
          <button className="text-sm border border-[#EF4444]/30 text-[#EF4444] px-4 py-2 rounded-lg hover:bg-[#EF4444]/10 transition-colors">
            Delete account
          </button>
        </section>
      </div>
    </div>
  );
}
