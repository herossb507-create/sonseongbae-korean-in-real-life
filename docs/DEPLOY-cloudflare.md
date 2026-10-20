# Cloudflare 배포 (Workers 정적 자산)

이 사이트는 정적 사이트로 빌드됨(`next.config.mjs`의 `output: "export"`). `npm run build`가 `out/` 폴더를 만들고,
`npx wrangler deploy`가 `wrangler.jsonc` 설정대로 그 폴더를 Cloudflare에 올린다. 서버 코드·DB 없음.

## 처음 한 번 (Cloudflare 대시보드)

1. https://dash.cloudflare.com → **Workers & Pages → Create → Import a repository**
2. GitHub의 `herossb507-create/sonseongbae-korean-in-real-life` 선택
3. 설정

   | 항목 | 값 |
   |---|---|
   | Project name | `korean-in-real-life` (`wrangler.jsonc`의 `name`과 같아야 함. 이름을 바꿀 땐 대시보드에서 먼저 바꾸고 이 파일도 맞춤) |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Root directory | `/` |

4. **Build variables** (Settings → Build → Variables and secrets)

   | 이름 | 값 |
   |---|---|
   | `NEXT_PUBLIC_APP_URL` | 실제 주소, 현재 `https://korean-in-real-life.herossb507.workers.dev` (도메인 연결 시 그 주소) |
   | `NODE_VERSION` | `24` (공연 데이터 검사 스크립트가 Node 22.18+ 필요. `.node-version`에도 적혀 있음) |

5. Deploy → `https://korean-in-real-life.herossb507.workers.dev`로 공개

이후 `main`에 push할 때마다 자동으로 다시 빌드·배포된다.

## 도메인 연결

Worker → **Settings → Domains & Routes → Add → Custom domain**. 도메인이 Cloudflare DNS에 있어야 함(없으면 도메인을 Cloudflare로 옮기거나 네임서버 변경).
연결 후 `NEXT_PUBLIC_APP_URL`을 그 주소로 바꾸고 다시 배포(sitemap·canonical·JSON-LD에 박히는 주소라서).

## 작은 Worker (`cloudflare/worker.js`)

정적 자산 서빙은 `/이름.html`을 `/이름`으로 리다이렉트한다. Google Search Console의 HTML 파일 인증은 정확한 주소에서 파일을 받아야 해서,
`wrangler.jsonc`의 `assets.run_worker_first`에 적힌 경로만 Worker가 직접 응답한다. 나머지 요청은 전부 정적 파일 그대로(Worker 요청 수에 안 잡힘).

## 로컬에서 배포본 확인

```bash
npm run build
npx wrangler dev
```

## 주의

- `NEXT_PUBLIC_*` 값은 빌드할 때 박히므로, 바꾸면 다시 배포해야 반영된다.
- 서버가 필요한 기능(API 라우트, 서버 액션, 요청마다 다른 페이지)을 추가하면 정적 내보내기가 깨진다. 그때는 OpenNext(@opennextjs/cloudflare)로 옮겨야 함.
