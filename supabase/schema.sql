-- =============================================
-- Korean in Real Life — Supabase DB 스키마
-- Supabase SQL Editor에서 실행
-- =============================================

-- 1. profiles — 사용자 프로필 (auth.users와 연동)
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  display_name  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- auth.users에 새 유저 생성 시 profiles 자동 생성 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. subscriptions — Stripe 구독 정보
CREATE TABLE IF NOT EXISTS subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id  TEXT NOT NULL,
  stripe_sub_id       TEXT NOT NULL UNIQUE,
  status              TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  plan                TEXT NOT NULL CHECK (plan IN ('monthly', 'annual')),
  current_period_end  TIMESTAMPTZ NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 3. chapters — 챕터 메타 정보
CREATE TABLE IF NOT EXISTS chapters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_num   INT NOT NULL UNIQUE CHECK (chapter_num BETWEEN 1 AND 16),
  slug          TEXT NOT NULL UNIQUE,  -- 'ch01-hangul'
  title         TEXT NOT NULL,
  is_free       BOOLEAN NOT NULL DEFAULT FALSE,
  word_count    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 초기 챕터 데이터
INSERT INTO chapters (chapter_num, slug, title, is_free, word_count) VALUES
  (1,  'ch01-hangul',           'Hangul — The Korean Alphabet',    TRUE,  320),
  (2,  'ch02-greetings',        'Greetings & Introductions',       TRUE,  410),
  (3,  'ch03-numbers',          'Numbers & Counting',              FALSE, 390),
  (4,  'ch04-time',             'Time & Dates',                    FALSE, 450),
  (5,  'ch05-food',             'Food & Ordering',                 FALSE, 480),
  (6,  'ch06-shopping',         'Shopping & Money',                FALSE, 420),
  (7,  'ch07-directions',       'Directions & Transportation',     FALSE, 460),
  (8,  'ch08-family',           'Family & Relationships',          FALSE, 400),
  (9,  'ch09-work',             'Work & Daily Routine',            FALSE, 470),
  (10, 'ch10-health',           'Health & Body',                   FALSE, 430),
  (11, 'ch11-weather',          'Weather & Seasons',               FALSE, 380),
  (12, 'ch12-hobbies',          'Hobbies & Free Time',             FALSE, 440),
  (13, 'ch13-travel',           'Travel & Tourism',                FALSE, 500),
  (14, 'ch14-culture',          'Culture & Customs',               FALSE, 460),
  (15, 'ch15-media',            'Media & Technology',              FALSE, 420),
  (16, 'ch16-advanced',         'Advanced Conversations',          FALSE, 510)
ON CONFLICT DO NOTHING;

-- 4. vocabulary — 챕터별 어휘
CREATE TABLE IF NOT EXISTS vocabulary (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id    UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  korean        TEXT NOT NULL,
  romanization  TEXT NOT NULL,
  english       TEXT NOT NULL,
  audio_hint    TEXT NOT NULL,  -- TTS에 넘길 텍스트
  display_order INT NOT NULL DEFAULT 0
);

-- 5. user_progress — 챕터 읽기 진도
CREATE TABLE IF NOT EXISTS user_progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id    UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  is_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  last_read_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, chapter_id)
);

-- 6. user_vocab_stats — 어휘 학습 통계
CREATE TABLE IF NOT EXISTS user_vocab_stats (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vocab_id      UUID NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  known         BOOLEAN NOT NULL DEFAULT FALSE,
  reviewed_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, vocab_id)
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters         ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocab_stats ENABLE ROW LEVEL SECURITY;

-- profiles: 본인만 읽기/수정
CREATE POLICY "profiles: self read"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: self update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- subscriptions: 본인만 읽기
CREATE POLICY "subscriptions: self read" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- chapters: 누구나 읽기 (무료/유료 구분은 앱 레이어에서)
CREATE POLICY "chapters: public read" ON chapters FOR SELECT USING (TRUE);

-- vocabulary: 누구나 읽기
CREATE POLICY "vocabulary: public read" ON vocabulary FOR SELECT USING (TRUE);

-- user_progress: 본인만 CRUD
CREATE POLICY "progress: self read"   ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "progress: self insert" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress: self update" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- user_vocab_stats: 본인만 CRUD
CREATE POLICY "vocab_stats: self read"   ON user_vocab_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "vocab_stats: self insert" ON user_vocab_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vocab_stats: self update" ON user_vocab_stats FOR UPDATE USING (auth.uid() = user_id);
