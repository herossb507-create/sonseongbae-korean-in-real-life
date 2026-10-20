"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "@/hooks/useXP";
import { speakKorean } from "@/lib/tts";
import { getDailyOptions } from "@/lib/daily-challenge";
import type { VocabItem } from "@/lib/vocab-data";

interface DailyResult {
  score: number;
  total: number;
  date: string;
}

interface QuizQuestion {
  korean: string;
  romanization: string;
  correctAnswer: string;
  options: string[];
}

interface Props {
  initialVocab: VocabItem[];
  allVocab: VocabItem[];
  todayStr: string;
}

const DAILY_XP = 40;

function buildQuestions(vocab: VocabItem[], allVocab: VocabItem[], date: string): QuizQuestion[] {
  return vocab.map((item, idx) => ({
    korean: item.korean,
    romanization: item.romanization,
    correctAnswer: item.english,
    options: getDailyOptions(item, allVocab, idx, date),
  }));
}

function getStars(score: number, total: number): number {
  const pct = score / total;
  if (pct === 1) return 3;
  if (pct >= 0.7) return 2;
  return 1;
}

function formatCountdown(ms: number): string {
  const totalSecs = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
}

function getMidnightMs(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function CompletedScreen({ result, todayStr }: { result: DailyResult; todayStr: string }) {
  const [countdown, setCountdown] = useState(() => getMidnightMs());
  const stars = getStars(result.score, result.total);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getMidnightMs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const shareText = `Korean in Real Life Daily Challenge 🔥 ${todayStr}: ${result.score}/${result.total} ${"⭐".repeat(stars)}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-8"
    >
      {/* Trophy / completion icon */}
      <div className="text-6xl">{stars === 3 ? "🏆" : stars === 2 ? "🎉" : "💪"}</div>

      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          오늘의 도전 완료! ✅
        </h2>
        <p className="text-[#8892B0] text-sm">{todayStr}</p>
      </div>

      {/* Score */}
      <div className="bg-white/5 backdrop-blur-lg border border-[#FFD700]/20 rounded-2xl p-6 max-w-xs mx-auto">
        <p className="text-[#FFD700] text-xs font-semibold uppercase tracking-widest mb-2">
          Today's Score
        </p>
        <p className="text-5xl font-bold text-white mb-2">
          {result.score}
          <span className="text-[#8892B0] text-3xl">/{result.total}</span>
        </p>
        <div className="flex justify-center gap-1 text-2xl">
          {"⭐".repeat(stars)}
          {"☆".repeat(3 - stars)}
        </div>
      </div>

      {/* XP badge */}
      <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full px-5 py-2">
        <span className="text-[#FFD700] font-bold">+{DAILY_XP} XP</span>
        <span className="text-[#8892B0] text-sm">earned today</span>
      </div>

      {/* Countdown */}
      <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 inline-block">
        <p className="text-[#8892B0] text-xs mb-1">Next challenge in</p>
        <p className="text-white font-mono font-semibold text-lg">{formatCountdown(countdown)}</p>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="block mx-auto text-sm text-[#8892B0] border border-white/10 rounded-lg px-4 py-2 hover:text-white hover:border-white/20 transition-colors"
      >
        📋 Copy result to clipboard
      </button>
    </motion.div>
  );
}

export function DailyChallenge({ initialVocab, allVocab, todayStr }: Props) {
  const { addXP } = useXP();
  const [alreadyDone, setAlreadyDone] = useState<DailyResult | null>(null);
  const [questions] = useState<QuizQuestion[]>(() =>
    buildQuestions(initialVocab, allVocab, todayStr)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [wrongWords, setWrongWords] = useState<{ korean: string; correct: string }[]>([]);
  const [countdown, setCountdown] = useState(() => getMidnightMs());

  const storageKey = `daily-challenge-${todayStr}`;

  // Check localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setAlreadyDone(JSON.parse(stored) as DailyResult);
      }
    } catch {
      // ignore parse errors
    }
  }, [storageKey]);

  // Countdown timer for done screen
  useEffect(() => {
    if (!done) return;
    const interval = setInterval(() => setCountdown(getMidnightMs()), 1000);
    return () => clearInterval(interval);
  }, [done]);

  const speak = useCallback((text: string) => speakKorean(text), []);

  const handleAnswer = useCallback(
    async (answer: string) => {
      if (selectedAnswer !== null) return;
      setSelectedAnswer(answer);

      const current = questions[currentIndex];
      const isCorrect = answer === current.correctAnswer;

      let nextScore = score;
      if (isCorrect) {
        nextScore = score + 1;
        setScore(nextScore);
      } else {
        setWrongWords((w) => [
          ...w,
          { korean: current.korean, correct: current.correctAnswer },
        ]);
      }

      setTimeout(async () => {
        if (currentIndex + 1 >= questions.length) {
          const finalScore = isCorrect ? score + 1 : score;
          // Save to localStorage
          const result: DailyResult = {
            score: finalScore,
            total: questions.length,
            date: todayStr,
          };
          try {
            localStorage.setItem(storageKey, JSON.stringify(result));
          } catch {
            // ignore storage errors
          }
          // Award XP
          await addXP(DAILY_XP);
          setXpEarned(DAILY_XP);
          setDone(true);
        } else {
          setCurrentIndex((i) => i + 1);
          setSelectedAnswer(null);
        }
      }, 1200);
    },
    [selectedAnswer, questions, currentIndex, score, addXP, storageKey, todayStr]
  );

  // Already completed today — show result
  if (alreadyDone) {
    return <CompletedScreen result={alreadyDone} todayStr={todayStr} />;
  }

  // Quiz finished — show result
  if (done) {
    const stars = getStars(score, questions.length);
    const shareText = `Korean in Real Life Daily Challenge 🔥 ${todayStr}: ${score}/${questions.length} ${"⭐".repeat(stars)}`;
    const handleShare = () => {
      if (navigator.clipboard) navigator.clipboard.writeText(shareText);
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8"
      >
        <div className="text-6xl">{stars === 3 ? "🏆" : stars === 2 ? "🎉" : "💪"}</div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Challenge Complete!</h2>
          <p className="text-[#8892B0] text-sm">{todayStr}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-[#FFD700]/20 rounded-2xl p-6 max-w-xs mx-auto">
          <p className="text-[#FFD700] text-xs font-semibold uppercase tracking-widest mb-2">
            Final Score
          </p>
          <p className="text-5xl font-bold text-white mb-2">
            {score}
            <span className="text-[#8892B0] text-3xl">/{questions.length}</span>
          </p>
          <div className="flex justify-center gap-1 text-2xl">
            {"⭐".repeat(stars)}
            {"☆".repeat(3 - stars)}
          </div>
        </div>

        {xpEarned > 0 && (
          <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full px-5 py-2">
            <span className="text-[#FFD700] font-bold">+{xpEarned} XP</span>
            <span className="text-[#8892B0] text-sm">earned</span>
          </div>
        )}

        {wrongWords.length > 0 && (
          <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-5 max-w-sm mx-auto">
            <p className="text-sm font-semibold text-[#8892B0] mb-3">Review these words:</p>
            <ul className="space-y-2">
              {wrongWords.map((w, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-white font-medium">{w.korean}</span>
                  <span className="text-[#8892B0]">{w.correct}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Countdown to next challenge */}
        <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 inline-block">
          <p className="text-[#8892B0] text-xs mb-1">Next challenge in</p>
          <p className="text-white font-mono font-semibold text-lg">{formatCountdown(countdown)}</p>
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          className="block mx-auto text-sm text-[#8892B0] border border-white/10 rounded-lg px-4 py-2 hover:text-white hover:border-white/20 transition-colors"
        >
          📋 Copy result to clipboard
        </button>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href="/vocab/ch01"
            className="px-6 py-2.5 bg-[#4F7FE8]/20 border border-[#4F7FE8]/30 rounded-xl text-[#4F7FE8] hover:bg-[#4F7FE8]/30 transition-colors text-sm font-medium"
          >
            Study vocab
          </a>
          <a
            href="/learn"
            className="px-6 py-2.5 bg-gradient-to-r from-[#FF4757] to-[#FF6B81] rounded-xl text-white hover:opacity-90 transition-opacity text-sm font-medium"
          >
            Back to chapters
          </a>
        </div>
      </motion.div>
    );
  }

  const current = questions[currentIndex];
  const total = questions.length;

  return (
    <div className="space-y-6">
      {/* Gold banner header */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full px-4 py-1.5 mb-3">
          <span className="text-[#FFD700] text-sm font-semibold">🔥 Daily Challenge · {todayStr}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[#8892B0]">
          <span>Question {currentIndex + 1} of {total}</span>
          <span className="text-[#FFD700] font-medium">Score: {score}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FFD700] to-[#FF4757] rounded-full"
            initial={false}
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
          className="bg-gradient-to-br from-[#1a2040] to-[#0f1629] border border-[#FFD700]/20 rounded-3xl p-8 text-center shadow-[0_0_40px_rgba(255,215,0,0.05)]"
        >
          <p className="text-xs text-[#4A5568] uppercase tracking-widest mb-4">
            What does this mean?
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl font-bold text-white font-noto-kr">
              {current.korean}
            </span>
            <button
              onClick={() => speak(current.korean)}
              className="text-xl opacity-60 hover:opacity-100 transition-opacity"
              title="Hear pronunciation"
            >
              🔊
            </button>
          </div>
          <p className="text-[#4A5568] text-sm mt-2">{current.romanization}</p>
        </motion.div>
      </AnimatePresence>

      {/* Answer options */}
      <div className="grid grid-cols-1 gap-3">
        {current.options.map((option) => {
          let style =
            "bg-white/5 border-white/10 text-[#C0C8D8] hover:bg-white/[0.08] hover:border-[#FFD700]/30";
          if (selectedAnswer !== null) {
            if (option === current.correctAnswer) {
              style = "bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]";
            } else if (option === selectedAnswer && option !== current.correctAnswer) {
              style = "bg-[#EF4444]/20 border-[#EF4444]/50 text-[#EF4444]";
            } else {
              style = "bg-white/[0.03] border-white/5 text-[#4A5568]";
            }
          }
          return (
            <motion.button
              key={option}
              whileHover={selectedAnswer === null ? { scale: 1.01 } : {}}
              whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all duration-200 text-sm font-medium ${style}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
