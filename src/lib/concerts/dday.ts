// K-pop fans count down to a show as "D-12" … "D-DAY".

/** Whole days from today (YYYY-MM-DD) to the show date; negative once it's over. */
export function daysUntil(date: string, today: string) {
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}

/** "D-DAY", "D-3", or null for a past show. */
export function dDay(date: string, today: string | null) {
  if (!today) return null;
  const n = daysUntil(date, today);
  return n < 0 ? null : n === 0 ? "D-DAY" : `D-${n}`;
}
