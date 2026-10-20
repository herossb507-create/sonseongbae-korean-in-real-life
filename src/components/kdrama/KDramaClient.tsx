"use client";

import { useState, useMemo } from "react";
import { speakKorean } from "@/lib/tts";
import type { KDramaPhrase } from "@/lib/kdrama-phrases";

interface Category {
  id: string;
  label: string;
  emoji: string;
}

interface KDramaClientProps {
  phrases: KDramaPhrase[];
  categories: Category[];
}

const CATEGORY_COLORS: Record<string, string> = {
  romance: "#E8436F",
  friendship: "#9B7FE8",
  drama: "#F59E0B",
  motivation: "#10B981",
  daily: "#8B5CF6",
  funny: "#EC4899",
};

const LEVEL_BADGE: Record<string, string> = {
  beginner: "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30",
  intermediate: "bg-amber-500/20 text-amber-600 border border-amber-500/30",
};

export default function KDramaClient({ phrases, categories }: KDramaClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filteredPhrases = useMemo(() => {
    let result = phrases;

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.korean.includes(searchQuery) ||
          p.english.toLowerCase().includes(q) ||
          (p.drama && p.drama.toLowerCase().includes(q)) ||
          p.romanization.toLowerCase().includes(q)
      );
    }

    return result;
  }, [phrases, selectedCategory, searchQuery]);

  function handleSpeak(phrase: KDramaPhrase) {
    setPlayingId(phrase.id);
    speakKorean(phrase.korean);
    setTimeout(() => setPlayingId(null), 2000);
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFF5F8" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🎬</span>
            <div>
              <h1 className="text-3xl font-black" style={{ color: "#1E1225" }}>
                K-Drama Phrases
              </h1>
              <p className="text-sm font-medium" style={{ color: "#E8436F" }}>
                Learn Korean the fun way
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm" style={{ color: "#6B5F7A" }}>
            Discover expressions you&apos;ll hear in K-Dramas and movies. Click
            the 🔊 button to hear native pronunciation.
          </p>
        </div>

        {/* Category Filter — full-bleed so last button never gets clipped */}
        <div className="-mx-4 mb-5">
          <div className="flex gap-2 overflow-x-auto py-2 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200"
                style={
                  selectedCategory === cat.id
                    ? {
                        background: "#E8436F",
                        color: "white",
                        borderColor: "#E8436F",
                      }
                    : {
                        background: "rgba(255,255,255,0.8)",
                        color: "#6B5F7A",
                        borderColor: "rgba(240,230,238,1)",
                      }
                }
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
            {/* right-edge spacer: ensures last button is fully visible when scrolled */}
            <div className="shrink-0 w-4" />
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search phrases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#E8436F]/20 focus:border-[#E8436F]"
            style={{
              background: "white",
              border: "1px solid rgba(240,230,238,1)",
              color: "#1E1225",
            }}
          />
        </div>

        {/* Results count */}
        <div className="mb-4 text-xs" style={{ color: "#B0A8BB" }}>
          {filteredPhrases.length} phrase{filteredPhrases.length !== 1 ? "s" : ""}
        </div>

        {/* Phrases Grid */}
        {filteredPhrases.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{
              background: "rgba(240,230,238,0.5)",
              border: "1px solid rgba(240,230,238,1)",
            }}
          >
            <p className="text-2xl mb-2">🔍</p>
            <p style={{ color: "#6B5F7A" }}>No phrases found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPhrases.map((phrase) => {
              const catColor = CATEGORY_COLORS[phrase.category] ?? "#6B5F7A";
              return (
                <div
                  key={phrase.id}
                  className="relative rounded-2xl p-4 transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    background: "#FFFFFF",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(240,230,238,1)",
                    boxShadow: "0 4px 16px rgba(232,67,111,0.08)",
                  }}
                >
                  {/* TTS button — top right */}
                  <button
                    onClick={() => handleSpeak(phrase)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200 hover:scale-110 active:scale-95"
                    style={{
                      background:
                        playingId === phrase.id
                          ? "#E8436F"
                          : "rgba(232,67,111,0.10)",
                      border: "1px solid rgba(232,67,111,0.20)",
                    }}
                    title="Play pronunciation"
                  >
                    🔊
                  </button>

                  {/* Korean text */}
                  <p
                    className="text-2xl font-bold mb-1 pr-10 font-noto-kr"
                    style={{ color: "#1E1225" }}
                  >
                    {phrase.korean}
                  </p>

                  {/* Romanization */}
                  <p className="text-sm mb-1" style={{ color: "#6B5F7A" }}>
                    {phrase.romanization}
                  </p>

                  {/* English */}
                  <p className="text-sm mb-3" style={{ color: "#6B5F7A" }}>
                    &ldquo;{phrase.english}&rdquo;
                  </p>

                  {/* Footer row: drama source + badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category badge */}
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: `${catColor}18`,
                        color: catColor,
                        border: `1px solid ${catColor}35`,
                      }}
                    >
                      {phrase.category === "romance" && "💕 Romance"}
                      {phrase.category === "friendship" && "👫 Friendship"}
                      {phrase.category === "drama" && "😤 Drama"}
                      {phrase.category === "motivation" && "🌟 Motivation"}
                      {phrase.category === "daily" && "☕ Daily"}
                      {phrase.category === "funny" && "😂 Funny"}
                    </span>

                    {/* Level badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${LEVEL_BADGE[phrase.level]}`}
                    >
                      {phrase.level}
                    </span>

                    {/* Drama source */}
                    {phrase.drama && (
                      <span className="text-xs" style={{ color: "#F4A261" }}>
                        📺 {phrase.drama}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer tip */}
        <div
          className="mt-10 rounded-2xl p-5 text-center"
          style={{
            background: "rgba(232,67,111,0.05)",
            border: "1px solid rgba(232,67,111,0.15)",
          }}
        >
          <p className="text-sm" style={{ color: "#6B5F7A" }}>
            <span style={{ color: "#E8436F" }}>💡 Tip:</span> Try using these
            phrases while watching K-Dramas to reinforce your memory!
          </p>
        </div>
      </div>
    </div>
  );
}
