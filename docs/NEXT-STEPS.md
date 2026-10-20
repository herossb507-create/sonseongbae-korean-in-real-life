# NEXT-STEPS.md — Claude Code 다음 작업 지시서
## Korean in Real Life · 고도화 로드맵

> **사용법:** Claude Code 세션 시작 시 이 파일을 먼저 읽고 작업을 진행하세요.
> `@NEXT-STEPS.md 읽고 TASK-1부터 시작해줘`

---

## 📊 현재 앱 상태 분석 (2026-03-16 기준)

### ✅ 완성된 것

| 영역 | 상태 | 파일 |
|------|------|------|
| Next.js 14 프로젝트 셋업 | ✅ 완성 | `package.json` |
| Supabase Auth + DB 연결 | ✅ 완성 | `src/lib/supabase/` |
| Supabase 스키마 + RLS | ✅ 완성 | `supabase/schema.sql` |
| Stripe + LemonSqueezy 웹훅 | ✅ 완성 | `src/app/api/webhooks/` |
| 로그인/회원가입 페이지 | ✅ 완성 | `src/app/login/`, `src/app/signup/` |
| 챕터 목록 페이지 | ✅ 완성 | `src/app/learn/page.tsx` |
| 챕터 리더 (커스텀 MD 파서) | ✅ 완성 | `src/components/ChapterReader.tsx` |
| 어휘 플래시카드 페이지 | ✅ 있음 | `src/app/vocab/[chapterId]/page.tsx` |
| 구독 게이트 컴포넌트 | ✅ 완성 | `src/components/SubscriptionGate.tsx` |
| 네비게이션 바 | ✅ 완성 | `src/components/AppNav.tsx` |
| 발음 플레이어 컴포넌트 | ✅ 있음 | `src/components/PronunciationPlayer.tsx` |

### ❌ 미완성 / 버그 / 개선 필요

| 우선순위 | 문제 | 파일 | 상세 |
|---------|------|------|------|
| 🔴 P0 | **대시보드 데이터 하드코딩** | `dashboard/page.tsx` | stats 전부 하드코딩, Supabase 미연결 |
| 🔴 P0 | **VocabCard → DB 저장 안 됨** | `components/VocabCard.tsx` | `// TODO: Supabase user_vocab_stats 업데이트` 방치 |
| 🔴 P0 | **전체 디자인 라이트 테마** | 전 파일 | 화이트/블루 기본 디자인, 글래스모피즘 적용 필요 |
| 🟠 P1 | **로마자 토글 없음** | ChapterReader | 리더에 발음 ON/OFF 토글 미구현 |
| 🟠 P1 | **TTS 속도 조절 없음** | PronunciationPlayer | 0.75x/1x/1.25x 선택 미구현 |
| 🟠 P1 | **스트릭/XP 시스템 없음** | 없음 | 게이미피케이션 전체 미구현 |
| 🟠 P1 | **SRS 없음** | VocabCard | known/unknown만 있고 간격반복 없음 |
| 🟠 P1 | **챕터 퀴즈 없음** | 없음 | quiz 페이지 자체 없음 |
| 🟡 P2 | **어휘 예문 없음** | schema.sql | vocabulary 테이블에 example_ko/en 컬럼 없음 |
| 🟡 P2 | **챕터 완료 체크 미작동** | learn/[id]/page.tsx | 완료 버튼 → DB 저장 불확실 |
| 🟡 P2 | **북마크 기능 없음** | 없음 | bookmarks 테이블, UI 모두 없음 |
| 🟡 P2 | **모바일 네비 없음** | AppNav | 반응형 모바일 드로어 없음 |
| 🟢 P3 | **PDF 치트시트 미구현** | 없음 | 랜딩에 소개만 있고 기능 없음 |
| 🟢 P3 | **다크모드 토글 없음** | 없음 | 라이트/다크 전환 UI 없음 |

---

## ✅ TASK-1: 디자인 전면 업그레이드 — Dark Glassmorphism

> **목표:** 화이트 테마 → 다크 글래스모피즘 테마로 전환 ✅ 완료
> **우선순위:** 🔴 P0 → ✅ 완료 (초기 구현 시 적용)
> **영향 파일:** `globals.css`, `layout.tsx`, `page.tsx`, `dashboard/page.tsx`, `learn/page.tsx`

### 1-1. globals.css 업데이트
```css
/* 아래 색상 변수를 :root에 추가 */
--bg-base: #0a0e1a;
--bg-surface: #0f1629;
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.10);
--accent-red: #FF4757;
--accent-blue: #4F7FE8;
--accent-gold: #FFD700;
--text-primary: #F0F4FF;
--text-secondary: #8892B0;
--success: #10B981;
```

### 1-2. layout.tsx 배경 변경
```tsx
// 현재: className="bg-white"
// 변경: className="bg-[#0a0e1a] text-[#F0F4FF]"
// html 태그에 className="dark" 추가
```

### 1-3. 랜딩 페이지 (`src/app/page.tsx`) 전면 재작성
현재 상태: 단순 흰 배경 + 파란 버튼 → 2026 트렌드에 맞게 전면 재작성

요구사항:
- 배경: `bg-[#0a0e1a]`
- Hero: 대형 한글 워터마크 배경 글자 (`한국어` 반투명) + 영문 타이틀
- Feature 카드: 글래스 카드 (`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl`)
- CTA 버튼: 그라디언트 (`bg-gradient-to-r from-[#FF4757] to-[#FF6B81]`)
- 떠다니는 한글 단어 애니메이션 배경 장식 (안녕하세요, 감사합니다 등)
- **소셜 프루프 섹션 추가:** "Join 1,000+ learners" 스타일 숫자 강조
- **FAQ 섹션 추가:** Accordion UI (shadcn Accordion 사용)

### 1-4. AppNav 다크 테마 + 모바일 드로어
```tsx
// 현재: bg-white border-b
// 변경: bg-[#0f1629]/80 backdrop-blur-md border-b border-white/10
// 추가: 모바일용 햄버거 메뉴 → shadcn Sheet 컴포넌트로 드로어 구현
```

### 1-5. ChapterReader 다크 테마
```tsx
// 텍스트: text-[#C0C8D8] → leading-8
// H2: border-b border-white/10
// 테이블 헤더: bg-[#4F7FE8]/20
// 블록쿼트: border-l-4 border-[#4F7FE8] bg-[#4F7FE8]/5
// TipBox: bg-[#FFD700]/10 border-[#FFD700]/20
```

### 설치 필요 패키지
```bash
npm install framer-motion
npm install next-themes
npx shadcn@latest add accordion sheet tabs
```

---

## ✅ TASK-2: 대시보드 실제 데이터 연결

> **목표:** 하드코딩된 stats → Supabase에서 실시간 fetch
> **파일:** `src/app/dashboard/page.tsx` ✅ 완료
> **우선순위:** 🔴 P0 → ✅ 완료 (2026-03-16)

### 현재 코드 문제
```tsx
// ❌ 현재: 전부 하드코딩
const stats = {
  chaptersCompleted: 2,   // 하드코딩
  wordsKnown: 38,          // 하드코딩
  streakDays: 5,           // 하드코딩
};
```

### 수정 방향
```tsx
// ✅ 목표: Supabase에서 병렬 fetch
const [progressData, vocabData] = await Promise.all([
  supabase.from('user_progress').select('*').eq('user_id', user.id).eq('is_completed', true),
  supabase.from('user_vocab_stats').select('*').eq('user_id', user.id).eq('known', true),
])
```

### 대시보드 UI 개선 사항
- 챕터 진도 맵 추가: 파트별(1~5) 챕터 버튼 그리드 (완료=초록, 미완=회색)
- 최근 학습 활동: "마지막으로 읽은 챕터" 표시
- 주간 학습 요약: 이번 주 읽은 챕터 수
- 어휘 도넛 차트 (선택사항): 마스터/학습중/미학습 비율

---

## ✅ TASK-3: VocabCard Supabase 저장 + 3D 애니메이션

> **목표:** TODO 제거 + 실제 DB 저장 + 3D 플립 애니메이션
> **파일:** `src/components/VocabCard.tsx` ✅ 완료
> **우선순위:** 🔴 P0 → ✅ 완료 (2026-03-16)

### 3-1. Supabase 저장 구현
```tsx
// VocabCard.tsx의 TODO 부분:
// TODO: Supabase user_vocab_stats 업데이트
// ↓ 아래로 교체:

async function handleKnown(newKnown: boolean) {
  setKnown(newKnown)
  const supabase = createBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('user_vocab_stats').upsert({
    user_id: user.id,
    vocab_id: id,
    known: newKnown,
    reviewed_at: new Date().toISOString(),
  }, { onConflict: 'user_id,vocab_id' })
}
```

### 3-2. 3D 플립 애니메이션 (Framer Motion)
```tsx
// 현재: 단순 조건부 렌더링
// 목표: CSS transform-style: preserve-3d + framer-motion rotateY 애니메이션
// 앞면: 한글 크게 (text-6xl) + 발음 버튼
// 뒷면: 영어 (text-3xl) + 로마자 + 예문
```

### 3-3. 발음 버튼 앞면으로 이동
```tsx
// 현재: 뒤집은 후에만 발음 버튼
// 목표: 앞면에도 🔊 버튼 (클릭해도 카드 안 뒤집히게 stopPropagation)
```

---

## ✅ TASK-4: DB 스키마 확장 (SRS + 게이미피케이션 + 예문)

> **목표:** Phase 2 기능을 위한 DB 테이블 추가
> **파일:** `supabase/migration-phase2.sql` ✅ 생성 완료
> **우선순위:** 🟠 P1 → ✅ 완료 (2026-03-16)

### 4-1. vocabulary 테이블 컬럼 추가
```sql
-- supabase/migration-phase2.sql 신규 작성
ALTER TABLE vocabulary
  ADD COLUMN IF NOT EXISTS example_ko TEXT,     -- 한국어 예문
  ADD COLUMN IF NOT EXISTS example_en TEXT;     -- 영어 예문 번역
```

### 4-2. user_vocab_stats SRS 컬럼 추가
```sql
ALTER TABLE user_vocab_stats
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new'
    CHECK (status IN ('new', 'learning', 'mastered')),
  ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS interval_days INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS ease_factor FLOAT DEFAULT 2.5,
  ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS correct_count INT DEFAULT 0;
```

### 4-3. user_progress 스크롤 위치 추가
```sql
ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS scroll_position INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
```

### 4-4. user_gamification 테이블 신규
```sql
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

CREATE POLICY "gamification: self read"   ON user_gamification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "gamification: self insert" ON user_gamification FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gamification: self update" ON user_gamification FOR UPDATE USING (auth.uid() = user_id);
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
```

### 4-5. bookmarks 테이블 신규
```sql
CREATE TABLE IF NOT EXISTS bookmarks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id  UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE POLICY "bookmarks: self crud" ON bookmarks FOR ALL USING (auth.uid() = user_id);
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
```

### 4-6. user_badges 테이블 신규
```sql
CREATE TABLE IF NOT EXISTS user_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id    TEXT NOT NULL,
  earned_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges: self read" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "badges: self insert" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## ✅ TASK-5: types/index.ts 확장

> **목표:** 새 DB 테이블에 맞는 TypeScript 타입 추가
> **파일:** `src/types/index.ts` ✅ 업데이트 완료
> **우선순위:** 🟠 P1 → ✅ 완료 (2026-03-16)

추가해야 할 타입:
```typescript
// Vocabulary 타입 확장 (example_ko, example_en)
// UserVocabStat SRS 필드 추가 (status, next_review_at, interval_days, ease_factor...)
// UserProgress 확장 (scroll_position, completed_at)
// UserGamification 신규
// Badge 신규
// Bookmark 신규
```

---

## ✅ TASK-6: 챕터 리더 — 로마자 토글 + TTS 속도 + 발음 버튼 통합

> **목표:** 읽기 경험 강화 — 발음 버튼, 로마자 토글, 북마크
> **파일:** `src/components/ReaderControls.tsx` ✅ 신규 + `src/components/ChapterReader.tsx` ✅ 업데이트
> **우선순위:** 🟠 P1 → ✅ 완료 (2026-03-16)

### 6-1. 리더 상단 컨트롤 바
```tsx
// 챕터 리더 페이지 상단에 추가:
// [로마자 ON/OFF] [발음 속도: 0.75x | 1x | 1.25x] [챕터 완료 체크]
```

### 6-2. 어휘 테이블 행에 발음 버튼 추가
```tsx
// ChapterReader의 TableBlock에서:
// 첫 번째 열(한국어)에 작은 🔊 버튼 추가
// 클릭 시 해당 셀 텍스트로 Web Speech API 호출
```

### 6-3. 로마자 토글
```tsx
// ChapterReader에 showRomanization prop 추가
// 로마자 표기(이탤릭체 등)를 조건부로 숨기기/보이기
// 어휘 테이블의 "Romanization" 열 ON/OFF
```

### 6-4. 문화 노트 강조 스타일
```tsx
// 🌏 이모지로 시작하는 blockquote를 별도 "CultureNote" flavor로 처리
// 보라색 계열 배경으로 구분: bg-[#4F7FE8]/10 border-l-4 border-purple-400
```

### 6-5. 챕터 완료 버튼 → DB 저장
```tsx
// 현재: 완료 처리가 명확하지 않음
// 목표: "✓ Mark chapter complete" 버튼 → user_progress upsert
//        +50 XP 추가 → user_gamification update
```

---

## ✅ TASK-7: 게이미피케이션 시스템 구현

> **목표:** 스트릭, XP, 레벨, 뱃지 시스템
> **신규 파일:** `src/hooks/useStreak.ts`, `src/hooks/useXP.ts`, `src/components/gamification/` ✅ 완료
> **우선순위:** 🟠 P1 → ✅ 완료 (2026-03-16)

### 7-1. useXP Hook
```typescript
// src/hooks/useXP.ts 신규 생성
// 기능: XP 추가, 레벨 계산, 뱃지 확인
// XP 테이블:
//   챕터 완료: +50
//   플래시카드 세트 완료: +20
//   퀴즈 통과(60%+): +30
//   퀴즈 만점(100%): +50
//   단어 마스터: +5
//   SRS 복습 완료: +10
//   스트릭 유지: +5/일
//   7일 스트릭: +100 (보너스)
```

### 7-2. useStreak Hook
```typescript
// src/hooks/useStreak.ts 신규 생성
// 로직: last_activity 날짜와 오늘 비교
//   오늘이 last_activity + 1일이면 streak +1
//   오늘이 last_activity + 2일 이상이면 streak = 1 (리셋)
//   오늘 == last_activity면 변화 없음
```

### 7-3. StreakCounter 컴포넌트
```tsx
// src/components/gamification/StreakCounter.tsx 신규
// 불꽃 이모지 + 숫자 + "일 연속"
// Framer Motion으로 흔들기 애니메이션
```

### 7-4. XPBar 컴포넌트
```tsx
// src/components/gamification/XPBar.tsx 신규
// 현재 XP / 다음 레벨까지 XP 진도 바
// 레벨업 시 confetti 효과 (canvas-confetti 패키지)
```

### 7-5. AppNav에 스트릭/XP 표시
```tsx
// AppNav 오른쪽에 StreakCounter + 레벨 뱃지 추가
```

---

## ✅ TASK-8: SRS 복습 시스템 구현

> **목표:** SM-2 알고리즘 기반 간격반복 복습
> **신규 파일:** `src/lib/srs.ts`, `src/app/review/page.tsx` ✅ 완료
> **우선순위:** 🟠 P1 → ✅ 완료 (2026-03-16)

### 8-1. SRS 알고리즘 구현
```typescript
// src/lib/srs.ts 신규 생성
// SM-2 알고리즘: quality(0~5) 입력 → nextInterval, newEaseFactor 반환
export function calculateNextReview(
  quality: number,      // 0=완전망각, 5=완벽
  intervalDays: number,
  easeFactor: number
): { nextInterval: number; nextEaseFactor: number }
```

### 8-2. 복습 큐 API
```typescript
// src/app/api/review/route.ts 신규
// GET: next_review_at <= NOW() 인 단어들 최대 20개 반환
// POST: 복습 결과(quality) 저장 → next_review_at 업데이트
```

### 8-3. 복습 페이지 신규
```tsx
// src/app/review/page.tsx 신규
// - 오늘 복습할 단어 개수 표시
// - FlashCard → 알았어요(5)/어려워요(2)/몰라요(1) 3단계 버튼
// - 복습 완료 시 XP +10, 축하 메시지
// - AppNav에 "복습 N개" 뱃지 표시
```

---

## ✅ TASK-9: 챕터 퀴즈 기능

> **목표:** 각 챕터 완료 후 4지선다 퀴즈
> **신규 파일:** `src/app/quiz/[chapterId]/page.tsx`, `src/components/QuizSession.tsx` ✅ 완료
> **우선순위:** 🟠 P1 → ✅ 완료 (2026-03-16)

### 9-1. 퀴즈 데이터 구조
```typescript
// 챕터의 vocabulary에서 랜덤 10개 선택
// 각 문제: 한글 단어 → 영어 4지선다 (정답 1개 + 오답 3개)
// 오답은 같은 챕터 또는 다른 챕터 어휘에서 랜덤 선택
```

### 9-2. 퀴즈 UI
```tsx
// 문제 번호 진도 바 (1/10, 2/10...)
// 한글 단어 크게 표시 + 발음 버튼
// 4개 선택지 버튼
// 정답/오답 즉시 피드백 (초록/빨강 하이라이트)
// 결과 화면: 점수 + XP 획득 + 틀린 단어 복습 목록
```

### 9-3. 챕터 리더에 퀴즈 연결
```tsx
// 챕터 완료 후 "Take Quiz →" 버튼 표시
// learn/[chapterId]/page.tsx 하단에 추가
```

---

## ✅ TASK-10: 한국어 폰트 + 타이포그래피 최적화

> **목표:** Noto Sans KR 로드 + 한글 표시 품질 향상
> **파일:** `src/app/layout.tsx`, `tailwind.config.ts` ✅ 완료
> **우선순위:** 🟡 P2 → ✅ 완료 (2026-03-16)

```tsx
// app/layout.tsx에서 next/font/google로 로드:
import { Inter, Noto_Sans_KR } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-kr'
})

// tailwind.config.ts에 폰트 변수 등록:
// fontFamily: { 'noto-kr': 'var(--font-noto-kr)', sans: 'var(--font-inter)' }

// 한글 텍스트에 font-noto-kr 클래스 적용
```

---

## ✅ TASK-11: 모바일 최적화 + PWA 준비

> **목표:** 모바일 UX 개선 + PWA manifest ✅ 완료
> **우선순위:** 🟡 P2 → ✅ 완료 (2026-03-16)

### 11-1. 플래시카드 스와이프 제스처
```tsx
// Framer Motion의 drag + onDragEnd로 스와이프 구현
// 오른쪽 스와이프: 알아요 (초록)
// 왼쪽 스와이프: 몰라요 (빨강)
```

### 11-2. 챕터 리더 폰트 크기 조절
```tsx
// 리더 상단에 A- / A+ 버튼 추가
// localStorage에 fontSize 저장 (sm/base/lg/xl)
```

### 11-3. public/manifest.json 추가
```json
{
  "name": "Korean in Real Life",
  "short_name": "Korean",
  "theme_color": "#0a0e1a",
  "background_color": "#0a0e1a",
  "display": "standalone"
}
```

---

## ✅ TASK-12: 랜딩 페이지 전환율 최적화

> **목표:** 더 매력적인 랜딩페이지로 전환율 향상
> **파일:** `src/app/page.tsx` ✅ 완료
> **우선순위:** 🟡 P2 → ✅ 완료 (2026-03-16)

추가 섹션:
- **소셜 프루프:** "이미 X명이 학습 중" + 실제 챕터 통계
- **무료 체험 미리보기:** 챕터 1의 일부 내용 스니펫 노출
- **비교 테이블:** "왜 우리 앱인가" (Duolingo vs 교재 vs Korean in Real Life)
- **학습 로드맵 시각화:** 16챕터 여정을 visual timeline으로 표현
- **FAQ Accordion:** 가격, 환불, 수준 등
- **Footer 개선:** 링크 섹션, 소셜 링크, 이메일 연락처

---

## 📋 작업 순서 권장사항

```
TASK-1 (디자인) → TASK-4+5 (DB 확장+타입) → TASK-2 (대시보드) →
TASK-3 (VocabCard) → TASK-6 (챕터 리더) → TASK-7 (게이미피케이션) →
TASK-8 (SRS) → TASK-9 (퀴즈) → TASK-10 (폰트) → TASK-11 (모바일) →
TASK-12 (랜딩)
```

---

## ⚠️ 코드 작업 시 주의사항

1. **`src/lib/supabase/server.ts`** — Next.js 15가 아닌 **14** 사용 중. `cookies()`는 `await` 없이 동기 호출
2. **`src/lib/chapter-content.ts`** — 챕터 MD 파일 로딩 유틸. 수정 시 경로 확인
3. **Stripe + LemonSqueezy** — 두 결제 모두 있음. 메인은 Stripe 사용
4. **`createClient()`** — server.ts에서 import, `await` 없이 사용 (Next.js 14 방식)
5. **Framer Motion** — 설치 후 `'use client'` 컴포넌트에서만 사용
6. **RLS** — 새 테이블 생성 시 반드시 RLS 정책 추가 (TASK-4 참조)

---

*이 파일은 작업 완료 시마다 해당 TASK에 ✅ 표시하고 업데이트하세요.*
