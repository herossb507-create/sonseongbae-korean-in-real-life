import Link from "next/link";
import { notFound } from "next/navigation";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import { CHAPTER_VOCAB } from "@/lib/vocab-data";
import { QuizSession } from "@/components/quiz/QuizSession";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: { chapterId: string };
}

export function generateMetadata({ params }: Props) {
  const chapter = CHAPTER_CONTENT[params.chapterId];
  if (!chapter) return {};
  return pageMeta({
    title: `Quiz: ${chapter.title}`,
    description: `Test your Korean from chapter ${chapter.num}, ${chapter.title}.`,
    path: `/quiz/${params.chapterId}`,
    noindex: true,
  });
}

export default function QuizPage({ params }: Props) {
  const { chapterId } = params;

  const chapter = CHAPTER_CONTENT[chapterId];
  if (!chapter) notFound();

  // Normalize key: vocab uses "ch01" style, chapterId might be "ch01-hangul" etc.
  const vocabKey = chapterId.split("-")[0]; // "ch01-hangul" → "ch01"
  const vocab = CHAPTER_VOCAB[vocabKey] ?? CHAPTER_VOCAB[chapterId] ?? [];

  if (vocab.length < 4) {
    return (
      <main className="min-h-screen bg-[#FFF5F8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[#6B5F7A]">Not enough vocabulary to generate a quiz.</p>
          <Link
            href={`/learn/${chapterId}`}
            className="text-[#9B7FE8] hover:underline text-sm"
          >
            ← Back to chapter
          </Link>
        </div>
      </main>
    );
  }

  // Build a larger pool for wrong answers from all chapters
  const allVocab = Object.values(CHAPTER_VOCAB).flat();

  return (
    <main className="min-h-screen bg-[#FFF5F8]">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-[#F0E6EE] px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href={`/learn/${chapterId}`}
          className="flex items-center gap-1.5 text-[#6B5F7A] hover:text-[#1E1225] text-sm font-medium transition-colors"
        >
          <span className="text-base">←</span>
          <span>Back to chapter</span>
        </Link>
        <span className="text-xs text-[#B0A8BB] font-medium">Chapter {chapter.num} Quiz</span>
        <Link
          href={`/vocab/${vocabKey}`}
          className="text-xs bg-[#9B7FE8]/20 text-[#9B7FE8] px-3 py-1.5 rounded-full font-medium hover:bg-[#9B7FE8]/30 transition-colors border border-[#9B7FE8]/30"
        >
          Vocab
        </Link>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#FFF0F5] via-[#FFFFFF] to-[#FFF5F8] border-b border-[#F0E6EE]">
        <div className="max-w-lg mx-auto px-6 py-8 text-center">
          <span className="inline-flex items-center gap-1.5 bg-[#E8436F]/20 text-[#E8436F] text-xs font-bold px-3 py-1 rounded-full border border-[#E8436F]/30 mb-3">
            🧠 Quiz
          </span>
          <h1 className="text-2xl font-bold text-[#1E1225] mb-1">{chapter.title}</h1>
          <p className="text-[#6B5F7A] text-sm">
            {Math.min(10, vocab.length)} questions · 4-choice
          </p>
        </div>
      </div>

      {/* Quiz */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <QuizSession chapterId={chapterId} vocab={vocab} allVocab={allVocab} />
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return Object.keys(CHAPTER_CONTENT).map((chapterId) => ({ chapterId }));
}
