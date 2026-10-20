import Link from "next/link";
import { PricingCard } from "@/components/subscription/PricingCard";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/logout";

export default async function PricingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 로그인 상태면 Pro CTA → 체크아웃 (미구현시 /settings)
  // 비로그인 상태면 → 회원가입
  const proCta = user ? "/api/checkout?plan=monthly" : "/signup?plan=pro";
  const annualCta = user ? "/api/checkout?plan=annual" : "/signup?plan=pro";

  return (
    <main className="min-h-screen bg-[#FFF5F8]">
      <nav className="bg-white border-b border-[#F0E6EE] px-6 py-4 flex justify-between items-center shadow-sm">
        <Link href={user ? "/learn" : "/"} className="text-xl font-bold text-[#E8436F]">
          Korean in Real Life
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/learn" className="text-[#6B5F7A] hover:text-[#1E1225]">Chapters</Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-[#6B5F7A] hover:text-[#EF4444] border border-[#F0E6EE] px-3 py-1.5 rounded-lg"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[#6B5F7A] hover:text-[#1E1225]">Log in</Link>
              <Link href="/signup" className="bg-gradient-to-r from-[#E8436F] to-[#F06B8A] text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                Start free
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-[#1E1225] mb-4">Simple, honest pricing</h1>
        <p className="text-[#6B5F7A] mb-14 text-lg">
          Start free. Upgrade when you&apos;re ready.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <PricingCard
            plan="Free"
            price="₩0"
            period="forever"
            features={[
              "Ch01–02 reading (with TTS audio)",
              "Ch01–02 flashcards & quiz",
              "Streak tracking",
              "Basic dashboard",
            ]}
            lockedFeatures={[
              "Ch03–16 (14 chapters locked)",
              "All 5 games",
              "SRS spaced review",
              "K-Drama phrases",
              "Conversation dialogues",
              "Leaderboard & XP system",
            ]}
            cta={user ? "Your current plan" : "Get started free"}
            href={user ? "/learn" : "/signup"}
            highlighted={false}
          />
          <PricingCard
            plan="Pro"
            price="₩9,900"
            period="month (~$7 USD)"
            annualPrice="₩79,000/year (~$57 USD) — save 33% →"
            annualHref={annualCta}
            badge="Most popular"
            features={[
              "All 16 chapters (full TTS audio)",
              "All flashcards & quizzes",
              "5 interactive games",
              "SRS spaced repetition review",
              "K-Drama phrases (60+ expressions)",
              "Conversation dialogues",
              "Leaderboard & full XP / level system",
              "Full gamification (streaks, badges)",
            ]}
            cta="Start Pro — ₩9,900/mo"
            href={proCta}
            highlighted={true}
          />
        </div>

        {!user && (
          <p className="mt-8 text-sm text-[#B0A8BB]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#9B7FE8] hover:underline">Log in</Link>
          </p>
        )}
      </section>
    </main>
  );
}
