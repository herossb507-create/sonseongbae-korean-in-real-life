import type { VocabItem } from "@/lib/vocab-data";

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr];
  let hash = simpleHash(seed);
  for (let i = result.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(hash) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Returns today's date as "YYYY-MM-DD" */
export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Deterministically selects 10 vocab items for the given date.
 * All users on the same date will get identical questions.
 */
export function getDailyVocab(date: string, allVocab: VocabItem[]): VocabItem[] {
  const shuffled = seededShuffle(allVocab, date);
  return shuffled.slice(0, 10);
}

/**
 * For a given question item, generate 4 answer options (1 correct + 3 wrong)
 * using the date seed so the distractors are also deterministic.
 */
export function getDailyOptions(
  item: VocabItem,
  allVocab: VocabItem[],
  questionIndex: number,
  date: string
): string[] {
  const seed = `${date}-opts-${questionIndex}`;
  const others = allVocab.filter((v) => v.id !== item.id && v.english !== item.english);
  const shuffledOthers = seededShuffle(others, seed);
  const wrongAnswers = shuffledOthers.slice(0, 3).map((v) => v.english);
  const options = seededShuffle([item.english, ...wrongAnswers], `${seed}-final`);
  return options;
}
