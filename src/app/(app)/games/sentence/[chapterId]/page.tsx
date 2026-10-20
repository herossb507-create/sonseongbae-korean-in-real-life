import { notFound } from "next/navigation";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import { CHAPTER_SENTENCES } from "@/lib/sentence-data";
import SentenceBuilder, { SentenceQuestion } from "@/components/games/SentenceBuilder";

interface PageProps {
  params: Promise<{ chapterId: string }>;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr];
  let hash = simpleHash(seed);
  for (let i = result.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(hash) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default async function SentencePage({ params }: PageProps) {
  const { chapterId } = await params;

  const chapter = CHAPTER_CONTENT[chapterId];
  if (!chapter) return notFound();

  const sentences = CHAPTER_SENTENCES[chapterId] ?? [];

  // Filter to only usable sentences (split >= 2 words)
  const usable = sentences.filter((s) => {
    const words = s.korean.split(" ");
    return words.length >= 2;
  });

  if (usable.length < 2) {
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
          <div className="text-4xl mb-4">📝</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "#1E1225" }}>
            이 챕터는 예문이 부족합니다
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6B5F7A" }}>
            This chapter does not have enough example sentences to play Sentence Builder.
          </p>
          <a
            href="/games"
            className="inline-block rounded-xl px-6 py-3 font-semibold transition-all duration-200"
            style={{
              background: "linear-gradient(to right, #34C899, #34D399)",
              color: "white",
            }}
          >
            Back to Games
          </a>
        </div>
      </div>
    );
  }

  // Deterministic shuffle using today's date as seed (prevents hydration mismatch)
  const todaySeed = new Date().toISOString().split("T")[0];
  const shuffledSentences = seededShuffle(usable, `${chapterId}-${todaySeed}`).slice(0, 10);

  const questions: SentenceQuestion[] = shuffledSentences.map((s) => {
    const words = s.korean.split(" ");
    const shuffledWords = seededShuffle(words, `${s.id}-${todaySeed}`);
    return {
      id: s.id,
      korean: s.korean,
      english: s.english,
      words,
      shuffled: shuffledWords,
    };
  });

  return (
    <SentenceBuilder
      chapterId={chapterId}
      questions={questions}
    />
  );
}

export function generateStaticParams() {
  return Object.keys(CHAPTER_CONTENT).map((chapterId) => ({ chapterId }));
}
