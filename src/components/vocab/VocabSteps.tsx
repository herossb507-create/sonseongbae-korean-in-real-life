"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VocabCard } from "@/components/vocab/VocabCard";
import type { VocabItem } from "@/lib/vocab-data";

interface Props {
  chapterId: string;
  chapter: { num: number; title: string };
  allVocab: VocabItem[];
  step: number;
}

// ─── Step configuration ───────────────────────────────────────────────────────
const STEPS = [
  {
    step: 1,
    label: "Starter",
    emoji: "🌱",
    color: "green",
    description: "Core words — most common & essential",
    range: [0, 6] as [number, number],   // words 1–7
  },
  {
    step: 2,
    label: "Building",
    emoji: "🔥",
    color: "amber",
    description: "Expanding vocabulary — intermediate level",
    range: [7, 13] as [number, number],  // words 8–14
  },
  {
    step: 3,
    label: "Advanced",
    emoji: "⚡",
    color: "blue",
    description: "Full mastery — advanced & specific terms",
    range: [14, 19] as [number, number], // words 15–20
  },
];

// Tailwind color map (must be full strings for purge to keep them)
const stepColors: Record<
  string,
  { bg: string; border: string; text: string; badge: string; btn: string; btnHover: string }
> = {
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    badge: "bg-green-100 text-green-700",
    btn: "bg-green-600",
    btnHover: "hover:bg-green-700",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
    btn: "bg-amber-500",
    btnHover: "hover:bg-amber-600",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
    btn: "bg-blue-600",
    btnHover: "hover:bg-blue-700",
  },
};

/** Reads ?step= in the browser, so the page itself can be prerendered. */
export function VocabStepsFromUrl(props: Omit<Props, "step">) {
  const rawStep = parseInt(useSearchParams().get("step") ?? "1", 10);
  const step = isNaN(rawStep) || rawStep < 1 || rawStep > 3 ? 1 : rawStep;
  return <VocabSteps {...props} step={step} />;
}

export function VocabSteps({ chapterId, chapter, allVocab, step: stepNum }: Props) {

  const stepConfig = STEPS[stepNum - 1];
  const { range } = stepConfig;
  const stepWords = allVocab.slice(range[0], range[1] + 1);
  const colors = stepColors[stepConfig.color];

  const isLastStep = stepNum === 3;
  const nextStepNum = stepNum + 1;

  return (
    <main className="min-h-screen bg-[#F8F5FF]">
      {/* ── Top nav ── */}
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-[#EAE4F7] px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href={`/learn/${chapterId}`}
          className="flex items-center gap-1.5 text-[#5A5475] hover:text-[#140F2D] text-sm font-medium transition-colors"
        >
          <span>←</span>
          <span>Back to chapter</span>
        </Link>
        <span className="text-xs text-[#9E98B8] font-medium">
          Chapter {chapter.num} · Vocab
        </span>
        <Link
          href="/learn"
          className="text-xs text-[#5A5475] hover:text-[#140F2D] transition-colors"
        >
          All chapters
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Chapter title ── */}
        <div className="mb-6">
          <p className="text-xs text-[#9E98B8] font-medium uppercase tracking-wider mb-1">
            Chapter {chapter.num}
          </p>
          <h1 className="text-xl font-bold text-[#140F2D]">{chapter.title}</h1>
          <p className="text-sm text-[#5A5475] mt-0.5">
            20 words total · 3 difficulty steps · Click each card to flip
          </p>
        </div>

        {/* ── Step progress bar ── */}
        <div className="bg-white rounded-2xl border border-[#EAE4F7] p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-[#9E98B8] uppercase tracking-wider">
              Progress
            </span>
          </div>
          <div className="flex gap-2">
            {STEPS.map((s) => {
              const isActive = s.step === stepNum;
              const isDone = s.step < stepNum;
              const c = stepColors[s.color];
              return (
                <Link
                  key={s.step}
                  href={`/vocab/${chapterId}?step=${s.step}`}
                  className={`flex-1 rounded-xl border p-3 text-center transition-all ${
                    isActive
                      ? "bg-[#F0E7FF] border-[#EAE4F7]"
                      : isDone
                      ? "bg-[#F8F5FF] border-[#EAE4F7] opacity-70"
                      : "bg-[#F8F5FF] border-[#EAE4F7] opacity-50"
                  }`}
                >
                  <div className="text-lg mb-0.5">
                    {isDone ? "✅" : s.emoji}
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      isActive ? "text-[#140F2D]" : "text-[#9E98B8]"
                    }`}
                  >
                    Step {s.step}
                  </div>
                  <div
                    className={`text-xs mt-0.5 ${
                      isActive ? "text-[#5A5475]" : "text-[#9E98B8]"
                    }`}
                  >
                    {s.label}
                  </div>
                  <div className="text-xs text-[#9E98B8] mt-0.5">
                    {s.range[1] - s.range[0] + 1} words
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Current step header ── */}
        <div className="bg-white border border-[#EAE4F7] rounded-2xl p-4 mb-6 flex items-start gap-4 shadow-sm">
          <span className="text-3xl">{stepConfig.emoji}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A5475]">
                Step {stepNum} of 3
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#F0E7FF] text-[#FF3D8B]">
                {stepConfig.label}
              </span>
            </div>
            <p className="text-sm font-medium text-[#140F2D]">
              {stepConfig.description}
            </p>
            <p className="text-xs text-[#9E98B8] mt-0.5">
              Words {range[0] + 1}–{range[1] + 1} of 20
            </p>
          </div>
          <div className="shrink-0 text-center px-3 py-2 rounded-xl bg-[#F8F5FF] border border-[#EAE4F7]">
            <div className="text-lg font-bold text-[#140F2D]">{stepWords.length}</div>
            <div className="text-xs text-[#5A5475]">words</div>
          </div>
        </div>

        {/* ── Vocab cards ── */}
        <div className="space-y-4 mb-8">
          {stepWords.map((word, i) => (
            <div key={word.id} className="relative">
              {/* Word number badge */}
              <div className="absolute -left-2 -top-2 z-10 w-6 h-6 rounded-full bg-white border border-[#EAE4F7] flex items-center justify-center text-xs font-bold text-[#5A5475]">
                {range[0] + i + 1}
              </div>
              <VocabCard
                id={word.id}
                korean={word.korean}
                romanization={word.romanization}
                english={word.english}
                audioHint={word.audioHint}
              />
            </div>
          ))}
        </div>

        {/* ── Step completion CTA ── */}
        <div className="bg-white border border-[#EAE4F7] rounded-2xl p-6 text-center shadow-sm">
          {!isLastStep ? (
            <>
              <div className="text-2xl mb-2">{STEPS[stepNum].emoji}</div>
              <h2 className="text-base font-bold text-[#140F2D] mb-1">
                Ready for Step {nextStepNum}?
              </h2>
              <p className="text-sm text-[#5A5475] mb-5">
                {STEPS[nextStepNum - 1].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/vocab/${chapterId}?step=${stepNum}`}
                  className="text-sm border border-[#DCD2F3] text-[#5A5475] px-5 py-2.5 rounded-xl hover:bg-[#F8F5FF] transition-colors"
                >
                  ↺ Review Step {stepNum}
                </Link>
                <Link
                  href={`/vocab/${chapterId}?step=${nextStepNum}`}
                  className="text-sm bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Next: Step {nextStepNum} — {STEPS[nextStepNum - 1].label} →
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-lg font-bold text-[#140F2D] mb-1">
                All 20 words complete!
              </h2>
              <p className="text-sm text-[#5A5475] mb-5">
                You&apos;ve studied every word in Chapter {chapter.num}. Keep it up!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/vocab/${chapterId}?step=1`}
                  className="text-sm border border-[#DCD2F3] text-[#5A5475] px-5 py-2.5 rounded-xl hover:bg-[#F8F5FF] transition-colors"
                >
                  ↺ Review from Step 1
                </Link>
                <Link
                  href={`/learn/${chapterId}`}
                  className="text-sm border border-[#7C5CFF]/40 text-[#7C5CFF] px-5 py-2.5 rounded-xl hover:bg-[#7C5CFF]/10 transition-colors"
                >
                  📖 Re-read Chapter {chapter.num}
                </Link>
                <Link
                  href="/learn"
                  className="text-sm bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Next chapter →
                </Link>
              </div>
            </>
          )}
        </div>

        {/* ── Bottom nav ── */}
        <div className="mt-6 flex justify-between items-center text-sm text-[#9E98B8]">
          <Link
            href={`/learn/${chapterId}`}
            className="hover:text-[#5A5475] transition-colors"
          >
            ← Back to reading
          </Link>
          <div className="flex gap-1">
            {STEPS.map((s) => (
              <Link
                key={s.step}
                href={`/vocab/${chapterId}?step=${s.step}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  s.step === stepNum
                    ? "bg-[#FF3D8B]"
                    : "bg-[#EAE4F7] hover:bg-[#DCD2F3]"
                }`}
              />
            ))}
          </div>
          <Link href="/learn" className="hover:text-[#5A5475] transition-colors">
            All chapters →
          </Link>
        </div>
      </div>
    </main>
  );
}
