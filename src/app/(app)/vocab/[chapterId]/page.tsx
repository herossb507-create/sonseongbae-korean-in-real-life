import { Suspense } from "react";
import { notFound } from "next/navigation";
import { VocabSteps, VocabStepsFromUrl } from "@/components/vocab/VocabSteps";
import { CHAPTER_VOCAB } from "@/lib/vocab-data";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";

interface Props {
  params: { chapterId: string };
}

export function generateStaticParams() {
  return Object.keys(CHAPTER_VOCAB)
    .filter((chapterId) => CHAPTER_CONTENT[chapterId])
    .map((chapterId) => ({ chapterId }));
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
