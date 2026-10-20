import Link from "next/link";
import { redirect } from "next/navigation";
import { DIALOGUE_SCENARIOS } from "@/lib/dialogue-data";
import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth";
import { ProGate } from "@/components/subscription/ProGate";

export const metadata = {
  title: "Conversation Dialogues | Korean in Real Life",
  description: "Practice real-life Korean conversations across everyday scenarios.",
};

const DIFFICULTY_BADGE: Record<string, { label: string; style: React.CSSProperties }> = {
  beginner: {
    label: "Beginner",
    style: {
      background: "rgba(52,200,153,0.15)",
      color: "#34C899",
      border: "1px solid rgba(52,200,153,0.3)",
    },
  },
  intermediate: {
    label: "Intermediate",
    style: {
      background: "rgba(245,158,11,0.15)",
      color: "#F59E0B",
      border: "1px solid rgba(245,158,11,0.3)",
    },
  },
};

export default async function DialoguesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { isPro } = await getUserAccess();
  if (!isPro) {
    return (
      <ProGate
        feature="Conversation Dialogues is Pro"
        description="Practice real-life Korean conversations across everyday scenarios. Upgrade to Pro to unlock this feature."
        backHref="/dashboard"
        backLabel="← Back to dashboard"
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFF5F8" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">💬</span>
            <div>
              <h1 className="text-3xl font-black" style={{ color: "#1E1225" }}>
                Conversation Dialogues
              </h1>
              <p className="text-sm font-medium" style={{ color: "#9B7FE8" }}>
                대화 시나리오
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm" style={{ color: "#6B5F7A" }}>
            Practice realistic Korean conversations for everyday situations. Each
            scenario includes pronunciation playback and romanization support.
          </p>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIALOGUE_SCENARIOS.map((scenario) => {
            const badge = DIFFICULTY_BADGE[scenario.difficulty];
            return (
              <Link
                key={scenario.id}
                href={`/dialogues/${scenario.id}`}
                className="group block rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                style={{
                  background: "#FFFFFF",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(240,230,238,1)",
                  boxShadow: "0 4px 16px rgba(232,67,111,0.08)",
                }}
              >
                {/* Emoji */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3"
                  style={{ background: "rgba(155,127,232,0.15)" }}
                >
                  {scenario.emoji}
                </div>

                {/* Korean title */}
                <p
                  className="text-xs font-medium mb-0.5 font-noto-kr"
                  style={{ color: "#6B5F7A" }}
                >
                  {scenario.titleKo}
                </p>

                {/* English title */}
                <h2
                  className="font-bold text-base mb-1 group-hover:text-[#E8436F] transition-colors"
                  style={{ color: "#1E1225" }}
                >
                  {scenario.title}
                </h2>

                {/* Setting */}
                <p className="text-xs mb-3" style={{ color: "#B0A8BB" }}>
                  {scenario.setting}
                </p>

                {/* Footer row */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={badge.style}
                  >
                    {badge.label}
                  </span>
                  <span className="text-xs" style={{ color: "#B0A8BB" }}>
                    {scenario.lines.length} lines →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer tip */}
        <div
          className="mt-10 rounded-2xl p-5 text-center"
          style={{
            background: "rgba(155,127,232,0.05)",
            border: "1px solid rgba(155,127,232,0.15)",
          }}
        >
          <p className="text-sm" style={{ color: "#6B5F7A" }}>
            <span style={{ color: "#9B7FE8" }}>💡 Tip:</span> Use the{" "}
            <strong style={{ color: "#1E1225" }}>Play All</strong> button inside
            each scenario to listen to the full conversation in sequence.
          </p>
        </div>
      </div>
    </div>
  );
}
