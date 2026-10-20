"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { speakKorean } from "@/lib/tts";
import type { DialogueScenario } from "@/lib/dialogue-data";

interface DialogueViewerProps {
  scenario: DialogueScenario;
}

export default function DialogueViewer({ scenario }: DialogueViewerProps) {
  const [showRomanization, setShowRomanization] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const stopRef = useRef(false);

  // Load romanization preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dialogue-romanization");
    if (saved !== null) {
      setShowRomanization(saved === "true");
    }
  }, []);

  function toggleRomanization() {
    const next = !showRomanization;
    setShowRomanization(next);
    localStorage.setItem("dialogue-romanization", String(next));
  }

  async function playAll() {
    if (isPlaying) return;
    stopRef.current = false;
    setIsPlaying(true);

    for (let i = 0; i < scenario.lines.length; i++) {
      if (stopRef.current) break;
      setActiveLineIndex(i);
      speakKorean(scenario.lines[i].korean);

      // Estimate duration based on character length (avg ~300ms per char, min 1.5s)
      const charCount = scenario.lines[i].korean.length;
      const waitMs = Math.max(1800, charCount * 320);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    setIsPlaying(false);
    setActiveLineIndex(-1);
  }

  function stopPlay() {
    stopRef.current = true;
    setIsPlaying(false);
    setActiveLineIndex(-1);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
  }

  function handleLineSpeak(korean: string, index: number) {
    setActiveLineIndex(index);
    speakKorean(korean);
    setTimeout(() => setActiveLineIndex(-1), 2000);
  }

  const DIFFICULTY_STYLE: Record<string, React.CSSProperties> = {
    beginner: {
      background: "rgba(16,185,129,0.15)",
      color: "#10B981",
      border: "1px solid rgba(16,185,129,0.3)",
    },
    intermediate: {
      background: "rgba(245,158,11,0.15)",
      color: "#F59E0B",
      border: "1px solid rgba(245,158,11,0.3)",
    },
  };

  return (
    <div className="min-h-screen" style={{ background: "#FFF5F8" }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/dialogues"
          className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-80"
          style={{ color: "#9B7FE8" }}
        >
          ← Back to Dialogues
        </Link>

        {/* Header card */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "rgba(155,127,232,0.08)",
            border: "1px solid rgba(155,127,232,0.20)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{scenario.emoji}</span>
              <div>
                <p
                  className="text-xs font-medium mb-0.5 font-noto-kr"
                  style={{ color: "#6B5F7A" }}
                >
                  {scenario.titleKo}
                </p>
                <h1
                  className="text-2xl font-black"
                  style={{ color: "#1E1225" }}
                >
                  {scenario.title}
                </h1>
                <p className="text-sm mt-1" style={{ color: "#6B5F7A" }}>
                  {scenario.setting}
                </p>
                <span
                  className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={DIFFICULTY_STYLE[scenario.difficulty]}
                >
                  {scenario.difficulty === "beginner" ? "Beginner" : "Intermediate"}
                </span>
              </div>
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3 mt-5 flex-wrap">
            {/* Play All / Stop */}
            {isPlaying ? (
              <button
                onClick={stopPlay}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(to right, #EF4444, #FF6B81)",
                  color: "white",
                  boxShadow: "0 4px 16px rgba(239,68,68,0.25)",
                }}
              >
                <span>⏹</span>
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={playAll}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(to right, #9B7FE8, #B099FF)",
                  color: "white",
                  boxShadow: "0 4px 16px rgba(155,127,232,0.30)",
                }}
              >
                <span>▶</span>
                <span>Play All</span>
              </button>
            )}

            {/* Romanization toggle */}
            <button
              onClick={toggleRomanization}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200"
              style={
                showRomanization
                  ? {
                      background: "rgba(155,127,232,0.12)",
                      color: "#1E1225",
                      borderColor: "rgba(155,127,232,0.25)",
                    }
                  : {
                      background: "rgba(240,230,238,0.5)",
                      color: "#6B5F7A",
                      borderColor: "rgba(240,230,238,1)",
                    }
              }
            >
              <span>Aa</span>
              <span>Romanization {showRomanization ? "ON" : "OFF"}</span>
            </button>

            {/* Line count */}
            <span className="text-xs ml-auto" style={{ color: "#B0A8BB" }}>
              {scenario.lines.length} lines
            </span>
          </div>
        </div>

        {/* Dialogue lines */}
        <div className="space-y-3">
          {scenario.lines.map((line, index) => {
            const isA = line.speaker === "A";
            const isActive = activeLineIndex === index;

            return (
              <div
                key={index}
                className={`flex ${isA ? "justify-start" : "justify-end"}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl p-4 transition-all duration-300"
                  style={{
                    ...(isA
                      ? {
                          background: "rgba(155,127,232,0.10)",
                          border: isActive
                            ? "2px solid #E8436F"
                            : "1px solid rgba(155,127,232,0.22)",
                          borderRadius: "16px 16px 16px 4px",
                        }
                      : {
                          background: "rgba(255,255,255,0.9)",
                          border: isActive
                            ? "2px solid #E8436F"
                            : "1px solid rgba(240,230,238,1)",
                          borderRadius: "16px 16px 4px 16px",
                        }),
                    boxShadow: isActive
                      ? "0 0 0 2px rgba(232,67,111,0.25)"
                      : undefined,
                  }}
                >
                  {/* Speaker name + TTS button */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: isA ? "#9B7FE8" : "#6B5F7A" }}
                    >
                      {line.speakerName}
                    </span>
                    <button
                      onClick={() => handleLineSpeak(line.korean, index)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
                      style={{
                        background: isActive
                          ? "#E8436F"
                          : "rgba(232,67,111,0.10)",
                        border: "1px solid rgba(232,67,111,0.20)",
                      }}
                      title="Play pronunciation"
                    >
                      🔊
                    </button>
                  </div>

                  {/* Korean */}
                  <p
                    className="text-base font-semibold mb-1 font-noto-kr"
                    style={{ color: "#1E1225" }}
                  >
                    {line.korean}
                  </p>

                  {/* Romanization */}
                  {showRomanization && (
                    <p className="text-xs mb-1.5" style={{ color: "#6B5F7A" }}>
                      {line.romanization}
                    </p>
                  )}

                  {/* English */}
                  <p className="text-sm" style={{ color: "#B0A8BB" }}>
                    {line.english}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom tip */}
        <div
          className="mt-8 rounded-2xl p-4 text-center"
          style={{
            background: "rgba(244,162,97,0.06)",
            border: "1px solid rgba(244,162,97,0.18)",
          }}
        >
          <p className="text-xs" style={{ color: "#6B5F7A" }}>
            <span style={{ color: "#F4A261" }}>💡</span> Tap each bubble&apos;s
            🔊 to hear individual lines, or press{" "}
            <strong style={{ color: "#1E1225" }}>Play All</strong> to listen to
            the full conversation.
          </p>
        </div>

        {/* Back to list */}
        <div className="mt-6 text-center">
          <Link
            href="/dialogues"
            className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl border transition-all duration-200 hover:opacity-80"
            style={{
              color: "#6B5F7A",
              borderColor: "rgba(240,230,238,1)",
              background: "rgba(255,255,255,0.8)",
            }}
          >
            ← All Scenarios
          </Link>
        </div>
      </div>
    </div>
  );
}
