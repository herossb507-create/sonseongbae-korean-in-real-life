# 홍보 추적 링크 (/go)

게시물에는 아마존 링크 대신 `/go/<슬러그>?src=<채널>&post=<게시물ID>`를 쓴다.
Worker(`cloudflare/worker.js`)가 클릭 1건을 Workers Analytics Engine 데이터셋 `promo_clicks`에 기록하고 302로 넘긴다.

- 슬러그 → 주소: `cloudflare/links.js` (책 주소가 바뀌면 `src/lib/books.ts`와 함께 고칠 것). 모르는 슬러그는 `/books`로.
- 사이트 안 목적지(`/books`, `/learn`, `/concerts`)는 `utm_source`·`utm_campaign`을 붙여 넘긴다.
- `wrangler.jsonc`: `run_worker_first`에 `/go/*`, `analytics_engine_datasets`에 `CLICKS` 바인딩. 데이터셋은 첫 기록 때 자동 생성.
- 바인딩이 없어도 리다이렉트는 정상 동작(기록만 빠짐).

## 기록 열

| 열 | 내용 |
|---|---|
| index1, blob1 | 슬러그 (kirl1, ku …) |
| blob2 | 채널 src (ig, x, yt, pin …, 없으면 direct) |
| blob3 | 게시물 ID (없으면 -) |
| blob4 | 국가 코드 |
| blob5 | 리퍼러 호스트 |
| blob6 | human / bot (링크 미리보기 봇) |

## 조회

`~/Desktop/프로젝트/02_한국콘텐츠사업/Promotion/clicks-report.mjs` 또는 SQL API:

```sql
SELECT blob2 AS src, blob1 AS book, SUM(_sample_interval) AS clicks
FROM promo_clicks
WHERE timestamp > NOW() - INTERVAL '7' DAY AND blob6 = 'human'
GROUP BY src, book ORDER BY clicks DESC
```

데이터는 약 3개월 보관된다(Analytics Engine 기본). 오래 남길 값은 주간 리포트에 옮겨 적을 것.
