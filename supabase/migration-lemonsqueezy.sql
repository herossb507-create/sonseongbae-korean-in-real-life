-- =============================================
-- Lemon Squeezy 마이그레이션
-- Stripe 컬럼 → Lemon Squeezy 컬럼으로 교체
-- Supabase SQL Editor에서 실행
-- =============================================

-- subscriptions 테이블 재생성 (Stripe → Lemon Squeezy)
-- 기존 데이터가 없다면 DROP 후 재생성이 가장 깔끔함
DROP TABLE IF EXISTS subscriptions;

CREATE TABLE subscriptions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ls_customer_id       TEXT NOT NULL,
  ls_subscription_id   TEXT NOT NULL UNIQUE,
  status               TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  plan                 TEXT NOT NULL CHECK (plan IN ('monthly', 'annual')),
  current_period_end   TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 재적용
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions: self read"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- =============================================
-- 기존 subscriptions 테이블이 있고 데이터를 유지해야 할 때:
-- (위 DROP/CREATE 대신 아래 ALTER를 사용)
-- =============================================
-- ALTER TABLE subscriptions RENAME COLUMN stripe_customer_id TO ls_customer_id;
-- ALTER TABLE subscriptions RENAME COLUMN stripe_sub_id TO ls_subscription_id;
-- ALTER TABLE subscriptions ALTER COLUMN current_period_end DROP NOT NULL;
