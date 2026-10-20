import { Suspense } from "react";
import { notFound } from "next/navigation";
import { VocabSteps, VocabStepsFromUrl } from "@/components/vocab/VocabSteps";
import { CHAPTER_VOCAB } from "@/lib/vocab-data";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: { chapterId: string };
}

export function generateStaticParams() {
  return Object.keys(CHAPTER_VOCAB)
    .filter((chapterId) => CHAPTER_CONTENT[chapterId])
    .map((chapterId) => ({ chapterId }));
}

export function generateMetadata({ params }: Props) {
  const chapter = CHAPTER_CONTENT[params.chapterId];
  const words = CHAPTER_VOCAB[params.chapterId] ?? [];
  if (!chapter) return {};
  return pageMeta({
    title: `${words.length} Korean Words: ${chapter.title} — Flashcards`,
    description: `Korean vocabulary for ${chapter.title}: ${words
      .slice(0, 5)
      .map((w) => `${w.korean} (${w.english})`)
      .join(", ")} and more, with pronunciation audio.`,
    path: `/vocab/${params.chapterId}`,
  });
}

export default function VocabPage({ params }: Props) {
  const { chapterId } = params;
  const allVocab = CHAPTER_VOCAB[chapterId];
  const chapter = CHAPTER_CONTENT[chapterId];
  if (!allVocab || !chapter) notFound();

  const props = { chapterId, chapter: { num: chapter.num, title: chapter.title }, allVocab };
  // Step 1 is prerendered; ?step=2 or 3 switches after the page loads.
  return (
    <Suspense fallback={<VocabSteps {...props} step={1} />}>
      <VocabStepsFromUrl {...props} />
    </Suspense>
  );
}
