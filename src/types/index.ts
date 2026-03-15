// Supabase DB 타입 (supabase gen types 명령으로 자동 생성 가능)
// 아래는 수동 정의 — 실제로는 `npx supabase gen types typescript` 사용 권장

export type SubscriptionStatus = "active" | "canceled" | "past_due";
export type SubscriptionPlan = "monthly" | "annual";

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
}

export interface UserProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  is_completed: boolean;
  last_read_at: string;
}

export interface UserVocabStat {
  id: string;
  user_id: string;
  vocab_id: string;
  known: boolean;
  reviewed_at: string;
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
    };
  };
};
