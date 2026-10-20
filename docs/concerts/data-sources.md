# K팝 공연 데이터 수집 설계 (수익화 전제)

작성: 2026-10-19 · 개정: 2026-10-19 (광고·제휴 링크 수익화 전제로 재설계) · 상태: 설계안 (구현 전)

## 1. 결론 요약

- **K팝 공연 정보를 한 번에 주는 공개 API는 없다.** 그래서 **"아티스트 감시 목록 + 여러 출처 병합 + 사람 검수"** 구조로 간다. K팝 여부는 장르 필터가 아니라 우리가 관리하는 아티스트 목록으로 정한다.
- **수익화를 하면 "무료 개발자 API를 그냥 쓰는" 방식은 안 된다.** Ticketmaster 일반 API 약관은 API로 직접·간접 수익을 내는 것을 금지한다. → **각 예매처의 제휴(affiliate) 프로그램에 가입하고, 그 계약 아래에서 데이터와 추적 링크를 받는** 방식으로 바꾼다.
- **데이터의 뼈대는 공식 발표(직접 확인한 사실)로 만든다.** 날짜·도시·공연장 같은 사실은 우리가 공식 출처에서 직접 확인해 입력하면 어느 업체 약관에도 묶이지 않는다. 예매처 데이터는 그 위에 "티켓 링크·상태"를 덧붙이는 용도.
- **수익원은 3개로 나눈다:** ① 티켓 제휴 링크(북미·유럽·호주·남미), ② 공연 여행 제휴(공연장 근처 숙소, eSIM, 공항 이동 — 한국·일본·동남아 공연에서 주력), ③ 디스플레이 광고.
- **한국·일본 공연은 티켓 제휴가 사실상 없다**(NOL World·멜론티켓·YES24·일본 예매처의 공개 제휴/API를 찾지 못함). 이 지역은 공식 예매 링크만 걸고, 수익은 여행 제휴와 광고로 낸다.
- **리셀(StubHub 등) 링크는 기본으로 넣지 않는다.** K팝 공연은 여권·실명 확인 입장이 많아(예: NOL World 상품 안내) 리셀 티켓으로는 입장하지 못할 수 있다. 팬 신뢰를 잃는 위험이 수수료보다 크다.

## 2. 출처와 각 출처의 역할

### Tier A — 공식 발표 (사실의 기준, 자유롭게 사용)

| 출처 | 수집 방법 | 비고 |
|---|---|---|
| Weverse 공지, 기획사 공식 사이트(SM·JYP·YG·HYBE 등) | 수동 + Claude 추출 → 검수 | 공개 API 없음 |
| 아티스트 공식 X/Instagram 투어 포스터 | 수동 + Claude 이미지 추출 → 검수 | X API는 유료, 자동 수집 안 함 |
| 현지 프로모터(Live Nation, AEG 등) 공지 | 수동 | |

- 우리가 사실(날짜·도시·공연장·티켓 오픈일)을 직접 정리해 우리 문장으로 쓴다. **포스터 이미지·공지 원문은 복제하지 않고 원문 링크만** 건다.
- 이 데이터에는 어떤 제3자 약관도 붙지 않으므로 광고·제휴 페이지에 마음껏 쓸 수 있다.

### Tier B — 제휴 프로그램 (티켓 링크·상태, 수익 발생)

| 프로그램 | 지역 | 받는 것 | 수익 | 확인할 것 |
|---|---|---|---|---|
| **Ticketmaster 제휴 (Impact)** | 미국·캐나다·멕시코, 브라질·칠레·페루, 영국·유럽 다수, 호주·뉴질랜드 등 25개+ 시장. **한국·일본 없음** | 승인 시 Impact 퍼블리셔 ID, API 키/콘텐츠 도구, **Discovery Feed**(JSON/CSV, 호출 한도 없음, 매시간 갱신) | **실제 판매 기준** 커미션. **선예매 기간과 일반 예매 시작 후 24시간 동안의 1차 판매는 커미션 없음**. 요율은 국가별 Impact 계약에서 확인 | 제휴 계약이 광고와 함께 데이터를 쓰는 것을 허용하는지 계약서에서 확인 |
| **SeatGeek 제휴 (Impact/FlexOffers)** | 미국 위주 | 추적 링크, API(client_id) | 판매 % (출처마다 0.4~5%로 엇갈림) | 실제 요율·API 사용 조건은 가입 후 대시보드에서 확인 |
| Bandsintown | 전세계 | 아티스트 단위 API(app_id 승인 필요) | 없음 | 원래 아티스트·대행사용 → **수익 사이트엔 쓰지 않는 것을 기본**으로, 쓰려면 상업 이용 허락을 서면으로 받기 |
| Songkick | 전세계 | 유료 라이선스(월 $500~, 2차 출처) | 없음 | 초기엔 제외 |
| StubHub (Partnerize) | 북미·유럽 | 추적 링크, API | 판매 % (출처마다 엇갈림) | **기본 제외.** 실명 입장 아닌 공연에 한해 "재판매" 라벨을 붙여 선택적으로만 |

Ticketmaster 커미션이 "일반 예매 시작 후 24시간 이후 판매"에만 붙는다는 점이 중요하다. K팝은 선예매·오픈 직후에 매진되는 경우가 많아 **인기 투어의 티켓 수익은 기대보다 작을 수 있다.** 매진 안 된 추가 공연·중소 규모 투어·북미/유럽 도시 공연에서 수익이 날 가능성이 크다.

### Tier C — 여행 제휴 (공연과 무관하게 수익, 한국·일본·동남아 주력)

| 프로그램 | 붙일 곳 | 수익(출처마다 다름, 가입 후 확인) |
|---|---|---|
| Klook | 공연장 도시의 eSIM·교통·관광, 일부 K팝 페스티벌/시상식 티켓 패키지 | 카테고리별 2~20% |
| Trip.com | 항공·호텔 | 최대 7% |
| 숙소(Agoda, Booking.com 등) | "공연장 근처 숙소" 블록 | 가입 후 확인 |

- 상세 패널에 "Traveling to this show?" 블록: 공연장 좌표 기준 숙소 검색 링크, 해당 국가 eSIM, 공항→공연장 이동.
- Klook에서 직접 파는 K팝 행사(시상식·페스티벌 패키지)는 Tier A로 확인한 공연과 매칭되면 티켓 링크로도 쓴다.

### Tier D — 단서용 (복제 금지)

Soompi 투어 마스터리스트, kpopofficial.com, 팬 계정·팬 시트. **어떤 투어가 있는지 찾는 용도로만** 보고, Tier A에서 확인한 것만 게시한다. 남의 목록을 통째로 긁으면 약관 위반이고, 수익 사이트에서는 분쟁 위험이 더 크다.

## 3. 파이프라인

```
artists.json (감시 목록: 아티스트 + 출처별 ID)
        │
        ├─ [수동] 공식 공지 URL·텍스트·포스터 → Claude 추출기 → 검수   ← 사실의 뼈대
        ├─ [자동, 매일] Ticketmaster Discovery Feed (제휴 승인 후)
        ├─ [자동, 매일] SeatGeek API (제휴 승인 후)
        ▼
   정규화 → 공연장 매칭 → 중복 제거 → 병합
        ▼
   제휴 링크 생성 (출처별 추적 파라미터, 지역별 우선순위)
        ▼
   변경점(diff) ─► 자동 반영: 기존 공연의 상태·가격·티켓 링크 변화
               └► 검수 대기: 새 공연, 날짜/장소 변경, 취소, 사라진 공연
        ▼
   data/*.json 갱신 → GitHub PR → 확인 후 머지 → 사이트 재배포
```

### 3.1 감시 목록 (`data/artists.json`)

```jsonc
{
  "id": "nova9",
  "name": "NOVA9",
  "nameKo": "노바나인",
  "agency": "…",
  "official": { "weverse": "…", "site": "…", "x": "…" },
  "sourceIds": {
    "ticketmasterAttractionId": "K8vZ…",   // 이름 검색 대신 ID 고정 → 동명이인·트리뷰트 공연 차단
    "seatgeekPerformerSlug": "nova9"
  }
}
```

처음엔 30~50팀(해외 투어 규모가 큰 그룹 위주)으로 시작.

### 3.2 Claude 추출기 (공식 발표용)

- 입력: 공지 본문 텍스트 또는 투어 포스터 이미지. 출력: 아래 JSON 후보 → **반드시 사람이 검수**.
- 포스터에 도시만 있고 공연장이 없으면 `venue: null`로 두고 나중에 채운다.
- 결과에 원문 URL을 `sourceRefs`로 붙인다.

```jsonc
{
  "artist": "NOVA9",
  "tour": "STARFALL World Tour",
  "shows": [{ "date": "2027-01-10", "city": "Los Angeles", "country": "US", "venue": "Kia Forum", "ticketOpen": "2026-11-01" }],
  "sourceUrl": "https://…"
}
```

### 3.3 공연장·좌표

- 공연장 테이블(지금의 `venues.ts`)을 재사용. 예매처 응답에 좌표가 있으면 그대로, 없으면 OpenStreetMap Nominatim으로 후보 생성(초당 1회, 출처 표기) → 검수.
- 공연장마다 IANA `timezone` 저장 → 현지 시각과 내 시각 둘 다 표시.

### 3.4 병합 규칙

- 같은 공연 판정: `artistId` + 현지 `date` + (`venueId` 또는 같은 도시).
- 날짜·공연장·투어명: **공식(Tier A) > 제휴 API**. 공식 확인이 없는 제휴 API 단독 공연은 `unverified`로 두고 검수 후 게시.
- 티켓 상태·가격: 제휴 API 최신값 우선.
- 출처에서 사라진 공연은 바로 지우지 않고 `lastSeenAt` 기록 → 7일 이상 안 보이면 검수 대기.

### 3.5 티켓 링크 우선순위

1. 공식 1차 예매처 (제휴 가능하면 제휴 링크 — Ticketmaster/SeatGeek)
2. 공식 1차 예매처 (제휴 불가 — NOL World, 멜론티켓 글로벌, YES24 글로벌, 일본 FC 등 일반 링크)
3. 팬클럽 선예매 안내 (공식 공지 링크)
4. 재판매 — 기본 미표시. 표시할 땐 "Resale · 입장 제한 가능" 경고 필수

**제휴 링크가 있다는 이유로 공식 예매처보다 위에 두지 않는다.** 팬이 엉뚱한 곳에서 사면 사이트 신뢰가 바로 무너진다.

## 4. 데이터 모델 변경안

```ts
interface Artist { id; slug; name; nameKo?; agency?; official; sourceIds }

interface Venue {
  // 기존 필드 +
  slug: string;
  timezone: string;                       // IANA
  externalIds?: { ticketmaster?: string; seatgeek?: string };
}

interface TicketLink {
  label: string;                          // "Ticketmaster", "NOL World", "Fanclub presale"
  url: string;                            // 원본 URL (제휴 파라미터는 렌더링 시 붙임)
  kind: "primary" | "fanclub" | "presale" | "resale";
  affiliate?: "ticketmaster" | "seatgeek" | "klook" | null;
}

interface Concert {
  // 기존 필드 +
  slug: string;                           // SEO용 개별 페이지
  artistId: string;
  ticketLinks: TicketLink[];
  sourceRefs: { source: "official" | "ticketmaster" | "seatgeek" | "manual";
                url: string; externalId?: string; fetchedAt: string }[];
  verification: "verified" | "unverified";
  lastSeenAt: string;
  idRequired?: boolean;                   // 실명/여권 입장 → 재판매 링크 숨김
}
```

- 제휴 파라미터는 데이터에 굳혀 넣지 말고 **렌더링할 때 붙인다**(`src/lib/affiliate.ts`). 프로그램을 바꾸거나 ID가 바뀌어도 데이터는 그대로.
- 제휴 링크에는 `rel="sponsored noopener"`를 붙인다.

## 5. 수익화에 따른 사이트 쪽 변경

- **개별 페이지 필요:** 광고·제휴 수익은 검색 유입이 좌우한다. 지금은 지도 한 페이지뿐이므로 `/artists/[slug]`, `/concerts/[slug]`, `/cities/[slug]` 정적 페이지와 sitemap, 공연 구조화 데이터(schema.org `MusicEvent`)를 추가한다.
- **고지 문구:** 푸터·제휴 링크 근처에 "일부 링크는 제휴 링크이며 구매 시 수수료를 받을 수 있습니다" 표시(미국 FTC 등 각국 광고 표시 규정 대응). 개인정보처리방침에 광고·추적 쿠키, 제휴 추적 고지.
- **쿠키 동의:** EU/영국 방문자 대상 광고·제휴 추적이면 동의 배너 필요.
- 광고는 지도·상세 패널을 가리지 않는 자리(목록 사이, 개별 페이지 하단)에만.

## 6. 체크리스트 (구현 전에 할 일)

- [ ] **Ticketmaster 제휴 가입** (developer.ticketmaster.com → Impact 캠페인). 승인 조건이 트래픽 기준일 수 있으므로 1단계로 사이트를 먼저 띄우고 신청.
- [ ] 승인 후 계약서에서 확인: Discovery Feed를 **광고가 있는 페이지에 표시해도 되는지**, 캐시 기간, 브랜딩 규정.
- [ ] SeatGeek 제휴 가입, 실제 요율·API 조건 확인.
- [ ] Klook / Trip.com / 숙소 제휴 가입 (이건 공연 데이터와 무관해서 바로 가능).
- [ ] Ticketmaster `/classifications`에 K-Pop 하위 장르가 있는지 확인 → 감시 목록 밖 신규 아티스트 발견용 보조 수단.
- [ ] Bandsintown은 상업 이용 서면 허락 없으면 쓰지 않음.
- [ ] 포스터·아티스트 사진 게시 안 함.

## 7. 단계별 실행 계획

1. **1단계 (공식 데이터 + 여행 제휴)** — 감시 목록 30팀, Claude 추출 스크립트, 데이터 모델 변경, 실제 검증 데이터로 교체, 개별 페이지·sitemap, 제휴 고지·개인정보처리방침, 여행 제휴 블록. 티켓은 공식 예매처 일반 링크. → 배포 후 트래픽을 만들어 제휴 심사 준비.
2. **2단계 (티켓 제휴)** — Ticketmaster·SeatGeek 승인 후 Feed/API 수집기, 병합·diff 스크립트, GitHub Actions 자동 PR, `affiliate.ts`로 링크 생성.
3. **3단계 (확장)** — 디스플레이 광고, 쿠키 동의, "정보 제보/오류 신고", 사라진 공연 알림, 필요 시 DB·관리자 화면.

## 참고 출처

- Ticketmaster — [Terms of use](https://developer.ticketmaster.com/support/terms-of-use/), [FAQ](https://developer.ticketmaster.com/support/faq/), [Affiliate sign-up](https://developer.ticketmaster.com/partners/distribution-partners/affiliate-sign-up), [Getting started](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/)
- SeatGeek — [FlexOffers 프로그램 정보](https://www.flexoffers.com/affiliate-programs/seatgeek-affiliate-program), [LinkClicky 요약](https://linkclicky.com/affiliate-program/seatgeek/)
- StubHub — [Affiliate Program](https://stubhub.com/affiliates), [Partnerize 소개](https://partnerize.com/resources/blog/stubhub-affiliate-program-spotlight-and-sign-up-information)
- Bandsintown — [What is the Bandsintown API](https://help.artists.bandsintown.com/en/articles/7053475-what-is-the-bandsintown-api)
- Songkick — [apitracker](https://apitracker.io/a/songkick)
- Klook·Trip.com — [Involve Asia 여행 제휴 정리](https://involve.asia/blog/best-affiliate-programs-in-travel/), [Klook K-World Dream Awards 상품 예](https://www.klook.com/en-SG/activity/164471-k-dream-world-awards-ticket-in-seoul/)
- NOL World — [리브랜딩 보도자료](https://www.webull.com/news/13957901137134592), [외국인 예매 가이드](https://blog.namanecard.com/en/kpop-concert-tickets-foreigners-guide-2026-en/)
- 단서용 목록 — [Soompi 2026 Tour Masterlist](https://www.soompi.com/article/1797016wpp), [kpopofficial schedule](https://kpopofficial.com/schedule/)
