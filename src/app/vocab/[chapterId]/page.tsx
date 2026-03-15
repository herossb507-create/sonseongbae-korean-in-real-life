// TODO: Supabase vocabulary 테이블에서 chapterId에 해당하는 단어 목록 fetch
// TODO: user_vocab_stats 연동 (아는 단어 체크)

import Link from "next/link";
import { VocabCard } from "@/components/VocabCard";

interface Props {
  params: { chapterId: string };
}

// 임시 어휘 데이터 — 실제는 Supabase에서 fetch
const MOCK_VOCAB = [
  { id: "v1", korean: "안녕하세요", romanization: "annyeonghaseyo", english: "Hello (formal)", audioHint: "안녕하세요" },
  { id: "v2", korean: "감사합니다", romanization: "gamsahamnida", english: "Thank you (formal)", audioHint: "감사합니다" },
  { id: "v3", korean: "네", romanization: "ne", english: "Yes", audioHint: "네" },
  { id: "v4", korean: "아니요", romanization: "aniyo", english: "No", audioHint: "아니요" },
  { id: "v5", korean: "괜찮아요", romanization: "gwaenchanayo", english: "It's okay / I'm fine", audioHint: "괜찮아요" },
];

export default function VocabPage({ params }: Props) {
  const { chapterId } = params;

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Link href={`/learn/${chapterId}`} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back to chapter
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-medium text-gray-700">Vocabulary — {chapterId}</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Flashcards</h1>
            <p className="text-gray-500 text-sm mt-1">{MOCK_VOCAB.length} words · Click to flip</p>
          </div>
          <div className="text-sm text-gray-500 bg-white border rounded-lg px-3 py-1.5">
            0 / {MOCK_VOCAB.length} known
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_VOCAB.map((word) => (
            <VocabCard
              key={word.id}
              id={word.id}
              korean={word.korean}
              romanization={word.romanization}
              english={word.english}
              audioHint={word.audioHint}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
