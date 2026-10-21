# 공연 팩트체크 (2026-10-20 ~ 21)

`data/concerts/concerts.json`을 공식 페이지(아티스트·기획사 공식 사이트, 공연장 운영사, 공식 프로모터, 공식 예매처) 기준으로 다시 확인했다.
결과: **102회 — 공식 확인 91회, 미확인 11회.** 각 공연의 `sourceRefs`에 확인한 페이지 주소가 있다.

## 바뀐 것
- **BTS:** 공식 투어 사이트(btsworldtourofficial.com)에서 아시아 전 일정 확인 → 가오슝·방콕·자카르타·홍콩 공식 확인으로 변경.
  쿠알라룸푸르 12/12·13(TM Stadium Nasional), 불라칸 2027-03-13·14·16(Philippine Sports Stadium) **추가**.
  멜버른 2/10은 공식 투어 사이트 목록엔 없지만 Ticketmaster AU(공식 판매처) 기사에 추가 공연으로 있어 유지.
- **NCT 127 사이타마:** 공연장이 Saitama Super Arena가 아니라 **Belluna Dome**(e+ 공식 예매처). 10/24 17:00, 10/25 13:00로 수정.
- **BABYMONSTER 시드니:** 공연장 이름이 Qudos Bank Arena → **Afterpay Arena**로 변경(공연장 공식 사이트). 12/13 19:00.
- **Stray Kids 방콕 2027-01-16·17: 삭제.** 프로모터·예매처 공식 페이지가 아직 없음(티켓 미발표).
- 시작 시각·매진 여부를 공식 페이지 기준으로 추가: TXT 마카오(전 회차 매진), BABYMONSTER 쿠알라룸푸르(매진), BOYNEXTDOOR 폼파노비치(매진) 등.

## 공식 확인 출처 (요약)
| 아티스트 | 확인한 곳 |
|---|---|
| BTS | btsworldtourofficial.com, The Kallang(싱가포르), Ticketmaster AU, Accor Stadium |
| Stray Kids | straykidsjapan.com(일본), Live Nation HK(홍콩), The Kallang(싱가포르) |
| TXT | NOL(서울), Weverse 공지(일본), Galaxy Macau(마카오) |
| LE SSERAFIM | Galaxy Macau, Singapore EXPO, SM Tickets(마닐라), NOL(오사카) |
| BOYNEXTDOOR | 각 공연장(Bomb Factory, MSG, Showbox, Warfield, Peacock Theater, Pompano Beach), Ticketmaster, AdmitOne |
| BABYMONSTER | Live Nation Malaysia, Rod Laver Arena, Afterpay Arena, The Kallang |
| NCT 127 | e+(사이타마), SM Tickets(마닐라) |
| ENHYPEN·ILLIT | HYBE JAPAN 보도자료 |
| MONSTA X | Live Nation 발표 |

## 미확인으로 남긴 11회 (공연 자체는 여러 언론이 기획사·프로모터 발표로 보도, 공식 판매 페이지 미확인)
TWS 가오슝 10/24 · NCT 127 방콕 10/31·11/1, 타이베이 2027-01-02 · LE SSERAFIM 타오위안 11/14·15 (Tixcraft 점검 중이라 확인 못함) ·
BOYNEXTDOOR 멕시코시티 11/24 · NMIXX 인천 11/27–29 · Stray Kids 타이베이돔 12/12 (Live Nation Taiwan 홈에 공연 영상만 있고 날짜 미표기)

사이트에는 "Unconfirmed" 배지로 표시된다. 공식 페이지가 확인되면 `sourceRefs`를 official로 바꾸고 `verification`을 `verified`로.
