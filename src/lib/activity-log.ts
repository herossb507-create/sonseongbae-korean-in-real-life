export interface DayActivity {
  date: string; // "2026-03-19"
  xp: number;
  actions: number;
}

const STORAGE_KEY = "kr-activity-log";

export function recordActivity(xp: number): void {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().split("T")[0];
  const raw = localStorage.getItem(STORAGE_KEY);
  const log: Record<string, DayActivity> = raw ? JSON.parse(raw) : {};
  if (!log[today]) log[today] = { date: today, xp: 0, actions: 0 };
  log[today].xp += xp;
  log[today].actions += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

export function getActivityLog(days: number = 182): DayActivity[] {
  const result: DayActivity[] = [];
  let log: Record<string, DayActivity> = {};

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        log = JSON.parse(raw);
      } catch {
        log = {};
      }
    }
  }

  // Build array from (days-1) days ago up to today (inclusive)
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    result.push(
      log[dateStr] ?? { date: dateStr, xp: 0, actions: 0 }
    );
  }

  return result;
}

export function getDayActivity(date: string): DayActivity | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const log: Record<string, DayActivity> = JSON.parse(raw);
    return log[date] ?? null;
  } catch {
    return null;
  }
}
