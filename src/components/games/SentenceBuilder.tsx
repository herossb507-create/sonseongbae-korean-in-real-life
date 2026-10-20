"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useXP } from "@/hooks/useXP";

export interface SentenceQuestion {
  id: string;
  korean: string;
  english: string;
  words: string[];
  shuffled: string[];
}

interface SentenceBuilderProps {
  chapterId: string;
  questions: SentenceQuestion[];
}

type CheckState = "idle" | "correct" | "incorrect";

export default function SentenceBuilder({
  chapterId,
  questions,
}: SentenceBuilderProps) {
  const { addXP } = useXP();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<SentenceQuestion[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  // Per-question state
  const [placed, setPlaced] = useState<string[]>([]);
  const [bank, setBank] = useState<string[]>(questions[0]?.shuffled ?? []);
  const [checkState, setCheckState] = useState<CheckState>("idle");

  const currentQuestion = questions[currentIndex];

  const handleBankClick = useCallback(
    (word: string, idx: number) => {
      if (checkState !== "idle") return;
      const newBank = [...bank];
      newBank.splice(idx, 1);
      setBank(newBank);
      setPlaced((prev) => [...prev, word]);
    },
    [bank, checkState]
  );

  const handlePlacedClick = useCallback(
    (word: string, idx: number) => {
      if (checkState !== "idle") return;
      const newPlaced = [...placed];
      newPlaced.splice(idx, 1);
      setPlaced(newPlaced);
      setBank((prev) => [...prev, word]);
    },
    [placed, checkState]
  );

  const handleReset = useCallback(() => {
    setPlaced([]);
    setBank(currentQuestion.shuffled);
    setCheckState("idle");
  }, [currentQuestion]);

  const advanceToNext = useCallback(
    (wasCorrect: boolean) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        const earned = correctCount * 3 + (wasCorrect ? 3 : 0);
        setXpEarned(earned);
        if (earned > 0) addXP(earned);
        setIsFinished(true);
      } else {
        setCurrentIndex(nextIndex);
        setPlaced([]);
        setBank(questions[nextIndex].shuffled);
        setCheckState("idle");
      }
    },
    [currentIndex, correctCount, questions, addXP]
  );

  const handleCheck = useCallback(() => {
    if (placed.length === 0) return;
    const isCorrect =
      placed.join(" ") === currentQuestion.words.join(" ");

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setCheckState("correct");
      setTimeout(() => advanceToNext(true), 800);
    } else {
      setIncorrectCount((c) => c + 1);
      setWrongQuestions((prev) => [...prev, currentQuestion]);
      setCheckState("incorrect");
      setTimeout(() => {
        setPlaced([]);
        setBank(currentQuestion.shuffled);
        setCheckState("idle");
      }, 500);
    }
  }, [placed, currentQuestion, advanceToNext]);

  // Completion screen
  if (isFinished) {
    const total = questions.length;
    const pct = Math.round((correctCount / total) * 100);

    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "#FFF5F8" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          {/* Score card */}
          <div
            className="rounded-3xl p-8 mb-6 text-center"
            style={{
              background: "white",
              border: "1px solid rgba(240,230,238,1)",
              boxShadow: "0 4px 16px rgba(232,67,111,0.08)",
            }}
          >
            <div className="text-5xl mb-4">
              {pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}
            </div>
            <h1 className="text-2xl font-black mb-1" style={{ color: "#1E1225" }}>
              Game Over!
            </h1>
            <p className="text-sm mb-6" style={{ color: "#6B5F7A" }}>
              Sentence Builder — Chapter {chapterId.replace("ch", "")}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div
                className="rounded-2xl p-4"
                style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)" }}
              >
                <div className="text-2xl font-black" style={{ color: "#10B981" }}>
                  {correctCount}
                </div>
                <div className="text-xs mt-1" style={{ color: "#6B5F7A" }}>Correct</div>
              </div>
              <div
                className="rounded-2xl p-4"
                style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)" }}
              >
                <div className="text-2xl font-black" style={{ color: "#EF4444" }}>
                  {incorrectCount}
                </div>
                <div className="text-xs mt-1" style={{ color: "#6B5F7A" }}>Incorrect</div>
              </div>
              <div
                className="rounded-2xl p-4"
                style={{ background: "rgba(155,127,232,0.10)", border: "1px solid rgba(155,127,232,0.25)" }}
              >
                <div className="text-2xl font-black" style={{ color: "#9B7FE8" }}>
                  {pct}%
                </div>
                <div className="text-xs mt-1" style={{ color: "#6B5F7A" }}>Accuracy</div>
              </div>
            </div>

            {xpEarned > 0 && (
              <div
                className="rounded-xl p-3 mb-4 flex items-center justify-center gap-2"
                style={{ background: "rgba(244,162,97,0.10)", border: "1px solid rgba(244,162,97,0.28)" }}
              >
                <span className="text-lg">⭐</span>
                <span className="font-bold" style={{ color: "#F4A261" }}>
                  +{xpEarned} XP earned!
                </span>
              </div>
            )}
          </div>

          {/* Wrong questions review */}
          {wrongQuestions.length > 0 && (
            <div
              className="rounded-2xl p-5 mb-6"
              style={{
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.18)",
              }}
            >
              <h2 className="font-bold mb-3 text-sm" style={{ color: "#EF4444" }}>
                Review — Sentences you missed:
              </h2>
              <div className="flex flex-col gap-3">
                {wrongQuestions.map((q) => (
                  <div key={q.id} className="text-sm">
                    <div style={{ color: "#6B5F7A" }}>{q.english}</div>
                    <div className="font-medium mt-0.5" style={{ color: "#1E1225" }}>
                      {q.korean}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setCorrectCount(0);
                setIncorrectCount(0);
                setWrongQuestions([]);
                setIsFinished(false);
                setXpEarned(0);
                setPlaced([]);
                setBank(questions[0]?.shuffled ?? []);
                setCheckState("idle");
              }}
              className="w-full rounded-xl py-3 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(to right, #10B981, #34D399)",
                color: "white",
                boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
              }}
            >
              Play Again
            </button>
            <Link
              href={`/vocab/${chapterId}`}
              className="w-full rounded-xl py-3 font-semibold text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(to right, #9B7FE8, #B099FF)",
                color: "white",
                boxShadow: "0 4px 16px rgba(155,127,232,0.25)",
              }}
            >
              Study Vocabulary
            </Link>
            <Link
              href="/games"
              className="w-full rounded-xl py-3 font-semibold text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "white",
                border: "1px solid rgba(240,230,238,1)",
                color: "#6B5F7A",
              }}
            >
              Other Games
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Game screen
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#FFF5F8" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 sticky top-0 z-10"
        style={{
          background: "rgba(255,245,248,0.95)",
          borderBottom: "1px solid rgba(240,230,238,1)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link
          href="/games"
          className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
          style={{ color: "#6B5F7A" }}
        >
          <span>←</span>
          <span>Games</span>
        </Link>

        <div className="flex items-center gap-3 text-sm font-medium">
          <span style={{ color: "#10B981" }}>✓ {correctCount}</span>
          <span style={{ color: "#EF4444" }}>✗ {incorrectCount}</span>
          <span style={{ color: "#6B5F7A" }}>
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full" style={{ background: "rgba(255,232,240,1)" }}>
        <motion.div
          className="h-full"
          style={{
            background: "linear-gradient(to right, #9B7FE8, #E8436F)",
            borderRadius: "0 4px 4px 0",
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* English hint */}
        <motion.div
          key={`hint-${currentIndex}`}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-2xl p-5 mb-6"
          style={{
            background: "rgba(155,127,232,0.06)",
            border: "1px solid rgba(155,127,232,0.22)",
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">💬</span>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: "#9B7FE8" }}>
                English
              </div>
              <p className="font-medium leading-relaxed" style={{ color: "#1E1225" }}>
                {currentQuestion.english}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Answer area */}
        <motion.div
          key={`answer-${currentIndex}`}
          animate={
            checkState === "incorrect"
              ? { x: [0, -10, 10, -10, 10, 0] }
              : { x: 0 }
          }
          transition={{ duration: 0.4 }}
          className="w-full mb-4"
        >
          <div className="text-xs font-medium mb-2" style={{ color: "#6B5F7A" }}>
            Your answer
          </div>
          <div
            className="min-h-[72px] w-full rounded-2xl p-4 flex flex-wrap gap-2 items-center"
            style={{
              background:
                checkState === "correct"
                  ? "rgba(16,185,129,0.06)"
                  : checkState === "incorrect"
                  ? "rgba(239,68,68,0.06)"
                  : "white",
              border:
                checkState === "correct"
                  ? "2px dashed rgba(16,185,129,0.45)"
                  : checkState === "incorrect"
                  ? "2px dashed rgba(239,68,68,0.45)"
                  : "2px dashed rgba(240,230,238,1)",
              transition: "all 0.2s",
            }}
          >
            <AnimatePresence mode="popLayout">
              {placed.length === 0 ? (
                <span className="text-sm" style={{ color: "#B0A8BB" }}>
                  Click words below to build the sentence...
                </span>
              ) : (
                placed.map((word, idx) => {
                  const isWrongSlot =
                    checkState === "incorrect" &&
                    word !== currentQuestion.words[idx];
                  const isCorrectSlot =
                    checkState === "correct";
                  return (
                    <motion.button
                      key={`placed-${idx}-${word}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => handlePlacedClick(word, idx)}
                      className="rounded-lg px-3 py-2 text-sm font-medium select-none transition-all duration-150"
                      style={{
                        background: isCorrectSlot
                          ? "rgba(16,185,129,0.15)"
                          : isWrongSlot
                          ? "rgba(239,68,68,0.15)"
                          : "rgba(155,127,232,0.15)",
                        border: isCorrectSlot
                          ? "1px solid #10B981"
                          : isWrongSlot
                          ? "1px solid #EF4444"
                          : "1px solid rgba(155,127,232,0.40)",
                        color: "#1E1225",
                        cursor: checkState !== "idle" ? "default" : "pointer",
                      }}
                    >
                      {word}
                    </motion.button>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Word bank */}
        <div className="w-full mb-6">
          <div className="text-xs font-medium mb-2" style={{ color: "#6B5F7A" }}>
            Word bank
          </div>
          <div className="flex flex-wrap gap-2 min-h-[48px]">
            <AnimatePresence mode="popLayout">
              {bank.map((word, idx) => (
                <motion.button
                  key={`bank-${idx}-${word}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleBankClick(word, idx)}
                  className="rounded-lg px-3 py-2 text-sm font-medium select-none transition-all duration-150"
                  style={{
                    background: "white",
                    border: "1px solid rgba(240,230,238,1)",
                    color: "#1E1225",
                    cursor: checkState !== "idle" ? "default" : "pointer",
                  }}
                  whileHover={checkState === "idle" ? { scale: 1.06, background: "rgba(255,240,245,1)" } : {}}
                  whileTap={checkState === "idle" ? { scale: 0.94 } : {}}
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={handleReset}
            disabled={checkState !== "idle"}
            className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "white",
              border: "1px solid rgba(240,230,238,1)",
              color: "#6B5F7A",
            }}
          >
            ↩ Reset
          </button>
          <button
            onClick={handleCheck}
            disabled={placed.length === 0 || checkState !== "idle"}
            className="flex-[2] rounded-xl py-3 text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background:
                placed.length > 0 && checkState === "idle"
                  ? "linear-gradient(to right, #10B981, #34D399)"
                  : "rgba(16,185,129,0.25)",
              color: "white",
              boxShadow:
                placed.length > 0 && checkState === "idle"
                  ? "0 4px 16px rgba(16,185,129,0.25)"
                  : "none",
            }}
          >
            {checkState === "correct"
              ? "✓ Correct!"
              : checkState === "incorrect"
              ? "✗ Try again..."
              : "Check"}
          </button>
        </div>
      </div>
    </div>
  );
}
