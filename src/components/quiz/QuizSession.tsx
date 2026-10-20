"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "@/hooks/useXP";
import { XP_ACTIONS } from "@/lib/xp";
import { speakKorean } from "@/lib/tts";
import type { VocabItem } from "@/lib/vocab-data";

interface QuizQuestion {
  korean: string;
  romanization: string;
  correctAnswer: string;
  options: string[];
}

interface Props {
  chapterId: string;
  vocab: VocabItem[];       // chapter vocab — question source
  allVocab: VocabItem[];    // all vocab — wrong-answer pool
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(vocab: VocabItem[], allVocab: VocabItem[]): QuizQuestion[] {
  const shuffled = shuffleArray(vocab);
  const questions = shuffled.slice(0, Math.min(10, shuffled.length));

  return questions.map((item) => {
    const correct = item.english;
    // Pick 3 wrong answers from other vocab items
    const otherEnglish = allVocab
      .filter((v) => v.id !== item.id && v.english !== correct)
      .map((v) => v.english);
    const wrongOptions = shuffleArray(otherEnglish).slice(0, 3);
    const options = shuffleArray([correct, ...wrongOptions]);
    return {
      korean: item.korean,
      romanization: item.romanization,
      correctAnswer: correct,
      options,
    };
  });
}

export function QuizSession({ chapterId, vocab, allVocab }: Props) {
  const { addXP } = useXP();
  // Generate questions only on client to avoid SSR/hydration mismatch (Math.random)
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [wrongWords, setWrongWords] = useState<{ korean: string; correct: string }[]>([]);

  useEffect(() => {
    setQuestions(generateQuestions(vocab, allVocab));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = useCallback((text: string) => speakKorean(text), []);

  const handleAnswer = useCallback(
    async (answer: string) => {
      if (selectedAnswer !== null) return;
      setSelectedAnswer(answer);

      const current = questions[currentIndex];
      const isCorrect = answer === current.correctAnswer;

      if (isCorrect) {
        setScore((s) => s + 1);
      } else {
        setWrongWords((w) => [
          ...w,
          { korean: current.korean, correct: current.correctAnswer },
        ]);
      }

      // Auto-advance after 1.2 s
      setTimeout(async () => {
        if (currentIndex + 1 >= questions.length) {
          // Quiz done — calculate XP
          const finalScore = isCorrect ? score + 1 : score;
          const total = questions.length;
          const pct = finalScore / total;
          let xp = 0;
          if (pct === 1) {
            xp = XP_ACTIONS.QUIZ_PERFECT;
          } else if (pct >= 0.6) {
            xp = XP_ACTIONS.QUIZ_PASS;
          }
          if (xp > 0) await addXP(xp);
          setXpEarned(xp);
          setDone(true);
        } else {
          setCurrentIndex((i) => i + 1);
          setSelectedAnswer(null);
        }
      }, 1200);
    },
    [selectedAnswer, questions, currentIndex, score, addXP]
  );

  // Still loading (client-side question generation not yet run)
  if (questions.length === 0) {
    return (
      <div className="text-center py-20 text-[#6B5F7A]">
        {vocab.length < 4
          ? "Not enough vocabulary for a quiz. Study some words first!"
          : "Loading quiz…"}
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 60;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8"
      >
        <div className="text-6xl">{pct === 100 ? "🏆" : passed ? "🎉" : "📚"}</div>
        <h2 className="text-3xl font-bold text-[#1E1225]">
          {score} / {questions.length}
        </h2>
        <p className="text-[#6B5F7A]">
          {pct === 100
            ? "Perfect score! Incredible!"
            : passed
            ? "Great work! Keep it up."
            : "Keep studying — you'll get there!"}
        </p>

        {xpEarned > 0 && (
          <div className="inline-flex items-center gap-2 bg-[#F4A261]/10 border border-[#F4A261]/25 rounded-full px-4 py-2">
            <span className="text-[#F4A261] font-bold">+{xpEarned} XP</span>
            <span className="text-[#6B5F7A] text-sm">earned</span>
          </div>
        )}

        {wrongWords.length > 0 && (
          <div className="text-left bg-white border border-[#F0E6EE] rounded-2xl p-5 max-w-sm mx-auto shadow-sm">
            <p className="text-sm font-semibold text-[#6B5F7A] mb-3">Review these words:</p>
            <ul className="space-y-2">
              {wrongWords.map((w, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-[#1E1225] font-medium">{w.korean}</span>
                  <span className="text-[#6B5F7A]">{w.correct}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href={`/quiz/${chapterId}`}
            className="px-6 py-2.5 bg-white border border-[#F0E6EE] rounded-xl text-[#6B5F7A] hover:text-[#1E1225] hover:border-[#E8D5E0] transition-colors text-sm font-medium shadow-sm"
          >
            Try again
          </a>
          <a
            href={`/vocab/${chapterId}`}
            className="px-6 py-2.5 bg-[#9B7FE8]/15 border border-[#9B7FE8]/25 rounded-xl text-[#9B7FE8] hover:bg-[#9B7FE8]/25 transition-colors text-sm font-medium"
          >
            Study vocab
          </a>
          <a
            href="/learn"
            className="px-6 py-2.5 bg-gradient-to-r from-[#E8436F] to-[#F06B8A] rounded-xl text-white hover:opacity-90 transition-opacity text-sm font-medium"
          >
            Next chapter →
          </a>
        </div>
      </motion.div>
    );
  }

  const current = questions[currentIndex];
  const total = questions.length;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[#6B5F7A]">
          <span>Question {currentIndex + 1} of {total}</span>
          <span>Score: {score}</span>
        </div>
        <div className="h-1.5 bg-[#FFE8F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#9B7FE8] to-[#E8436F] rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex) / total) * 100}%` }}
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
          className="bg-gradient-to-br from-[#FFF0F5] to-[#FFF5F8] border border-[#F0E6EE] rounded-3xl p-8 text-center shadow-sm"
        >
          <p className="text-xs text-[#B0A8BB] uppercase tracking-widest mb-4">
            What does this mean?
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl font-bold text-[#1E1225] font-noto-kr">{current.korean}</span>
            <button
              onClick={() => speak(current.korean)}
              className="text-xl opacity-60 hover:opacity-100 transition-opacity"
              title="Hear pronunciation"
            >
              🔊
            </button>
          </div>
          <p className="text-[#B0A8BB] text-sm mt-2">{current.romanization}</p>
        </motion.div>
      </AnimatePresence>

      {/* Answer options */}
      <div className="grid grid-cols-1 gap-3">
        {current.options.map((option) => {
          let style =
            "bg-white border-[#F0E6EE] text-[#1E1225] hover:bg-[#FFF5F8] hover:border-[#E8D5E0]";
          if (selectedAnswer !== null) {
            if (option === current.correctAnswer) {
              style = "bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]";
            } else if (option === selectedAnswer && option !== current.correctAnswer) {
              style = "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]";
            } else {
              style = "bg-[#FFF5F8] border-[#F0E6EE] text-[#B0A8BB]";
            }
          }
          return (
            <motion.button
              key={option}
              whileHover={selectedAnswer === null ? { scale: 1.01 } : {}}
              whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all duration-200 text-sm font-medium shadow-sm ${style}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
