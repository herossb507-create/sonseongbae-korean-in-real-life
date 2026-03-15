"use client";

import { useState } from "react";

interface Props {
  id: string;
  korean: string;
  romanization: string;
  english: string;
  audioHint: string;
}

export function VocabCard({ korean, romanization, english, audioHint }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(false);

  function playAudio() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(audioHint);
    utterance.lang = "ko-KR";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div
      className={`bg-white rounded-xl border-2 p-6 cursor-pointer select-none transition-colors ${
        known ? "border-green-200 bg-green-50" : "border-gray-100 hover:border-blue-200"
      }`}
      onClick={() => setFlipped((f) => !f)}
    >
      {!flipped ? (
        // Front: 한글
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">{korean}</div>
          <div className="text-sm text-gray-400">Click to reveal</div>
        </div>
      ) : (
        // Back: 영어 + 발음
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-1">{english}</div>
          <div className="text-base text-blue-500 mb-4">{romanization}</div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio();
              }}
              className="text-sm border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50"
            >
              🔊 Hear it
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setKnown((k) => !k);
                // TODO: Supabase user_vocab_stats 업데이트
              }}
              className={`text-sm px-3 py-1.5 rounded-lg ${
                known
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {known ? "✓ Known" : "Mark as known"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
