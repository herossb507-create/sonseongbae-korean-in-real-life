// SM-2 간격반복 알고리즘
// quality: 0=완전망각, 1=몰라요, 2=어려워요, 3=힌트필요, 4=알았어요, 5=완벽

export function calculateNextReview(
  quality: number,
  intervalDays: number,
  easeFactor: number
): { nextInterval: number; nextEaseFactor: number } {
  const newEaseFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  let nextInterval: number;
  if (quality < 3) {
    nextInterval = 1; // 틀렸으면 내일 다시
  } else if (intervalDays <= 1) {
    nextInterval = 6;
  } else {
    nextInterval = Math.round(intervalDays * newEaseFactor);
  }

  return { nextInterval, nextEaseFactor: newEaseFactor };
}

export function nextReviewDate(intervalDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + intervalDays);
  return date.toISOString();
}

// 복습 버튼 3단계 정의
export const REVIEW_BUTTONS = [
  {
    quality: 1,
    label: "Again",
    sublabel: "Didn't know",
    hint: "Tomorrow",
    emoji: "😵",
    color: "border-[#EF4444]/40 text-[#EF4444] hover:bg-[#EF4444]/10",
  },
  {
    quality: 3,
    label: "Hard",
    sublabel: "Got it with effort",
    hint: "~6 days",
    emoji: "😅",
    color: "border-[#F59E0B]/40 text-[#F59E0B] hover:bg-[#F59E0B]/10",
  },
  {
    quality: 5,
    label: "Easy",
    sublabel: "Knew it!",
    hint: "~2 weeks",
    emoji: "😊",
    color: "border-[#10B981]/40 text-[#10B981] hover:bg-[#10B981]/10",
  },
] as const;
