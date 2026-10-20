# Cloudflare Pages 배포

이 사이트는 정적 사이트로 빌드됨(`next.config.mjs`의 `output: "export"`). `npm run build`가 `out/` 폴더에 HTML·JS·CSS를 만들고, Cloudflare Pages가 그대로 서빙한다. 서버·함수·DB 없음.

## 처음 한 번 (Cloudflare 대시보드)

1. https://dash.cloudflare.com 가입/로그인
2. **Workers & Pages → Create → Pages → Connect to Git**
3. GitHub 연결 후 `herossb507-create/sonseongbae-korean-in-real-life` 선택
4. 빌드 설정
   | 항목 | 값 |
   |---|---|
   | Production branch | `main` |
   | Framework preset | `Next.js (Static HTML Export)` |
   | Build command | `npm run build` |
   | Build output directory | `out` |
5. **Environment variables (Production)**
   | 이름 | 값 |
   |---|---|
   | `NEXT_PUBLIC_APP_URL` | 실제 주소, 예: `https://sonseongbae-korean-in-real-life.pages.dev` 또는 연결한 도메인 |
   | `NODE_VERSION` | `24` (공연 데이터 검사 스크립트가 Node 22.18+ 필요. `.node-version` 파일에도 적혀 있음) |
6. **Save and Deploy** → 몇 분 뒤 `https://<프로젝트>.pages.dev`로 공개

이후 `main`에 push할 때마다 자동 재배포. 다른 브랜치를 push하면 미리보기 주소가 따로 생긴다.

## 도메인 연결

Pages 프로젝트 → **Custom domains → Set up a custom domain**. 도메인이 Cloudflare DNS에 있으면 자동, 아니면 안내된 CNAME 추가. 연결 후 `NEXT_PUBLIC_APP_URL`을 그 주소로 바꾸고 **Retry deployment**(sitemap·canonical·JSON-LD에 들어가는 주소라서).

## 로컬에서 배포본 확인

```bash
npm run build
npx serve out
```

## 주의

- `NEXT_PUBLIC_*` 값은 빌드할 때 박히므로, 바꾸면 다시 배포해야 반영된다.
- 서버가 필요한 기능(API 라우트, 서버 액션, 요청마다 다른 페이지)을 추가하면 정적 내보내기가 깨진다. 그때는 Cloudflare Workers + OpenNext로 옮겨야 함.
