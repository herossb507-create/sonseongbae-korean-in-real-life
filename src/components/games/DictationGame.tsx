"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "@/hooks/useXP";
import { speakKorean } from "@/lib/tts";
import Link from "next/link";

export interface DictationQuestion {
  id: string;
  audio: string;
  answer: string;
  hint: string;
  romanization?: string;
}

interface DictationGameProps {
  chapterId: string;
  questions: DictationQuestion[];
  mode: "word" | "sentence";
}

function normalizeKorean(text: string): string {
  return text.trim().replace(/[^가-힣]/g, "");
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type FeedbackState = "idle" | "correct" | "wrong";

export default function DictationGame({
  chapterId,
  questions: rawQuestions,
  mode,
}: DictationGameProps) {
  const { addXP } = useXP();

  // Shuffle once on client to avoid hydration mismatch
  const [questions, setQuestions] = useState<DictationQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [correctRomanization, setCorrectRomanization] = useState<
    string | undefined
  >(undefined);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showRomanization, setShowRomanization] = useState(false);
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wrongWords, setWrongWords] = useState<
    { korean: string; english: string; romanization?: string }[]
  >([]);
  const [autoPlayDone, setAutoPlayDone] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize shuffled questions on client
  useEffect(() => {
    setQuestions(shuffleArray(rawQuestions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset per-question state when index changes
  useEffect(() => {
    setInput("");
    setFeedback("idle");
    setHintUsed(false);
    setShowRomanization(false);
    setAutoPlayDone(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentIndex]);

  // Autoplay TTS when question changes
  useEffect(() => {
    if (questions.length === 0 || done || autoPlayDone) return;
    const current = questions[currentIndex];
    if (!current) return;
    setAutoPlayDone(true);
    const t = setTimeout(() => {
      setIsSpeaking(true);
      speakKorean(current.audio);
      setTimeout(() => setIsSpeaking(false), 2000);
    }, 300);
    return () => clearTimeout(t);
  }, [questions, currentIndex, done, autoPlayDone]);

  const handleSpeak = useCallback(() => {
    const current = questions[currentIndex];
    if (!current) return;
    setIsSpeaking(true);
    speakKorean(current.audio);
    setTimeout(() => setIsSpeaking(false), 2000);
  }, [questions, currentIndex]);

  const handleShowHint = useCallback(() => {
    if (showRomanization) return;
    setShowRomanization(true);
    setHintUsed(true);
    setTotalHintsUsed((n) => n + 1);
  }, [showRomanization]);

  const advance = useCallback(
    async (isCorrect: boolean, xpForThisQuestion: number) => {
      if (xpForThisQuestion > 0) {
        await addXP(xpForThisQuestion);
        setXpEarned((prev) => prev + xpForThisQuestion);
      }

      const delay = isCorrect ? 1200 : 2200;
      advanceTimeoutRef.current = setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          setDone(true);
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }, delay);
    },
    [addXP, currentIndex, questions.length]
  );

  const handleSubmit = useCallback(async () => {
    if (feedback !== "idle") return;
    const current = questions[currentIndex];
    if (!current) return;

    const isCorrect =
      normalizeKorean(input) === normalizeKorean(current.answer);

    setCorrectAnswer(current.answer);
    setCorrectRomanization(current.romanization);

    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback("correct");
      const xp = hintUsed ? 3 : 8;
      await advance(true, xp);
    } else {
      setWrongWords((w) => [
        ...w,
        {
          korean: current.answer,
          english: current.hint,
          romanization: current.romanization,
        },
      ]);
      setFeedback("wrong");
      await advance(false, 0);
    }
  }, [feedback, questions, currentIndex, input, hintUsed, advance]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  // --- Loading state ---
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-pulse">🎧</div>
          <p style={{ color: "#6B5F7A" }}>Preparing dictation…</p>
        </div>
      </div>
    );
  }

  // --- Done screen ---
  if (done) {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 60;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8 px-4 max-w-lg mx-auto"
      >
        <div className="text-6xl">
          {pct === 100 ? "🏆" : passed ? "🎉" : "📚"}
        </div>
        <h2 className="text-4xl font-black" style={{ color: "#1E1225" }}>
          {score} / {total}
        </h2>
        <p style={{ color: "#6B5F7A" }}>
          {pct === 100
            ? "Perfect dictation! Your Korean is sharp!"
            : passed
            ? "Nice work! Keep practicing your writing."
            : "Keep listening — your ear and hands will improve!"}
        </p>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-3 rounded-2xl p-4"
          style={{
            background: "white",
            border: "1px solid rgba(240,230,238,1)",
          }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#10B981" }}>
              {pct}%
            </div>
            <div className="text-xs mt-1" style={{ color: "#6B5F7A" }}>
              Accuracy
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#F4A261" }}>
              {xpEarned}
            </div>
            <div className="text-xs mt-1" style={{ color: "#6B5F7A" }}>
              XP earned
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#9B7FE8" }}>
              {totalHintsUsed}
            </div>
            <div className="text-xs mt-1" style={{ color: "#6B5F7A" }}>
              Hints used
            </div>
          </div>
        </div>

        {/* Wrong words review */}
        {wrongWords.length > 0 && (
          <div
            className="text-left rounded-2xl p-5 max-w-sm mx-auto"
            style={{
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.18)",
            }}
          >
            <p
              className="text-sm font-semibold mb-3"
              style={{ color: "#EF4444" }}
            >
              Words to review ({wrongWords.length}):
            </p>
            <ul className="space-y-2">
              {wrongWords.map((w, i) => (
                <li key={i} className="text-sm">
                  <span
                    className="font-bold font-noto-kr mr-2"
                    style={{ color: "#1E1225" }}
                  >
                    {w.korean}
                  </span>
                  {w.romanization && (
                    <span className="mr-2" style={{ color: "#6B5F7A" }}>
                      [{w.romanization}]
                    </span>
                  )}
                  <span style={{ color: "#6B5F7A" }}>{w.english}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href={`/games/dictation/${chapterId}`}
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: "rgba(155,127,232,0.10)",
              border: "1px solid rgba(155,127,232,0.25)",
              color: "#9B7FE8",
            }}
          >
            Try again
          </a>
          <a
            href={`/vocab/${chapterId}`}
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: "rgba(155,127,232,0.15)",
              border: "1px solid rgba(155,127,232,0.25)",
              color: "#9B7FE8",
            }}
          >
            Study vocab
          </a>
          <a
            href="/games"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(to right, #E8436F, #F06B8A)",
              color: "white",
            }}
          >
            Other games
          </a>
        </div>
      </motion.div>
    );
  }

  // --- Game screen ---
  const current = questions[currentIndex];
  const total = questions.length;

  const inputBorder =
    feedback === "correct"
      ? "#10B981"
      : feedback === "wrong"
      ? "#EF4444"
      : "rgba(240,230,238,1)";

  const inputBg =
    feedback === "correct"
      ? "rgba(16,185,129,0.06)"
      : feedback === "wrong"
      ? "rgba(239,68,68,0.06)"
      : "white";

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      {/* Progress bar + stats */}
      <div className="space-y-1.5">
        <div
          className="flex justify-between text-xs"
          style={{ color: "#6B5F7A" }}
        >
          <span>
            Question {currentIndex + 1} of {total}
          </span>
          <span className="flex gap-3">
            <span style={{ color: "#10B981" }}>✓ {score}</span>
            <span style={{ color: "#EF4444" }}>
              ✗ {currentIndex - score + (feedback !== "idle" ? 0 : 0)}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                background: "rgba(155,127,232,0.12)",
                color: "#9B7FE8",
              }}
            >
              {mode === "word" ? "Word Mode" : "Sentence Mode"}
            </span>
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,232,240,1)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(to right, #9B7FE8, #E8436F)",
            }}
            animate={{ width: `${(currentIndex / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl p-6 flex flex-col items-center gap-5"
          style={{
            background: "linear-gradient(135deg, #FFF0F5 0%, #FFF5F8 100%)",
            border: "1px solid rgba(240,230,238,1)",
          }}
        >
          {/* English hint */}
          <div className="text-center">
            <p
              className="text-xs uppercase tracking-widest font-medium mb-1"
              style={{ color: "#B0A8BB" }}
            >
              English meaning
            </p>
            <p
              className="text-xl font-semibold"
              style={{ color: "#1E1225" }}
            >
              &ldquo;{current.hint}&rdquo;
            </p>
          </div>

          {/* Big play button */}
          <motion.button
            onClick={handleSpeak}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={
              isSpeaking
                ? {
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      "0 4px 24px rgba(155,127,232,0.35)",
                      "0 4px 48px rgba(155,127,232,0.65)",
                      "0 4px 24px rgba(155,127,232,0.35)",
                    ],
                  }
                : {}
            }
            transition={
              isSpeaking
                ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                : {}
            }
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
            style={{
              background:
                "linear-gradient(135deg, #9B7FE8 0%, #B099FF 100%)",
              boxShadow: "0 4px 24px rgba(155,127,232,0.40)",
              cursor: "pointer",
              border: "none",
            }}
            aria-label="Play Korean audio"
          >
            🔊
          </motion.button>

          <p className="text-xs" style={{ color: "#B0A8BB" }}>
            {isSpeaking ? "Playing…" : "Tap to hear again"}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Input area */}
      <div className="space-y-3">
        <motion.input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            if (feedback === "idle") setInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="한국어로 입력하세요..."
          disabled={feedback !== "idle"}
          className="w-full rounded-xl px-4 py-4 text-xl text-center font-noto-kr transition-all duration-200 focus:outline-none"
          style={{
            background: inputBg,
            border: `2px solid ${inputBorder}`,
            color: "#1E1225",
            boxShadow:
              feedback === "correct"
                ? "0 0 16px rgba(16,185,129,0.15)"
                : feedback === "wrong"
                ? "0 0 16px rgba(239,68,68,0.15)"
                : "none",
          }}
          animate={
            feedback === "correct"
              ? { scale: [1, 1.02, 1] }
              : feedback === "wrong"
              ? { x: [-6, 6, -4, 4, 0] }
              : {}
          }
          transition={{ duration: 0.4 }}
        />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={feedback !== "idle" || input.trim() === ""}
          className="w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background:
              "linear-gradient(to right, #9B7FE8, #B099FF)",
            color: "white",
            boxShadow: "0 4px 16px rgba(155,127,232,0.30)",
          }}
        >
          ✓ Check Answer
        </button>
      </div>

      {/* Feedback banner */}
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl py-4 px-5 text-center"
            style={{
              background:
                feedback === "correct"
                  ? "rgba(16,185,129,0.08)"
                  : "rgba(239,68,68,0.08)",
              border:
                feedback === "correct"
                  ? "1px solid rgba(16,185,129,0.28)"
                  : "1px solid rgba(239,68,68,0.28)",
            }}
          >
            {feedback === "correct" ? (
              <div>
                <p
                  className="font-bold text-base"
                  style={{ color: "#10B981" }}
                >
                  ✅ Correct!
                </p>
                {hintUsed && (
                  <p className="text-xs mt-1" style={{ color: "#6B5F7A" }}>
                    +3 XP (hint used)
                  </p>
                )}
                {!hintUsed && (
                  <p className="text-xs mt-1" style={{ color: "#6B5F7A" }}>
                    +8 XP
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p
                  className="font-bold text-base mb-1"
                  style={{ color: "#EF4444" }}
                >
                  ✗ Not quite
                </p>
                <p className="text-sm" style={{ color: "#1E1225" }}>
                  Answer:{" "}
                  <span
                    className="font-bold font-noto-kr"
                    style={{ color: "#1E1225" }}
                  >
                    {correctAnswer}
                  </span>
                  {correctRomanization && (
                    <span
                      className="ml-2 text-xs"
                      style={{ color: "#6B5F7A" }}
                    >
                      [{correctRomanization}]
                    </span>
                  )}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Romanization hint section */}
      {feedback === "idle" && (
        <div className="text-center">
          <AnimatePresence mode="wait">
            {!showRomanization ? (
              <motion.button
                key="hint-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleShowHint}
                disabled={!current.romanization}
                className="text-xs px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: "rgba(155,127,232,0.10)",
                  border: "1px solid rgba(155,127,232,0.22)",
                  color: "#9B7FE8",
                }}
              >
                Show romanization hint (−5 XP)
              </motion.button>
            ) : (
              <motion.div
                key="hint-text"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-2 rounded-full inline-block"
                style={{
                  background: "rgba(155,127,232,0.08)",
                  border: "1px solid rgba(155,127,232,0.18)",
                }}
              >
                <p className="text-sm" style={{ color: "#9B7FE8" }}>
                  {current.romanization}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
