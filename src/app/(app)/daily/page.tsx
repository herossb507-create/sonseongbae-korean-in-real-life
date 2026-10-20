import { getDailyVocab, getTodayString } from "@/lib/daily-challenge";
import { CHAPTER_VOCAB } from "@/lib/vocab-data";
import { DailyChallenge } from "@/components/games/DailyChallenge";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Daily Korean Challenge — 10 New Questions Every Day",
  description: "A free daily Korean vocabulary quiz: 10 new questions every day, the same for every learner worldwide.",
  path: "/daily",
});

export default function DailyChallengePage() {
  const todayStr = getTodayString();
  const allVocab = Object.values(CHAPTER_VOCAB).flat();
  const dailyVocab = getDailyVocab(todayStr, allVocab);

  return (
    <div className="min-h-screen bg-[#FFF5F8] py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#F4A261]/10 border border-[#F4A261]/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[#F4A261] text-xs font-semibold uppercase tracking-widest">
              🔥 Daily Challenge
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#1E1225] mb-2">
            Today&apos;s Korean Challenge
          </h1>
          <p className="text-[#6B5F7A] text-sm">
            10 questions · same for every learner · resets at midnight
          </p>
          <p className="text-[#B0A8BB] text-xs mt-1">{todayStr}</p>
        </div>

        {/* Quiz card */}
        <div className="bg-white backdrop-blur-lg border border-[#F0E6EE] rounded-2xl p-6 shadow-[0_4px_16px_rgba(232,67,111,0.12)]">
          <DailyChallenge
            initialVocab={dailyVocab}
            allVocab={allVocab}
            todayStr={todayStr}
          />
        </div>
      </div>
    </div>
  );
}
