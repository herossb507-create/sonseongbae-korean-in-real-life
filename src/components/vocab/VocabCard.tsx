"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { markWordKnown, readProgress } from "@/lib/progress";
import { speakKorean } from "@/lib/tts";

interface Props {
  id: string;
  korean: string;
  romanization: string;
  english: string;
  audioHint: string;
}

export function VocabCard({ id, korean, romanization, english, audioHint }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(false);

  useEffect(() => {
    setKnown(Boolean(readProgress().vocab[id]));
  }, [id]);

  function playAudio(e: React.MouseEvent) {
    e.stopPropagation();
    speakKorean(audioHint);
  }

  function handleKnown(e: React.MouseEvent) {
    e.stopPropagation();
    if (known) return; // already in review queue
    setKnown(true);
    markWordKnown(id);
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    const threshold = 80;
    if (info.offset.x > threshold && !known) {
      handleKnown({ stopPropagation: () => {} } as React.MouseEvent);
    } else if (info.offset.x < -threshold) {
      setFlipped((f) => !f);
    }
  }

  return (
    // 카드 컨테이너 — perspective 설정으로 3D 원근감 부여
    <motion.div
      className="relative cursor-pointer select-none"
      style={{ perspective: "1200px", minHeight: "160px" }}
      onClick={() => setFlipped((f) => !f)}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="w-full h-full"
        style={{ transformStyle: "preserve-3d", minHeight: "160px" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* ── 앞면: 한글 + 발음 버튼 ── */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className={[
            "absolute inset-0 rounded-2xl border p-6",
            "flex flex-col items-center justify-center gap-3",
            "transition-colors",
            known
              ? "bg-[#10B981]/10 border-[#10B981]/40"
              : "bg-white border-[#F0E6EE] hover:bg-[#FFF5F8] shadow-sm",
          ].join(" ")}
        >
          {known && (
            <span className="absolute top-3 right-3 text-xs text-[#10B981] font-medium">
              ✓ Known
            </span>
          )}
          <div className="text-5xl font-bold text-[#1E1225] font-noto-kr">{korean}</div>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={playAudio}
              className="text-xs border border-[#9B7FE8]/40 text-[#9B7FE8] px-3 py-1.5 rounded-lg hover:bg-[#9B7FE8]/10 transition-colors"
            >
              🔊 Hear it
            </button>
            <span className="text-[#B0A8BB] text-xs">Tap to reveal</span>
          </div>
        </div>

        {/* ── 뒷면: 영어 + 로마자 + 버튼 ── */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className={[
            "absolute inset-0 rounded-2xl border p-6",
            "flex flex-col items-center justify-center gap-2",
            known
              ? "bg-[#10B981]/10 border-[#10B981]/40"
              : "bg-[#FFF0F5] border-[#F0E6EE] shadow-sm",
          ].join(" ")}
        >
          <div className="text-3xl font-semibold text-[#1E1225]">{english}</div>
          <div className="text-[#9B7FE8] text-base">{romanization}</div>
          <div className="flex gap-3 mt-3">
            <button
              onClick={playAudio}
              className="text-xs border border-[#9B7FE8]/40 text-[#9B7FE8] px-3 py-1.5 rounded-lg hover:bg-[#9B7FE8]/10 transition-colors"
            >
              🔊 Hear it
            </button>
            <button
              onClick={handleKnown}
              disabled={known}
              className={[
                "text-xs px-3 py-1.5 rounded-lg transition-colors",
                known
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 cursor-default"
                  : "border border-[#F0E6EE] text-[#6B5F7A] hover:bg-[#FFF5F8]",
              ].join(" ")}
            >
              {known ? "✓ Added to review" : "Mark as known"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
