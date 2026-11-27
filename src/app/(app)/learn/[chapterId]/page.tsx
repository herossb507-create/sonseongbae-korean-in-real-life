import Link from "next/link";
import { notFound } from "next/navigation";
import { ReaderControls } from "@/components/reader/ReaderControls";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import { ChapterBookCTA } from "@/components/books/ChapterBookCTA";
import { chapterSummary, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/concerts/site";

interface Props {
  params: { chapterId: string };
}

export function generateMetadata({ params }: Props) {
  const chapter = CHAPTER_CONTENT[params.chapterId];
  if (!chapter) return {};
  return pageMeta({
    title: `Korean Lesson ${chapter.num}: ${chapter.title}`,
    description: `${chapterSummary(params.chapterId)}. Free Korean lesson with romanization, audio and culture notes.`,
    path: `/learn/${params.chapterId}`,
  });
}

export default function ChapterPage({ params }: Props) {
  const { chapterId } = params;

  const chapter = CHAPTER_CONTENT[chapterId];
  if (!chapter) notFound();

  const chapterKeys = Object.keys(CHAPTER_CONTENT);
  const totalChapters = chapterKeys.length;
  const currentIndex = chapterKeys.indexOf(chapterId);
  const prevId = currentIndex > 0 ? chapterKeys[currentIndex - 1] : null;
  const nextId =
    currentIndex < totalChapters - 1 ? chapterKeys[currentIndex + 1] : null;
  const progress = Math.round(((currentIndex + 1) / totalChapters) * 100);

  return (
    <div className="min-h-screen bg-[#F8F5FF]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LearningResource",
              name: `Korean Lesson ${chapter.num}: ${chapter.title}`,
              description: chapterSummary(chapterId),
              url: `${SITE_URL}/learn/${chapterId}`,
              inLanguage: "en",
              learningResourceType: "Lesson",
              educationalLevel: "Beginner",
              teaches: "Korean language",
              isAccessibleForFree: true,
              isPartOf: { "@type": "Course", name: "Korean in Real Life", url: `${SITE_URL}/learn` },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Learn Korean", item: `${SITE_URL}/learn` },
                { "@type": "ListItem", position: 2, name: chapter.title, item: `${SITE_URL}/learn/${chapterId}` },
              ],
            },
          ],
        }}
      />
      {/* ── Sticky top nav ── */}
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-[#EAE4F7] px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href="/learn"
          className="flex items-center gap-1.5 text-[#5A5475] hover:text-[#140F2D] text-sm font-medium transition-colors"
        >
          <span className="text-base">←</span>
          <span>Chapters</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9E98B8] font-medium">
            {currentIndex + 1} / {totalChapters}
          </span>
          <div className="hidden sm:block w-24 h-1.5 bg-[#F0E7FF] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#FF3D8B] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Link
          href={`/vocab/${chapterId}`}
          className="text-xs bg-[#7C5CFF]/20 text-[#7C5CFF] px-3 py-1.5 rounded-full font-medium hover:bg-[#7C5CFF]/30 transition-colors border border-[#7C5CFF]/30"
        >
          Vocab →
        </Link>
      </nav>

      {/* ── Chapter hero ── */}
      <div className="bg-gradient-to-br from-[#F2ECFF] via-[#FFFFFF] to-[#F8F5FF] border-b border-[#EAE4F7]">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#7C5CFF]/20 text-[#7C5CFF] text-xs font-bold px-2.5 py-1 rounded-full border border-[#7C5CFF]/30">
              Ch {chapter.num}
            </span>
            <span className="text-[#9E98B8] text-xs">Reading</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight text-[#140F2D]">
            {chapter.title}
          </h1>
          <div className="flex items-center gap-3 text-[#9E98B8] text-xs flex-wrap">
            <span className="flex items-center gap-1">📖 ~10 min read</span>
            {prevId && (
              <>
                <span>·</span>
                <Link
                  href={`/learn/${prevId}`}
                  className="hover:text-[#5A5475] transition-colors"
                >
                  ← {CHAPTER_CONTENT[prevId].title}
                </Link>
              </>
            )}
            {nextId && (
              <>
                <span>·</span>
                <Link
                  href={`/learn/${nextId}`}
                  className="hover:text-[#5A5475] transition-colors"
                >
                  {CHAPTER_CONTENT[nextId].title} →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-[#EAE4F7] p-6 sm:p-10 shadow-sm">
          <ReaderControls content={chapter.content} chapterId={chapterId} />
        </div>

        {/* ── Quick actions ── */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href={`/vocab/${chapterId}`}
            className="flex flex-col items-center justify-center gap-1.5 p-4 bg-[#7C5CFF]/10 rounded-xl border border-[#7C5CFF]/30 hover:bg-[#7C5CFF]/20 transition-all"
          >
            <span className="text-xl">📚</span>
            <span className="text-sm font-semibold text-[#7C5CFF]">Study Vocab</span>
            <span className="text-xs text-[#9E98B8]">Flashcards</span>
          </Link>
          <Link
            href={`/quiz/${chapterId}`}
            className="flex flex-col items-center justify-center gap-1.5 p-4 bg-[#FF3D8B]/10 rounded-xl border border-[#FF3D8B]/30 hover:bg-[#FF3D8B]/20 transition-all"
          >
            <span className="text-xl">🧠</span>
            <span className="text-sm font-semibold text-[#FF3D8B]">Take Quiz</span>
            <span className="text-xs text-[#9E98B8]">Test yourself</span>
          </Link>
        </div>

        {/* ── The book this chapter comes from ── */}
        <div className="mt-6">
          <ChapterBookCTA chapterId={chapterId} />
        </div>

        {/* ── Bottom navigation ── */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            {prevId ? (
              <Link
                href={`/learn/${prevId}`}
                className="flex flex-col gap-1 p-4 bg-[#F8F5FF] rounded-xl border border-[#EAE4F7] hover:border-[#DCD2F3] hover:bg-[#F2ECFF] transition-all h-full"
              >
                <span className="text-xs text-[#9E98B8]">← Previous</span>
                <span className="text-sm font-medium text-[#5A5475] line-clamp-2">
                  {CHAPTER_CONTENT[prevId].title}
                </span>
              </Link>
            ) : (
              <Link
                href="/learn"
                className="flex flex-col gap-1 p-4 bg-[#F8F5FF] rounded-xl border border-[#EAE4F7] hover:border-[#DCD2F3] transition-all h-full"
              >
                <span className="text-xs text-[#9E98B8]">← Back</span>
                <span className="text-sm font-medium text-[#5A5475]">All Chapters</span>
              </Link>
            )}
          </div>

          <div>
            {nextId ? (
              <Link
                href={`/learn/${nextId}`}
                className="flex flex-col items-end gap-1 p-4 bg-gradient-to-br from-[#FF3D8B] to-[#FF6FB1] rounded-xl hover:opacity-90 transition-all h-full"
              >
                <span className="text-xs text-white/60">Next →</span>
                <span className="text-sm font-semibold text-white text-right line-clamp-2">
                  {CHAPTER_CONTENT[nextId].title}
                </span>
              </Link>
            ) : (
              <Link
                href="/learn"
                className="flex flex-col items-end gap-1 p-4 bg-[#34C899]/20 rounded-xl border border-[#34C899]/30 hover:bg-[#34C899]/30 transition-all h-full"
              >
                <span className="text-xs text-[#34C899]">🎉 Done!</span>
                <span className="text-sm font-semibold text-[#140F2D]">All Chapters</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(CHAPTER_CONTENT).map((chapterId) => ({ chapterId }));
}
