"use client";

import { useState } from "react";

// Web Speech API (Phase 1)
// Phase 2: Google Cloud TTS로 교체 예정

interface Props {
  text?: string; // 외부에서 재생할 텍스트 주입 가능
}

export function PronunciationPlayer({ text }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputText, setInputText] = useState(text ?? "");

  function speak(textToSpeak: string) {
    if (!textToSpeak.trim()) return;
    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support speech synthesis.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "ko-KR";
    utterance.rate = 0.85; // 약간 느리게 — 학습 목적
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center gap-3">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type Korean text to hear pronunciation..."
        className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={() => speak(inputText)}
        disabled={isPlaying}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isPlaying ? (
          <>
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Playing...
          </>
        ) : (
          <>🔊 Listen</>
        )}
      </button>
    </div>
  );
}
