import { notFound, redirect } from "next/navigation";
import { CHAPTER_CONTENT } from "@/lib/chapter-content";
import { CHAPTER_VOCAB } from "@/lib/vocab-data";
import MemoryMatch from "@/components/games/MemoryMatch";
import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth";
import { ProGate } from "@/components/subscription/ProGate";

interface PageProps {
  params: Promise<{ chapterId: string }>;
}

export default async function MemoryMatchPage({ params }: PageProps) {
  const { chapterId } = await params;

  const chapter = CHAPTER_CONTENT[chapterId];
  if (!chapter) return notFound();

  // Auth + Pro check
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { isPro } = await getUserAccess();
  if (!isPro) {
    return (
      <ProGate
        feature="Games are Pro"
        description="All games require a Pro subscription. Upgrade to play Memory Match, Listening Quiz, Speed Round, Sentence Builder, and Dictation."
        backHref="/games"
        backLabel="← Back to games"
      />
    );
  }

  const vocab = CHAPTER_VOCAB[chapterId];

  if (!vocab || vocab.length < 8) {
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
          <h1 className="text-xl font-bold mb-2" style={{ color: "#1E1225" }}>
            어휘가 충분하지 않습니다
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6B5F7A" }}>
            This chapter needs at least 8 vocabulary words to play Memory Match.
          </p>
          <a
            href="/games"
            className="inline-block rounded-xl px-6 py-3 font-semibold transition-all duration-200"
            style={{
              background: "linear-gradient(to right, #E8436F, #F06B8A)",
              color: "white",
            }}
          >
            Back to Games
          </a>
        </div>
      </div>
    );
  }

  return (
    <MemoryMatch
      chapterId={chapterId}
      vocab={vocab}
    />
  );
}

export function generateStaticParams() {
  return Object.keys(CHAPTER_CONTENT).map((chapterId) => ({ chapterId }));
}
