export interface ChapterData {
  num: number;
  slug: string;
  title: string;
  content: string;
}

export const CHAPTER_CONTENT: Record<string, ChapterData> = {
  "ch01": {
    num: 1,
    slug: "ch01",
    title: "Meet Hangul — The Korean Alphabet",
    content: `# Chapter 1 · Meet Hangul — The Korean Alphabet

## What You'll Learn
- Why Hangul is easier than it looks — you can read it within a week
- The 21 vowels and 19 consonants that make up the entire system
- How Korean syllable blocks work
- Practice words to start reading immediately

Hangul (한글) is a phonetic alphabet — every character represents a sound. Once you know the sounds, you can read any Korean word. It was created in 1443 by King Sejong the Great (세종대왕) to increase literacy. The system has 40 letters: 21 vowels (모음) and 19 consonants (자음), arranged into syllable blocks.

---

## The Basic Vowels (모음)

| Hangul | Romanization | Sound |
|--------|-------------|-------|
| ㅏ | a | "ah" as in father |
| ㅓ | eo | "uh" as in butter |
| ㅗ | o | "oh" as in no |
| ㅜ | u | "oo" as in moon |
| ㅡ | eu | no English equivalent — lips flat |
| ㅣ | i | "ee" as in see |
| ㅑ | ya | "yah" |
| ㅕ | yeo | "yuh" |
| ㅛ | yo | "yoh" |
| ㅠ | yu | "yoo" |

Vertical vowels (ㅏ, ㅓ, ㅣ) go to the **right** of their consonant. Horizontal vowels (ㅗ, ㅜ, ㅡ) go **below**.

---

## The Basic Consonants (자음)

| Hangul | Romanization | Sound |
|--------|-------------|-------|
| ㄱ | g/k | "g" at start, "k" at end |
| ㄴ | n | "n" |
| ㄷ | d/t | "d" at start, "t" at end |
| ㄹ | r/l | between "r" and "l" |
| ㅁ | m | "m" |
| ㅂ | b/p | "b" at start, "p" at end |
| ㅅ | s | "s" |
| ㅇ | silent/ng | silent at syllable start; "ng" at end |
| ㅈ | j | "j" |
| ㅎ | h | "h" |
| ㅋ | k | aspirated "k" |
| ㅌ | t | aspirated "t" |
| ㅍ | p | aspirated "p" |
| ㅊ | ch | "ch" |

**Tense consonants** (ㄲ ㄸ ㅃ ㅆ ㅉ) — sharper, clipped sounds found in words like 빨리 (ppalli — quickly).

---

## Syllable Blocks

Every syllable block has: **initial consonant + vowel + optional final consonant (받침)**.

- ㅎ + ㅏ + ㄴ = **한** (han)
- ㄱ + ㅡ + ㄹ = **글** (geul)
- Together: **한글** = Hangul

> **ㅇ rule:** When a syllable starts with a vowel sound, ㅇ is used as a silent placeholder. 아 = ㅇ (silent) + ㅏ (a).

---

## Reading Practice

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 안녕 | an-nyeong | hello / goodbye (casual) |
| 감사합니다 | gam-sa-ham-ni-da | thank you (formal) |
| 한국 | han-guk | Korea |
| 서울 | seo-ul | Seoul |
| 사람 | sa-ram | person |
| 물 | mul | water |
| 밥 | bap | rice / meal |
| 친구 | chin-gu | friend |

---

## 💡 Chapter Summary
- Hangul is **phonetic** — learn the sounds, read everything
- **21 vowels + 19 consonants** = 40 letters total
- Letters combine into **syllable blocks** (consonant + vowel + optional 받침)
- ㅇ is silent at the start of a syllable, "ng" at the end
- You can realistically learn to read Hangul in **1–3 days** of focused practice

> 🌏 **Culture Note:** King Sejong (세종대왕) is one of the most beloved figures in Korean history — his face appears on the 10,000 won note. October 9th is **한글날 (Hangeul Day)**, a national holiday celebrating the alphabet.
`,
  },

  "ch02": {
    num: 2,
    slug: "ch02",
    title: "How Korean Works — A Quick Grammar Overview",
    content: `# Chapter 2 · How Korean Works — A Quick Grammar Overview

## What You'll Learn
- Why Korean word order is different — and why it's actually logical
- The particle system: the small words that tell you what each noun is doing
- How Korean verbs work and why they come at the end
- The two main speech levels you need to know

Korean grammar follows **Subject-Object-Verb (SOV)** order. "I coffee drink" instead of "I drink coffee." The verb always comes last — which means you can add nuance right up until the end of a sentence.

---

## Word Order: SOV

| English | Korean structure |
|---------|----------------|
| I eat rice. | I + rice + eat |
| She likes Seoul. | She + Seoul + likes |
| We are studying Korean. | We + Korean + studying-are |

In Korean: **저는 한국어를 공부해요** (I-topic Korean-object study)

---

## Particles — The Grammar Backbone

Particles attach to nouns and tell you their grammatical role. There's no word order confusion once you know the particles.

| Particle | Function | Example |
|----------|----------|---------|
| 은/는 | Topic marker | 저**는** (as for me) |
| 이/가 | Subject marker | 친구**가** (my friend [subject]) |
| 을/를 | Object marker | 밥**을** (rice [object]) |
| 에 | Location / direction | 서울**에** (in/to Seoul) |
| 에서 | Location of action | 카페**에서** (at the café) |
| 의 | Possession | 친구**의** (friend's) |
| 와/과, 하고 | And (with nouns) | 빵**하고** 커피 (bread and coffee) |

> **은 vs 는 / 이 vs 가:** Use 은/이 after consonants, 는/가 after vowels. 학교**는** (school-topic), 카페**가** (café-subject).

---

## Verbs: Always Last, Always Conjugated

The base form of Korean verbs ends in **다**. To use them, remove 다 and add an ending.

| Verb base | Meaning | Polite form |
|-----------|---------|-------------|
| 먹다 | to eat | 먹어요 |
| 마시다 | to drink | 마셔요 |
| 가다 | to go | 가요 |
| 오다 | to come | 와요 |
| 하다 | to do | 해요 |
| 공부하다 | to study | 공부해요 |

---

## The Two Speech Levels You Need

Korean has multiple formality levels. Start with these two:

**해요체 (Haeyoche) — Polite informal:** End with 요
- Everyday Korean with strangers, shopkeepers, colleagues
- Safe for almost any situation
- 먹어**요**, 가**요**, 좋아**요**

**합쇼체 (Hapshoche) — Formal:** Ends in 습니다/ㅂ니다
- News broadcasts, announcements, very formal settings
- 먹습니다, 갑니다, 좋습니다

> You will not need 반말 (informal speech without 요) until you have a close relationship with a Korean speaker who invites you to use it.

---

## Making Questions

Add **요?** with rising intonation to most statements → instant question.

- 먹어요 (eating) → 먹어요? (are you eating?)
- 한국 사람이에요 (Korean person) → 한국 사람이에요? (are you Korean?)

Question words:
| Korean | Meaning |
|--------|---------|
| 뭐 / 무엇 | what |
| 어디 | where |
| 언제 | when |
| 누구 | who |
| 왜 | why |
| 어떻게 | how |
| 얼마 | how much |

---

## 💡 Chapter Summary
- Korean is **SOV** — the verb always comes last
- **Particles** attach to nouns to show their grammatical role — no word-order guessing
- Verbs are conjugated by removing 다 and adding an ending
- Start with **해요체** (polite -요 ending) for most situations
- Making questions is simple: rising intonation + 요?
`,
  },

  "ch03": {
    num: 3,
    slug: "ch03",
    title: "Hello & Goodbye — Greetings & Introductions",
    content: `# Chapter 3 · Hello & Goodbye — Greetings & Introductions

## What You'll Learn
- The greetings Koreans actually use — formal and casual
- How to handle first meetings the Korean way
- Goodbye phrases (there are two, and which one you use matters)
- Bowing: the unwritten rules

---

## Core Greetings

| Korean | Romanization | Use when |
|--------|-------------|----------|
| 안녕하세요 | an-nyeong-ha-se-yo | Standard polite hello — use with almost everyone |
| 안녕 | an-nyeong | Casual — close friends only |
| 안녕하십니까 | an-nyeong-ha-sim-ni-kka | Very formal — announcements, first business meeting |
| 반갑습니다 | ban-gap-sseum-ni-da | Nice to meet you (formal first meeting) |
| 반가워요 | ban-ga-wo-yo | Nice to meet you (polite, warmer) |
| 오랜만이에요 | o-raen-man-i-e-yo | Long time no see (polite) |
| 잘 지냈어요? | jal ji-nae-sseo-yo? | How have you been? |
| 네, 잘 지냈어요 | ne, jal ji-nae-sseo-yo | Yes, I've been well |

---

## First Meetings

When meeting someone for the first time, a brief, genuine greeting goes further than perfect Korean.

**Typical first-meeting exchange:**

---
A: 안녕하세요. 저는 [이름]이에요/예요. *(Hello. I'm [name].)*
B: 반갑습니다. 저는 [이름]입니다. *(Nice to meet you. I'm [name].)*
A: 만나서 반가워요. *(Glad to meet you.)*

---

**이에요 vs 예요:** Use 이에요 after a consonant, 예요 after a vowel.
- 민준**이에요** (ends in consonant ㄴ)
- 유나**예요** (ends in vowel ㅏ)

---

## Goodbyes — Two Forms That Mean Different Things

Korean has two goodbye phrases, and they're not interchangeable:

| Situation | Korean | Meaning |
|-----------|--------|---------|
| You are leaving, they are staying | 안녕히 계세요 | "Stay well" — said to the one remaining |
| They are leaving, you are staying | 안녕히 가세요 | "Go well" — said to the one departing |
| Both leaving | 안녕히 가세요 | Both can say this |
| Casual (any direction) | 잘 가 / 잘 있어 | Informal — close friends only |

> Other useful goodbyes:
> - **다음에 봐요** (da-eu-me bwa-yo) — See you next time
> - **내일 봐요** (nae-il bwa-yo) — See you tomorrow
> - **조심히 가세요** (jo-sim-hi ga-se-yo) — Go carefully / Take care

---

## Bowing

Bowing (절 / jeol) is how Koreans greet, thank, and show respect. No physical contact is expected (handshakes are becoming more common in business settings).

| Situation | Depth | Notes |
|-----------|-------|-------|
| Casual greeting | ~15° head nod | Among friends, brief acknowledgment |
| Standard polite greeting | ~30° bow | Meeting someone new, entering a shop |
| Respectful to elders | ~45° bow | First meeting, formal respect |
| Deep apology or gratitude | ~90° bow | Formal ceremony, serious situations |

> 🌏 **Culture Note:** In Korea, **age determines social hierarchy**. Knowing this explains why Koreans often ask your age early in conversation — it tells them how to speak to you and how to bow. This isn't rudeness; it's the system working.

---

## Dialogue: Meeting Someone for the First Time

---
유진: 안녕하세요! 저는 유진이에요. 만나서 반가워요.
     *(Hello! I'm Yujin. Nice to meet you.)*

레이: 안녕하세요. 저는 레이예요. 반갑습니다.
     *(Hello. I'm Ray. Nice to meet you.)*

유진: 어느 나라에서 왔어요?
     *(Which country are you from?)*

레이: 영국에서 왔어요. 유진 씨는요?
     *(I'm from England. And you, Yujin?)*

유진: 저는 한국 사람이에요. 한국어 잘 하시네요!
     *(I'm Korean. You speak Korean well!)*

---

## 💡 Chapter Summary
- **안녕하세요** — the all-purpose polite hello
- **반갑습니다 / 반가워요** — nice to meet you (formal / polite)
- Two goodbyes: **안녕히 계세요** (you stay) vs **안녕히 가세요** (you go)
- Bow based on context — ~30° for most polite greetings
- Age hierarchy is real and explains a lot about Korean interaction
`,
  },

  "ch04": {
    num: 4,
    slug: "ch04",
    title: "Nice to Meet You — Talking About Yourself",
    content: `# Chapter 4 · Nice to Meet You — Talking About Yourself

## What You'll Learn
- How to introduce yourself: name, nationality, and where you're from
- Talking about your job and why you're in Korea
- The Korean age system — why Koreans may tell you you're older than you think
- How to address people: titles, 씨, and what to never do

---

## Introducing Yourself

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 저는 [이름]이에요/예요 | jeo-neun [name]-i-e-yo/ye-yo | I'm [name] |
| 제 이름은 [이름]이에요 | je i-reum-eun [name]-i-e-yo | My name is [name] |
| [나라]에서 왔어요 | [country]-e-seo wa-sseo-yo | I'm from [country] |
| [도시]에 살아요 | [city]-e sa-ra-yo | I live in [city] |
| 한국에 온 지 [기간] 됐어요 | | I've been in Korea for [time] |

**Country names:**
| English | Korean |
|---------|--------|
| USA | 미국 |
| UK | 영국 |
| Australia | 호주 |
| Canada | 캐나다 |
| China | 중국 |
| Japan | 일본 |
| France | 프랑스 |

---

## Talking About Your Job

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 무슨 일 하세요? | mu-seun il ha-se-yo? | What do you do? |
| 저는 [직업]이에요 | jeo-neun [job]-i-e-yo | I'm a [job] |
| 회사원이에요 | hoe-sa-wo-ni-e-yo | I work at a company (office worker) |
| 선생님이에요 | seon-saeng-ni-mi-e-yo | I'm a teacher |
| 학생이에요 | hak-saeng-i-e-yo | I'm a student |
| 디자이너예요 | di-ja-i-neo-ye-yo | I'm a designer |
| 한국어를 공부하러 왔어요 | | I came to study Korean |

---

## The Korean Age System

Korea uses a traditional age-counting system that may add 1–2 years to your international age.

**Korean age = Current year − Birth year + 1**

Everyone gains a year on **January 1st**, not on their birthday. A baby born in December is considered "2 years old" by January 1st of the following year.

| How to ask / answer |  |
|---------------------|--|
| 나이가 어떻게 되세요? | How old are you? (polite) |
| 몇 살이에요? | How old are you? (casual) |
| 한국 나이로 [나이]살이에요 | I'm [age] in Korean age |
| 만 [나이]살이에요 | I'm [age] in international age |

> 🌏 **Culture Note:** Koreans often ask your age early in conversation — not from nosiness, but because it determines the speech level and titles they should use with you. It's the grammar system requiring social information. Answer comfortably; it's expected.

---

## How to Address People

**씨 (ssi)** — the all-purpose honorific title, attached to the full name or first name:
- 김민준 **씨** → Mr./Ms. Kim Minjun
- 민준 **씨** → Minjun (polite but friendly)

> ⚠️ **Never use 씨 with someone's last name alone.** 김 씨 sounds cold or rude. Always use the full name or first name + 씨.

**님 (nim)** — higher respect, used for teachers, bosses, professionals:
- 선생**님** — teacher
- 사장**님** — company president
- 의사**님** — doctor

**Don't use 당신 (dangshin — "you")** — it sounds confrontational in everyday speech. Use the person's name + 씨, or just omit the subject (Korean sentences often drop the subject entirely).

---

## Dialogue: Getting to Know Someone

---
지수: 어디에서 왔어요?
     *(Where are you from?)*

톰: 영국에서 왔어요. 런던이요.
   *(I'm from England. London.)*

지수: 한국에는 왜 왔어요?
     *(Why did you come to Korea?)*

톰: 한국어 배우러 왔어요. 그리고 한국 음식을 너무 좋아해서요.
   *(I came to learn Korean. And because I love Korean food so much.)*

지수: 한국 나이로 몇 살이에요?
     *(How old are you in Korean age?)*

톰: 한국 나이로 스물아홉이에요.
   *(I'm 29 in Korean age.)*

---

## 💡 Chapter Summary
- Introduce yourself: **저는 [이름]이에요/예요** + **[나라]에서 왔어요**
- Korean age = birth year subtracted from current year + 1; everyone ages on Jan 1
- Use **[name] 씨** for polite address — never last name alone + 씨
- **님** attaches to titles for added respect (선생님, 사장님)
- Avoid **당신** — use names or drop the subject entirely
`,
  },

  "ch05": {
    num: 5,
    slug: "ch05",
    title: "Numbers, Dates & Time",
    content: `# Chapter 5 · Numbers, Dates & Time

## What You'll Learn
- Two complete number systems — when to use each one
- How to tell the time in Korean
- Days of the week, months, and dates
- Essential counters (the "classifiers" that come after numbers)

Korean has **two number systems**: Sino-Korean (from Chinese) and Native Korean. You need both. They're used in different situations.

---

## Sino-Korean Numbers (한자어 수)

Used for: money, phone numbers, dates, floors, minutes, addresses

| Number | Korean | Romanization |
|--------|--------|-------------|
| 0 | 영 / 공 | yeong / gong |
| 1 | 일 | il |
| 2 | 이 | i |
| 3 | 삼 | sam |
| 4 | 사 | sa |
| 5 | 오 | o |
| 6 | 육 | yuk |
| 7 | 칠 | chil |
| 8 | 팔 | pal |
| 9 | 구 | gu |
| 10 | 십 | sip |
| 100 | 백 | baek |
| 1,000 | 천 | cheon |
| 10,000 | 만 | man |

Build numbers by combining: 십일 (11), 이십 (20), 삼십오 (35), 백오십 (150)

---

## Native Korean Numbers (고유어 수)

Used for: counting objects (1–99), hours, age (informal)

| Number | Korean | Romanization |
|--------|--------|-------------|
| 1 | 하나 | ha-na |
| 2 | 둘 | dul |
| 3 | 셋 | set |
| 4 | 넷 | net |
| 5 | 다섯 | da-seot |
| 6 | 여섯 | yeo-seot |
| 7 | 일곱 | il-gop |
| 8 | 여덟 | yeo-deol |
| 9 | 아홉 | a-hop |
| 10 | 열 | yeol |
| 20 | 스물 | seu-mul |
| 30 | 서른 | seo-reun |

> ⚠️ When followed by a counter, 하나→한, 둘→두, 셋→세, 넷→네. E.g., 한 개 (one item), 두 명 (two people).

---

## Telling the Time

**Hours** use Native Korean numbers. **Minutes** use Sino-Korean.

| Korean | Meaning |
|--------|---------|
| 몇 시예요? | What time is it? |
| [native #] 시 [sino #] 분이에요 | It's [hour] o'clock [minute] |
| 한 시 | 1 o'clock |
| 두 시 삼십 분 | 2:30 |
| 세 시 오 분 | 3:05 |
| 오전 / 오후 | AM / PM |
| 정오 | noon |
| 자정 | midnight |

---

## Days, Months & Dates

**Days of the week:**
| Korean | Romanization | Day |
|--------|-------------|-----|
| 월요일 | wo-ryo-il | Monday |
| 화요일 | hwa-yo-il | Tuesday |
| 수요일 | su-yo-il | Wednesday |
| 목요일 | mo-gyo-il | Thursday |
| 금요일 | geu-myo-il | Friday |
| 토요일 | to-yo-il | Saturday |
| 일요일 | i-ryo-il | Sunday |

**Months** = Sino-Korean number + 월: 일월 (January), 이월 (February) ... 십이월 (December)

**Dates** = Sino-Korean number + 일: 일 일 (1st), 십오 일 (15th), 이십팔 일 (28th)

---

## Essential Counters

| Counter | Use | Example |
|---------|-----|---------|
| 개 | general objects | 사과 두 **개** (2 apples) |
| 명 | people (neutral) | 세 **명** (3 people) |
| 분 | people (respectful) | 두 **분** (2 people, polite) |
| 잔 | cups / glasses | 커피 한 **잔** (1 coffee) |
| 병 | bottles | 맥주 두 **병** (2 beers) |
| 권 | books | 책 세 **권** (3 books) |
| 장 | flat sheets | 종이 한 **장** (1 sheet of paper) |
| 번 | times / turns | 두 **번** (twice) |
| 마리 | animals | 고양이 한 **마리** (1 cat) |

---

## 💡 Chapter Summary
- **Sino-Korean**: money, dates, minutes, phone numbers, floors
- **Native Korean**: hours, counting objects (1–99), casual age
- Time formula: **[Native] 시 [Sino] 분** — e.g., 두 시 삼십 분 = 2:30
- Months = number + 월; Dates = number + 일
- Counters attach after numbers — learn the 9 above first
`,
  },

  "ch06": {
    num: 6,
    slug: "ch06",
    title: "Getting Around — Directions & Transport",
    content: `# Chapter 6 · Getting Around — Directions & Transport

## What You'll Learn
- Direction words and how to ask where things are
- The Seoul subway: T-money, transfers, and essential phrases
- Taking buses and taxis
- Apps that will save you: Kakao Taxi, Naver Map, KakaoMap

---

## Asking for Directions

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| [장소]이/가 어디예요? | [place]-i/ga eo-di-ye-yo? | Where is [place]? |
| [장소]에 어떻게 가요? | [place]-e eo-tteo-ke ga-yo? | How do I get to [place]? |
| 여기서 가까워요? | yeo-gi-seo ga-kka-wo-yo? | Is it close from here? |
| 걸어서 얼마나 걸려요? | | How long does it take on foot? |
| 길을 잃었어요 | gi-reul i-reo-sseo-yo | I'm lost |

**Direction words:**
| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 왼쪽 | oen-jjok | left |
| 오른쪽 | o-reun-jjok | right |
| 직진 / 앞 | jik-jin / ap | straight ahead |
| 뒤 | dwi | behind |
| 옆 | yeop | next to / beside |
| 맞은편 | ma-jeun-pyeon | across from / opposite |
| 근처 | geun-cheo | nearby |

---

## The Seoul Subway (지하철)

The subway is the best way to get around Seoul — cheap, fast, and almost always on time.

**Getting started:**
- Buy a **T-money card (티머니)** at any convenience store (CU, GS25, 7-Eleven)
- Charge it at subway station kiosks or convenience stores
- Tap in at the gate, tap out at the destination — fare is distance-based (₩1,400–2,000 typical range)
- **환승 (hwan-seung)** = transfer — free within 30 minutes

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 지하철 | ji-ha-cheol | subway |
| 몇 호선이에요? | myeot ho-seo-ni-e-yo? | Which line is it? |
| [역 이름]역 가는 거 맞아요? | | Is this going to [station]? |
| 다음 역이 뭐예요? | | What's the next station? |
| 환승 | hwan-seung | transfer |
| 출구 | chul-gu | exit |
| 막차 | mak-cha | last train |

---

## Buses (버스)

Seoul buses are color-coded by route type:
- 🔵 Blue — main city trunk routes, fast
- 🟢 Green — local neighborhood routes
- 🔴 Red — express to suburbs / outside Seoul
- 🟡 Yellow — inner city circular routes

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 버스 정류장 | beo-seu jeong-nyu-jang | bus stop |
| [번호]번 버스 | [number]-beon beo-seu | bus number [X] |
| [장소] 가요? | [place] ga-yo? | Does this go to [place]? |
| 내려 주세요 | nae-ryeo ju-se-yo | Please let me off here |

---

## Taxis (택시)

Taxis are metered and affordable. Base fare: ~₩4,800 (standard taxi).

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| [장소]로 가 주세요 | [place]-ro ga ju-se-yo | Please take me to [place] |
| 여기서 세워 주세요 | yeo-gi-seo se-wo ju-se-yo | Please stop here |
| 얼마예요? | eol-ma-ye-yo? | How much? |
| 영수증 주세요 | yeong-su-jeung ju-se-yo | Receipt, please |

> 🏠 **Local's Note:** **Kakao Taxi** (카카오택시) is the dominant ride-hailing app. Download it before you arrive — it works with English, shows estimated cost, and saves having to pronounce the destination.

---

## Dialogue: Getting to a Station

---
외국인: 실례합니다. 홍대입구역이 어디예요?
        *(Excuse me. Where is Hongdae Station?)*

행인: 저기서 왼쪽으로 가면 있어요. 걸어서 5분쯤이요.
     *(Go left from there. About 5 minutes on foot.)*

외국인: 감사합니다!
        *(Thank you!)*

---

## 💡 Chapter Summary
- **T-money card** — essential; buy and charge before you ride
- Ask directions with **[장소] 어디예요?** or **어떻게 가요?**
- Subway: tap in, tap out, transfer free within 30 min (환승)
- Taxis: tell the destination + **로 가 주세요**; use Kakao Taxi app
- Useful apps: **Naver Map** (best for transit directions), **KakaoMap**, **Kakao Taxi**
`,
  },

  "ch07": {
    num: 7,
    slug: "ch07",
    title: "Let's Eat! — Food, Restaurants & Korean Food Culture",
    content: `# Chapter 7 · Let's Eat! — Food, Restaurants & Korean Food Culture

## What You'll Learn
- How to order food confidently — from reading menus to getting the bill
- Essential food vocabulary and dishes
- Dietary restrictions and how to communicate them
- Drinking culture basics and toasting
- Paying the bill: who pays and how to say it

---

## Getting a Table & Ordering

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 몇 분이세요? | myeot bun-i-se-yo? | How many people? (staff to you) |
| [숫자]명이요 | [number]-myeong-i-yo | [Number] people |
| 메뉴 주세요 | me-nyu ju-se-yo | Menu, please |
| 이거 주세요 | i-geo ju-se-yo | This one, please (point at menu) |
| [메뉴] 하나 주세요 | [item] ha-na ju-se-yo | One [item], please |
| [메뉴] 두 개 주세요 | [item] du gae ju-se-yo | Two [items], please |
| 추천해 주세요 | chu-cheon-hae ju-se-yo | Please recommend something |
| 이게 뭐예요? | i-ge mwo-ye-yo? | What is this? |
| 조금 있다가요 | jo-geum it-da-ga-yo | A little later (not ready to order) |
| 여기요! | yeo-gi-yo! | Excuse me! (calling a server) |

---

## Essential Korean Dishes

| Korean | Romanization | Description |
|--------|-------------|-------------|
| 비빔밥 | bi-bim-bap | Rice with vegetables, egg, gochujang — mix it yourself |
| 불고기 | bul-go-gi | Marinated grilled beef |
| 삼겹살 | sam-gyeop-sal | Grilled pork belly — eat with lettuce wraps |
| 갈비 | gal-bi | Short ribs, grilled |
| 냉면 | naeng-myeon | Cold noodles — buckwheat, served in chilled broth |
| 된장찌개 | doen-jang-jji-gae | Fermented soybean paste stew |
| 김치찌개 | gim-chi-jji-gae | Kimchi stew |
| 순두부찌개 | sun-du-bu-jji-gae | Silken tofu stew |
| 떡볶이 | tteok-bo-kki | Spicy rice cakes — street food classic |
| 김밥 | gim-bap | Rice rolls with fillings, seaweed outside |

---

## 반찬 (Banchan) — Side Dishes

반찬 (ban-chan) are the small dishes served automatically with your meal — kimchi, seasoned vegetables, eggs, pickled items. They are:
- **Complimentary and unlimited** — ask for refills: **[반찬 이름] 더 주세요** (more [dish] please)
- **Communal** — shared from the center of the table
- **Part of the meal** — not optional extras

---

## Dietary Restrictions

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 저는 채식주의자예요 | jeo-neun chae-sik-jju-i-ja-ye-yo | I'm vegetarian |
| 고기 빼 주세요 | go-gi bbae ju-se-yo | Please leave out the meat |
| 해산물 못 먹어요 | hae-san-mul mot meo-geo-yo | I can't eat seafood |
| 알레르기가 있어요 | al-le-reu-gi-ga i-sseo-yo | I have an allergy |
| 견과류 알레르기가 있어요 | | I'm allergic to nuts |
| 덜 맵게 해 주세요 | deol maep-ge hae ju-se-yo | Please make it less spicy |
| 안 맵게 해 주세요 | an maep-ge hae ju-se-yo | Please make it not spicy |

> 🏠 **Local's Note:** Vegetarianism is difficult in Korea — many "vegetable" dishes are made with anchovy broth. Be specific. Ask: **이 국물이 고기 육수예요?** (Is this broth meat-based?) Even better, research vegetarian-friendly restaurants in advance.

---

## Paying the Bill

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 계산해 주세요 | gye-san-hae ju-se-yo | The bill, please |
| 얼마예요? | eol-ma-ye-yo? | How much is it? |
| 따로따로 계산해 주세요 | tta-ro-tta-ro gye-san-hae ju-se-yo | Separate bills, please |
| 같이 계산해 주세요 | ga-chi gye-san-hae ju-se-yo | Together, please |
| 카드 돼요? | ka-deu dwae-yo? | Do you accept card? |
| 영수증 주세요 | yeong-su-jeung ju-se-yo | Receipt, please |

> 🌏 **Culture Note:** In Korean dining culture, one person often pays for the whole table — **한 턱 내다 (han teok nae-da)** — especially the elder or the person who invited. The next outing, someone else pays. It cycles over time. Splitting every bill equally is a newer and more common practice among younger Koreans and among friends.

---

## 건배! — Toasting

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 건배! | geon-bae! | Cheers! (literally: dry cup) |
| 위하여! | wi-ha-yeo! | To [something]! |
| 잘 먹겠습니다 | jal meok-get-sseum-ni-da | Said before eating (I will eat well) |
| 잘 먹었습니다 | jal meo-geot-sseum-ni-da | Said after eating (I ate well / thank you) |

---

## 💡 Chapter Summary
- Call server with **여기요!**; order with **[item] 주세요**
- 반찬 (side dishes) are free and refillable — ask for more
- For spice level: **덜 맵게** (less spicy) or **안 맵게** (not spicy)
- Pay with: **계산해 주세요**; specify together or separate
- Say **잘 먹겠습니다** before eating, **잘 먹었습니다** after
`,
  },

  "ch08": {
    num: 8,
    slug: "ch08",
    title: "Shopping — Markets, Stores & Bargaining",
    content: `# Chapter 8 · Shopping — Markets, Stores & Bargaining

## What You'll Learn
- How to browse, ask about items, and handle transactions
- Sizes, colors, and asking for what you want
- Bargaining: where it works and exactly what to say
- K-beauty shopping vocabulary
- 편의점 (convenience store) culture

---

## Browsing & Asking

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 그냥 보는 거예요 | geu-nyang bo-neun geo-ye-yo | Just looking |
| 이거 얼마예요? | i-geo eol-ma-ye-yo? | How much is this? |
| 입어봐도 돼요? | i-beo-bwa-do dwae-yo? | Can I try this on? |
| 다른 색 있어요? | da-reun saek i-sseo-yo? | Do you have a different color? |
| 다른 사이즈 있어요? | da-reun sa-i-jeu i-sseo-yo? | Do you have a different size? |
| 더 큰 거 있어요? | deo keun geo i-sseo-yo? | Do you have a bigger one? |
| 더 작은 거 있어요? | deo ja-geun geo i-sseo-yo? | Do you have a smaller one? |
| 이게 제일 잘 나가요 | i-ge je-il jal na-ga-yo | This is our best seller |

**Colors:**
| Korean | Color | Korean | Color |
|--------|-------|--------|-------|
| 빨간색 | red | 파란색 | blue |
| 노란색 | yellow | 초록색 | green |
| 검은색 | black | 흰색 | white |
| 회색 | gray | 분홍색 | pink |
| 갈색 | brown | 보라색 | purple |

---

## Sizes

Korean clothing often uses free/S/M/L/XL or numeric sizes (55/66/77/88 for women's, based on hip measurement in cm).

| Korean | Meaning |
|--------|---------|
| 프리 사이즈 | One-size-fits-most |
| 작아요 | It's small / too small |
| 커요 | It's big / too big |
| 딱 맞아요 | It fits perfectly |

---

## Paying

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 카드 돼요? | ka-deu dwae-yo? | Credit card okay? |
| 현금으로 낼게요 | hyeon-geu-meu-ro nael-ge-yo | I'll pay cash |
| 봉투 주세요 | bong-tu ju-se-yo | Bag, please |
| 영수증 주세요 | yeong-su-jeung ju-se-yo | Receipt, please |
| 교환할 수 있어요? | gyo-hwan-hal su i-sseo-yo? | Can I exchange this? |
| 환불해 주세요 | hwan-bul-hae ju-se-yo | Refund, please |

---

## Bargaining

Fixed prices are standard in most Korean retail. Bargaining works at:
- Traditional markets (재래시장) — 남대문, 광장, 동대문
- Street vendors and small stalls
- Some small independent shops

> ⚠️ Do NOT bargain at department stores, chain shops, or any store with a barcode scanner. It will cause embarrassment.

**Bargaining phrases:**
| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 좀 깎아 주세요 | jom kka-kka ju-se-yo | Please lower the price a little |
| 너무 비싸요 | neo-mu bi-ssa-yo | It's too expensive |
| 조금만 더 깎아 주세요 | jo-geum-man deo kka-kka ju-se-yo | A little more off, please |
| 두 개 사면 깎아 줄 수 있어요? | | If I buy two, can you discount? |
| 이게 마지막 가격이에요? | | Is this the final price? |

> 🏠 **Local's Note:** Start by asking **좀 깎아 주세요** with a smile. The vendor will likely counter. Don't push aggressively — one or two rounds is normal. If they say no, accept it gracefully. A Korean market vendor's refusal is final.

---

## K-Beauty Shopping

Korea's beauty industry is world-class. Major shopping areas:
- **명동 (Myeongdong)** — highest density of beauty shops; competitive pricing
- **올리브영 (Olive Young)** — the dominant drugstore chain; find it everywhere

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 피부 타입이 뭐예요? | | What's your skin type? |
| 건성 / 지성 / 복합성 | geon-seong / ji-seong / bok-hap-seong | dry / oily / combination |
| 이 크림 잘 팔려요? | | Does this cream sell well? |
| 샘플 있어요? | saem-peul i-sseo-yo? | Do you have samples? |
| 선크림 추천해 주세요 | | Please recommend a sunscreen |

---

## 편의점 (Convenience Store) Culture

Korean convenience stores (CU, GS25, 7-Eleven, Emart24) are genuinely useful:
- Hot foods: 삼각김밥 (triangle gimbap), 호빵, 즉석식품 (instant meals heated on-site)
- ATMs that accept foreign cards (most do)
- Phone charging, printing, parcel pickup, T-money top-up
- Open 24/7, everywhere

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 이거 데워 주세요 | i-geo de-wo ju-se-yo | Please heat this up |
| 젓가락 주세요 | jeot-ga-rak ju-se-yo | Chopsticks, please |
| 봉투 필요해요? | bong-tu pil-lyo-hae-yo? | Do you need a bag? |

---

## 💡 Chapter Summary
- **그냥 보는 거예요** — say this immediately when you enter and don't want pressure
- **이거 얼마예요?** — works for almost any price inquiry
- Bargaining works at traditional markets; never at chain stores
- Key phrase: **좀 깎아 주세요** (please give me a small discount)
- Olive Young for K-beauty; 편의점 for everything else at any hour
`,
  },

  "ch09": {
    num: 9,
    slug: "ch09",
    title: "At Work & School — Professional Korean",
    content: `# Chapter 9 · At Work & School — Professional Korean

## What You'll Learn
- Workplace titles and how to use them correctly
- Essential professional phrases — agreeing, reporting, excusing yourself
- Email and written communication conventions
- 회식 (hoesik) culture — the work dinner and how to navigate it

---

## Titles in the Korean Workplace

In Korean workplaces, you address colleagues by their **job title**, not their name. Using someone's name alone (without a title) is reserved for close friends or subordinates.

| Korean | Romanization | Title |
|--------|-------------|-------|
| 사장님 | sa-jang-nim | CEO / Company president |
| 부장님 | bu-jang-nim | Department head / General manager |
| 과장님 | gwa-jang-nim | Section chief / Manager |
| 팀장님 | tim-jang-nim | Team leader |
| 대리님 | dae-ri-nim | Assistant manager |
| 선생님 | seon-saeng-nim | Teacher |
| 교수님 | gyo-su-nim | Professor |
| 선배 | seon-bae | Senior (at work or school) |
| 후배 | hu-bae | Junior (at work or school) |

> **Rule:** Add **님** to any title for respect. Never use just a title without 님 when speaking *to* someone — only when speaking *about* them.

---

## Essential Professional Phrases

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 알겠습니다 | al-get-sseum-ni-da | Understood / I'll do that (formal) |
| 네, 알겠어요 | ne, al-ge-sseo-yo | Yes, I understand (polite) |
| 확인해 보겠습니다 | hwa-gin-hae bo-get-sseum-ni-da | I'll check on that |
| 죄송합니다 | joe-song-ham-ni-da | I'm sorry (formal apology) |
| 먼저 가겠습니다 | meon-jeo ga-get-sseum-ni-da | I'll be leaving first (said when leaving before others) |
| 수고하셨습니다 | su-go-ha-syeot-sseum-ni-da | You worked hard / Thank you for your effort |
| 수고하세요 | su-go-ha-se-yo | Keep up the good work (to someone continuing to work) |
| 잘 부탁드립니다 | jal bu-tak-deu-rim-ni-da | I look forward to working with you / Please take care of this |
| 보고드리겠습니다 | bo-go-deu-ri-get-sseum-ni-da | I will report back to you |
| 자리 비웠습니다 | ja-ri bi-weot-sseum-ni-da | I was away from my desk |

---

## Agreeing & Responding

| Situation | Korean | Meaning |
|-----------|--------|---------|
| Receiving an instruction | 알겠습니다 | Understood |
| Completing a task | 다 됐습니다 | It's done / All finished |
| In a meeting (agreement) | 맞습니다 | That's correct |
| Offering to help | 제가 할게요 | I'll do it |
| Can't do something | 죄송한데요, 좀 어렵습니다 | I'm sorry, it's a bit difficult |

---

## Email & Written Communication

Korean professional emails follow a structure:
1. Formal greeting + recipient's title
2. Self-introduction (if needed)
3. Main content
4. Closing phrase

**Key email phrases:**
| Korean | Meaning |
|--------|---------|
| 안녕하세요, [이름] [직함]님 | Hello, [Name] [Title] |
| 다름이 아니라 | The reason I'm writing is... |
| 검토 부탁드립니다 | Please review |
| 확인 부탁드립니다 | Please confirm |
| 감사합니다 | Thank you |
| [이름] 드림 | Sincerely, [Name] (lit: given by [Name]) |

---

## 회식 (Hoesik) — The Work Dinner

**회식 (hoe-sik)** is the work social dinner — a core part of Korean office culture. It's simultaneously a meal, a bonding ritual, and an extension of the workday.

회식 typically happens in rounds:
- **1차 (il-cha)** — First round: the meal itself (Korean BBQ, pojangmacha, or a restaurant)
- **2차 (i-cha)** — Second round: a bar or more drinks
- **3차 (sam-cha)** — Third round: noraebang (private karaoke) or another bar

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 오늘 회식이에요 | o-neul hoe-si-gi-e-yo | There's a work dinner today |
| 2차 가요! | i-cha ga-yo! | Let's go for the second round! |
| 먼저 일어나도 될까요? | | May I excuse myself first? |
| 내일 일찍 출근해야 해서요 | | I have to be in early tomorrow |

> 🏠 **Local's Note:** You're never obligated to attend every round of a 회식. In more modern and tech-company workplaces, skipping is increasingly accepted. In traditional corporate culture, staying for at least 1차 is an unspoken expectation. A clear, polite reason for leaving (early morning, family obligation) is always accepted gracefully.

---

## Dialogue: At the Office

---
팀장님: 이 보고서 오늘까지 될 것 같아요?
        *(Do you think this report can be done by today?)*

직원: 네, 오후 3시까지 보내드리겠습니다.
     *(Yes, I'll send it to you by 3 PM.)*

팀장님: 수고해요.
        *(Good work.)*

직원: 감사합니다. 먼저 가겠습니다.
     *(Thank you. I'll head out first.)*

팀장님: 수고했어요.
        *(You worked hard.)*

---

## 💡 Chapter Summary
- Address colleagues by **job title + 님**, not by name alone
- **알겠습니다** — the key phrase for acknowledging any instruction
- **먼저 가겠습니다** — always say this when leaving before your colleagues
- **수고하셨습니다** — say this to colleagues finishing work
- 회식 has rounds (1차, 2차, 3차) — attend at least the first; exit gracefully with a reason
`,
  },

  "ch10": {
    num: 10,
    slug: "ch10",
    title: "Staying Healthy — Pharmacy & Hospital",
    content: `# Chapter 10 · Staying Healthy — Pharmacy & Hospital

## What You'll Learn
- Body parts and how to describe symptoms
- Pharmacy vocabulary — what to ask for and how
- Types of clinics and hospitals in Korea
- Korean vs. Western medicine and when to use which

---

## Body Parts (신체 부위)

| Korean | Romanization | Body Part |
|--------|-------------|-----------|
| 머리 | meo-ri | head |
| 눈 | nun | eye(s) |
| 귀 | gwi | ear(s) |
| 코 | ko | nose |
| 목 | mok | throat / neck |
| 어깨 | eo-kkae | shoulder |
| 가슴 | ga-seum | chest |
| 배 | bae | stomach / belly |
| 등 | deung | back |
| 허리 | heo-ri | lower back / waist |
| 팔 | pal | arm |
| 손 | son | hand |
| 다리 | da-ri | leg |
| 무릎 | mu-reup | knee |
| 발 | bal | foot |

---

## Describing Symptoms

**The core pattern: [body part] + 이/가 + 아파요**

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 머리가 아파요 | meo-ri-ga a-pa-yo | I have a headache |
| 목이 아파요 | mo-gi a-pa-yo | My throat hurts |
| 배가 아파요 | bae-ga a-pa-yo | My stomach hurts |
| 허리가 아파요 | heo-ri-ga a-pa-yo | My lower back hurts |

**Other symptoms:**
| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 열이 나요 | yeo-ri na-yo | I have a fever |
| 기침이 나요 | gi-chi-mi na-yo | I have a cough |
| 콧물이 나요 | kon-mu-ri na-yo | I have a runny nose |
| 토할 것 같아요 | to-hal geot ga-ta-yo | I feel like vomiting |
| 어지러워요 | eo-ji-reo-wo-yo | I'm dizzy |
| 설사해요 | seol-sa-hae-yo | I have diarrhea |
| 알레르기 반응이 있어요 | | I'm having an allergic reaction |

---

## At the Pharmacy (약국)

Pharmacies (약국 / yak-guk) are everywhere in Korea, open long hours, and pharmacists are knowledgeable.

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 두통약 있어요? | du-tong-nyak i-sseo-yo? | Do you have headache medicine? |
| 감기약 주세요 | gam-gi-nyak ju-se-yo | Cold medicine, please |
| 소화제 주세요 | so-hwa-je ju-se-yo | Digestive medicine, please |
| 진통제 있어요? | jin-tong-je i-sseo-yo? | Do you have painkillers? |
| 처방전 없이 살 수 있어요? | | Can I buy this without a prescription? |
| 하루에 몇 번 먹어요? | ha-ru-e myeot beon meo-geo-yo? | How many times a day do I take it? |
| 식전 / 식후에 드세요 | | Take before / after meals |

---

## Types of Medical Facilities

| Korean | Type | Notes |
|--------|------|-------|
| 의원 (의 clinic) | Small local clinic | For common illness — fast, cheap, no appointment usually needed |
| 병원 | Hospital | Larger; for more serious conditions |
| 종합병원 | General hospital | Multiple departments; for complex cases |
| 응급실 | Emergency room | 24-hour emergency care |
| 한의원 | Korean traditional medicine clinic | 한방 (hanbang) medicine — acupuncture, herbal treatment |
| 약국 | Pharmacy | Can treat minor issues directly; no appointment needed |

> 🏠 **Local's Note:** For common illness (cold, fever, upset stomach), go to a **동네 의원** (local neighborhood clinic). Costs are low with Korean insurance (₩5,000–15,000 for consultation + medication), and you often don't need an appointment. Many clinics near major areas have English-speaking staff.

---

## At the Doctor (병원)

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 진료 받고 싶어요 | jil-lyo bat-go si-peo-yo | I'd like to see a doctor |
| 증상이 언제부터예요? | | When did the symptoms start? |
| [기간] 전부터요 | | Since [time period] ago |
| 약 알레르기 있어요? | | Do you have any drug allergies? |
| 진단서 써 주세요 | | Please write me a medical certificate |
| 입원해야 해요? | | Do I need to be hospitalized? |

---

## Korean vs. Western Medicine

Korea has two parallel medical systems:

**양방 (yang-bang)** — Western medicine (standard hospitals and clinics)
**한방 (han-bang)** — Korean traditional medicine (한의원)

한방 treatments include:
- 침 (chim) — acupuncture
- 뜸 (tteum) — moxibustion
- 한약 (ha-nyak) — herbal medicine

Both are covered (partially or fully) under Korean national health insurance.

---

## 💡 Chapter Summary
- Core symptom phrase: **[body part] + 이/가 + 아파요**
- For minor illness: **약국** first, then **의원** if you need a doctor
- Call for an ambulance: **119** (fire/ambulance), **112** (police)
- Korea has two medical systems: 양방 (Western) and 한방 (traditional)
- Pharmacists can advise and sell without prescription for minor issues
`,
  },

  "ch11": {
    num: 11,
    slug: "ch11",
    title: "Making Friends — Small Talk & Casual Conversation",
    content: `# Chapter 11 · Making Friends — Small Talk & Casual Conversation

## What You'll Learn
- The Korean small talk sequence — what comes first and why
- MBTI culture and why Koreans ask about it
- Giving and receiving compliments
- Talking about hobbies and free time
- Texting slang you need to know
- 눈치 (nunchi) — the social awareness concept that changes how you read a room

---

## The Small Talk Sequence

Korean small talk follows a recognizable pattern. Knowing it helps you initiate and maintain conversation naturally.

| Step | What you ask | Example |
|------|-------------|---------|
| 1. Establish connection | Where are you from? | 어디에서 왔어요? |
| 2. Find common ground | How long in Korea? | 한국에 얼마나 됐어요? |
| 3. Share opinions | Do you like Korean food? | 한국 음식 좋아해요? |
| 4. Suggest next steps | Want to hang out sometime? | 나중에 같이 밥 먹어요 |

**Useful small talk phrases:**
| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 요즘 어때요? | yo-jeum eo-ttae-yo? | How have things been lately? |
| 한국 생활 어때요? | | How is life in Korea? |
| 한국 음식 잘 맞아요? | | Does Korean food suit you well? |
| 취미가 뭐예요? | chwi-mi-ga mwo-ye-yo? | What are your hobbies? |
| 주말에 뭐 해요? | | What do you do on weekends? |
| 시간 있으면 같이 밥 먹어요 | | If you have time, let's eat together |

---

## MBTI Culture

Koreans — especially in their 20s and 30s — are deeply interested in MBTI personality types. It's commonly used as a conversation starter and personality shorthand.

| Korean | Meaning |
|--------|---------|
| MBTI가 뭐예요? | What's your MBTI? |
| 저는 INFP예요 | I'm an INFP |
| 우리 잘 맞겠다! | We'd get along well! |
| T야, F야? | Are you a T (thinker) or F (feeler)? |

> 🏠 **Local's Note:** T vs F (Thinking vs Feeling) has become almost a cultural shorthand for communication style. Being a "T" is sometimes used humorously to explain blunt responses; being an "F" for being emotionally reactive. Know your type before you arrive — you will be asked.

---

## Compliments

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 한국어 잘 하시네요! | han-gu-geo jal ha-si-ne-yo! | You speak Korean so well! |
| 정말요? 아직 멀었어요 | | Really? I still have a long way to go |
| 피부 좋으시네요 | | Your skin is great |
| 스타일 멋있어요 | | Your style is cool |
| 진짜 잘 하시는 것 같아요 | | You seem really good at this |

> **How to receive a compliment:** Koreans typically deflect with modesty. Accepting a compliment too directly can seem arrogant. A natural response: **아니에요, 별로예요** (No, not really) or **감사해요, 아직 멀었어요** (Thanks, I still have a long way to go).

---

## Talking About Hobbies

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 저는 [취미]를 좋아해요 | | I like [hobby] |
| 운동해요 | un-dong-hae-yo | I exercise |
| 독서를 좋아해요 | | I like reading |
| 요리를 즐겨요 | | I enjoy cooking |
| 게임을 자주 해요 | | I play games often |
| 여행을 좋아해요 | | I love traveling |
| 같이 해요! | | Let's do it together! |

---

## Texting Slang

| Slang | Meaning | Notes |
|-------|---------|-------|
| ㅋㅋㅋ | haha / lol | More ㅋ = louder laughter |
| ㅎㅎ | hehe | Softer, lighter laugh |
| ㅠㅠ or ㅜㅜ | tears / sad face | These are the eyes |
| ㅇㅇ | yeah / okay | Short for 응응 |
| ㄴㄴ | nope / no | Short for 노노 |
| 대박 | daebak | Awesome! Amazing! |
| 헐 | heol | Wow / Oh my / No way |
| 진짜? | Really? | Very common verbal and text |
| 뭐해? | What are you doing? | Standard text opener |
| ㅂㅂ | bye bye | Casual text goodbye |

---

## 눈치 (Nunchi) — Reading the Room

**눈치 (nun-chi)** is the Korean concept of social awareness — the ability to read a situation, pick up on unspoken cues, and adjust your behavior accordingly.

- High 눈치: you know when someone's uncomfortable without them saying so; you sense when it's time to leave; you pick up on what's wanted without being asked
- Low 눈치: you miss social cues; you stay too long; you say the wrong thing because you weren't reading the room

> 🌏 **Culture Note:** Koreans value 눈치 highly. Having good 눈치 is considered a social skill and a form of consideration for others. As a foreigner learning Korean, simply being aware that this concept exists — and trying to read situations rather than relying only on explicit communication — will earn you respect.

---

## 💡 Chapter Summary
- Korean small talk follows a natural sequence: connection → common ground → opinions → next steps
- MBTI is cultural currency — know yours before visiting
- Deflect compliments modestly; excessive agreement sounds arrogant
- Key texting slang: ㅋㅋ (lol), ㅠㅠ (sad), 대박 (amazing), 헐 (wow)
- **눈치** — social awareness; read the room, not just the words
`,
  },

  "ch12": {
    num: 12,
    slug: "ch12",
    title: "Respect & Relationships — Understanding Honorifics",
    content: `# Chapter 12 · Respect & Relationships — Understanding Honorifics

## What You'll Learn
- The two core speech levels — formal polite and informal — and when to use each
- How verbs, nouns, and even pronouns change based on who you're speaking to
- Korean kinship titles: why Koreans call strangers 오빠 and 언니
- The five most common mistakes foreigners make with honorifics

---

## The Two Systems: 존댓말 vs 반말

| System | Name | Usage |
|--------|------|-------|
| 존댓말 (jondaemal) | Polite / formal speech | Strangers, elders, colleagues, any unfamiliar situation |
| 반말 (banmal) | Casual / informal speech | Close friends of equal or lesser age — only when invited |

> **Default rule:** When in doubt, use 존댓말. You will not offend anyone by being too polite. You will offend people by being too casual.

---

## Speech Levels in Practice

**해요체 (haeyoche)** — the 존댓말 you'll use most:
- Ends in **-요**
- Warm but respectful
- Works in almost any daily situation

**합쇼체 (hapshoche)** — formal 존댓말:
- Ends in **-습니다 / -ㅂ니다**
- Used in presentations, announcements, first business meetings

**반말** — informal:
- No -요 ending
- Only with close friends who've agreed to use it (말 놓다 — to drop formality)

| Verb | 해요체 | 합쇼체 | 반말 |
|------|--------|--------|------|
| 먹다 (eat) | 먹어요 | 먹습니다 | 먹어 |
| 가다 (go) | 가요 | 갑니다 | 가 |
| 하다 (do) | 해요 | 합니다 | 해 |
| 있다 (exist/have) | 있어요 | 있습니다 | 있어 |

---

## Honorific Vocabulary — Different Words for the Same Thing

When speaking to elders or superiors, certain nouns and verbs change entirely:

| Meaning | Regular | Honorific |
|---------|---------|-----------|
| to eat | 먹다 | 드시다 / 잡수시다 |
| to sleep | 자다 | 주무시다 |
| to be / exist | 있다 | 계시다 |
| to die | 죽다 | 돌아가시다 |
| house | 집 | 댁 |
| name | 이름 | 성함 |
| age | 나이 | 연세 |
| words/speech | 말 | 말씀 |

---

## Korean Kinship Titles

Koreans often use **family terms** to address people they're not related to. The system is based on your gender and the other person's gender and age.

| If you are female, call: | Korean | Meaning |
|--------------------------|--------|---------|
| Older male | 오빠 (oppa) | older brother |
| Older female | 언니 (unni) | older sister |

| If you are male, call: | Korean | Meaning |
|------------------------|--------|---------|
| Older male | 형 (hyeong) | older brother |
| Older female | 누나 (nuna) | older sister |

**For anyone older (used by anyone):**
- 아저씨 (ajussi) — middle-aged man (use carefully — can sound rude to younger men)
- 아주머니 (ajumeoni) — middle-aged woman
- 할아버지 (harabeoji) — elderly man
- 할머니 (halmeoni) — elderly woman

> 🌏 **Culture Note:** These terms are genuine expressions of connection, not just labels. Calling someone 오빠 or 언니 signals that you see them as family-adjacent — trusted, close, familiar. Be thoughtful about when you use them; they carry emotional weight.

---

## Five Common Honorific Mistakes

1. **Using 반말 with someone you just met** — especially dangerous with older Koreans. Default to 존댓말 until clearly invited to switch.

2. **Forgetting the honorific verb forms** — saying 있어요 instead of 계세요 when asking about someone's elder. 계세요 is respectful; 있어요 sounds dismissive.

3. **Using 당신 (you)** — sounds confrontational or cold. Use the person's name + 씨, or drop the subject entirely.

4. **Saying 아저씨 to a man who doesn't consider himself middle-aged** — can cause offense. With unfamiliar men in their 30s–40s, avoid 아저씨 unless they're clearly significantly older.

5. **Never switching to 반말 when invited** — if a Korean friend asks to drop formality (말 놓자 — let's speak casually), refusing indefinitely can create distance. Accept the invitation gracefully.

---

## Dialogue: First Meeting vs Close Friend

**First meeting (존댓말):**
A: 안녕하세요. 성함이 어떻게 되세요?
   *(Hello. What is your name?)*
B: 저는 지민이라고 합니다. 만나서 반갑습니다.
   *(I'm Jimin. Nice to meet you.)*

**Close friend (반말):**
A: 야, 뭐 해?
   *(Hey, what are you doing?)*
B: 그냥 집에 있어. 왜?
   *(Just at home. Why?)*

---

## 💡 Chapter Summary
- **Default to 존댓말** (polite -요 ending) in any unfamiliar situation
- Honorific verbs change entirely: 먹다→드시다, 있다→계시다, 자다→주무시다
- Kinship titles (오빠/언니/형/누나) are used for non-relatives and carry warmth
- **반말** is only used with close friends who've explicitly agreed to it
- Avoid **당신** — use names instead
`,
  },

  "ch13": {
    num: 13,
    slug: "ch13",
    title: "Emotions & Reactions — Expressing Yourself",
    content: `# Chapter 13 · Emotions & Reactions — Expressing Yourself

## What You'll Learn
- How to express happiness, excitement, surprise, frustration, and sadness in natural Korean
- The exclamations Koreans actually use — and what they really mean
- How to soften what you say so you don't come across as blunt
- 눈치 (nunchi) revisited: how emotional expression relates to social awareness

---

## Happiness & Positive Emotions

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 기뻐요 | gi-ppeo-yo | I'm happy / glad |
| 행복해요 | haeng-bo-kae-yo | I'm happy (deeper contentment) |
| 설레요 | seol-le-yo | I'm excited / have butterflies (anticipatory feeling) |
| 신나요 | sin-na-yo | I'm excited / pumped up |
| 재미있어요 | jae-mi-i-sseo-yo | It's fun / interesting |
| 좋아요 | jo-a-yo | It's good / I like it |
| 최고예요 | choe-go-ye-yo | It's the best |
| 대박이에요 | dae-ba-gi-e-yo | It's amazing / incredible |

> **설레다 vs 신나다:** 설레다 is the flutter of anticipation — before a date, before something exciting happens. 신나다 is active, energetic excitement — like being pumped up for a concert. Both translate roughly to "excited" in English, but they feel different.

---

## Surprise & Disbelief

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 어머! | eo-meo! | Oh my! (mild surprise — typically female) |
| 어머나! | eo-meo-na! | Oh my goodness! (stronger) |
| 세상에! | se-sang-e! | Good heavens! / Oh wow! |
| 대박! | dae-bak! | Wow! Amazing! (surprise or admiration) |
| 헐! | heol! | Wow / No way / I can't believe it |
| 말도 안 돼! | mal-do an-dwae! | No way! / That can't be! |
| 진짜요? | jin-jja-yo? | Really? / Seriously? |
| 설마요? | seol-ma-yo? | You don't mean...? / Surely not? |

---

## Frustration & Difficulty

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 답답해요 | dap-dap-hae-yo | It's frustrating / I feel suffocated |
| 힘들어요 | him-deu-reo-yo | It's hard / I'm struggling |
| 짜증나요 | jja-jeung-na-yo | I'm annoyed / it's irritating |
| 스트레스 받아요 | | I'm stressed |
| 피곤해요 | pi-gon-hae-yo | I'm tired |
| 지쳤어요 | ji-chyeo-sseo-yo | I'm exhausted / burned out |
| 모르겠어요 | mo-reu-ge-sseo-yo | I don't know / I can't figure it out |
| 어떡해요 | eo-tteo-kae-yo | What should I do? / Oh no |

> 🌏 **Culture Note:** **답답하다 (dap-dap-ha-da)** is one of those Korean words with no perfect English translation. Literally it means "stuffy" or "airless." Emotionally it describes the feeling of being stuck, unable to communicate or move forward — when something or someone is blocking you and you can't do anything about it. It appears constantly in everyday Korean.

---

## Sadness & Empathy

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 슬퍼요 | seul-peo-yo | I'm sad |
| 외로워요 | oe-ro-wo-yo | I'm lonely |
| 그리워요 | geu-ri-wo-yo | I miss (someone/something) |
| 속상해요 | sok-sang-hae-yo | I'm upset / my feelings are hurt |
| 마음이 아파요 | | My heart hurts |
| 많이 힘드셨겠어요 | | That must have been really hard for you |
| 괜찮아요? | gwaen-cha-na-yo? | Are you okay? |
| 다 잘 될 거예요 | | Everything will be okay |

---

## Korean Exclamations

| Korean | Romanization | When to use |
|--------|-------------|-------------|
| 아이고! | a-i-go! | Oh dear! / Oops! / Oh my! — very versatile |
| 에이~ | e-i~ | Come on / Aww (mild disappointment or disbelief) |
| 그니까! | geu-ni-kka! | Exactly! / I know, right! |
| 맞아요! | ma-ja-yo! | That's right! / Exactly! |
| 어쩌지 | eo-jjeo-ji | What do I do? / Hmm, tricky |
| 아 진짜 | a jin-jja | Ugh, seriously / Oh come on |

---

## Softening Your Words

Korean communication often uses softeners to avoid sounding abrupt or demanding.

| Softener | Effect | Example |
|----------|--------|---------|
| -것 같아요 | "It seems like..." | 좀 어려운 것 같아요 (It seems a bit difficult) |
| 좀 | "a little / a bit" | 좀 피곤해요 (I'm a bit tired) |
| -는데요 | Creates gentle pause / "but..." | 저는 좀 다른데요 (Mine is a little different, though...) |
| 혹시 | "By any chance..." | 혹시 괜찮으세요? (Are you okay, by any chance?) |
| 죄송한데요 | "I'm sorry, but..." | 죄송한데요, 잠깐만요 (I'm sorry, but just a moment) |

---

## Dialogue: Comforting a Friend

---
A: 요즘 너무 힘들어요. 직장도 스트레스고, 집도 문제가 많아서요.
   *(Things have been really hard lately. Work is stressful, and there are a lot of problems at home.)*

B: 많이 힘드셨겠어요. 괜찮아요?
   *(That must have been really hard. Are you okay?)*

A: 그냥 좀 답답해요.
   *(I just feel a bit stuck / frustrated.)*

B: 그니까요. 많이 쌓였겠다. 다 잘 될 거예요.
   *(I know. You must have built up a lot. Everything will work out.)*

---

## 💡 Chapter Summary
- **설레요** (anticipatory excitement) vs **신나요** (energetic excitement) — both are "excited" but feel different
- **답답해요** — the uniquely Korean feeling of being emotionally stuck or suffocated
- Exclamations: 아이고 (oh dear), 대박 (amazing), 헐 (no way), 그니까 (exactly)
- Soften with: **좀** (a bit), **-것 같아요** (it seems like), **혹시** (by any chance)
- When someone's struggling, **많이 힘드셨겠어요** shows genuine empathy
`,
  },

  "ch14": {
    num: 14,
    slug: "ch14",
    title: "K-Pop & K-Drama — Language Through Pop Culture",
    content: `# Chapter 14 · K-Pop & K-Drama — Language Through Pop Culture

## What You'll Learn
- K-drama phrases that actually work in real life
- Fan culture vocabulary — from 팬싸 to 응원봉
- How to use Korean content deliberately to accelerate learning
- Recommended dramas and songs organized by difficulty level
- How Hallyu reshaped the world's relationship with Korea

---

## K-Drama Phrases That Work in Real Life

Not all drama Korean is usable in real life. Here's what actually transfers:

| Korean | Romanization | Meaning | Real-life use |
|--------|-------------|---------|---------------|
| 괜찮아요? | gwaen-cha-na-yo? | Are you okay? | Yes — natural, everyday |
| 괜찮아요 | gwaen-cha-na-yo | I'm fine / It's okay | Yes — very common |
| 잠깐만요 | jam-kkan-man-yo | Just a moment | Yes — completely natural |
| 왜요? | wae-yo? | Why? | Yes — soften with 왜 그러세요? |
| 정말요? | jeong-mal-yo? | Really? | Yes — casual surprise |
| 이게 뭐예요? | i-ge mwo-ye-yo? | What is this? | Yes — when confused by something |
| 보고 싶었어요 | bo-go si-peo-sseo-yo | I missed you | Use carefully — with the right person |

> ⚠️ **Use with caution:** Lines like 나 없으면 어떡할 거야? (What would you do without me?) sound bizarre in daily life. K-drama dialogue is often heightened — treat historical dramas especially as dramatic fiction, not language models.

---

## Fan Culture Vocabulary

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 팬덤 | paen-deom | Fandom |
| 팬싸 | paen-ssa | Fan sign event (팬 사인회) |
| 응원봉 | eung-won-bong | Light stick |
| 직캠 | jik-kaem | Fancam (individual focus video) |
| 최애 | choe-ae | Favorite idol |
| 부캐 | bu-kae | Alt persona / side character |
| 데뷔 | de-byu | Debut |
| 컴백 | keom-baek | Comeback (new music release) |
| 티저 | ti-jeo | Teaser (pre-release content) |
| 포카 | po-ka | Photocard |
| 음방 | eum-bang | Music show (음악 방송) |
| 응원법 | eung-won-beop | Fanchant / fan cheering guide |
| 1위 | il-wi | First place / chart win |
| 현장 | hyeon-jang | On-site / at the venue |

> 🏠 **Local's Note:** K-pop companies release content on a deliberate schedule — teasers, concept photos, tracklists — building to a "comeback era." Fans often wait online at midnight for releases. Understanding this rhythm helps you participate in Korean fan communities naturally.

---

## Using Content to Actually Learn Korean

Watching K-dramas passively will improve your ear — but won't teach you to speak. To break through the plateau, use **active methods:**

### Step 1: Choose the Right Level

**Beginner (Chapters 1–6):**
- Variety shows with on-screen captions: 런닝맨 (Running Man), 나혼자산다 (I Live Alone)
- Slower K-pop ballads: IU, mid-tempo NewJeans

**Beginner with grammar (Chapters 7–10):**
- 응답하라 1988 (Reply 1988) — family vocabulary, slower pace
- 이태원 클라쓰 (Itaewon Class) — workplace Korean
- 이상한 변호사 우영우 (Extraordinary Attorney Woo) — precise, clear speech

**Intermediate (Chapters 11–16):**
- 나의 아저씨 (My Mister) — natural, emotionally nuanced dialogue
- 유 퀴즈 온 더 블럭 (You Quiz on the Block) — unscripted conversations

### Step 2: Shadow Dialogue
1. Play a short clip (30–60 seconds)
2. Listen once without stopping
3. Pause after each sentence — repeat it aloud
4. Play again and speak simultaneously with the speaker

### Step 3: Mine Vocabulary
Pause when you hear an unknown word. Write it down. Look it up. Ten new words per episode is enough — don't try to catch everything.

---

## Recommended Content by Level

**Dramas:**

| Level | Title | Why it works |
|-------|-------|-------------|
| Beginner | 스물다섯 스물하나 (Twenty-Five Twenty-One) | Modern, emotional, manageable vocabulary |
| Beginner | 이상한 변호사 우영우 | Precise, clear speech pattern |
| Intermediate | 나의 아저씨 (My Mister) | Emotionally rich, subtext-heavy |
| All levels | 응답하라 1988 (Reply 1988) | Warm everyday language |

**Music:**
- **IU (아이유)** — 밤편지, 팔레트 — literary lyrics, slow enough to follow
- **BTS** — 봄날 (Spring Day) — accessible and emotionally rich
- **NewJeans** — Hype Boy, OMG — simple, repetitive, very learnable
- **BLACKPINK / Rosé** — On the Ground — clearer Korean sections

---

## 한류 (Hallyu) — The Korean Wave

한류 (han-nyu) — "Korean Wave" — the global spread of Korean pop culture, coined in the late 1990s. What began in Asia has spread worldwide: 오징어 게임 (Squid Game) became Netflix's most-watched series ever; Parasite won the Academy Award for Best Picture; TOPIK exam registrations have surged every year since 2015.

The wave is not accidental. After the 1997 Asian financial crisis, the Korean government invested heavily in cultural exports. K-pop trainees spend years developing before debut. The result: an entertainment industry unlike anywhere else.

> 🏠 **Local's Note:** Koreans have complicated feelings about Hallyu's success. There's genuine pride — but also awareness that the curated image of Korea (cafés, idols, dramas) is one layer of a more complex society. Stay curious about the whole picture.

---

## Dialogue: Talking About K-Dramas

---
유진: 요즘 뭐 봐요? *(What are you watching these days?)*

레이: 나의 아저씨 다시 보고 있어요. 진짜 명작이에요.
     *(I'm rewatching My Mister. It's truly a masterpiece.)*

유진: 맞아요! 한국어 공부에도 도움이 됐어요?
     *(Right! Did it help with studying Korean too?)*

레이: 네, 많이 됐어요. 자연스러운 표현이 많아서요.
     *(Yes, a lot. There are so many natural expressions.)*

---

## 💡 Chapter Summary
- Drama phrases like 괜찮아요, 잠깐만요, 정말요 transfer directly into real life
- Melodramatic lines do not — use drama Korean as inspiration, not a script
- Fan vocabulary (팬덤, 직캠, 포카, 컴백, 음방) is its own ecosystem
- Active learning beats passive watching: shadow, mine vocab, watch at your level
- Variety shows (especially with on-screen text) give the most natural spoken Korean
`,
  },

  "ch15": {
    num: 15,
    slug: "ch15",
    title: "Holidays & Customs — Seollal, Chuseok & More",
    content: `# Chapter 15 · Holidays & Customs — Seollal, Chuseok & More

## What You'll Learn
- The major Korean holidays — what they are, what happens, and what to say
- Gift-giving culture: what to bring, what never to bring
- Seasonal greetings for each occasion
- How Korean holiday traditions are changing

---

## Seollal (설날) — Korean Lunar New Year

**설날 (Seollal)** is the most important holiday in the Korean calendar — the lunar new year, falling between late January and mid-February. The country essentially stops as tens of millions return to their hometowns.

**What happens:**
- **차례 (cha-rye)** — ancestral memorial ceremony with food offerings
- **세배 (se-bae)** — deep bow of respect from younger to older family members
- **세뱃돈 (se-baet-don)** — new year's money given by elders to children (crisp new bills)
- **떡국 (tteok-guk)** — rice cake soup eaten on Seollal morning; eating it is said to add a year to your age

**What to say:**
| Korean | Romanization | Use |
|--------|-------------|-----|
| 새해 복 많이 받으세요 | sae-hae bok man-i ba-deu-se-yo | Happy New Year (formal) |
| 새해 복 많이 받아 | | Happy New Year (casual, to friends) |
| 새해에도 건강하세요 | | Stay healthy in the new year too |
| 올해도 잘 부탁드립니다 | | I look forward to your continued support |

> ⚠️ **새해 복 많이 받으세요** is specifically for Seollal (lunar), not January 1st (solar). Using it on the right day signals genuine cultural knowledge.

---

## Chuseok (추석) — Korean Harvest Festival

**추석 (Chuseok)** is the mid-autumn harvest festival, the 15th day of the 8th lunar month — typically September or October. Like Seollal, it triggers a national homecoming.

**What happens:**
- 차례 — ancestral ceremony
- **성묘 (seong-myo)** — visiting and tending ancestral graves
- **송편 (song-pyeon)** — half-moon rice cakes stuffed with sesame/beans/chestnut, steamed over pine needles; traditionally made together as a family
- **강강술래** — traditional circle dance under the full moon

**What to say:**
| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 추석 잘 보내세요 | chu-seok jal bo-nae-se-yo | Have a good Chuseok |
| 풍요로운 추석 되세요 | | Have an abundant Chuseok (formal) |
| 가족들과 즐거운 시간 보내세요 | | Spend happy time with your family |

---

## Other Key Holidays

| Date | Korean | Meaning |
|------|--------|---------|
| March 1 | 삼일절 | Independence Movement Day (1919) |
| May 5 | 어린이날 | Children's Day |
| June 6 | 현충일 | Memorial Day |
| August 15 | 광복절 | Liberation Day (end of Japanese colonial rule, 1945) |
| October 3 | 개천절 | National Foundation Day |
| October 9 | 한글날 | Hangeul Day (creation of the alphabet) |
| December 25 | 크리스마스 | Christmas (public holiday, popular as a couples' day) |

**Uniquely Korean commercial holidays:**
- **발렌타인데이 (Feb 14)** — women give chocolate to men
- **화이트데이 (Mar 14)** — men reciprocate with candy or gifts
- **블랙데이 (Apr 14)** — singles eat 짜장면 (black bean noodles) together
- **빼빼로데이 (Nov 11)** — exchange Pepero sticks (11/11 looks like four sticks)

---

## Gift-Giving Culture

Gift-giving in Korea is a practiced social language with clear conventions.

**Good occasions to give gifts:**
- Seollal and Chuseok (major gift seasons)
- Weddings — always cash in an envelope (축의금 / chu-gi-geum)
- Housewarmings (집들이)
- Hospital visits

**What to give:**
| Korean | Romanization | What |
|--------|-------------|------|
| 과일 세트 | gwa-il se-teu | Fruit set (premium pears, apples) |
| 홍삼 | hong-sam | Red ginseng |
| 건강 보조제 | | Health supplement set |
| 상품권 | sang-pum-gwon | Gift voucher (totally acceptable) |

**특이한 집들이 선물 (Housewarming traditions):**
- **세제 (laundry detergent)** — foam symbolizes wealth
- **화장지 (toilet paper)** — long rolls symbolize longevity
- **양초 (candles)** — modern option

**What NOT to give:**
| Don't give | Reason |
|-----------|--------|
| 신발 (shoes) | Means they'll "run away" from you |
| 칼 (knives) | Associated with cutting ties |
| Sets of 4 items | 사(4) sounds like 死 (death) |
| Name written in red ink | Red = death in traditional culture |

**Giving and receiving:**
| Korean | Meaning |
|--------|---------|
| 선물이에요 | It's a gift |
| 별거 아닌데요 | It's nothing special (humble phrase) |
| 받으세요 | Please accept this |
| 감사히 받겠습니다 | I receive this gratefully (formal) |

> 🏠 **Local's Note:** Gifts are often not opened immediately in front of the giver — this isn't indifference. It's the Korean way of not making the giver feel self-conscious if the reaction isn't effusive enough.

---

## Dialogue: Chuseok Gift

---
직원: 어머, 이게 뭐예요? *(Oh my, what is this?)*

외국인: 추석이라서요. 별거 아닌데 받으세요.
        *(Because it's Chuseok. It's nothing special, please accept it.)*

직원: 이런 걸 왜... 감사히 받겠습니다!
     *(You didn't have to... I will receive it gratefully!)*

외국인: 추석 잘 보내세요! *(Have a good Chuseok!)*

---

## 💡 Chapter Summary
- **설날** (lunar new year) and **추석** (harvest festival) — the two great Korean holidays
- Greetings: **새해 복 많이 받으세요** (Seollal) and **추석 잘 보내세요** (Chuseok)
- Gift rules: both hands, humble phrasing, avoid number 4, no sharp objects, never write names in red
- Cash gifts (축의금) at weddings — amounts are tracked and reciprocated over time
- Housewarming gift: bring laundry detergent (세제) — the foam symbolizes prosperity
`,
  },

  "ch16": {
    num: 16,
    slug: "ch16",
    title: "Dining Etiquette & Social Customs — Eating, Drinking & Going Out",
    content: `# Chapter 16 · Dining Etiquette & Social Customs — Eating, Drinking & Going Out

## What You'll Learn
- Table manners at Korean meals — the rules that matter
- Drinking culture: toasting phrases and pouring etiquette
- 노래방, 찜질방, and 피시방 — vocabulary and unwritten rules of Korea's social spaces
- 빨리빨리 — the psychology behind Korea's famous speed culture

---

## Table Manners — What Actually Matters

**The rules you must know:**

| Rule | Notes |
|------|-------|
| Wait for the eldest to eat first | Before picking up chopsticks or spoon |
| Don't pour your own drink | Pour for others; they'll pour for you |
| Use two hands with seniors | When receiving food, drinks, or any item |
| Soup spoon for rice; chopsticks for side dishes | Metal chopsticks are standard |
| Don't blow your nose at the table | Step away if needed |

**Sharing phrases:**
| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 많이 드세요 | man-i deu-se-yo | Please eat a lot |
| 맛있게 드세요 | ma-sit-ge deu-se-yo | Bon appétit (Korean style) |
| 드세요 | deu-se-yo | Please eat / help yourself |
| 같이 먹어요 | ga-chi meo-geo-yo | Let's eat together |
| 잘 먹겠습니다 | jal meok-get-sseum-ni-da | Said before eating |
| 잘 먹었습니다 | jal meo-geot-sseum-ni-da | Said after eating (thank you for the meal) |

> 🏠 **Local's Note:** The "wait for the eldest" rule gets lighter with younger, casual groups. What matters is being *aware* of the dynamic, even when it's being relaxed — awareness itself is respected.

---

## Drinking Culture

Korea has one of the highest per-capita alcohol consumption rates in the world. Drinking together is deeply embedded social activity.

**The main drinks:**
| Korean | Romanization | Description |
|--------|-------------|-------------|
| 소주 | so-ju | Distilled spirit, 16–25%; the national drink |
| 맥주 | maek-ju | Beer; popular brands: Cass, Hite, Terra |
| 막걸리 | mak-geol-li | Traditional rice wine, milky, 5–8%; served in bowls |
| 소맥 | so-maek | Soju mixed with beer — the standard combo |

**Toasting:**
| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 건배! | geon-bae! | Cheers! (dry cup) |
| 위하여! | wi-ha-yeo! | To [something]! |
| 원샷! | won-syat! | Bottoms up! |
| 짠! | jjan! | The sound of clinking — Koreans literally say this |

**Pouring etiquette:**
- Watch others' glasses — refill before they ask
- Pour for elders with **two hands** on the bottle
- Receive a pour with **both hands** holding the glass
- To decline more: cover glass gently with hand + **저는 됐어요** (I'm fine)

> 🏠 **Local's Note:** If you don't drink alcohol, say it early: **저는 술을 못 해요** (I can't drink) or **저는 술을 안 해요** (I don't drink). Koreans will accept this without pushback — what matters is the togetherness, not what's in the glass.

---

## 회식 (Hoesik) — Work Dinner Rounds

회식 (hoe-sik) — the work social dinner — happens in rounds:

| Round | Korean | Typical venue |
|-------|--------|--------------|
| 1st | 1차 (il-cha) | Dinner restaurant |
| 2nd | 2차 (i-cha) | Bar or more drinks |
| 3rd | 3차 (sam-cha) | Noraebang or another bar |

> ⚠️ **Watch Out:** **첫 잔은 원샷** (the first glass is drained in one shot) is a common expectation at group dinners. You don't have to comply if you can't, but know it's coming.

---

## 노래방 (Noraebang) — Private Karaoke

노래방 is **not** Western karaoke. You rent a private room — no audience of strangers. Just your group, microphones, tambourines, and a song catalogue. Rooms rent by the hour (~₩10,000–15,000 per room).

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 마이크 주세요 | ma-i-keu ju-se-yo | Give me the microphone |
| 이 노래 아세요? | i no-rae a-se-yo? | Do you know this song? |
| 같이 불러요! | ga-chi bul-leo-yo! | Let's sing together! |
| 다음 곡은 뭐 할까요? | | What shall we do for the next song? |

> 🏠 **Local's Note:** The unwritten rule: **no one sits down while someone is singing**. You stand, clap, shake the tambourine, and make your friend feel like they're performing at a stadium — even if the singing is objectively terrible. *Especially* then.

---

## 찜질방 (Jjimjilbang) — Korean Sauna Complex

찜질방 is a large public facility with multiple heated rooms, bathing areas (gender-separated), and sleeping areas. Entry fee: ₩10,000–15,000. You wear the provided uniform (loose shorts and T-shirt) in communal areas.

**Room types:**
| Korean | Romanization | Description |
|--------|-------------|-------------|
| 황토방 | hwang-to-bang | Yellow clay room, mid-high heat |
| 소금방 | so-geum-bang | Salt room, very hot |
| 냉방 | naeng-bang | Cool room, a break from heat |
| 수면실 | su-myeon-sil | Sleeping room (people sleep overnight here) |
| 때밀이 | ttae-mil-li | Full-body scrub service (extra cost, ~₩15,000–25,000) |

> 🏠 **Local's Note:** Budget at least 2 hours. The first 30 minutes feel strange; after that, you'll understand why Koreans spend their weekends here. You'll see grandmothers napping next to college students studying next to families eating instant ramen at midnight.

---

## 피시방 (PC방) — Gaming Café

High-spec PCs available by the hour (₩1,000–2,000/hr), usually including unlimited instant noodles. Birthplace of Korean e-sports culture.

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 몇 시간 쓸 거예요? | myeot si-gan sseu-l geo-ye-yo? | How many hours will you use? |
| 라면 하나 주세요 | | One ramen, please |
| 충전 좀 해주세요 | | Please add more time |

---

## 빨리빨리 (Ppalli Ppalli) — Korean Speed Culture

**빨리빨리 (ppal-li ppal-li)** means *hurry hurry*. It is also a cultural operating principle. Food arrives fast, construction moves in months, delivery apps promise 20–30 minutes.

| Korean | Romanization | Meaning |
|--------|-------------|---------|
| 빨리빨리 | ppal-li ppal-li | Hurry hurry / Quickly |
| 천천히 하세요 | cheon-cheon-hi ha-se-yo | Take your time / No rush |
| 서두르지 마세요 | seo-du-reu-ji ma-se-yo | Don't rush |

> 🌏 **Culture Note:** Don't interpret Korean speed as rudeness. A taxi driver who doesn't wait a second after dropping you off isn't being dismissive — they're operating on the standard cultural rhythm. Once you adjust, what felt rushed starts to feel like respect for your time.

The same culture that values 빨리빨리 in tasks values **patience in relationships**. Korean friendships deepen slowly, trust is extended carefully. The pace is calibrated differently depending on whether you're completing a task or building a connection.

---

## Dialogue: First Round of Drinks

---
선배: 자, 첫 잔은 다 같이! *(Okay, the first glass — everyone together!)*

모두: 건배! *(Cheers!)*

외국인: 맛있다... 강하네요. *(That's good... it's strong.)*

선배: 소주 처음이에요? *(Is this your first time having soju?)*

외국인: 네, 근데 좋아요! 한 잔 더 주세요.
        *(Yes, but I like it! Please give me another glass.)*

선배: (웃으며) 우리 친구 됐네요! *(Laughing: We're friends now!)*

---

## 💡 Chapter Summary
- **Table manners**: wait for eldest, pour for others, two hands with seniors, 잘 먹겠습니다 before / 잘 먹었습니다 after
- **Drinking**: 건배 for toasts, pour generously, decline with 저는 됐어요
- **회식**: 3 rounds (1차→2차→3차) — attend at least the first; exit with a clear reason
- **노래방**: private room, no strangers watching — stand and cheer for every singer
- **찜질방**: communal sauna; budget 2+ hours; try the 때밀이 scrub
- **빨리빨리**: Korean speed is cultural, not rudeness — adjust your frame
`,
  },
};
