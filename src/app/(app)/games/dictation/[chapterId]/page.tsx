import { notFound } from "next/navigation";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import { CHAPTER_VOCAB } from "@/lib/vocab-data";
import DictationGame from "@/components/games/DictationGame";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Korean Dictation Game",
  description: "Practice Korean vocabulary with Dictation.",
  path: "/games",
  noindex: true,
});

interface PageProps {
  params: Promise<{ chapterId: string }>;
}

export function generateStaticParams() {
  return Object.keys(CHAPTER_CONTENT).map((chapterId) => ({ chapterId }));
}

export default async function DictationPage({ params }: PageProps) {
  const { chapterId } = await params;

  const chapter = CHAPTER_CONTENT[chapterId];
  if (!chapter) return notFound();

  const vocab = CHAPTER_VOCAB[chapterId] ?? [];

  if (vocab.length < 3) {
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
          <div className="text-4xl mb-4">📚</div>
          <h1
            className="text-xl font-bold mb-2 font-noto-kr"
            style={{ color: "#1E1225" }}
          >
            이 챕터는 어휘가 부족합니다
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6B5F7A" }}>
            This chapter needs at least 3 vocabulary words to play Dictation.
          </p>
          <a
            href="/games"
            className="inline-block rounded-xl px-6 py-3 font-semibold transition-all duration-200"
            style={{
              background: "linear-gradient(to right, #8B5CF6, #A78BFA)",
              color: "white",
            }}
          >
            Back to Games
          </a>
        </div>
      </div>
    );
  }

  const questions = vocab.slice(0, 10).map((v) => ({
    id: v.id,
    audio: v.audioHint || v.korean,
    answer: v.korean,
    hint: v.english,
    romanization: v.romanization,
  }));

  return (
    <div className="min-h-screen" style={{ background: "#FFF5F8" }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <a
              href="/games"
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: "#6B5F7A" }}
            >
              Games
            </a>
            <span style={{ color: "#B0A8BB" }}>/</span>
            <span className="text-sm" style={{ color: "#6B5F7A" }}>
              Dictation
            </span>
            <span style={{ color: "#B0A8BB" }}>/</span>
            <span className="text-sm" style={{ color: "#1E1225" }}>
              Ch{String(chapter.num).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "rgba(139,92,246,0.2)" }}
            >
              🎧
            </div>
            <div>
              <h1 className="text-2xl font-black" style={{ color: "#1E1225" }}>
                Dictation
              </h1>
              <p className="text-sm" style={{ color: "#6B5F7A" }}>
                {chapter.title}
              </p>
            </div>
          </div>
        </div>

        {/* Game card */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            background: "rgba(232,67,111,0.04)",
            border: "1px solid rgba(232,67,111,0.10)",
          }}
        >
          <DictationGame
            chapterId={chapterId}
            questions={questions}
            mode="word"
          />
        </div>
      </div>
    </div>
  );
}
