import Link from "next/link";

interface ProGateProps {
  feature: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

export function ProGate({
  feature,
  description,
  backHref = "/learn",
  backLabel = "← Back",
}: ProGateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FFF5F8" }}>
      <div className="max-w-md w-full">
        <div
          className="rounded-3xl p-8 text-center"
          style={{ background: "white", border: "1px solid rgba(240,230,238,1)", boxShadow: "0 8px 32px rgba(232,67,111,0.08)" }}
        >
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, #E8436F, #9B7FE8)" }}
          >
            <span className="text-3xl">👑</span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1E1225" }}>
            {feature}
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "#6B5F7A" }}>
            {description ??
              "Upgrade to Pro to unlock all 16 chapters, games, K-Drama phrases, conversation dialogues, leaderboard, and full gamification."}
          </p>

          {/* Pro benefits list */}
          <div
            className="rounded-2xl p-4 mb-6 text-left"
            style={{ background: "rgba(232,67,111,0.04)", border: "1px solid rgba(232,67,111,0.12)" }}
          >
            {[
              "📖 All 16 chapters with full TTS",
              "🎮 5 interactive games (Memory, Quiz, Speed...)",
              "🎬 K-Drama phrases & dialogues",
              "🔄 SRS spaced-repetition review",
              "🏆 Leaderboard & full XP system",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 py-1">
                <span className="text-xs font-semibold" style={{ color: "#E8436F" }}>✓</span>
                <span className="text-xs" style={{ color: "#6B5F7A" }}>{item}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/pricing"
            className="block w-full py-3 rounded-xl font-semibold text-white text-sm mb-3 transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(to right, #E8436F, #F06B8A)", boxShadow: "0 4px 16px rgba(232,67,111,0.3)" }}
          >
            Upgrade to Pro — from $7.99/mo
          </Link>
          <Link
            href={backHref}
            className="block w-full text-sm py-2 transition-colors"
            style={{ color: "#B0A8BB" }}
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
