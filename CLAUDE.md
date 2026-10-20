# CLAUDE.md — Korean in Real Life · 학습 플랫폼 프로젝트 지침

> Claude Code가 이 파일을 자동으로 읽어 프로젝트 컨텍스트를 이해합니다.
> **위치: 반드시 Next.js 프로젝트 루트에 `CLAUDE.md`로 저장하세요.**

---

## 🗂️ 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 앱 이름 | **Korean in Real Life** |
| 부제 | AI-Powered Korean Learning Platform |
| 목적 | 동명 전자책 콘텐츠 기반 구독형 한국어 학습 SaaS |
| 타겟 유저 | 완전 초보자 ~ 초급 수준의 영어권 한국어 학습자 |
| 수익 모델 | Stripe 월/연 구독 (Free Tier 포함) |

---

## ⚙️ 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | v4 |
| Components | shadcn/ui | latest |
| Animation | Framer Motion | 11.x |
| Auth | Supabase Auth | latest |
| Database | Supabase PostgreSQL | latest |
| Storage | Supabase Storage | latest |
| Payment | Stripe (Subscriptions + Webhook) | latest |
| TTS | Web Speech API (여성 목소리 자동 선택) | - |
| AI (Future) | Vercel AI SDK + OpenAI | latest |
| Deployment | Vercel | - |

---

## 🎨 디자인 시스템 (2026 트렌드 반영)

### 핵심 컨셉: **Dark Glassmorphism**
> 어두운 배경 위에 반투명 유리 패널을 올린 느낌.
> Duolingo의 친근함 + Notion의 정갈함 + Apple의 세련됨을 조합.

### 색상 팔레트

```css
/* 배경 */
--bg-base:        #0a0e1a;   /* 딥 네이비 (메인 배경) */
--bg-surface:     #0f1629;   /* 약간 밝은 배경 (카드 뒤) */

/* 글래스 패널 */
--glass-bg:       rgba(255, 255, 255, 0.05);
--glass-border:   rgba(255, 255, 255, 0.10);
--glass-blur:     backdrop-filter: blur(16px);

/* 포인트 컬러 */
--accent-red:     #FF4757;   /* 한국 전통색 영감, 주요 CTA */
--accent-blue:    #4F7FE8;   /* 보조 액션, 링크 */
--accent-gold:    #FFD700;   /* 스트릭/뱃지/포인트 */

/* 텍스트 */
--text-primary:   #F0F4FF;
--text-secondary: #8892B0;
--text-muted:     #4A5568;

/* 상태 컬러 */
--success:        #10B981;
--warning:        #F59E0B;
--error:          #EF4444;
```

### 타이포그래피
```css
/* 영어 */
font-family: 'Inter', sans-serif;          /* CSS var: --font-inter */

/* 한국어 본문 */
font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif;  /* CSS var: --font-noto-kr */
```

### 핵심 UI 패턴

**1. 글래스 카드**
```tsx
className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6
           shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-white/8 transition-all duration-300"
```

**2. 그라디언트 버튼 (Primary CTA)**
```tsx
className="bg-gradient-to-r from-[#FF4757] to-[#FF6B81]
           hover:from-[#FF6B81] hover:to-[#FF4757]
           text-white font-semibold rounded-xl px-6 py-3
           shadow-[0_4px_24px_rgba(255,71,87,0.4)]
           transition-all duration-300 hover:scale-105 active:scale-95"
```

**3. 한글 카드 (Flashcard/Vocab)**
```tsx
className="bg-gradient-to-br from-[#1a2040] to-[#0f1629]
           border border-white/10 rounded-3xl p-8
           text-5xl font-bold text-white text-center font-noto-kr
           shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
```

**4. 진도 바**
```tsx
className="h-2 bg-white/10 rounded-full overflow-hidden"
// inner: className="h-full bg-gradient-to-r from-[#4F7FE8] to-[#FF4757] rounded-full transition-all duration-700"
```

### 반응형 전략
- Mobile-first
- Breakpoints: `sm:640px` `md:768px` `lg:1024px` `xl:1280px`
- 챕터 리더: max-width 720px (가독성 우선)
- 대시보드: 3-column grid → 1-column mobile

---

## 🚀 전체 기능 목록 (Feature Registry)

### 🆓 FREE TIER (비회원 / 무료 회원)

| 기능 ID | 기능명 | 상태 | 설명 |
|---------|--------|------|------|
| F-01 | 랜딩 페이지 | ✅ | 앱 소개, 챕터 로드맵, 비교표, FAQ, CTA |
| F-02 | 무료 챕터 미리보기 | ✅ | Ch01~Ch02 전체 읽기 |
| F-03 | 기본 TTS 발음 | ✅ | 여성 목소리(유나) 자동 선택 |
| F-04 | 요금제 페이지 | ✅ | Pricing + FAQ |
| F-05 | 소셜 로그인 | ✅ | Google OAuth (Supabase) |

### 💎 PRO TIER (유료 구독자)

#### 📖 읽기 & 콘텐츠
| 기능 ID | 기능명 | 상태 | 설명 |
|---------|--------|------|------|
| R-01 | 전체 챕터 읽기 | ✅ | Ch01~Ch16 전체 |
| R-02 | 로마자 토글 | ✅ | 한글 아래 로마자 표기 ON/OFF |
| R-03 | 폰트 크기 조절 | ✅ | A−/A+ 버튼, localStorage 저장 |
| R-04 | 읽기 진도 저장 | ✅ | 마지막 읽은 위치 자동 저장 |
| R-05 | 챕터 완료 체크 | ✅ | 챕터 읽음 표시 + 진도율 업데이트 |

#### 🔊 발음 & 듣기
| 기능 ID | 기능명 | 상태 | 설명 |
|---------|--------|------|------|
| P-01 | 단어 TTS 재생 | ✅ | 단어 클릭 → 한국어 여성 발음 즉시 재생 |
| P-02 | 문장 TTS 재생 | ✅ | 예문 전체 읽어주기 |
| P-03 | 재생 속도 조절 | ✅ | 0.75x / 1x / 1.25x 속도 선택 |
| P-04 | Listening Quiz | 🔜 | 🔊 소리 듣고 뜻 고르기 (TTS 활용) |

#### 🃏 어휘 학습 (Flashcard + SRS)
| 기능 ID | 기능명 | 상태 | 설명 |
|---------|--------|------|------|
| V-01 | 챕터별 플래시카드 | ✅ | 한글 → 뒤집기 → 영어 뜻, 스와이프 제스처 |
| V-02 | 아는 단어 표시 | ✅ | ✓ 버튼으로 "마스터" 처리 |
| V-03 | SRS 복습 큐 | ✅ | 망각 곡선 기반 복습 단어 추천 |
| V-04 | 발음 재생 (카드) | ✅ | 카드 앞면에서 발음 듣기 버튼 |

#### 🧠 퀴즈 & 미니게임
| 기능 ID | 기능명 | 상태 | 설명 |
|---------|--------|------|------|
| Q-01 | 챕터 퀴즈 | ✅ | 4지 선다 어휘 퀴즈 (챕터 완료 후) |
| Q-02 | Memory Match | 🔜 | 카드 뒤집어 한글-영어 짝 맞추기 게임 |
| Q-03 | Sentence Builder | 🔜 | 단어 블록 드래그 → 올바른 문장 순서 맞추기 |
| Q-04 | Speed Round | 🔜 | 제한 시간 안에 최대한 많은 단어 맞추기 |
| Q-05 | Dictation | 🔜 | 들리는 한국어를 직접 타이핑 |

#### 🎮 게이미피케이션
| 기능 ID | 기능명 | 상태 | 설명 |
|---------|--------|------|------|
| G-01 | 학습 스트릭 | ✅ | 연속 학습일 카운터 + 불꽃 아이콘 |
| G-02 | XP 포인트 | ✅ | 챕터 완료 / 퀴즈 / 복습마다 XP 획득 |
| G-03 | 레벨 시스템 | ✅ | XP 누적으로 레벨업 |
| G-04 | Daily Challenge | 🔜 | 매일 바뀌는 특별 미션, 모든 유저 동일 문제 |
| G-05 | Leaderboard | 🔜 | 주간 XP 랭킹 (상위 20명) |

#### 📊 진도 & 통계
| 기능 ID | 기능명 | 상태 | 설명 |
|---------|--------|------|------|
| D-01 | 학습 대시보드 | ✅ | 진도율, 스트릭, XP, 최근 활동 |
| D-02 | 챕터 진도 맵 | ✅ | 16챕터 visual roadmap |
| D-03 | Progress Heatmap | 🔜 | GitHub 스타일 학습 캘린더 시각화 |
| D-04 | 어휘 통계 | ✅ | 마스터한 단어 수 / 복습 필요 수 |

#### 🌏 문화 & 추가 콘텐츠
| 기능 ID | 기능명 | 상태 | 설명 |
|---------|--------|------|------|
| C-01 | 문화 노트 | ✅ | 챕터별 🌏 Culture Note 강조 표시 |
| C-02 | K-Drama Phrases | 🔜 | 드라마/영화 자주 나오는 표현 모음 |
| C-03 | Conversation Dialogues | 🔜 | 상황별 대화 시나리오 (카페, 쇼핑 등) |
| C-04 | AI Chat Partner | 🔜 | AI와 한국어로 대화 연습 (Vercel AI SDK) |

> 상태: ✅ 완료 · 🔜 예정

---

## 📁 폴더 구조 (현행)

```
webapp/                           ← Next.js 프로젝트 루트
├── CLAUDE.md                     ← 이 파일 (루트 필수)
├── src/
│   ├── app/
│   │   ├── page.tsx              ← 랜딩 페이지
│   │   ├── layout.tsx            ← 루트 레이아웃 (폰트, PWA 메타)
│   │   ├── globals.css
│   │   ├── login/                ← 로그인
│   │   ├── signup/               ← 회원가입
│   │   ├── pricing/              ← 요금제
│   │   ├── dashboard/            ← 학습 대시보드
│   │   ├── learn/
│   │   │   ├── page.tsx          ← 챕터 목록
│   │   │   └── [chapterId]/      ← 챕터 읽기
│   │   ├── vocab/[chapterId]/    ← 플래시카드
│   │   ├── quiz/[chapterId]/     ← 챕터 퀴즈
│   │   ├── review/               ← SRS 복습
│   │   ├── settings/
│   │   ├── subscribe/
│   │   ├── games/                ← 🔜 미니게임 허브
│   │   │   ├── memory/[chapterId]/   ← 🔜 Memory Match
│   │   │   ├── speed/[chapterId]/    ← 🔜 Speed Round
│   │   │   └── sentence/[chapterId]/ ← 🔜 Sentence Builder
│   │   ├── daily/                ← 🔜 Daily Challenge
│   │   ├── leaderboard/          ← 🔜 랭킹
│   │   └── api/
│   │       ├── auth/callback/
│   │       ├── checkout/
│   │       ├── billing/portal/
│   │       ├── review/
│   │       └── webhooks/
│   │           ├── stripe/
│   │           └── lemonsqueezy/
│   ├── components/
│   │   ├── layout/               ← AppNav, MobileNav
│   │   ├── reader/               ← ChapterReader, ReaderControls, PronunciationPlayer
│   │   ├── vocab/                ← VocabCard
│   │   ├── quiz/                 ← QuizSession
│   │   ├── review/               ← ReviewSession
│   │   ├── dashboard/            ← ProgressTracker
│   │   ├── subscription/         ← SubscriptionGate, PricingCard
│   │   ├── gamification/         ← StreakCounter, XPBar
│   │   ├── games/                ← 🔜 MemoryMatch, SpeedRound, SentenceBuilder
│   │   ├── ui/                   ← shadcn/ui
│   │   └── FloatingWords.tsx
│   ├── hooks/
│   │   ├── useStreak.ts
│   │   └── useXP.ts
│   ├── lib/
│   │   ├── supabase/             ← client.ts, server.ts
│   │   ├── tts.ts                ← Web Speech API (여성 목소리 자동 선택)
│   │   ├── srs.ts                ← SM-2 알고리즘
│   │   ├── xp.ts                 ← XP 액션 상수
│   │   ├── chapter-content.ts    ← 챕터 콘텐츠 데이터
│   │   ├── vocab-data.ts         ← 어휘 데이터
│   │   ├── stripe.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── public/
│   └── manifest.json             ← PWA
├── supabase/
│   ├── schema.sql
│   ├── migration-phase2.sql
│   └── migration-lemonsqueezy.sql
└── docs/
    ├── NEXT-STEPS.md
    └── PREMIUM-FEATURES.md
```

---

## 🗃️ DB 스키마 (Supabase PostgreSQL)

### profiles
```sql
id              uuid PRIMARY KEY REFERENCES auth.users(id)
email           text NOT NULL
display_name    text
avatar_url      text
created_at      timestamptz DEFAULT now()
```

### subscriptions
```sql
id                   uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id              uuid REFERENCES profiles(id) ON DELETE CASCADE
stripe_customer_id   text UNIQUE
stripe_sub_id        text UNIQUE
status               text CHECK (status IN ('active','canceled','past_due','trialing'))
plan                 text CHECK (plan IN ('monthly','annual'))
current_period_end   timestamptz
created_at           timestamptz DEFAULT now()
```

### chapters
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
chapter_num  int NOT NULL
slug         text NOT NULL UNIQUE
title        text NOT NULL
subtitle     text
is_free      boolean DEFAULT false
word_count   int
part_num     int
created_at   timestamptz DEFAULT now()
```

### vocabulary
```sql
id             uuid PRIMARY KEY DEFAULT gen_random_uuid()
chapter_id     uuid REFERENCES chapters(id) ON DELETE CASCADE
korean         text NOT NULL
romanization   text
english        text NOT NULL
example_ko     text
example_en     text
audio_text     text
display_order  int DEFAULT 0
created_at     timestamptz DEFAULT now()
```

### user_progress
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE
chapter_id      uuid REFERENCES chapters(id) ON DELETE CASCADE
is_completed    boolean DEFAULT false
scroll_position int DEFAULT 0
completed_at    timestamptz
last_read_at    timestamptz DEFAULT now()
UNIQUE(user_id, chapter_id)
```

### user_vocab_stats (SRS)
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE
vocab_id        uuid REFERENCES vocabulary(id) ON DELETE CASCADE
status          text CHECK (status IN ('new','learning','mastered')) DEFAULT 'new'
next_review_at  timestamptz DEFAULT now()
interval_days   int DEFAULT 1
ease_factor     float DEFAULT 2.5
review_count    int DEFAULT 0
correct_count   int DEFAULT 0
last_reviewed   timestamptz
UNIQUE(user_id, vocab_id)
```

### user_gamification
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE
xp              int DEFAULT 0
level           int DEFAULT 1
streak_current  int DEFAULT 0
streak_longest  int DEFAULT 0
last_activity   date
daily_goal_xp   int DEFAULT 50
created_at      timestamptz DEFAULT now()
```

### user_badges
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid REFERENCES profiles(id) ON DELETE CASCADE
badge_id    text NOT NULL
earned_at   timestamptz DEFAULT now()
UNIQUE(user_id, badge_id)
```

### user_activity_log (Progress Heatmap용) 🔜
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid REFERENCES profiles(id) ON DELETE CASCADE
activity_date  date NOT NULL
xp_earned   int DEFAULT 0
actions     int DEFAULT 0    -- 학습 액션 수
created_at  timestamptz DEFAULT now()
UNIQUE(user_id, activity_date)
```

### daily_challenges 🔜
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
challenge_date  date NOT NULL UNIQUE
vocab_ids       uuid[]          -- 오늘의 퀴즈 단어 목록 (10개)
created_at      timestamptz DEFAULT now()
```

### user_daily_scores 🔜
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE
challenge_date  date NOT NULL
score           int DEFAULT 0
completed_at    timestamptz DEFAULT now()
UNIQUE(user_id, challenge_date)
```

---

## 🔐 환경 변수

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_ANNUAL_PRICE_ID=

NEXT_PUBLIC_APP_URL=http://localhost:3000

# Phase 3 (선택)
OPENAI_API_KEY=          # AI Chat Partner
```

---

## 💳 구독 티어 정의

```typescript
export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: ['Ch01~02 읽기', '기본 발음 듣기', '50개 무료 어휘'],
    freeChapters: ['ch01-hangul', 'ch02-grammar-overview']
  },
  PRO_MONTHLY: {
    name: 'Pro Monthly',
    price: 7.99,
    interval: 'month',
    stripePriceId: process.env.STRIPE_MONTHLY_PRICE_ID
  },
  PRO_ANNUAL: {
    name: 'Pro Annual',
    price: 59.99,   // ≈ $5/월, 37% 절약
    interval: 'year',
    stripePriceId: process.env.STRIPE_ANNUAL_PRICE_ID
  }
}
```

---

## 🧮 SRS 알고리즘 (SM-2 기반)

```typescript
// lib/srs.ts
export function calculateNextReview(
  quality: 0 | 1 | 2 | 3 | 4 | 5,
  intervalDays: number,
  easeFactor: number
): { nextInterval: number; nextEaseFactor: number } {
  const newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )
  let nextInterval: number
  if (quality < 3) {
    nextInterval = 1
  } else if (intervalDays === 1) {
    nextInterval = 6
  } else {
    nextInterval = Math.round(intervalDays * newEaseFactor)
  }
  return { nextInterval, nextEaseFactor: newEaseFactor }
}
```

---

## 🎮 게이미피케이션 XP 테이블

| 액션 | XP |
|------|----|
| 챕터 완료 | +50 XP |
| 플래시카드 1 세트 완료 | +20 XP |
| 퀴즈 통과 (60%+) | +30 XP |
| 퀴즈 만점 (100%) | +50 XP |
| 단어 마스터 | +5 XP |
| SRS 복습 완료 | +10 XP |
| 스트릭 유지 | +5 XP/일 |
| 7일 스트릭 달성 | +100 XP (보너스) |
| Memory Match 완료 | +25 XP 🔜 |
| Speed Round 완료 | +20 XP 🔜 |
| Sentence Builder 완료 | +30 XP 🔜 |
| Daily Challenge 완료 | +40 XP 🔜 |
| Daily Challenge 1등 | +100 XP (보너스) 🔜 |

---

## 🔊 TTS 구현 (현행)

```typescript
// lib/tts.ts — Web Speech API, 여성 목소리 자동 선택
// 우선순위: "유나"(macOS) > "yuna" > "해미"(Windows) > "google 한국어" > non-male
// ⚠️ Safari: 반드시 클릭 핸들러에서 동기적으로 호출 (autoplay 정책)
// lang 필터: ko-KR | ko_KR | ko-KP | ko (kok-IN 등 비한국어 제외)
export function speakKorean(text: string, options?: { rate?: number; pitch?: number }): void
```

---

## 📝 코딩 컨벤션

- **컴포넌트**: PascalCase (`MemoryMatch.tsx`)
- **훅**: camelCase + use 접두사 (`useStreak.ts`)
- **유틸**: camelCase (`formatKorean.ts`)
- **API Route**: `app/api/[resource]/route.ts`
- **타입**: `types/index.ts`에 중앙 관리
- **Server Components 기본**, 상호작용 필요 시 `'use client'` 명시
- **에러 처리**: 모든 API Route에 try/catch + 적절한 HTTP 상태코드
- **Supabase**: 서버에서는 `createServerClient`, 클라이언트에서는 `createBrowserClient`
- **한국어 텍스트**: `font-noto-kr` 클래스 적용

---

## 🛡️ RLS 원칙

- `profiles`: 본인 데이터만 SELECT/UPDATE
- `subscriptions`: 본인 데이터만 SELECT (INSERT/UPDATE는 Stripe Webhook service role로만)
- `chapters`, `vocabulary`: 모두 SELECT 가능 (is_free 체크는 앱 레벨에서)
- `user_progress`, `user_vocab_stats`, `user_gamification`: 본인 데이터만 CRUD
- `daily_challenges`: 모두 SELECT 가능 (INSERT는 서버 전용)
- `user_daily_scores`, `user_activity_log`: 본인 데이터만 CRUD

---

## 🔄 개발 Phase 로드맵

### ✅ Phase 0 — 설계
- [x] 기능 정의 / DB 스키마 / 디자인 시스템

### ✅ Phase 1 — MVP
- [x] Next.js 프로젝트 셋업
- [x] Supabase 연결 + 인증 (Google OAuth)
- [x] 랜딩 페이지 + Pricing 페이지
- [x] 챕터 목록 + 읽기 페이지
- [x] Web Speech API TTS (여성 목소리)
- [x] Stripe 구독 결제
- [x] SubscriptionGate

### ✅ Phase 2 — 학습 기능
- [x] 플래시카드 (스와이프 제스처)
- [x] SRS 복습 시스템
- [x] 챕터 퀴즈 (4지선다)
- [x] 게이미피케이션 (스트릭, XP, 레벨)
- [x] 학습 대시보드 + 챕터 진도 맵
- [x] 로마자 토글 + 폰트 크기 조절
- [x] PWA (manifest.json)
- [x] 컴포넌트 폴더 구조 정리

### 🔄 Phase 3 — 게임 & 인터랙션 (현재)
- [ ] Memory Match 게임
- [ ] Listening Quiz (🔊 듣고 뜻 고르기)
- [ ] Speed Round (제한 시간 퀴즈)
- [ ] Sentence Builder (문장 순서 맞추기)
- [ ] Daily Challenge (매일 미션)
- [ ] Leaderboard (주간 랭킹)
- [ ] Progress Heatmap (캘린더 시각화)

### ⏳ Phase 4 — 성장
- [ ] K-Drama Phrases 콘텐츠
- [ ] Conversation Dialogues
- [ ] AI Chat Partner (Vercel AI SDK + OpenAI)
- [ ] 이메일 학습 리마인더
- [ ] Dictation (받아쓰기)

---

## 🎤 K-pop Concerts 섹션 (/concerts)

2026-10-20에 별도 프로젝트(`~/Desktop/프로젝트/03_개인프로젝트/앱/kpop-concert-map`, Next 16)를 이 앱으로 옮겨 합침. 로그인 없이 공개되는 섹션.

| 위치 | 내용 |
|------|------|
| `src/app/concerts/page.tsx` | 세계 지도 (react-leaflet 4, Esri Light Gray 타일) |
| `src/app/concerts/(content)/` | 아티스트·도시·공연 상세(`[slug]`)·제휴 고지 페이지 |
| `src/components/concerts/`, `src/lib/concerts/` | 컴포넌트, 데이터 로더, 제휴 링크(`affiliate.ts`) |
| `data/concerts/*.json` | 아티스트 감시목록·공연장·공연 데이터 |
| `scripts/concerts/*.mts` | `npm run concerts:validate` (prebuild), `concerts:extract` (Claude로 공식 발표 추출), `concerts:apply` |
| `docs/concerts/` | 데이터 수집 설계, 2026-10-19 조사 기록 |

규칙: 공연 정보는 공식 발표 기준. 공식 페이지에서 확인한 것만 `verified`, 언론 보도만 있으면 `unverified`(화면에 Unconfirmed 배지). 공식 판매처를 제휴 링크보다 항상 먼저 노출.
