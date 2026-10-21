// XP 액션별 포인트 정의
export const XP_ACTIONS = {
  CHAPTER_COMPLETE:  50,
  FLASHCARD_SET:     20,
  QUIZ_PASS:         30,
  QUIZ_PERFECT:      50,
  WORD_MASTERED:      5,
  SRS_REVIEW:        10,
  STREAK_DAILY:       5,
  STREAK_7_DAY:     100,
} as const;

// 레벨 n에 필요한 누적 XP: L1=0, L2=100, L3=300, L4=600, L5=1000...
// 공식: (n-1)*n/2 * 100
export function xpForLevel(level: number): number {
  return ((level - 1) * level * 100) / 2;
}

export function levelFromXP(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

export function xpToNextLevel(xp: number): {
  current: number;
  needed: number;
  level: number;
  percent: number;
} {
  const level = levelFromXP(xp);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const current = xp - currentLevelXP;
  const needed = nextLevelXP - currentLevelXP;
  return { current, needed, level, percent: Math.min((current / needed) * 100, 100) };
}

export const LEVEL_NAMES: Record<number, string> = {
  1:  "Beginner",
  2:  "Learner",
  3:  "Student",
  4:  "Speaker",
  5:  "Conversant",
  6:  "Fluent",
  7:  "Advanced",
  8:  "Expert",
  9:  "Master",
  10: "Legend",
};

export function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.min(level, 10)] ?? "Legend";
}
