"use client";

import { useState, useEffect } from "react";
import { ChapterReader } from "@/components/reader/ChapterReader";
import { markChapterComplete, markChapterRead, readProgress } from "@/lib/progress";

interface Props {
  content: string;
  chapterId: string;
}

const TTS_RATES = [
  { label: "0.75×", value: 0.75 },
  { label: "1×",    value: 1.0  },
  { label: "1.25×", value: 1.25 },
];

const FONT_SIZES = ["sm", "base", "lg", "xl"] as const;
type FontSize = typeof FONT_SIZES[number];

export function ReaderControls({ content, chapterId }: Props) {
  const [showRomanization, setShowRomanization] = useState(true);
  const [ttsRate, setTtsRate] = useState(1.0);
  const [completed, setCompleted] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("base");

  useEffect(() => {
    // Opening a chapter counts as reading it ("Continue learning" on Home).
    markChapterRead(chapterId);
    setCompleted(readProgress().chapters[chapterId]?.completed ?? false);
  }, [chapterId]);

  useEffect(() => {
    const saved = localStorage.getItem("reader-font-size") as FontSize | null;
    if (saved && (FONT_SIZES as readonly string[]).includes(saved)) setFontSize(saved);
  }, []);

  function changeFontSize(dir: "up" | "down") {
    const idx = FONT_SIZES.indexOf(fontSize);
    const next = dir === "up" ? Math.min(idx + 1, FONT_SIZES.length - 1) : Math.max(idx - 1, 0);
    const newSize = FONT_SIZES[next];
    setFontSize(newSize);
    localStorage.setItem("reader-font-size", newSize);
  }

  function handleComplete() {
    if (completed) return;
    markChapterComplete(chapterId);
    setCompleted(true);
  }

  return (
    <div>
      {/* ── 컨트롤 바 ── */}
      <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 border border-white/10 rounded-xl flex-wrap">
        {/* 로마자 토글 */}
        <button
          onClick={() => setShowRomanization((v) => !v)}
          className={[
            "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors",
            showRomanization
              ? "bg-[#4F7FE8]/20 border-[#4F7FE8]/40 text-[#4F7FE8]"
              : "bg-white/5 border-white/10 text-[#4A5568] hover:text-[#8892B0]",
          ].join(" ")}
        >
          <span>🈳</span>
          <span>Romanization {showRomanization ? "ON" : "OFF"}</span>
        </button>

        {/* TTS 속도 */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#4A5568] mr-1">🔊</span>
          {TTS_RATES.map((r) => (
            <button
              key={r.value}
              onClick={() => setTtsRate(r.value)}
              className={[
                "text-xs px-2.5 py-1.5 rounded-lg border transition-colors",
                ttsRate === r.value
                  ? "bg-[#4F7FE8]/20 border-[#4F7FE8]/40 text-[#4F7FE8]"
                  : "bg-white/5 border-white/10 text-[#4A5568] hover:text-[#8892B0]",
              ].join(" ")}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* 폰트 크기 */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeFontSize("down")}
            disabled={fontSize === "sm"}
            className="text-xs px-2 py-1.5 rounded-lg border bg-white/5 border-white/10 text-[#8892B0] hover:text-white disabled:opacity-30 transition-colors"
            title="Decrease font size"
          >
            A−
          </button>
          <button
            onClick={() => changeFontSize("up")}
            disabled={fontSize === "xl"}
            className="text-xs px-2 py-1.5 rounded-lg border bg-white/5 border-white/10 text-[#8892B0] hover:text-white disabled:opacity-30 transition-colors"
            title="Increase font size"
          >
            A+
          </button>
        </div>

        {/* 완료 버튼 */}
        <button
          onClick={handleComplete}
          disabled={completed}
          className={[
            "ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors",
            completed
              ? "bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981] cursor-default"
              : "bg-white/5 border-white/10 text-[#8892B0] hover:border-[#10B981]/40 hover:text-[#10B981]",
          ].join(" ")}
        >
          {completed ? "✓ Completed" : "✓ Mark complete"}
        </button>
      </div>

      {/* ── 챕터 컨텐츠 ── */}
      <ChapterReader
        content={content}
        chapterId={chapterId}
        showRomanization={showRomanization}
        ttsRate={ttsRate}
        fontSize={fontSize}
      />
    </div>
  );
}
