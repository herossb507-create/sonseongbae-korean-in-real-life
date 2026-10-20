# PREMIUM-FEATURES.md — Korean in Real Life · AI 프리미엄 티어 설계서

> **Claude Code 참조 문서** — Phase 3 유료 기능 구현 시 반드시 이 파일을 읽고 시작하세요.
> 기존 NEXT-STEPS.md의 12개 태스크(TASK-1~12)는 모두 ✅ 완료 상태입니다.
> 이 문서는 Phase 3: AI 딥러닝 유료 구독 티어 전용 설계서입니다.

---

## 📋 구독 티어 전면 재편 (Monetization Overhaul)

### 핵심 변경 사항

| 구분 | 변경 전 | 변경 후 |
|------|---------|---------|
| Free | Ch01~02만 제공, 기본 발음 | **전체 챕터 + 모든 기존 기능** 무료 |
| Pro | 전체 챕터 접근 ($7.99/월) | **AI 딥러닝 전용 기능** (₩9,900/월) |
| 목적 | 콘텐츠 잠금 해제 | 학습 가속 · AI 코칭 |

### 새 티어 정의

```typescript
// lib/subscription.ts
export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price_krw: 0,
    price_usd: 0,
    features: [
      '전체 16챕터 읽기',
      'TTS 발음 듣기 (Web Speech API)',
      '300+ 플래시카드 (SRS 포함)',
      '챕터별 퀴즈',
      '학습 대시보드 (스트릭 · XP · 뱃지)',
      '북마크 · 진도 저장',
    ],
  },
  PRO_MONTHLY: {
    name: 'Pro',
    badge: '🤖 AI Coach',
    price_krw: 9900,
    price_usd: 7.49,          // 환율 참고용 표시값
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_KRW,
    features: [
      'AI 발음 분석 (문장 억양 그래프)',
      'AI 한국어 일기 교정',
      'TOPIK 모의고사 무제한',
      '오답 노트 자동 생성',
      '드라마 쉐도잉 플레이어',
      '상황별 AI 역할극 챗봇',
      '월간 성장 리포트 + PDF 수료증',
    ],
  },
  PRO_ANNUAL: {
    name: 'Pro Annual',
    badge: '🤖 AI Coach',
    price_krw: 99000,         // ≈ ₩8,250/월, 약 17% 절약
    price_usd: 74.99,
    interval: 'year',
    stripePriceId: process.env.STRIPE_PRO_ANNUAL_KRW,
  },
} as const;

export type TierKey = keyof typeof SUBSCRIPTION_TIERS;
```

---

## 🤖 기능 1 — AI 발음 분석 (Pronunciation Coach)

### 개요
사용자가 한국어 문장을 말하면 AI가 억양 패턴을 분석하고, 원어민 패턴과의 일치율을 시각적 그래프로 제공합니다.

마치 **피아노 건반 위에서 자신이 친 음과 정답 음을 동시에 보여주는 것**처럼, 내 목소리의 높낮이 곡선과 원어민 곡선이 겹쳐 표시됩니다.

### 기술 스택
- **Web Speech API** `SpeechRecognition` — 음성 → 텍스트 변환
- **Web Audio API** `AudioContext.getByteTimeDomainData` — pitch 추출
- **OpenAI Whisper API** (`/v1/audio/transcriptions`) — 정확한 한국어 STT
- **Canvas API 또는 Recharts** — 억양 피치 그래프 렌더링

### DB 테이블

```sql
-- Supabase SQL Editor에서 실행
create table pronunciation_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users not null,
  chapter_id   text not null,
  sentence_ko  text not null,           -- 연습 문장
  transcribed  text,                    -- Whisper 인식 결과
  pitch_data   jsonb,                   -- {user: number[], native: number[]}
  match_score  numeric(5,2),            -- 0~100 일치율
  created_at   timestamptz default now()
);

alter table pronunciation_sessions enable row level security;
create policy "users own their sessions"
  on pronunciation_sessions for all
  using (auth.uid() = user_id);
```

### API Route

```typescript
// app/api/pronunciation/analyze/route.ts
import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audioBlob = formData.get('audio') as File;
  const sentenceKo = formData.get('sentence') as string;

  const openai = new OpenAI();

  // 1. Whisper STT
  const transcription = await openai.audio.transcriptions.create({
    file: audioBlob,
    model: 'whisper-1',
    language: 'ko',
  });

  // 2. 텍스트 일치율 계산 (Levenshtein distance 기반)
  const matchScore = calculateMatchScore(sentenceKo, transcription.text);

  // 3. Supabase 저장
  // ... (supabase upsert)

  return Response.json({ transcribed: transcription.text, matchScore });
}
```

### UI 컴포넌트 명세

```
components/premium/
  PronunciationCoach/
    index.tsx              — 메인 컴포넌트 (PronunciationCoach)
    RecordButton.tsx       — 녹음 시작/중지 (pulse 애니메이션)
    PitchGraph.tsx         — Recharts LineChart (user=blue, native=gold)
    ScoreBadge.tsx         — 일치율 % + 피드백 텍스트
    SentencePicker.tsx     — 챕터별 연습 문장 선택
```

**PitchGraph 컬러 규칙:**
- 원어민 곡선: `stroke="#FFD700"` (gold, 점선)
- 사용자 곡선: `stroke="#4F7FE8"` (blue, 실선)
- 배경: `fill="#0a0e1a"`, 그리드: `stroke="rgba(255,255,255,0.05)"`

### 페이지 라우트
`/app/pro/pronunciation/page.tsx`

---

## 🤖 기능 2 — AI 한국어 일기 교정 (Writing Coach)

### 개요
사용자가 한국어로 일기나 짧은 글을 쓰면, AI가 문법·어휘·자연스러움을 교정하고 이유를 영어로 설명합니다.

마치 **원어민 친구가 내 일기에 빨간 펜으로 코멘트를 달아주는 것**처럼, 원문과 교정문을 나란히 표시하고 각 수정 이유를 tooltip으로 보여줍니다.

### 기술 스택
- **Vercel AI SDK** (`ai` 패키지) + `openai` — streaming 응답
- **OpenAI GPT-4o** — 한국어 교정 특화 프롬프트

### System Prompt 템플릿

```
You are a Korean language teacher specializing in natural, conversational Korean.
The user will write Korean text (diary entries, short essays, messages).
Your job:
1. Identify grammar errors, unnatural expressions, and vocabulary issues.
2. Return a corrected version.
3. For each correction, explain WHY in simple English (1 sentence max).
4. Tone: Encouraging, like a friendly teacher.

Response format (JSON):
{
  "corrected": "교정된 전체 텍스트",
  "corrections": [
    {
      "original": "틀린 부분",
      "corrected": "수정된 부분",
      "reason": "Why this change (English)"
    }
  ],
  "overall_feedback": "Overall encouragement + 1 tip"
}
```

### DB 테이블

```sql
create table writing_sessions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users not null,
  original_text  text not null,
  corrected_text text,
  corrections    jsonb,           -- corrections 배열
  overall_feedback text,
  char_count     int generated always as (length(original_text)) stored,
  created_at     timestamptz default now()
);

alter table writing_sessions enable row level security;
create policy "users own writing sessions"
  on writing_sessions for all
  using (auth.uid() = user_id);
```

### API Route

```typescript
// app/api/writing/correct/route.ts
import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const correctionSchema = z.object({
  corrected: z.string(),
  corrections: z.array(z.object({
    original: z.string(),
    corrected: z.string(),
    reason: z.string(),
  })),
  overall_feedback: z.string(),
});

export async function POST(req: Request) {
  const { text } = await req.json();

  return streamObject({
    model: openai('gpt-4o'),
    schema: correctionSchema,
    system: SYSTEM_PROMPT,
    prompt: `Correct this Korean text:\n\n${text}`,
  });
}
```

### UI 컴포넌트 명세

```
components/premium/
  WritingCoach/
    index.tsx              — 메인 (WritingCoach)
    DiaryEditor.tsx        — textarea (dark glass, 최소 8줄, 글자 수 카운터)
    CorrectionDiff.tsx     — 원문/교정 side-by-side diff 뷰
    CorrectionCard.tsx     — 개별 교정 항목 (original → corrected + reason)
    FeedbackBanner.tsx     — overall_feedback 표시 (gold border)
```

### 페이지 라우트
`/app/pro/writing/page.tsx`

---

## 🎓 기능 3 — TOPIK 모의고사 (TOPIK Mock Exam)

### 개요
TOPIK I·II 섹션별(듣기/읽기/쓰기) 모의고사를 무제한 풀 수 있습니다. 오답은 자동으로 오답 노트에 수집되고, AI가 유사 문제를 추가 생성합니다.

마치 **수능 기출 문제집이 AI로 무한 복제되는 것**처럼, 기존 패턴을 학습한 AI가 새로운 문제를 계속 생성해 지루함 없이 실력을 키울 수 있습니다.

### DB 테이블

```sql
-- 문제 은행
create table topik_questions (
  id           uuid primary key default gen_random_uuid(),
  level        text check (level in ('TOPIK-I', 'TOPIK-II')),
  section      text check (section in ('listening', 'reading', 'writing')),
  question_ko  text not null,
  options      jsonb,            -- ["①...", "②...", "③...", "④..."]
  answer_idx   int,              -- 0-based
  explanation  text,
  source       text,             -- 'original' | 'ai-generated'
  created_at   timestamptz default now()
);

-- 사용자 시험 시도
create table topik_attempts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users not null,
  session_id    uuid,            -- 같은 시험 묶음
  question_id   uuid references topik_questions,
  selected_idx  int,
  is_correct    boolean,
  time_taken_s  int,
  created_at    timestamptz default now()
);

-- 오답 노트 (자동 생성)
create table error_notes (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users not null,
  question_id    uuid references topik_questions,
  attempt_id     uuid references topik_attempts,
  ai_similar_q   jsonb,          -- AI 생성 유사 문제
  reviewed_count int default 0,
  resolved       boolean default false,
  created_at     timestamptz default now()
);

alter table topik_questions enable row level security;
alter table topik_attempts enable row level security;
alter table error_notes enable row level security;

create policy "anyone can read questions" on topik_questions for select using (true);
create policy "users own attempts" on topik_attempts for all using (auth.uid() = user_id);
create policy "users own error notes" on error_notes for all using (auth.uid() = user_id);
```

### AI 유사 문제 생성 API

```typescript
// app/api/topik/generate-similar/route.ts
export async function POST(req: Request) {
  const { originalQuestion, level, section } = await req.json();

  // GPT-4o에게 동일 패턴의 새 문제 생성 요청
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'system',
      content: `You are a TOPIK exam question writer.
      Create a new ${level} ${section} question following the exact same pattern as the example.
      Return JSON: { question_ko, options: string[4], answer_idx: number, explanation: string }`
    }, {
      role: 'user',
      content: `Original question:\n${JSON.stringify(originalQuestion)}\n\nCreate a similar question.`
    }],
    response_format: { type: 'json_object' },
  });

  return Response.json(JSON.parse(response.choices[0].message.content!));
}
```

### UI 컴포넌트 명세

```
components/premium/
  TopikExam/
    index.tsx              — 시험 선택 화면 (TopikHub)
    ExamSession.tsx        — 실제 시험 플레이어 (타이머 + 문제 + 옵션)
    ResultScreen.tsx       — 채점 결과 (섹션별 점수 + 정답률 차트)
    ErrorNoteBook.tsx      — 오답 노트 목록 (resolved 토글)
    SimilarQuestionCard.tsx — AI 생성 유사 문제 카드
```

### 페이지 라우트
- `/app/pro/topik/page.tsx` — 시험 선택
- `/app/pro/topik/exam/page.tsx` — 시험 진행
- `/app/pro/topik/results/[sessionId]/page.tsx` — 결과
- `/app/pro/topik/error-notes/page.tsx` — 오답 노트

---

## 🎬 기능 4 — 드라마 쉐도잉 (Drama Shadowing Player)

### 개요
한국 드라마 장면에 자막(한글/영어/로마자)을 표시하고, 속도 조절 + 반복 구간 설정 + 녹음 비교 기능을 제공합니다.

마치 **언어 학습 전용 유튜브 플레이어**처럼, 자막을 클릭하면 그 구간만 루프 재생되고, 동시에 사용자가 따라 읽은 목소리를 녹음해 비교합니다.

### 기술 스택
- **HTML5 `<video>`** — 영상 재생 (저작권 없는 클립 or 자체 제작)
- **WebVTT / SRT 파싱** — 자막 타임라인 처리
- **Web Audio API** — 녹음 + 파형 시각화
- **Supabase Storage** — 쉐도잉 클립 + 자막 파일 저장

### 콘텐츠 전략
> ⚠️ 저작권 주의: 실제 드라마 영상 사용 불가. 아래 대안 중 하나를 택하세요.
> - **자체 제작 대화 영상** (한국인 배우 섭외 → 상황별 1-3분 클립)
> - **무료 CC 라이선스 한국어 교육 영상** (KBS World 교육 콘텐츠 등)
> - **AI 아바타 영상** (HeyGen 또는 D-ID API로 생성)

### DB 테이블

```sql
create table shadowing_clips (
  id           uuid primary key default gen_random_uuid(),
  title_en     text not null,
  title_ko     text not null,
  situation    text,             -- 'cafe', 'office', 'date', 'shopping' 등
  level        text,             -- 'beginner', 'intermediate'
  duration_s   int,
  video_url    text,             -- Supabase Storage URL
  subtitle_url text,             -- .vtt 파일 URL
  thumbnail_url text,
  chapter_id   text,             -- 연관 챕터
  created_at   timestamptz default now()
);

create table shadowing_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users not null,
  clip_id       uuid references shadowing_clips,
  completed     boolean default false,
  loop_count    int default 0,
  recording_url text,            -- Supabase Storage (사용자 녹음)
  created_at    timestamptz default now()
);

alter table shadowing_clips enable row level security;
alter table shadowing_sessions enable row level security;

create policy "anyone can view clips" on shadowing_clips for select using (true);
create policy "users own sessions" on shadowing_sessions for all using (auth.uid() = user_id);
```

### UI 컴포넌트 명세

```
components/premium/
  ShadowingPlayer/
    index.tsx              — 메인 플레이어 (ShadowingPlayer)
    VideoPlayer.tsx        — HTML5 video + 속도 슬라이더 (0.5x ~ 1.5x)
    SubtitleTrack.tsx      — 실시간 자막 오버레이 (KO / EN / Romanization 토글)
    LoopControls.tsx       — A-B 구간 반복 설정
    RecordOverlay.tsx      — 사용자 녹음 + 파형 시각화
    ClipLibrary.tsx        — 상황별 클립 목록 (상황 태그 필터)
```

**자막 토글 상태:**
```typescript
interface SubtitleState {
  korean: boolean;      // 기본 on
  english: boolean;     // 기본 on
  romanization: boolean; // 기본 off (학습자 레벨에 따라)
}
```

### 페이지 라우트
- `/app/pro/shadowing/page.tsx` — 클립 라이브러리
- `/app/pro/shadowing/[clipId]/page.tsx` — 플레이어

---

## 🎬 기능 5 — 상황별 AI 역할극 (Role-Play AI Chatbot)

### 개요
카페 주문, 길 찾기, 쇼핑, 병원 등 실생활 상황을 AI와 음성으로 대화 연습합니다. AI가 상황에 맞는 한국어 캐릭터를 연기하며 대화를 이끕니다.

마치 **어학원 회화 수업에서 선생님과 롤플레이를 하는 것**처럼, AI가 "안녕하세요, 무엇을 도와드릴까요?"라고 먼저 말을 걸고 사용자가 대답합니다. 틀린 표현은 대화가 끝난 후 한꺼번에 피드백합니다.

### 기술 스택
- **Vercel AI SDK** `useChat` hook — 스트리밍 대화
- **Web Speech API** `SpeechSynthesis` — AI 응답 음성 출력 (한국어 TTS)
- **Web Speech API** `SpeechRecognition` — 사용자 음성 입력
- **OpenAI GPT-4o** — 역할극 AI

### 시나리오 정의

```typescript
// lib/roleplay-scenarios.ts
export const SCENARIOS = [
  {
    id: 'cafe-order',
    title: '☕ 카페에서 주문하기',
    title_en: 'Ordering at a Café',
    level: 'beginner',
    chapterRef: 'ch05',
    systemPrompt: `You are a friendly Korean barista named 민지 at a modern Seoul café.
    Speak ONLY in Korean. Keep sentences short and natural.
    If the user makes a grammar mistake, continue the conversation naturally (don't correct mid-conversation).
    After the conversation ends (when they say 감사합니다 or similar), provide a JSON feedback block.`,
  },
  {
    id: 'ask-directions',
    title: '🗺️ 길 찾기',
    title_en: 'Asking for Directions',
    level: 'beginner',
    chapterRef: 'ch07',
    systemPrompt: `You are a helpful Korean pedestrian on the streets of Seoul...`,
  },
  {
    id: 'shopping',
    title: '🛍️ 옷 가게 쇼핑',
    title_en: 'Shopping for Clothes',
    level: 'intermediate',
    chapterRef: 'ch09',
    systemPrompt: `You are a Korean clothing store employee...`,
  },
  {
    id: 'doctor',
    title: '🏥 병원 진료',
    title_en: 'At the Doctor\'s Office',
    level: 'intermediate',
    chapterRef: 'ch11',
    systemPrompt: `You are a Korean nurse at a clinic reception...`,
  },
] as const;
```

### API Route

```typescript
// app/api/roleplay/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages, scenarioId } = await req.json();
  const scenario = SCENARIOS.find(s => s.id === scenarioId);

  return streamText({
    model: openai('gpt-4o'),
    system: scenario?.systemPrompt ?? '',
    messages,
  });
}
```

### DB 테이블

```sql
create table roleplay_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users not null,
  scenario_id  text not null,
  messages     jsonb not null,           -- 전체 대화 기록
  feedback     jsonb,                    -- AI 피드백 (오류 목록)
  duration_s   int,
  completed    boolean default false,
  created_at   timestamptz default now()
);

alter table roleplay_sessions enable row level security;
create policy "users own roleplay sessions"
  on roleplay_sessions for all
  using (auth.uid() = user_id);
```

### UI 컴포넌트 명세

```
components/premium/
  RolePlay/
    index.tsx              — 시나리오 선택 허브 (RolePlayHub)
    ScenarioCard.tsx       — 카드형 시나리오 선택 (배경 이미지, 레벨 뱃지)
    ChatInterface.tsx      — 대화 화면 (말풍선 UI, useChat 연동)
    VoiceInput.tsx         — SpeechRecognition 버튼 + 자동 전송
    TTSToggle.tsx          — AI 응답 음성 재생 on/off
    FeedbackModal.tsx      — 대화 종료 후 오류 피드백 모달
```

**말풍선 스타일:**
- AI (상대방): `bg-white/10 border border-white/10 rounded-2xl rounded-tl-none` (왼쪽)
- 사용자: `bg-[#4F7FE8]/20 border border-[#4F7FE8]/30 rounded-2xl rounded-tr-none` (오른쪽)

### 페이지 라우트
- `/app/pro/roleplay/page.tsx` — 시나리오 선택
- `/app/pro/roleplay/[scenarioId]/page.tsx` — 대화 화면

---

## 💡 기능 6 — 월간 성장 리포트 + PDF 수료증 (Monthly Growth Report)

### 개요
매월 1일 자동 생성. 학습 통계, 발음 향상 추이, 어휘 마스터 수, TOPIK 점수 변화를 담은 개인화 리포트와 PDF 수료증을 이메일로 발송합니다.

마치 **헬스장 PT 선생님이 월말에 "이번 달 당신의 운동 성과 분석표"를 주는 것**처럼, 학습 노력이 수치로 보상받는 경험을 만들어 이탈을 방지합니다.

### 기술 스택
- **`@react-pdf/renderer`** — PDF 수료증 생성
- **Resend** (또는 Supabase Edge Functions + SMTP) — 이메일 발송
- **Vercel Cron Jobs** — 매월 1일 자동 실행
- **Supabase Functions** — 데이터 집계

### DB 테이블

```sql
create table monthly_reports (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users not null,
  report_month     date not null,          -- 해당 월의 1일 (예: 2026-03-01)
  stats            jsonb not null,         -- 집계 데이터 (아래 구조 참고)
  pdf_url          text,                   -- Supabase Storage
  emailed_at       timestamptz,
  created_at       timestamptz default now(),
  unique (user_id, report_month)
);

alter table monthly_reports enable row level security;
create policy "users own reports" on monthly_reports for all using (auth.uid() = user_id);
```

**stats JSONB 구조:**
```typescript
interface MonthlyStats {
  month: string;                    // "2026년 3월"
  user_name: string;
  total_study_days: number;
  streak_max: number;
  xp_earned: number;
  chapters_completed: number;
  vocab_mastered: number;
  pronunciation_avg_score: number;  // 0~100
  topik_avg_score: number;
  writing_entries: number;
  roleplay_sessions: number;
  badge_earned: string[];
}
```

### PDF 수료증 컴포넌트

```typescript
// components/premium/Certificate.tsx
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { backgroundColor: '#0a0e1a', padding: 40 },
  title: { fontSize: 28, color: '#F0F4FF', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#8892B0', textAlign: 'center', marginBottom: 40 },
  name: { fontSize: 22, color: '#FFD700', textAlign: 'center', marginBottom: 20 },
  body: { fontSize: 12, color: '#C0C8D8', textAlign: 'center', lineHeight: 1.6 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 },
  stat: { alignItems: 'center' },
  statNum: { fontSize: 24, color: '#4F7FE8', fontWeight: 'bold' },
  statLabel: { fontSize: 10, color: '#8892B0' },
});

export function Certificate({ stats }: { stats: MonthlyStats }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>🇰🇷 Korean in Real Life</Text>
        <Text style={styles.subtitle}>Monthly Achievement Certificate</Text>
        <Text style={styles.name}>{stats.user_name}</Text>
        <Text style={styles.body}>
          {stats.month} 동안 꾸준한 한국어 학습으로{'\n'}
          다음 성과를 달성했습니다
        </Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{stats.total_study_days}일</Text>
            <Text style={styles.statLabel}>학습일</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{stats.vocab_mastered}개</Text>
            <Text style={styles.statLabel}>어휘 마스터</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{stats.xp_earned} XP</Text>
            <Text style={styles.statLabel}>획득 경험치</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{stats.pronunciation_avg_score}점</Text>
            <Text style={styles.statLabel}>발음 점수</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
```

### Vercel Cron API Route

```typescript
// app/api/cron/monthly-report/route.ts
// vercel.json: { "crons": [{ "path": "/api/cron/monthly-report", "schedule": "0 9 1 * *" }] }
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // 1. Cron 보안 검증
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. Pro 구독 유저 목록 조회
  // 3. 각 유저의 지난 달 stats 집계
  // 4. PDF 생성 → Supabase Storage 업로드
  // 5. Resend로 이메일 발송
  // 6. monthly_reports 테이블에 저장

  return Response.json({ success: true });
}
```

### UI 컴포넌트 명세

```
components/premium/
  MonthlyReport/
    index.tsx              — 리포트 대시보드 (MonthlyReportHub)
    ReportCard.tsx         — 월별 리포트 카드 (PDF 다운로드 버튼 포함)
    StatsChart.tsx         — 월별 추이 차트 (Recharts AreaChart)
    CertificatePreview.tsx — PDF 미리보기 + 다운로드
```

### 페이지 라우트
`/app/pro/reports/page.tsx`

---

## 🔐 구독 게이트 (SubscriptionGate) 업데이트

기존 SubscriptionGate는 Free/Pro 2단계 콘텐츠 잠금용이었습니다.
이제 Pro 전용 기능 페이지에는 아래 패턴을 사용하세요:

```typescript
// components/premium/ProGate.tsx
'use client';
import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';

export function ProGate({ children }: { children: React.ReactNode }) {
  const { isPro, isLoading } = useSubscription();

  if (isLoading) return <LoadingSpinner />;

  if (!isPro) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-white mb-3">AI Coach 기능</h2>
          <p className="text-[#8892B0] mb-6 leading-relaxed">
            이 기능은 AI Coach 구독자 전용입니다.
            월 ₩9,900으로 발음 분석, 글쓰기 교정, TOPIK 모의고사 등
            AI 기반 딥러닝 기능을 모두 이용하세요.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-[#FF4757] hover:bg-[#FF6B81] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            AI Coach 시작하기 — ₩9,900/월
          </Link>
          <p className="text-[#4A5568] text-xs mt-4">언제든지 취소 가능</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

**모든 `/app/pro/*` 페이지는 반드시 `<ProGate>`로 감싸세요.**

---

## 📦 새로 필요한 패키지

```bash
# AI
npm install ai @ai-sdk/openai openai

# PDF 생성
npm install @react-pdf/renderer

# 이메일 발송
npm install resend

# 유효성 검사 (AI SDK 스키마)
npm install zod

# 음성 유사도 (Levenshtein)
npm install fastest-levenshtein
```

---

## 🗂️ 폴더 구조 추가 사항

```
webapp/src/
├── app/
│   ├── pro/                         ← 새로 추가 (모든 페이지 ProGate 적용)
│   │   ├── pronunciation/page.tsx
│   │   ├── writing/page.tsx
│   │   ├── topik/
│   │   │   ├── page.tsx
│   │   │   ├── exam/page.tsx
│   │   │   ├── results/[sessionId]/page.tsx
│   │   │   └── error-notes/page.tsx
│   │   ├── shadowing/
│   │   │   ├── page.tsx
│   │   │   └── [clipId]/page.tsx
│   │   ├── roleplay/
│   │   │   ├── page.tsx
│   │   │   └── [scenarioId]/page.tsx
│   │   └── reports/page.tsx
│   ├── api/
│   │   ├── pronunciation/
│   │   │   └── analyze/route.ts
│   │   ├── writing/
│   │   │   └── correct/route.ts
│   │   ├── topik/
│   │   │   └── generate-similar/route.ts
│   │   ├── roleplay/
│   │   │   └── chat/route.ts
│   │   └── cron/
│   │       └── monthly-report/route.ts
├── components/
│   └── premium/                     ← 새로 추가
│       ├── ProGate.tsx
│       ├── PronunciationCoach/
│       ├── WritingCoach/
│       ├── TopikExam/
│       ├── ShadowingPlayer/
│       ├── RolePlay/
│       └── MonthlyReport/
├── lib/
│   ├── roleplay-scenarios.ts        ← 새로 추가
│   └── levenshtein.ts               ← 새로 추가 (발음 일치율)
└── hooks/
    └── useSubscription.ts           ← 새로 추가 (Pro 여부 확인)
```

---

## 🌐 환경 변수 추가 목록

```bash
# .env.local에 추가
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
CRON_SECRET=your-random-secret-for-cron-auth
STRIPE_PRO_MONTHLY_KRW=price_...       # ₩9,900/월 Stripe Price ID
STRIPE_PRO_ANNUAL_KRW=price_...        # ₩99,000/연 Stripe Price ID
```

---

## 🚀 구현 우선순위 (Phase 3 로드맵)

| 순서 | 기능 | 예상 복잡도 | 비고 |
|------|------|------------|------|
| P3-1 | AI 한국어 일기 교정 | ⭐⭐ 보통 | AI SDK + Streaming, 즉시 체감 효과 |
| P3-2 | 상황별 AI 역할극 | ⭐⭐ 보통 | useChat 패턴, 가장 차별화 포인트 |
| P3-3 | TOPIK 모의고사 | ⭐⭐⭐ 높음 | 문제 DB 구축 필요 |
| P3-4 | AI 발음 분석 | ⭐⭐⭐ 높음 | Audio API + 그래프 복잡 |
| P3-5 | 드라마 쉐도잉 | ⭐⭐⭐⭐ 매우 높음 | 콘텐츠 제작 선행 필요 |
| P3-6 | 월간 리포트 + PDF | ⭐⭐ 보통 | Cron + PDF 렌더링 |

> **추천 시작점: P3-1 (글쓰기 교정)** — OpenAI API 연동을 검증하면서 가장 빠르게 사용자 가치를 만들 수 있습니다.

---

## ⚠️ 공통 주의사항

1. **모든 AI API 호출은 서버 사이드에서만** — `OPENAI_API_KEY`를 클라이언트에 노출 금지
2. **Rate limiting** — Pro 유저도 일일 사용량 제한 권장 (발음 분석 50회/일, 역할극 20세션/일)
3. **Streaming UI** — `useChat`, `useObject` 훅 사용 시 로딩 스켈레톤 반드시 구현
4. **Error Boundary** — AI 응답 실패 시 graceful fallback 메시지 표시
5. **모바일 최적화** — 음성 기능은 모바일 Safari에서 별도 테스트 필수 (iOS 권한 팝업)
6. **한국어 폰트** — `font-noto-kr` 클래스를 모든 한국어 텍스트에 적용 유지
