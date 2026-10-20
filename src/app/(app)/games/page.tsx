import Link from "next/link";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import { CHAPTER_VOCAB } from "@/lib/vocab-data";
import { CHAPTER_SENTENCES } from "@/lib/sentence-data";

const CHAPTER_EMOJI: Record<string, string> = {
  ch01: "🔤",
  ch02: "📝",
  ch03: "🔢",
  ch04: "⏰",
  ch05: "🍜",
  ch06: "🛍️",
  ch07: "🗺️",
  ch08: "👨‍👩‍👧",
  ch09: "💼",
  ch10: "🏥",
  ch11: "🌤️",
  ch12: "🎵",
  ch13: "✈️",
  ch14: "🎎",
  ch15: "📱",
  ch16: "💬",
};

export default function GamesPage() {
  const chapters = Object.values(CHAPTER_CONTENT).sort((a, b) => a.num - b.num);

  function hasSentences(slug: string): boolean {
    const sentences = CHAPTER_SENTENCES[slug] ?? [];
    return sentences.filter((s) => s.korean.split(" ").length >= 2).length >= 2;
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFF5F8" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🎮</span>
            <h1 className="text-3xl font-black" style={{ color: "#1E1225" }}>
              Games
            </h1>
          </div>
          <p style={{ color: "#6B5F7A" }}>
            Reinforce your Korean vocabulary through fun, interactive games.
            Pick a chapter and start playing!
          </p>
        </div>

        {/* Game Type Banners */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            {
              emoji: "🃏",
              title: "Memory Match",
              desc: "Flip cards to match Korean words with English meanings.",
              bg: "linear-gradient(135deg, rgba(155,127,232,0.15) 0%, rgba(232,67,111,0.1) 100%)",
              border: "rgba(155,127,232,0.3)",
              iconBg: "rgba(155,127,232,0.2)",
            },
            {
              emoji: "🔊",
              title: "Listening Quiz",
              desc: "Hear the Korean word and pick the correct English meaning.",
              bg: "linear-gradient(135deg, rgba(232,67,111,0.15) 0%, rgba(240,107,138,0.1) 100%)",
              border: "rgba(232,67,111,0.3)",
              iconBg: "rgba(232,67,111,0.2)",
            },
            {
              emoji: "⚡",
              title: "Speed Round",
              desc: "60-second blitz — answer as many words as you can!",
              bg: "linear-gradient(135deg, rgba(244,162,97,0.15) 0%, rgba(245,158,11,0.1) 100%)",
              border: "rgba(244,162,97,0.3)",
              iconBg: "rgba(244,162,97,0.2)",
            },
            {
              emoji: "📝",
              title: "Sentence Builder",
              desc: "Rearrange Korean word blocks into the correct sentence order.",
              bg: "linear-gradient(135deg, rgba(52,200,153,0.15) 0%, rgba(52,211,153,0.1) 100%)",
              border: "rgba(52,200,153,0.3)",
              iconBg: "rgba(52,200,153,0.2)",
            },
            {
              emoji: "🎧",
              title: "Dictation",
              desc: "Hear Korean words and type exactly what you hear.",
              bg: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(167,139,250,0.1) 100%)",
              border: "rgba(139,92,246,0.3)",
              iconBg: "rgba(139,92,246,0.2)",
            },
          ].map((game) => (
            <div
              key={game.title}
              className="rounded-2xl p-5 flex flex-col items-center text-center gap-3"
              style={{ background: game.bg, border: `1px solid ${game.border}` }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: game.iconBg }}
              >
                {game.emoji}
              </div>
              <div>
                <h2 className="font-bold text-sm mb-1" style={{ color: "#1E1225" }}>
                  {game.title}
                </h2>
                <p className="text-xs leading-relaxed" style={{ color: "#6B5F7A" }}>
                  {game.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chapter Grid */}
        <h2 className="text-lg font-bold mb-4" style={{ color: "#1E1225" }}>
          Choose a Chapter
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter) => {
            const vocabCount = CHAPTER_VOCAB[chapter.slug]?.length ?? 0;
            const hasEnoughVocab = vocabCount >= 8;
            const hasSentenceGame = hasSentences(chapter.slug);
            const emoji = CHAPTER_EMOJI[chapter.slug] ?? "📖";

            return (
              <div
                key={chapter.slug}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: "rgba(232,67,111,0.04)",
                  border: "1px solid rgba(232,67,111,0.10)",
                  opacity: hasEnoughVocab ? 1 : 0.5,
                }}
              >
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-xs font-medium mb-0.5"
                        style={{ color: "#6B5F7A" }}
                      >
                        Chapter {chapter.num}
                      </div>
                      <h3
                        className="font-bold text-sm leading-tight"
                        style={{ color: "#1E1225" }}
                      >
                        {chapter.title}
                      </h3>
                    </div>
                  </div>

                  <div
                    className="text-xs mb-4"
                    style={{ color: "#6B5F7A" }}
                  >
                    {vocabCount} vocabulary words
                  </div>

                  {hasEnoughVocab ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/games/memory/${chapter.slug}`}
                        className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background:
                            "linear-gradient(to right, #9B7FE8, #B99BFF)",
                          color: "white",
                          boxShadow: "0 4px 16px rgba(155,127,232,0.3)",
                        }}
                      >
                        <span>🃏</span>
                        <span>Memory Match</span>
                      </Link>
                      <Link
                        href={`/games/listening/${chapter.slug}`}
                        className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background:
                            "linear-gradient(to right, #E8436F, #F06B8A)",
                          color: "white",
                          boxShadow: "0 4px 16px rgba(232,67,111,0.3)",
                        }}
                      >
                        <span>🔊</span>
                        <span>Listening Quiz</span>
                      </Link>
                      <Link
                        href={`/games/speed/${chapter.slug}`}
                        className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background:
                            "linear-gradient(to right, #F4A261, #F59E0B)",
                          color: "#1E1225",
                          boxShadow: "0 4px 16px rgba(244,162,97,0.25)",
                        }}
                      >
                        <span>⚡</span>
                        <span>Speed Round</span>
                      </Link>
                      {hasSentenceGame && (
                        <Link
                          href={`/games/sentence/${chapter.slug}`}
                          className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                          style={{
                            background: "rgba(52,200,153,0.1)",
                            border: "1px solid rgba(52,200,153,0.3)",
                            color: "#34C899",
                          }}
                        >
                          <span>📝</span>
                          <span>Sentence Builder</span>
                        </Link>
                      )}
                      <Link
                        href={`/games/dictation/${chapter.slug}`}
                        className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background: "rgba(139,92,246,0.1)",
                          border: "1px solid rgba(139,92,246,0.3)",
                          color: "#8B5CF6",
                        }}
                      >
                        <span>🎧</span>
                        <span>Dictation</span>
                      </Link>
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-semibold"
                      style={{
                        background: "rgba(232,67,111,0.05)",
                        color: "#B0A8BB",
                        cursor: "not-allowed",
                      }}
                    >
                      <span>🔒</span>
                      <span>Not enough vocab</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div
          className="mt-10 rounded-2xl p-5 text-center"
          style={{
            background: "rgba(244,162,97,0.05)",
            border: "1px solid rgba(244,162,97,0.15)",
          }}
        >
          <p className="text-sm" style={{ color: "#6B5F7A" }}>
            <span style={{ color: "#F4A261" }}>💡 Tip:</span> Complete games to
            earn XP and level up your Korean learning journey!
          </p>
        </div>
      </div>
    </div>
  );
}
