"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useXP } from "@/hooks/useXP";
import { VocabItem } from "@/lib/vocab-data";

interface MemoryCard {
  id: string;
  pairId: string;
  type: "korean" | "english";
  korean: string;
  english: string;
  romanization: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchProps {
  chapterId: string;
  vocab: VocabItem[];
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildCards(vocabItems: VocabItem[]): MemoryCard[] {
  const selected = shuffle(vocabItems).slice(0, 8);
  const cards: MemoryCard[] = [];

  selected.forEach((item, index) => {
    const pairId = `vocab-${index}`;
    cards.push({
      id: `${pairId}-ko`,
      pairId,
      type: "korean",
      korean: item.korean,
      english: item.english,
      romanization: item.romanization,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: `${pairId}-en`,
      pairId,
      type: "english",
      korean: item.korean,
      english: item.english,
      romanization: item.romanization,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffle(cards);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function calcXP(moves: number): { base: number; bonus: number; total: number } {
  const base = 25;
  let bonus = 0;
  if (moves <= 16) bonus = 15;
  else if (moves <= 24) bonus = 7;
  return { base, bonus, total: base + bonus };
}

function calcStars(moves: number): number {
  if (moves <= 16) return 3;
  if (moves <= 24) return 2;
  return 1;
}

interface CardProps {
  card: MemoryCard;
  onClick: (card: MemoryCard) => void;
}

function MemoryCardTile({ card, onClick }: CardProps) {
  const isVisible = card.isFlipped || card.isMatched;

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => onClick(card)}
    >
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isVisible ? 180 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative w-full"
      >
        {/* Back face (hidden state) */}
        <div
          className="absolute inset-0 rounded-2xl flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #FFF0F5 0%, #FFF5F8 100%)",
            border: "1px solid rgba(232,67,111,0.15)",
            boxShadow: "0 4px 16px rgba(232,67,111,0.08)",
            minHeight: "120px",
          }}
        >
          <span
            className="font-noto-kr font-black select-none"
            style={{ fontSize: "2.5rem", color: "rgba(232,67,111,0.15)" }}
          >
            한
          </span>
        </div>

        {/* Front face (revealed state) */}
        <div
          className="rounded-2xl flex flex-col items-center justify-center p-3 select-none"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            minHeight: "120px",
            background:
              card.type === "korean"
                ? "linear-gradient(135deg, #FFF0F5 0%, #FFE8F0 100%)"
                : "linear-gradient(135deg, #F5F0FF 0%, #EDE8FF 100%)",
            border: card.isMatched
              ? "2px solid #10B981"
              : card.type === "korean"
              ? "1px solid rgba(232,67,111,0.35)"
              : "1px solid rgba(155,127,232,0.35)",
            boxShadow: card.isMatched
              ? "0 8px 32px rgba(16,185,129,0.15)"
              : "0 4px 16px rgba(232,67,111,0.06)",
            backgroundColor: card.isMatched ? "rgba(16,185,129,0.08)" : undefined,
          }}
        >
          {card.type === "korean" ? (
            <>
              <span
                className="font-noto-kr font-bold text-center leading-tight"
                style={{
                  fontSize: card.korean.length > 6 ? "1rem" : card.korean.length > 4 ? "1.25rem" : "1.5rem",
                  color: "#1E1225",
                }}
              >
                {card.korean}
              </span>
              <span
                className="mt-1 text-center"
                style={{ fontSize: "0.65rem", color: "#6B5F7A" }}
              >
                {card.romanization}
              </span>
            </>
          ) : (
            <span
              className="text-center font-medium leading-tight"
              style={{
                fontSize: card.english.length > 20 ? "0.7rem" : card.english.length > 12 ? "0.85rem" : "1rem",
                color: "#1E1225",
              }}
            >
              {card.english}
            </span>
          )}

          {card.isMatched && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2"
            >
              <span style={{ fontSize: "1rem" }}>✓</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function MemoryMatch({ chapterId, vocab }: MemoryMatchProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const isChecking = useRef(false);

  const { addXP } = useXP();

  // Initialize cards on client side to avoid SSR hydration mismatch
  useEffect(() => {
    setCards(buildCards(vocab));
  }, [vocab]);

  // Timer
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Award XP when game completes
  useEffect(() => {
    if (isComplete && !xpAwarded) {
      setXpAwarded(true);
      const { total } = calcXP(moves);
      setEarnedXP(total);
      addXP(total).catch(() => {});
    }
  }, [isComplete, xpAwarded, moves, addXP]);

  const resetGame = useCallback(() => {
    setCards(buildCards(vocab));
    setFlippedIds([]);
    setMoves(0);
    setMatchedCount(0);
    setIsComplete(false);
    setSeconds(0);
    setTimerRunning(false);
    setXpAwarded(false);
    setEarnedXP(0);
    isChecking.current = false;
  }, [vocab]);

  const handleCardClick = useCallback(
    (card: MemoryCard) => {
      // Ignore if already matched, already flipped, or currently checking
      if (card.isMatched || card.isFlipped || isChecking.current) return;
      if (flippedIds.length >= 2) return;

      // Start timer on first click
      if (!timerRunning && moves === 0 && flippedIds.length === 0) {
        setTimerRunning(true);
      }

      // Flip the card
      const newFlipped = [...flippedIds, card.id];
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
      );
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        isChecking.current = true;

        // Find both cards
        setCards((prev) => {
          const [id1, id2] = newFlipped;
          const card1 = prev.find((c) => c.id === id1);
          const card2 = prev.find((c) => c.id === id2);

          if (card1 && card2 && card1.pairId === card2.pairId) {
            // Match!
            const updated = prev.map((c) =>
              c.id === id1 || c.id === id2
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            );
            const newMatchedCount = updated.filter((c) => c.isMatched).length / 2;
            setMatchedCount(newMatchedCount);
            setFlippedIds([]);
            isChecking.current = false;

            if (newMatchedCount === 8) {
              setTimerRunning(false);
              setTimeout(() => setIsComplete(true), 500);
            }

            return updated;
          } else {
            // No match — flip back after 1 second
            setTimeout(() => {
              setCards((curr) =>
                curr.map((c) =>
                  c.id === id1 || c.id === id2
                    ? { ...c, isFlipped: false }
                    : c
                )
              );
              setFlippedIds([]);
              isChecking.current = false;
            }, 1000);

            return prev;
          }
        });
      }
    },
    [flippedIds, timerRunning, moves]
  );

  const stars = calcStars(moves);
  const { base, bonus } = calcXP(moves);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#FFF5F8" }}
    >
      {/* HUD */}
      <div
        className="sticky top-0 z-10 px-4 py-3"
        style={{
          background: "rgba(255,245,248,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(240,230,238,1)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Link
            href={`/learn/${chapterId}`}
            className="flex items-center gap-1 text-sm transition-colors"
            style={{ color: "#6B5F7A" }}
          >
            <span>←</span>
            <span>Back</span>
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <span style={{ color: "#10B981" }}>★</span>
              <span style={{ color: "#1E1225" }}>
                {matchedCount} / 8 pairs
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: "#9B7FE8" }}>↕</span>
              <span style={{ color: "#1E1225" }}>{moves} moves</span>
            </div>
            <div
              className="font-mono font-bold"
              style={{ color: "#F4A261", minWidth: "3.5rem", textAlign: "right" }}
            >
              {formatTime(seconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center pt-6 pb-4 px-4">
        <h1 className="text-xl font-bold" style={{ color: "#1E1225" }}>
          Memory Match
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B5F7A" }}>
          Match each Korean word with its English meaning
        </p>
      </div>

      {/* Card Grid */}
      <div className="flex-1 px-4 pb-8">
        <div
          className="max-w-2xl mx-auto grid gap-3"
          style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          {cards.map((card) => (
            <MemoryCardTile key={card.id} card={card} onClick={handleCardClick} />
          ))}
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            key="completion-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(255,245,248,0.90)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-md rounded-3xl p-8"
              style={{
                background: "white",
                border: "1px solid rgba(240,230,238,1)",
                boxShadow: "0 24px 64px rgba(232,67,111,0.15)",
              }}
            >
              {/* Celebration */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="text-5xl mb-3"
                >
                  🎉
                </motion.div>
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ color: "#1E1225" }}
                >
                  완료!
                </h2>
                <p style={{ color: "#6B5F7A" }}>Game complete!</p>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3].map((star) => (
                  <motion.span
                    key={star}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15 + star * 0.08, type: "spring" }}
                    style={{
                      fontSize: "2rem",
                      filter: star <= stars ? "none" : "grayscale(1) opacity(0.3)",
                    }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div
                  className="rounded-2xl p-4 text-center"
                  style={{
                    background: "rgba(240,230,238,0.5)",
                    border: "1px solid rgba(240,230,238,1)",
                  }}
                >
                  <div
                    className="text-lg font-bold"
                    style={{ color: "#1E1225" }}
                  >
                    {formatTime(seconds)}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#6B5F7A" }}>
                    Time
                  </div>
                </div>
                <div
                  className="rounded-2xl p-4 text-center"
                  style={{
                    background: "rgba(240,230,238,0.5)",
                    border: "1px solid rgba(240,230,238,1)",
                  }}
                >
                  <div
                    className="text-lg font-bold"
                    style={{ color: "#1E1225" }}
                  >
                    {moves}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#6B5F7A" }}>
                    Moves
                  </div>
                </div>
                <div
                  className="rounded-2xl p-4 text-center"
                  style={{
                    background: "rgba(155,127,232,0.10)",
                    border: "1px solid rgba(155,127,232,0.25)",
                  }}
                >
                  <div
                    className="text-lg font-bold"
                    style={{ color: "#F4A261" }}
                  >
                    +{earnedXP || base + bonus}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#6B5F7A" }}>
                    XP
                  </div>
                </div>
              </div>

              {/* XP breakdown */}
              {bonus > 0 && (
                <p className="text-center text-xs mb-6" style={{ color: "#10B981" }}>
                  Base {base} XP + Bonus {bonus} XP for efficiency!
                </p>
              )}

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={resetGame}
                  className="w-full rounded-xl py-3 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(to right, #E8436F, #F06B8A)",
                    color: "white",
                    boxShadow: "0 4px 24px rgba(232,67,111,0.35)",
                  }}
                >
                  다시하기 (Play Again)
                </button>
                <Link
                  href={`/vocab/${chapterId}`}
                  className="w-full rounded-xl py-3 font-semibold text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] block"
                  style={{
                    background: "rgba(240,230,238,0.5)",
                    border: "1px solid rgba(240,230,238,1)",
                    color: "#1E1225",
                  }}
                >
                  어휘 학습하기 (Study Vocab)
                </Link>
                <Link
                  href={`/games`}
                  className="w-full rounded-xl py-3 font-semibold text-center transition-all duration-200 hover:opacity-80 block"
                  style={{ color: "#6B5F7A" }}
                >
                  Back to Games
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
