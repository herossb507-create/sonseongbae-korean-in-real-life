"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "@/hooks/useXP";
import type { VocabItem } from "@/lib/vocab-data";
import Link from "next/link";

interface Question {
  vocab: VocabItem;
  correctAnswer: string;
  options: string[];
}

interface Props {
  chapterId: string;
  vocab: VocabItem[];
  allVocab: VocabItem[];
}

const INITIAL_TIME = 60;
const CORRECT_BONUS = 2;
const WRONG_PENALTY = 3;
const MAX_XP = 50;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion(
  vocab: VocabItem[],
  allVocab: VocabItem[],
  usedIds: Set<string>
): Question | null {
  const available = vocab.filter((v) => !usedIds.has(v.id));
  const pool = available.length > 0 ? available : vocab;
  const item = pool[Math.floor(Math.random() * pool.length)];
  if (!item) return null;

  const correct = item.english;
  const otherEnglish = allVocab
    .filter((v) => v.id !== item.id && v.english !== correct)
    .map((v) => v.english);
  const wrongOptions = shuffleArray(otherEnglish).slice(0, 3);
  const options = shuffleArray([correct, ...wrongOptions]);

  return { vocab: item, correctAnswer: correct, options };
}

type FlashState = "none" | "correct" | "wrong";

export default function SpeedRound({ chapterId, vocab, allVocab }: Props) {
  const { addXP } = useXP();

  // Game states
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [flash, setFlash] = useState<FlashState>("none");
  const [xpEarned, setXpEarned] = useState(0);
  const [lastResult, setLastResult] = useState<"correct" | "wrong" | null>(null);

  const usedIdsRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answeredRef = useRef(false);

  const endGame = useCallback(
    async (finalScore: number, finalTotal: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      const xp = Math.min(finalScore * 2, MAX_XP);
      if (xp > 0) {
        await addXP(xp);
      }
      setXpEarned(xp);
      setDone(true);
    },
    [addXP]
  );

  // Timer
  useEffect(() => {
    if (!started || done) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, done]);

  // Watch for time running out
  useEffect(() => {
    if (started && !done && timeLeft === 0) {
      endGame(score, totalAnswered);
    }
  }, [timeLeft, started, done, score, totalAnswered, endGame]);

  const loadNextQuestion = useCallback(() => {
    answeredRef.current = false;
    const q = generateQuestion(vocab, allVocab, usedIdsRef.current);
    setCurrentQuestion(q);
  }, [vocab, allVocab]);

  const startGame = useCallback(() => {
    usedIdsRef.current = new Set();
    setTimeLeft(INITIAL_TIME);
    setScore(0);
    setTotalAnswered(0);
    setFlash("none");
    setLastResult(null);
    setDone(false);
    setStarted(true);
    const q = generateQuestion(vocab, allVocab, usedIdsRef.current);
    setCurrentQuestion(q);
  }, [vocab, allVocab]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (answeredRef.current || done || !currentQuestion) return;
      answeredRef.current = true;

      const isCorrect = answer === currentQuestion.correctAnswer;
      usedIdsRef.current.add(currentQuestion.vocab.id);

      setTotalAnswered((t) => t + 1);
      setLastResult(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        setScore((s) => s + 1);
        setFlash("correct");
        setTimeLeft((t) => Math.min(t + CORRECT_BONUS, 99));
      } else {
        setFlash("wrong");
        setTimeLeft((t) => Math.max(t - WRONG_PENALTY, 0));
      }

      // Clear flash and load next
      setTimeout(() => {
        setFlash("none");
        setLastResult(null);
        loadNextQuestion();
      }, 300);
    },
    [done, currentQuestion, loadNextQuestion]
  );

  const timerPct = (timeLeft / INITIAL_TIME) * 100;
  const isLow = timeLeft <= 15;
  const accuracy =
    totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

  // ─── Start screen ───────────────────────────────────────────────────────────
  if (!started && !done) {
    return (
      <div className="flex flex-col items-center gap-8 py-8 px-4 text-center">
        <div className="text-7xl">⚡</div>
        <div>
          <h2 className="text-3xl font-black mb-2" style={{ color: "#1E1225" }}>
            Speed Round
          </h2>
          <p className="text-sm" style={{ color: "#6B5F7A" }}>
            60 seconds · answer as many as you can!
          </p>
        </div>

        <div
          className="rounded-2xl p-5 w-full max-w-xs text-left space-y-2"
          style={{
            background: "white",
            border: "1px solid rgba(240,230,238,1)",
          }}
        >
          {[
            ["✅ Correct answer", `+1 point, +${CORRECT_BONUS}s`],
            ["❌ Wrong answer", `-${WRONG_PENALTY}s penalty`],
            ["⏱ Time limit", "60 seconds"],
            ["⚡ Max XP", `${MAX_XP} XP`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span style={{ color: "#6B5F7A" }}>{label}</span>
              <span className="font-semibold" style={{ color: "#1E1225" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <motion.button
          onClick={startGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-2xl text-lg font-black"
          style={{
            background: "linear-gradient(to right, #F4A261, #F7B88A)",
            color: "#1E1225",
            boxShadow: "0 4px 24px rgba(244,162,97,0.40)",
          }}
        >
          Start!
        </motion.button>
      </div>
    );
  }

  // ─── Done screen ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8 px-4"
      >
        <div className="text-6xl">⚡</div>
        <h2 className="text-4xl font-black" style={{ color: "#1E1225" }}>
          Time&apos;s Up!
        </h2>

        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[
            { label: "Score", value: score, color: "#F4A261" },
            { label: "Accuracy", value: `${accuracy}%`, color: "#10B981" },
            { label: "Answered", value: totalAnswered, color: "#9B7FE8" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl p-3"
              style={{
                background: "white",
                border: "1px solid rgba(240,230,238,1)",
              }}
            >
              <div className="text-2xl font-black" style={{ color }}>
                {value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#6B5F7A" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {xpEarned > 0 && (
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5"
            style={{
              background: "rgba(244,162,97,0.12)",
              border: "1px solid rgba(244,162,97,0.28)",
            }}
          >
            <span className="font-bold text-lg" style={{ color: "#F4A261" }}>
              +{xpEarned} XP
            </span>
            <span className="text-sm" style={{ color: "#6B5F7A" }}>
              earned
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={startGame}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(to right, #F4A261, #F7B88A)",
              color: "#1E1225",
            }}
          >
            ⚡ Play Again
          </button>
          <Link
            href="/games"
            className="px-6 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: "white",
              border: "1px solid rgba(240,230,238,1)",
              color: "#6B5F7A",
            }}
          >
            Other Games
          </Link>
          <Link
            href={`/vocab/${chapterId}`}
            className="px-6 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(155,127,232,0.12)",
              border: "1px solid rgba(155,127,232,0.25)",
              color: "#9B7FE8",
            }}
          >
            Study Vocab
          </Link>
        </div>
      </motion.div>
    );
  }

  // ─── Active game ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 select-none">
      {/* Timer bar + HUD */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {/* Timer number */}
          <motion.span
            key={timeLeft}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-3xl font-black tabular-nums"
            style={{ color: isLow ? "#E8436F" : "#1E1225" }}
          >
            {timeLeft}s
          </motion.span>

          {/* Score */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm" style={{ color: "#6B5F7A" }}>
              Score
            </span>
            <span
              className="text-xl font-black"
              style={{ color: "#F4A261" }}
            >
              {score}
            </span>
          </div>
        </div>

        {/* Timer bar */}
        <div
          className="h-3 rounded-full overflow-hidden"
          style={{ background: "rgba(255,232,240,1)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: isLow
                ? "linear-gradient(to right, #E8436F, #F06B8A)"
                : "linear-gradient(to right, #E8436F, #F4A261)",
            }}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Low time pulse indicator */}
        {isLow && (
          <motion.p
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-xs text-center font-semibold"
            style={{ color: "#E8436F" }}
          >
            Hurry!
          </motion.p>
        )}
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div
            key={currentQuestion.vocab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              backgroundColor:
                flash === "correct"
                  ? "rgba(16,185,129,0.10)"
                  : flash === "wrong"
                  ? "rgba(239,68,68,0.10)"
                  : "rgba(255,240,245,0.9)",
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl text-center py-10 px-6"
            style={{
              border:
                flash === "correct"
                  ? "1px solid rgba(16,185,129,0.35)"
                  : flash === "wrong"
                  ? "1px solid rgba(239,68,68,0.35)"
                  : "1px solid rgba(240,230,238,1)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: "#B0A8BB" }}
            >
              What does this mean?
            </p>
            <p
              className="text-5xl font-black"
              style={{
                color: "#1E1225",
                fontFamily: "'Noto Sans KR', sans-serif",
              }}
            >
              {currentQuestion.vocab.korean}
            </p>
            <p className="text-sm mt-2" style={{ color: "#B0A8BB" }}>
              {currentQuestion.vocab.romanization}
            </p>

            {/* Flash feedback text */}
            <AnimatePresence>
              {lastResult && (
                <motion.p
                  key={lastResult}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-sm font-bold"
                  style={{
                    color: lastResult === "correct" ? "#10B981" : "#EF4444",
                  }}
                >
                  {lastResult === "correct" ? `✓ +${CORRECT_BONUS}s` : `✗ -${WRONG_PENALTY}s`}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer options 2x2 */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div
            key={`opts-${currentQuestion.vocab.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-2 gap-3"
          >
            {currentQuestion.options.map((option, idx) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(option)}
                className="rounded-xl px-4 py-4 text-sm font-semibold text-center transition-all duration-150"
                style={{
                  background: "white",
                  border: "1px solid rgba(240,230,238,1)",
                  color: "#1E1225",
                  minHeight: "4rem",
                  lineHeight: "1.3",
                  cursor: "pointer",
                }}
              >
                {option}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
