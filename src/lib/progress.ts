"use client";

// Learning progress, stored in this browser only (no accounts).
// Everything that used to live in Supabase tables — user_gamification,
// user_progress, user_vocab_stats, profiles.display_name — lives here now.

import { useSyncExternalStore } from "react";
import { recordActivity } from "@/lib/activity-log";
import { levelFromXP } from "@/lib/xp";

const STORAGE_KEY = "kril-progress-v1";
const CHANGE_EVENT = "kril-progress-change";

export interface ChapterProgress {
  completed: boolean;
  lastReadAt: string; // ISO
  completedAt?: string; // ISO
}

export interface VocabProgress {
  status: "learning" | "mastered";
  nextReviewAt: string; // ISO
  intervalDays: number;
  easeFactor: number;
  reviewCount: number;
  correctCount: number;
  lastReviewed: string; // ISO
}

export interface Progress {
  displayName: string;
  xp: number;
  streakCurrent: number;
  streakLongest: number;
  lastActivity: string | null; // YYYY-MM-DD, local date
  dailyGoalXp: number;
  chapters: Record<string, ChapterProgress>;
  vocab: Record<string, VocabProgress>;
}

export const EMPTY_PROGRESS: Progress = {
  displayName: "",
  xp: 0,
  streakCurrent: 0,
  streakLongest: 0,
  lastActivity: null,
  dailyGoalXp: 50,
  chapters: {},
  vocab: {},
};

// ── Store ────────────────────────────────────────────────────────────────────

let cachedRaw: string | null | undefined;
let cached: Progress = EMPTY_PROGRESS;

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null; // blocked storage (private mode, settings)
  }
}

export function readProgress(): Progress {
  const raw = storage()?.getItem(STORAGE_KEY) ?? null;
  if (raw === cachedRaw) return cached; // stable reference for useSyncExternalStore
  cachedRaw = raw;
  try {
    cached = raw ? { ...EMPTY_PROGRESS, ...(JSON.parse(raw) as Partial<Progress>) } : EMPTY_PROGRESS;
  } catch {
    cached = EMPTY_PROGRESS;
  }
  return cached;
}

export function updateProgress(update: (p: Progress) => Progress): Progress {
  const next = update(readProgress());
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or blocked storage: keep going without saving.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return next;
}

export function resetProgress() {
  try {
    storage()?.removeItem(STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Current progress; null during server render, before the browser store is read. */
export function useProgress(): Progress | null {
  return useSyncExternalStore(subscribe, readProgress, () => null);
}

// ── Actions ──────────────────────────────────────────────────────────────────

function localDate(d = new Date()) {
  return d.toLocaleDateString("sv-SE"); // YYYY-MM-DD in the learner's timezone
}

function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

/** Counts today toward the streak: +1 after a consecutive day, reset after a gap. */
function withStreak(p: Progress): Progress {
  const today = localDate();
  if (p.lastActivity === today) return p;
  const streak = p.lastActivity && daysBetween(p.lastActivity, today) === 1 ? p.streakCurrent + 1 : 1;
  return {
    ...p,
    streakCurrent: streak,
    streakLongest: Math.max(streak, p.streakLongest),
    lastActivity: today,
  };
}

export function addXP(amount: number) {
  recordActivity(amount); // heatmap log
  const before = readProgress();
  const after = updateProgress((p) => withStreak({ ...p, xp: p.xp + amount }));
  const oldLevel = levelFromXP(before.xp);
  const newLevel = levelFromXP(after.xp);
  return { oldXP: before.xp, newXP: after.xp, newLevel, leveledUp: newLevel > oldLevel };
}

export function markChapterRead(slug: string) {
  updateProgress((p) => ({
    ...p,
    chapters: {
      ...p.chapters,
      [slug]: { ...p.chapters[slug], completed: p.chapters[slug]?.completed ?? false, lastReadAt: new Date().toISOString() },
    },
  }));
}

export function markChapterComplete(slug: string) {
  const now = new Date().toISOString();
  updateProgress((p) =>
    withStreak({
      ...p,
      chapters: { ...p.chapters, [slug]: { completed: true, lastReadAt: now, completedAt: now } },
    }),
  );
}

/** Puts a word in the review queue (first review tomorrow). */
export function markWordKnown(id: string) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  updateProgress((p) =>
    p.vocab[id]
      ? p
      : {
          ...p,
          vocab: {
            ...p.vocab,
            [id]: {
              status: "learning",
              nextReviewAt: tomorrow.toISOString(),
              intervalDays: 1,
              easeFactor: 2.5,
              reviewCount: 0,
              correctCount: 0,
              lastReviewed: now.toISOString(),
            },
          },
        },
  );
}

export function setDisplayName(name: string) {
  updateProgress((p) => ({ ...p, displayName: name.trim().slice(0, 40) }));
}

// ── Derived values ───────────────────────────────────────────────────────────

/** Streak as the learner should see it today: 0 once a day has been missed. */
export function currentStreak(p: Progress) {
  if (!p.lastActivity) return 0;
  return daysBetween(p.lastActivity, localDate()) <= 1 ? p.streakCurrent : 0;
}

export function completedChapterIds(p: Progress) {
  return Object.entries(p.chapters)
    .filter(([, c]) => c.completed)
    .map(([id]) => id);
}

export function lastReadChapter(p: Progress) {
  const entries = Object.entries(p.chapters).sort((a, b) => b[1].lastReadAt.localeCompare(a[1].lastReadAt));
  return entries[0] ? { slug: entries[0][0], ...entries[0][1] } : null;
}

export function knownWordCount(p: Progress) {
  return Object.keys(p.vocab).length;
}
