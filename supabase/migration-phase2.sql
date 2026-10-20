-- =============================================
-- Korean in Real Life — Phase 2 마이그레이션
-- SRS + 게이미피케이션 + 예문 + 북마크 + 뱃지
-- Supabase SQL Editor에서 실행
-- =============================================

-- =============================================
-- 4-1. vocabulary 테이블 — 예문 컬럼 추가
-- =============================================
ALTER TABLE vocabulary
  ADD COLUMN IF NOT EXISTS example_ko TEXT,   -- 한국어 예문
  ADD COLUMN IF NOT EXISTS example_en TEXT;   -- 영어 예문 번역

-- =============================================
-- 4-2. user_vocab_stats — SRS 컬럼 추가
-- =============================================
ALTER TABLE user_vocab_stats
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new'
    CHECK (status IN ('new', 'learning', 'mastered')),
  ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS interval_days INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS ease_factor FLOAT DEFAULT 2.5,
  ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS correct_count INT DEFAULT 0;

-- =============================================
-- 4-3. user_progress — 스크롤 위치 + 완료 시각 추가
-- =============================================
ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS scroll_position INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- =============================================
-- 4-4. user_gamification — 신규 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS user_gamification (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  xp              INT NOT NULL DEFAULT 0,
  level           INT NOT NULL DEFAULT 1,
  streak_current  INT NOT NULL DEFAULT 0,
  streak_longest  INT NOT NULL DEFAULT 0,
  last_activity   DATE,
  daily_goal_xp   INT NOT NULL DEFAULT 50,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gamification: self read"
  ON user_gamification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "gamification: self insert"
  ON user_gamification FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "gamification: self update"
  ON user_gamification FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- 4-5. bookmarks — 신규 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id  UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarks: self crud"
  ON bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- =============================================
-- 4-6. user_badges — 신규 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS user_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id    TEXT NOT NULL,
  earned_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "badges: self read"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "badges: self insert"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);
