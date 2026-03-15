// TODO: chapterId로 MD 파일 읽기 (하이브리드 방식: 본문은 MD, 어휘는 Supabase)
// TODO: 유료 챕터 접근 권한 체크 (Supabase subscriptions)

import Link from "next/link";
import { ChapterReader } from "@/components/ChapterReader";
import { PronunciationPlayer } from "@/components/PronunciationPlayer";

interface Props {
  params: { chapterId: string };
}

// 임시 데이터 — 실제로는 /10-manuscripts/{chapterId}.md 읽기
const MOCK_CHAPTER = {
  id: "ch01",
  num: 1,
  title: "Hangul — The Korean Alphabet",
  content: `
# Chapter 1: Hangul — The Korean Alphabet

Hangul (한글) is the writing system of the Korean language, created in 1443 by King Sejong the Great.

## Vowels (모음)

Korean has 10 basic vowels:

| Korean | Romanization | Sound |
|--------|-------------|-------|
| 아     | a           | "ah"  |
| 에     | e           | "eh"  |
| 이     | i           | "ee"  |
| 오     | o           | "oh"  |
| 우     | u           | "oo"  |

## Consonants (자음)

There are 14 basic consonants in Korean...
  `.trim(),
};

export default function ChapterPage({ params }: Props) {
  const { chapterId } = params;

  // TODO: chapterId로 실제 데이터 fetch
  const chapter = MOCK_CHAPTER;

  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b px-6 py-4 flex items-center gap-4">
        <Link href="/learn" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back to chapters
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-medium text-gray-700">
          Chapter {chapter.num}: {chapter.title}
        </span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* 발음 플레이어 — 선택한 텍스트나 단어 클릭 시 재생 */}
        <PronunciationPlayer />

        {/* 챕터 본문 */}
        <ChapterReader content={chapter.content} chapterId={chapterId} />

        {/* 챕터 하단 네비게이션 */}
        <div className="mt-12 pt-6 border-t flex justify-between">
          <Link href="/learn" className="text-sm text-gray-500 hover:text-gray-700">
            ← Chapter list
          </Link>
          <div className="flex gap-3">
            <Link
              href={`/vocab/${chapterId}`}
              className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Study vocab
            </Link>
            <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Mark complete ✓
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
