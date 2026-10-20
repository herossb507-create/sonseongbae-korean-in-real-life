"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "@/hooks/useXP";
import { XP_ACTIONS } from "@/lib/xp";
import { speakKorean } from "@/lib/tts";
import type { VocabItem } from "@/lib/vocab-data";

// ── Question types ──────────────────────────────────────────
// "meaning"  : hear Korean → pick the correct English meaning (4 English options)
// "spelling" : hear Korean → pick the correct Korean spelling (4 Korean options)
// "context"  : hear Korean → pick the sentence it belongs to (4 English options that look similar)
type QuestionFormat = "meaning" | "spelling";

interface ListeningQuestion {
  vocab: VocabItem;
  format: QuestionFormat;
  correctAnswer: string;
  options: string[];
  prompt: string;
  badge: string; // small tag shown on question card
}

interface Props {
  chapterId: string;
  vocab: VocabItem[];
  allVocab: VocabItem[];
}

// ── Helpers ─────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Classify a vocab item as single-word/short vs. multi-word phrase/sentence */
function vocabType(item: VocabItem): "word" | "phrase" {
  const eng = item.english.trim();
  const kor = item.korean.trim();
  if (
    eng.split(" ").length >= 3 ||
    /\b(I|you|we|he|she|they|it|let|please|don't|can|do|is|are|have)\b/i.test(eng) ||
    kor.endsWith("요") ||
    kor.endsWith("까") ||
    kor.endsWith("다") ||
    kor.endsWith("세요") ||
    kor.includes(" ")
  ) {
    return "phrase";
  }
  return "word";
}

/**
 * Pick 3 wrong English options that match the same type (word/phrase)
 * and have a similar word-count to make them less obvious.
 */
function pickWrongEnglish(
  item: VocabItem,
  pool: VocabItem[],
): string[] {
  const type = vocabType(item);
  const targetLen = item.english.split(" ").length;

  // 1. Same type, similar length (within ±2 words)
  let candidates = pool.filter(
    (v) =>
      v.id !== item.id &&
      v.english !== item.english &&
      vocabType(v) === type &&
      Math.abs(v.english.split(" ").length - targetLen) <= 2,
  );

  // 2. Fallback: same type, any length
  if (candidates.length < 3) {
    candidates = pool.filter(
      (v) => v.id !== item.id && v.english !== item.english && vocabType(v) === type,
    );
  }

  // 3. Last resort: any vocab with similar length
  if (candidates.length < 3) {
    candidates = pool.filter(
      (v) =>
        v.id !== item.id &&
        v.english !== item.english &&
        Math.abs(v.english.split(" ").length - targetLen) <= 2,
    );
  }

  // 4. Absolute fallback
  if (candidates.length < 3) {
    candidates = pool.filter((v) => v.id !== item.id && v.english !== item.english);
  }

  return shuffleArray(candidates)
    .slice(0, 3)
    .map((v) => v.english);
}

/**
 * Pick 3 wrong Korean options that match the same type.
 * For "spelling" questions the distractors should look visually similar
 * (same length bracket, same type).
 */
function pickWrongKorean(
  item: VocabItem,
  pool: VocabItem[],
): string[] {
  const type = vocabType(item);
  const targetLen = item.korean.replace(/\s/g, "").length;

  // Same type, similar character count (±3 chars)
  let candidates = pool.filter(
    (v) =>
      v.id !== item.id &&
      v.korean !== item.korean &&
      vocabType(v) === type &&
      Math.abs(v.korean.replace(/\s/g, "").length - targetLen) <= 3,
  );

  if (candidates.length < 3) {
    candidates = pool.filter(
      (v) => v.id !== item.id && v.korean !== item.korean && vocabType(v) === type,
    );
  }

  if (candidates.length < 3) {
    candidates = pool.filter((v) => v.id !== item.id && v.korean !== item.korean);
  }

  return shuffleArray(candidates)
    .slice(0, 3)
    .map((v) => v.korean);
}

// ── Question generation ────────────────────────────────────

function generateQuestions(
  vocab: VocabItem[],
  allVocab: VocabItem[],
): ListeningQuestion[] {
  const shuffled = shuffleArray(vocab);
  const selected = shuffled.slice(0, Math.min(10, shuffled.length));

  return selected.map((item, idx) => {
    // Alternate between formats: 0,2,4,6,8 → meaning | 1,3,5,7,9 → spelling
    // But only use "spelling" if vocab pool has enough Korean alternatives
    const hasEnoughForSpelling = allVocab.filter(
      (v) => v.id !== item.id && v.korean !== item.korean && vocabType(v) === vocabType(item),
    ).length >= 2;

    const useSpelling = idx % 3 === 2 && hasEnoughForSpelling; // every 3rd question
    const format: QuestionFormat = useSpelling ? "spelling" : "meaning";

    if (format === "spelling") {
      const wrongKorean = pickWrongKorean(item, allVocab);
      const options = shuffleArray([item.korean, ...wrongKorean]);
      return {
        vocab: item,
        format,
        correctAnswer: item.korean,
        options,
        prompt: `You hear: "${item.english}" — which Korean is correct?`,
        badge: "Korean spelling",
      };
    } else {
      const wrongEnglish = pickWrongEnglish(item, allVocab);
      const options = shuffleArray([item.english, ...wrongEnglish]);
      return {
        vocab: item,
        format,
        correctAnswer: item.english,
        options,
        prompt: "What does this sound mean?",
        badge: "Meaning",
      };
    }
  });
}

// ── Component ──────────────────────────────────────────────

export default function ListeningQuiz({ chapterId, vocab, allVocab }: Props) {
  const { addXP } = useXP();
  const [questions, setQuestions] = useState<ListeningQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [wrongWords, setWrongWords] = useState<{ korean: string; correct: string }[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlayAttempted, setAutoPlayAttempted] = useState(false);

  useEffect(() => {
    setQuestions(generateQuestions(vocab, allVocab));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAutoPlayAttempted(false);
  }, [currentIndex]);

  useEffect(() => {
    if (questions.length === 0 || done || autoPlayAttempted) return;
    if (selectedAnswer !== null) return;
    setAutoPlayAttempted(true);
    const current = questions[currentIndex];
    if (!current) return;
    const timer = setTimeout(() => {
      setIsSpeaking(true);
      speakKorean(current.vocab.audioHint || current.vocab.korean);
      setTimeout(() => setIsSpeaking(false), 2000);
    }, 300);
    return () => clearTimeout(timer);
  }, [questions, currentIndex, done, autoPlayAttempted, selectedAnswer]);

  const handleSpeak = useCallback(() => {
    if (!questions[currentIndex]) return;
    const current = questions[currentIndex];
    setIsSpeaking(true);
    speakKorean(current.vocab.audioHint || current.vocab.korean);
    setTimeout(() => setIsSpeaking(false), 2000);
  }, [questions, currentIndex]);

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
          { korean: current.vocab.korean, correct: current.correctAnswer },
        ]);
      }

      const delay = isCorrect ? 1200 : 1800;

      setTimeout(async () => {
        if (currentIndex + 1 >= questions.length) {
          const finalScore = isCorrect ? score + 1 : score;
          const pct = finalScore / questions.length;
          let xp = 0;
          if (pct === 1) xp = XP_ACTIONS.QUIZ_PERFECT;
          else if (pct >= 0.6) xp = XP_ACTIONS.QUIZ_PASS;
          if (xp > 0) await addXP(xp);
          setXpEarned(xp);
          setDone(true);
        } else {
          setCurrentIndex((i) => i + 1);
          setSelectedAnswer(null);
        }
      }, delay);
    },
    [selectedAnswer, questions, currentIndex, score, addXP],
  );

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-pulse">🔊</div>
          <p style={{ color: "#6B5F7A" }}>Preparing listening quiz…</p>
        </div>
      </div>
    );
  }

  // ── Done screen ────────────────────────────────────────
  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 60;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8 px-4"
      >
        <div className="text-6xl">{pct === 100 ? "🏆" : passed ? "🎉" : "📚"}</div>
        <h2 className="text-4xl font-black" style={{ color: "#1E1225" }}>
          {score} / {questions.length}
        </h2>
        <p style={{ color: "#6B5F7A" }}>
          {pct === 100
            ? "Perfect score! Your ears are sharp!"
            : passed
            ? "Great listening! Keep it up."
            : "Keep practicing — your ears will improve!"}
        </p>

        {xpEarned > 0 && (
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5"
            style={{ background: "rgba(244,162,97,0.12)", border: "1px solid rgba(244,162,97,0.28)" }}
          >
            <span className="font-bold text-lg" style={{ color: "#F4A261" }}>
              +{xpEarned} XP
            </span>
            <span className="text-sm" style={{ color: "#6B5F7A" }}>
              earned
            </span>
          </div>
        )}

        {wrongWords.length > 0 && (
          <div
            className="text-left rounded-2xl p-5 max-w-sm mx-auto"
            style={{ background: "white", border: "1px solid rgba(240,230,238,1)" }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: "#6B5F7A" }}>
              Review these:
            </p>
            <ul className="space-y-2">
              {wrongWords.map((w, i) => (
                <li key={i} className="flex justify-between text-sm gap-3">
                  <span className="font-medium font-noto-kr" style={{ color: "#1E1225" }}>
                    {w.korean}
                  </span>
                  <span style={{ color: "#6B5F7A" }} className="text-right">
                    {w.correct}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href={`/games/listening/${chapterId}`}
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ background: "white", border: "1px solid rgba(240,230,238,1)", color: "#6B5F7A" }}
          >
            Try again
          </a>
          <a
            href={`/vocab/${chapterId}`}
            className="px-6 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(155,127,232,0.15)",
              border: "1px solid rgba(155,127,232,0.25)",
              color: "#9B7FE8",
            }}
          >
            Study vocab
          </a>
          <a
            href={`/learn/${chapterId}`}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(to right, #E8436F, #F06B8A)", color: "white" }}
          >
            Back to chapter
          </a>
        </div>
      </motion.div>
    );
  }

  const current = questions[currentIndex];
  const total = questions.length;
  const isSpelling = current.format === "spelling";

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs" style={{ color: "#6B5F7A" }}>
          <span>
            Question {currentIndex + 1} of {total}
          </span>
          <span>Score: {score}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,232,240,1)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(to right, #9B7FE8, #E8436F)" }}
            animate={{ width: `${(currentIndex / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question type badge */}
      <div className="flex justify-center">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{
            background: isSpelling ? "rgba(155,127,232,0.12)" : "rgba(232,67,111,0.10)",
            color: isSpelling ? "#9B7FE8" : "#E8436F",
            border: `1px solid ${isSpelling ? "rgba(155,127,232,0.25)" : "rgba(232,67,111,0.20)"}`,
          }}
        >
          {isSpelling ? "🇰🇷 Korean Spelling" : "💬 Meaning"}
        </span>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center gap-5"
          style={{
            background: isSpelling
              ? "linear-gradient(135deg, #F5F0FF 0%, #FFF5F8 100%)"
              : "linear-gradient(135deg, #FFF0F5 0%, #FFF5F8 100%)",
            border: "1px solid rgba(240,230,238,1)",
            borderRadius: "24px",
            padding: "2.5rem 1.5rem",
          }}
        >
          {/* For spelling: show English meaning first */}
          {isSpelling && (
            <p className="text-base font-semibold text-center" style={{ color: "#1E1225" }}>
              &ldquo;{current.vocab.english}&rdquo;
            </p>
          )}

          <p className="text-xs uppercase tracking-widest font-medium" style={{ color: "#B0A8BB" }}>
            {isSpelling ? "Hear it, then pick the Korean" : "What does this sound mean?"}
          </p>

          {/* Play button */}
          <motion.button
            onClick={handleSpeak}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={
              isSpeaking
                ? {
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      "0 0 40px rgba(232,67,111,0.35)",
                      "0 0 70px rgba(232,67,111,0.60)",
                      "0 0 40px rgba(232,67,111,0.35)",
                    ],
                  }
                : {}
            }
            transition={isSpeaking ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" } : {}}
            className="w-28 h-28 rounded-full flex items-center justify-center text-4xl"
            style={{
              background: isSpelling
                ? "linear-gradient(135deg, #9B7FE8 0%, #C084FC 100%)"
                : "linear-gradient(135deg, #E8436F 0%, #F06B8A 100%)",
              boxShadow: isSpelling
                ? "0 0 60px rgba(155,127,232,0.40)"
                : "0 0 60px rgba(232,67,111,0.40)",
              cursor: "pointer",
              border: "none",
            }}
            aria-label="Hear the word"
          >
            🔊
          </motion.button>

          <p className="text-xs" style={{ color: "#B0A8BB" }}>
            {isSpeaking ? "Playing…" : "Tap to hear again"}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Answer options */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`options-${currentIndex}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="grid grid-cols-2 gap-3"
        >
          {current.options.map((option, idx) => {
            let bg = "white";
            let border = "rgba(240,230,238,1)";
            let color = "#1E1225";
            let cursor = "pointer";

            if (selectedAnswer !== null) {
              cursor = "default";
              if (option === current.correctAnswer) {
                bg = "rgba(52,200,153,0.12)";
                border = "#34C899";
                color = "#10B981";
              } else if (option === selectedAnswer) {
                bg = "rgba(239,68,68,0.12)";
                border = "#EF4444";
                color = "#EF4444";
              } else {
                bg = "rgba(240,230,238,0.4)";
                border = "rgba(240,230,238,0.8)";
                color = "#B0A8BB";
              }
            }

            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={selectedAnswer === null ? { scale: 1.02, y: -1 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.97 } : {}}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`rounded-xl px-4 py-4 text-sm font-medium text-center transition-all duration-200 ${
                  isSpelling ? "font-noto-kr" : ""
                }`}
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  color,
                  cursor,
                  minHeight: "4.5rem",
                  lineHeight: "1.4",
                  fontSize: isSpelling ? "1rem" : "0.875rem",
                }}
              >
                {option}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {selectedAnswer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center rounded-xl py-3 px-4 text-sm font-semibold"
            style={{
              background:
                selectedAnswer === current.correctAnswer
                  ? "rgba(52,200,153,0.10)"
                  : "rgba(239,68,68,0.10)",
              border:
                selectedAnswer === current.correctAnswer
                  ? "1px solid rgba(52,200,153,0.3)"
                  : "1px solid rgba(239,68,68,0.3)",
              color: selectedAnswer === current.correctAnswer ? "#10B981" : "#EF4444",
            }}
          >
            {selectedAnswer === current.correctAnswer ? (
              <span>Correct! ✓</span>
            ) : (
              <span>
                <span className="font-noto-kr">{current.vocab.korean}</span>
                {" = "}
                &ldquo;{current.vocab.english}&rdquo;
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
