import { notFound } from "next/navigation";
import Link from "next/link";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import { CHAPTER_VOCAB } from "@/lib/vocab-data";
import SpeedRound from "@/components/games/SpeedRound";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Korean Speed Round Game",
  description: "Practice Korean vocabulary with Speed Round.",
  path: "/games",
  noindex: true,
});

interface PageProps {
  params: Promise<{ chapterId: string }>;
}

export default async function SpeedRoundPage({ params }: PageProps) {
  const { chapterId } = await params;

  const chapter = CHAPTER_CONTENT[chapterId];
  if (!chapter) return notFound();

  const vocab = CHAPTER_VOCAB[chapterId];

  if (!vocab || vocab.length < 4) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8"
        style={{ background: "#FFF5F8" }}
      >
        <div
          className="rounded-2xl p-8 text-center max-w-md shadow-sm"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(232,67,111,0.10)",
          }}
        >
          <div className="text-4xl mb-4">⚡</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "#1E1225" }}>
            Not Enough Vocabulary
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6B5F7A" }}>
            This chapter needs at least 4 vocabulary words to play Speed Round.
          </p>
          <Link
            href="/games"
            className="inline-block rounded-xl px-6 py-3 font-semibold transition-all duration-200"
            style={{
              background: "linear-gradient(to right, #F4A261, #F59E0B)",
              color: "#1E1225",
            }}
          >
            Back to Games
          </Link>
        </div>
      </div>
    );
  }

  // Build a larger pool for wrong answers from all chapters
  const allVocab = Object.values(CHAPTER_VOCAB).flat();

  return (
    <main className="min-h-screen" style={{ background: "#FFF5F8" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-10 px-4 sm:px-6 py-3 flex items-center justify-between"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(240,230,238,1)",
        }}
      >
        <Link
          href="/games"
          className="flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: "#6B5F7A" }}
        >
          <span>←</span>
          <span>Games</span>
        </Link>
        <span className="text-xs font-medium" style={{ color: "#B0A8BB" }}>
          Chapter {chapter.num} · Speed Round
        </span>
        <Link
          href={`/vocab/${chapterId}`}
          className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
          style={{
            background: "rgba(244,162,97,0.1)",
            color: "#F4A261",
            border: "1px solid rgba(244,162,97,0.3)",
          }}
        >
          Vocab
        </Link>
      </nav>

      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #FFF5F0 0%, #FFFAF5 30%, #FFFFFF 60%, #FFF5F8 100%)",
          borderBottom: "1px solid rgba(240,230,238,1)",
        }}
      >
        <div className="max-w-lg mx-auto px-6 py-8 text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-3"
            style={{
              background: "rgba(244,162,97,0.15)",
              color: "#F4A261",
              border: "1px solid rgba(244,162,97,0.3)",
            }}
          >
            ⚡ Speed Round
          </span>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#1E1225" }}>
            {chapter.title}
          </h1>
          <p className="text-sm" style={{ color: "#6B5F7A" }}>
            {vocab.length} words · 60 seconds · answer as many as you can!
          </p>
        </div>
      </div>

      {/* Game */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <SpeedRound chapterId={chapterId} vocab={vocab} allVocab={allVocab} />
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return Object.keys(CHAPTER_CONTENT).map((chapterId) => ({ chapterId }));
}
