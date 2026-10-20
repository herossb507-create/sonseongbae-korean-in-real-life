"use client";

import { useEffect, useState } from "react";

interface VoiceInfo {
  name: string;
  lang: string;
  default: boolean;
}

export default function VoiceTestPage() {
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [played, setPlayed] = useState<string>("");

  useEffect(() => {
    const load = () => {
      const all = speechSynthesis.getVoices();
      setVoices(all.map((v) => ({ name: v.name, lang: v.lang, default: v.default })));
    };
    load();
    speechSynthesis.addEventListener("voiceschanged", load);
    return () => speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  function testVoice(name: string) {
    const v = speechSynthesis.getVoices().find((x) => x.name === name);
    if (!v) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance("안녕하세요, 저는 한국어를 가르쳐요");
    u.lang = "ko-KR";
    u.voice = v;
    u.rate = 0.85;
    speechSynthesis.speak(u);
    setPlayed(name);
  }

  const krVoices = voices.filter((v) => v.lang.startsWith("ko"));
  const otherVoices = voices.filter((v) => !v.lang.startsWith("ko"));

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">🔊 목소리 진단</h1>
      <p className="text-[#8892B0] mb-6">각 목소리 버튼을 눌러서 들어보세요</p>

      {/* 한국어 목소리 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-[#4F7FE8]">
          한국어 목소리 ({krVoices.length}개)
        </h2>
        {krVoices.length === 0 ? (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 text-red-300">
            ❌ 한국어 목소리가 없어요! — 기기에 한국어 TTS가 설치되지 않았어요.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {krVoices.map((v) => (
              <button
                key={v.name}
                onClick={() => testVoice(v.name)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  played === v.name
                    ? "bg-green-500/20 border-green-500/40 text-green-300"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="font-mono font-bold">{v.name}</div>
                <div className="text-sm text-[#8892B0]">lang: {v.lang}{v.default ? " · 기본값" : ""}</div>
                {played === v.name && (
                  <div className="text-xs text-green-400 mt-1">▶ 재생 중...</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 현재 tts.ts 선택 결과 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-[#FF4757]">
          현재 코드가 선택하는 목소리
        </h2>
        <button
          onClick={() => {
            const all = speechSynthesis.getVoices();
            const kr = all.filter((v) => v.lang.startsWith("ko"));
            const female = kr.find((v) =>
              ["yuna","heami","google 한국의","google 한국어","google korean","수아","sora","나나","female","google"]
                .some((kw) => v.name.toLowerCase().includes(kw))
            );
            const picked = female ?? kr.find((v) =>
              !["male","남성","daniel","thomas","유호"].some((kw) => v.name.toLowerCase().includes(kw))
            ) ?? kr[0] ?? null;
            setSelected(picked ? picked.name : "없음 (기본값 사용)");
            if (picked) testVoice(picked.name);
          }}
          className="bg-gradient-to-r from-[#FF4757] to-[#FF6B81] text-white font-bold py-3 px-6 rounded-xl"
        >
          🔊 현재 코드로 재생
        </button>
        {selected && (
          <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-4">
            <span className="text-[#8892B0]">선택된 목소리: </span>
            <span className="font-mono font-bold text-yellow-300">{selected}</span>
          </div>
        )}
      </div>

      {/* 전체 목소리 수 */}
      <div className="text-[#8892B0] text-sm">
        전체 목소리 수: {voices.length}개 (한국어: {krVoices.length}개, 기타: {otherVoices.length}개)
      </div>
    </div>
  );
}
