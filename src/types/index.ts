// Supabase DB 타입 (supabase gen types 명령으로 자동 생성 가능)
// 아래는 수동 정의 — 실제로는 `npx supabase gen types typescript` 사용 권장

export type SubscriptionStatus = "active" | "canceled" | "past_due";
export type SubscriptionPlan = "monthly" | "annual";
export type VocabStatus = "new" | "learning" | "mastered";

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_sub_id: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  current_period_end: string;
  created_at: string;
}

export interface Chapter {
  id: string;
  chapter_num: number;
  slug: string;
  title: string;
  is_free: boolean;
  word_count: number;
  created_at: string;
}

export interface Vocabulary {
  id: string;
  chapter_id: string;
  korean: string;
  romanization: string;
  english: string;
  audio_hint: string;
  display_order: number;
  example_ko: string | null;  // Phase 2: 한국어 예문
  example_en: string | null;  // Phase 2: 영어 예문 번역
}

export interface UserProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  is_completed: boolean;
  last_read_at: string;
  scroll_position: number;      // Phase 2: 마지막 스크롤 위치
  completed_at: string | null;  // Phase 2: 완료 시각
}

export interface UserVocabStat {
  id: string;
  user_id: string;
  vocab_id: string;
  known: boolean;
  reviewed_at: string;
  // Phase 2: SRS 필드
  status: VocabStatus;
  next_review_at: string;
  interval_days: number;
  ease_factor: number;
  review_count: number;
  correct_count: number;
}

// Phase 2: 게이미피케이션
export interface UserGamification {
  id: string;
  user_id: string;
  xp: number;
  level: number;
  streak_current: number;
  streak_longest: number;
  last_activity: string | null;  // DATE (YYYY-MM-DD)
  daily_goal_xp: number;
  created_at: string;
}

// Phase 2: 뱃지
export type BadgeId =
  | "first_chapter"    // 첫 챕터 완료
  | "streak_7"         // 7일 연속 학습
  | "streak_30"        // 30일 연속 학습
  | "quiz_perfect"     // 퀴즈 만점
  | "vocab_50"         // 단어 50개 마스터
  | "vocab_100"        // 단어 100개 마스터
  | "all_chapters"     // 전체 챕터 완료
  | string;            // 확장 가능

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: BadgeId;
  earned_at: string;
}

// Phase 2: 북마크
export interface Bookmark {
  id: string;
  user_id: string;
  chapter_id: string;
  content: string;
  created_at: string;
}

// Supabase Database 타입 (자동 생성 타입을 위한 placeholder)
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "created_at">; Update: Partial<Profile> };
      subscriptions: { Row: Subscription; Insert: Omit<Subscription, "id" | "created_at">; Update: Partial<Subscription> };
      chapters: { Row: Chapter; Insert: Omit<Chapter, "id" | "created_at">; Update: Partial<Chapter> };
      vocabulary: { Row: Vocabulary; Insert: Omit<Vocabulary, "id">; Update: Partial<Vocabulary> };
      user_progress: { Row: UserProgress; Insert: Omit<UserProgress, "id">; Update: Partial<UserProgress> };
      user_vocab_stats: { Row: UserVocabStat; Insert: Omit<UserVocabStat, "id">; Update: Partial<UserVocabStat> };
      user_gamification: { Row: UserGamification; Insert: Omit<UserGamification, "id" | "created_at">; Update: Partial<UserGamification> };
      user_badges: { Row: UserBadge; Insert: Omit<UserBadge, "id" | "earned_at">; Update: never };
      bookmarks: { Row: Bookmark; Insert: Omit<Bookmark, "id" | "created_at">; Update: Partial<Bookmark> };
    };
  };
};
