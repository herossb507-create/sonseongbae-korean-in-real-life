import { notFound } from "next/navigation";
import Link from "next/link";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import { CHAPTER_VOCAB } from "@/lib/vocab-data";
import ListeningQuiz from "@/components/games/ListeningQuiz";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Korean Listening Quiz Game",
  description: "Practice Korean vocabulary with Listening Quiz.",
  path: "/games",
  noindex: true,
});

interface PageProps {
  params: Promise<{ chapterId: string }>;
}

export default async function ListeningQuizPage({ params }: PageProps) {
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
          <div className="text-4xl mb-4">🔊</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "#1E1225" }}>
            Not Enough Vocabulary
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6B5F7A" }}>
            This chapter needs at least 4 vocabulary words to play the
            Listening Quiz.
          </p>
          <Link
            href="/games"
            className="inline-block rounded-xl px-6 py-3 font-semibold transition-all duration-200"
            style={{
              background: "linear-gradient(to right, #E8436F, #F06B8A)",
              color: "white",
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
          Chapter {chapter.num} · Listening Quiz
        </span>
        <Link
          href={`/vocab/${chapterId}`}
          className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
          style={{
            background: "rgba(155,127,232,0.15)",
            color: "#9B7FE8",
            border: "1px solid rgba(155,127,232,0.3)",
          }}
        >
          Vocab
        </Link>
      </nav>

      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #FFF0F5 0%, #FFFFFF 60%, #FFF5F8 100%)",
          borderBottom: "1px solid rgba(240,230,238,1)",
        }}
      >
        <div className="max-w-lg mx-auto px-6 py-8 text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-3"
            style={{
              background: "rgba(232,67,111,0.15)",
              color: "#E8436F",
              border: "1px solid rgba(232,67,111,0.3)",
            }}
          >
            🔊 Listening Quiz
          </span>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#1E1225" }}>
            {chapter.title}
          </h1>
          <p className="text-sm" style={{ color: "#6B5F7A" }}>
            {Math.min(10, vocab.length)} questions · Listen &amp; choose
          </p>
        </div>
      </div>

      {/* Quiz */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <ListeningQuiz chapterId={chapterId} vocab={vocab} allVocab={allVocab} />
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return Object.keys(CHAPTER_CONTENT).map((chapterId) => ({ chapterId }));
}
