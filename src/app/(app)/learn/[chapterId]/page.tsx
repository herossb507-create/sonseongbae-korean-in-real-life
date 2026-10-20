import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ReaderControls } from "@/components/reader/ReaderControls";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth";
import { ProGate } from "@/components/subscription/ProGate";

const FREE_CHAPTERS = new Set(["ch01", "ch02"]);

interface Props {
  params: { chapterId: string };
}

export default async function ChapterPage({ params }: Props) {
  const { chapterId } = params;

  const chapter = CHAPTER_CONTENT[chapterId];
  if (!chapter) notFound();

  // Auth check
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Pro check for non-free chapters
  const { isPro } = await getUserAccess();
  if (!FREE_CHAPTERS.has(chapterId) && !isPro) {
    return (
      <ProGate
        feature="This chapter is Pro"
        description="Chapters 3–16 require a Pro subscription. Upgrade to access all 16 chapters with full audio, vocabulary flashcards, and quizzes."
        backHref="/learn"
        backLabel="← Back to all chapters"
      />
    );
  }

  const chapterKeys = Object.keys(CHAPTER_CONTENT);
  const totalChapters = chapterKeys.length;
  const currentIndex = chapterKeys.indexOf(chapterId);
  const prevId = currentIndex > 0 ? chapterKeys[currentIndex - 1] : null;
  const nextId =
    currentIndex < totalChapters - 1 ? chapterKeys[currentIndex + 1] : null;
  const progress = Math.round(((currentIndex + 1) / totalChapters) * 100);

  return (
    <div className="min-h-screen bg-[#FFF5F8]">
      {/* ── Sticky top nav ── */}
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-[#F0E6EE] px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href="/learn"
          className="flex items-center gap-1.5 text-[#6B5F7A] hover:text-[#1E1225] text-sm font-medium transition-colors"
        >
          <span className="text-base">←</span>
          <span>Chapters</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#B0A8BB] font-medium">
            {currentIndex + 1} / {totalChapters}
          </span>
          <div className="hidden sm:block w-24 h-1.5 bg-[#FFE8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#9B7FE8] to-[#E8436F] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Link
          href={`/vocab/${chapterId}`}
          className="text-xs bg-[#9B7FE8]/20 text-[#9B7FE8] px-3 py-1.5 rounded-full font-medium hover:bg-[#9B7FE8]/30 transition-colors border border-[#9B7FE8]/30"
        >
          Vocab →
        </Link>
      </nav>

      {/* ── Chapter hero ── */}
      <div className="bg-gradient-to-br from-[#FFF0F5] via-[#FFFFFF] to-[#FFF5F8] border-b border-[#F0E6EE]">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#9B7FE8]/20 text-[#9B7FE8] text-xs font-bold px-2.5 py-1 rounded-full border border-[#9B7FE8]/30">
              Ch {chapter.num}
            </span>
            <span className="text-[#B0A8BB] text-xs">Reading</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight text-[#1E1225]">
            {chapter.title}
          </h1>
          <div className="flex items-center gap-3 text-[#B0A8BB] text-xs flex-wrap">
            <span className="flex items-center gap-1">📖 ~10 min read</span>
            {prevId && (
              <>
                <span>·</span>
                <Link
                  href={`/learn/${prevId}`}
                  className="hover:text-[#6B5F7A] transition-colors"
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
                  className="hover:text-[#6B5F7A] transition-colors"
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
        <div className="bg-white rounded-2xl border border-[#F0E6EE] p-6 sm:p-10 shadow-sm">
          <ReaderControls content={chapter.content} chapterId={chapterId} />
        </div>

        {/* ── Quick actions ── */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href={`/vocab/${chapterId}`}
            className="flex flex-col items-center justify-center gap-1.5 p-4 bg-[#9B7FE8]/10 rounded-xl border border-[#9B7FE8]/30 hover:bg-[#9B7FE8]/20 transition-all"
          >
            <span className="text-xl">📚</span>
            <span className="text-sm font-semibold text-[#9B7FE8]">Study Vocab</span>
            <span className="text-xs text-[#B0A8BB]">Flashcards</span>
          </Link>
          <Link
            href={`/quiz/${chapterId}`}
            className="flex flex-col items-center justify-center gap-1.5 p-4 bg-[#E8436F]/10 rounded-xl border border-[#E8436F]/30 hover:bg-[#E8436F]/20 transition-all"
          >
            <span className="text-xl">🧠</span>
            <span className="text-sm font-semibold text-[#E8436F]">Take Quiz</span>
            <span className="text-xs text-[#B0A8BB]">Test yourself</span>
          </Link>
        </div>

        {/* ── Bottom navigation ── */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            {prevId ? (
              <Link
                href={`/learn/${prevId}`}
                className="flex flex-col gap-1 p-4 bg-[#FFF5F8] rounded-xl border border-[#F0E6EE] hover:border-[#E8D5E0] hover:bg-[#FFF0F5] transition-all h-full"
              >
                <span className="text-xs text-[#B0A8BB]">← Previous</span>
                <span className="text-sm font-medium text-[#6B5F7A] line-clamp-2">
                  {CHAPTER_CONTENT[prevId].title}
                </span>
              </Link>
            ) : (
              <Link
                href="/learn"
                className="flex flex-col gap-1 p-4 bg-[#FFF5F8] rounded-xl border border-[#F0E6EE] hover:border-[#E8D5E0] transition-all h-full"
              >
                <span className="text-xs text-[#B0A8BB]">← Back</span>
                <span className="text-sm font-medium text-[#6B5F7A]">All Chapters</span>
              </Link>
            )}
          </div>

          <div>
            {nextId ? (
              <Link
                href={`/learn/${nextId}`}
                className="flex flex-col items-end gap-1 p-4 bg-gradient-to-br from-[#E8436F] to-[#F06B8A] rounded-xl hover:opacity-90 transition-all h-full"
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
                <span className="text-sm font-semibold text-[#1E1225]">All Chapters</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
