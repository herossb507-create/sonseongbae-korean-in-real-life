import type { BookId } from "./books";

// Longer content for each book's page (/books/<id>): story or overview, what's
// inside, characters, a short excerpt and images from the book. Text comes from
// the books' manuscripts and KDP listings in 02_한국콘텐츠사업; images are the
// books' own infographics and illustrations (no third-party photos).

export interface BookImage {
  src: string; // under /public
  caption: string;
}

export interface BookDetail {
  tagline: string;
  about: string[];
  forWho: string[];
  /** Grouped chapter / lesson list. */
  contents: { heading?: string; items: string[] }[];
  characters?: { name: string; ko?: string; image?: string; desc: string }[];
  excerpt?: { label: string; korean?: string; text: string };
  gallery: BookImage[];
  galleryTitle: string;
}

const img = (book: BookId, file: string, caption: string): BookImage => ({ src: `/books/${book}/${file}.jpg`, caption });

export const BOOK_DETAILS: Record<BookId, BookDetail> = {
  "kirl-1": {
    tagline: "Read Korean in an afternoon. Order dinner in Korean by the weekend.",
    about: [
      "Most textbooks teach you about Korean. Korean in Real Life teaches you what to actually say at the café, on the subway and around a Korean BBQ table, starting from absolute zero.",
      "Written for complete beginners, Volume 1 takes you from your very first Hangul letter to real conversations. Your guide is Kohami, a friendly hamster teacher who cheers you on in every chapter and shares the little tips locals know.",
    ],
    forWho: [
      "Complete beginners who can't read Hangul yet",
      "Travelers who want to order, shop and get around in Korean",
      "K-pop and K-drama fans who want to understand what they hear",
    ],
    contents: [
      {
        heading: "10 chapters",
        items: [
          "Meet Hangul — The Korean Alphabet",
          "How Korean Works — A Quick Grammar Overview",
          "Hello & Goodbye — Greetings & Introductions",
          "Nice to Meet You — Talking About Yourself",
          "Numbers, Dates & Time",
          "Getting Around — Directions & Transport",
          "Let's Eat! — Food, Restaurants & Korean Food Culture",
          "Shopping — Markets, Stores & Bargaining",
          "Korean Texting & Social Media — ㅋㅋ, KakaoTalk & Digital Korean",
          "K-Pop & K-Drama — Language Through Pop Culture",
        ],
      },
      { heading: "Plus", items: ["Complete Hangul chart", "Answer key for every exercise", "Free Listen & Repeat videos for chapters 1, 3, 4, 5 and 7"] },
    ],
    excerpt: {
      label: "Kohami's Tip · Getting Around",
      text: "On buses, tap your T-money card when you get off as well as when you get on. Skip the tap-out and you lose the free transfer to your next bus or subway. In a crowd, a quick 내릴게요! (nae-ril-ge-yo, “I'm getting off!”) clears the way.",
    },
    galleryTitle: "Quick Reference Cards from the book",
    gallery: [
      img("kirl-1", "vol1-ch01-hangul-stroke-order-01", "Hangul stroke order"),
      img("kirl-1", "vol1-ch01-korean-vowel-chart-01", "All 21 Korean vowels"),
      img("kirl-1", "vol1-ch03-bow-angle-guide-01", "How deep to bow"),
      img("kirl-1", "vol1-ch05-two-number-systems-01", "Korea's two number systems"),
      img("kirl-1", "vol1-ch06-seoul-subway-overview-01", "Seoul subway cheat sheet"),
      img("kirl-1", "vol1-ch07-restaurant-phrase-flow-01", "Restaurant phrase flow"),
      img("kirl-1", "vol1-ch11-korean-texting-guide-01", "Korean texting guide"),
      img("kirl-1", "vol1-ch10-kdrama-phrase-guide-01", "K-drama phrase safety guide"),
    ],
  },

  "kirl-2": {
    tagline: "You can order food in Korean. But can you survive a company dinner?",
    about: [
      "Volume 2 picks up where survival phrases stop. It's the Korean you need once you actually live, work or study in Korea: talking to your boss, explaining symptoms at a pharmacy, making friends, and knowing when to switch from polite to casual speech.",
      "Every chapter pairs real dialogue with the culture behind it, from honorifics and gift-giving to holidays and the unwritten rules of eating and drinking together. Kohami the hamster teacher is back with a tip in every chapter.",
    ],
    forWho: [
      "Learners who finished Volume 1 or know basic Korean",
      "Anyone about to work, study or live in Korea",
      "Learners who want to understand honorifics and Korean social customs",
    ],
    contents: [
      {
        heading: "7 chapters",
        items: [
          "At Work & School — Professional Korean",
          "Staying Healthy — Pharmacy & Hospital",
          "Making Friends — Small Talk & Casual Conversation",
          "Respect & Relationships — Understanding Honorifics",
          "Emotions & Reactions — Expressing Yourself",
          "Holidays & Customs — Seollal, Chuseok & More",
          "Dining Etiquette & Social Customs — Eating, Drinking & Going Out",
        ],
      },
      { heading: "Plus", items: ["Verb conjugation guide", "Vocabulary map and Hangul chart", "A 30-day study plan", "Free Listen & Repeat videos for every chapter"] },
    ],
    excerpt: {
      label: "Kohami's Tip · At Work & School",
      text: "Never put 님 on your own title. You introduce yourself as 김민수 대리입니다, not 대리님. 님 is the respect you give other people, so using it on yourself sounds like you're bowing to yourself.",
    },
    galleryTitle: "Quick Reference Cards from the book",
    gallery: [
      img("kirl-2", "vol2-ch09-workplace-hierarchy-01", "Korean workplace hierarchy"),
      img("kirl-2", "vol2-ch12-speech-level-map-01", "Korean speech-level map"),
      img("kirl-2", "vol2-ch10-medical-system-guide-01", "Korean medical system guide"),
      img("kirl-2", "vol2-ch13-emotion-quick-card-01", "Emotion words quick card"),
      img("kirl-2", "vol2-ch15-seollal-vs-chuseok-01", "Seollal vs Chuseok"),
      img("kirl-2", "vol2-ch15-gift-giving-rules-01", "Gift-giving rules"),
      img("kirl-2", "vol2-ch16-night-out-roadmap-01", "A Korean night out, round by round"),
      img("kirl-2", "vol2-closing-30day-study-plan-01", "Your 30-day study plan"),
    ],
  },

  "korean-on-campus": {
    tagline: "Your Korean is correct. So why does everyone laugh?",
    about: [
      "Yuki's Korean grammar is perfect, but she talks to her classmates like a hotel manager. Jake talks to everyone like an old friend, including his boss and his professor. Over one fall semester at a Korean university, both of them are about to find out how Korean really works.",
      "Korean on Campus is a Korean course told as a drama. Every lesson opens with a scene caught on a campus security camera — the same scene you can watch for free in the YouTube Shorts series 한국대학교 CCTV. Then the book shows you what the camera didn't catch, and teaches you the Korean behind every line.",
      "Every lesson has a Core layer for upper beginners (TOPIK 1–2) and a Level Up layer for intermediate learners (TOPIK 3–4), so you can read the whole season at your level.",
    ],
    forWho: [
      "Learners who can read Hangul and want to stop sounding like a textbook",
      "Anyone confused about 반말 vs 존댓말",
      "Fans of K-dramas set on campus, and anyone heading to study in Korea",
    ],
    contents: [
      {
        heading: "18 lessons · one fall semester",
        items: [
          "밥 먹자 — Let's eat!",
          "앉아도 돼? — Can I sit here?",
          "가입하고 싶어요 — I'd like to join",
          "떨려 — I'm nervous",
          "어서 오세요 — Welcome!",
          "이거 서비스예요 — It's on the house",
          "잘한다! — You're good!",
          "단톡방 만들게 — I'll make a group chat",
          "벼락치기 — Cramming",
          "무슨 사이야? — What are you two?",
          "같이 쓸래? — Want to share?",
          "자리 맡아 줘 — Save me a seat",
          "눈치 — Reading the room",
          "할 말 있어 — I have something to say",
          "마지막 무대 — The last stage",
          "할 수 있어 — You can do it",
          "사귈래? — Will you go out with me?",
          "보고 싶을 거야 — I'll miss you",
        ],
      },
      { heading: "Plus", items: ["Campus Korean dictionary", "Grammar summary", "Casual ↔ polite ↔ formal conversion table", "Full answer key and free companion videos"] },
    ],
    characters: [
      { name: "Yuki", image: "/books/korean-on-campus/char-yuki.jpg", desc: "Japanese international student, 22. Perfect grammar, far too polite — she has to learn when to switch to casual speech." },
      { name: "Jake", image: "/books/korean-on-campus/char-jake.jpg", desc: "American exchange student, 24, flying home on December 20. Talks to everyone like an old friend, including his professor." },
      { name: "Jisu", ko: "한지수", image: "/books/korean-on-campus/char-jisu.jpg", desc: "Class representative and queen of student slang, abbreviations and group-chat style." },
      { name: "Doyoon", ko: "서도윤", image: "/books/korean-on-campus/char-doyoon.jpg", desc: "Fourth-year president of the SORIUL band club. Shows how a senior talks casually to juniors." },
      { name: "Taeo", ko: "박태오", image: "/books/korean-on-campus/char-taeo.jpg", desc: "Back on campus after military service, still slipping into army-style formal speech." },
      { name: "Maria", image: "/books/korean-on-campus/char-maria.jpg", desc: "SORIUL's lead vocalist from Mexico, who learned her Korean from K-dramas." },
      { name: "Nguyen", image: "/books/korean-on-campus/char-nguyen.jpg", desc: "Vietnamese grad student, 26, working part-time at Haru Mart — the go-to for customer-service Korean." },
    ],
    galleryTitle: "Inside the season",
    gallery: [
      img("korean-on-campus", "koc-ch-12-cast-group", "The cast of Season 1"),
      img("korean-on-campus", "koc-ch-14-relationship-map-v2", "Who's who on campus"),
      img("korean-on-campus", "koc-l01-a-cctv", "Lesson 1, caught on campus CCTV"),
      img("korean-on-campus", "koc-br-06-campus-map", "Campus map of Magpie Hill University"),
      img("korean-on-campus", "koc-ig-01-speech-level-map-v2", "The speech-level map"),
      img("korean-on-campus", "koc-ig-06-polite-ladder", "The politeness ladder"),
      img("korean-on-campus", "koc-ig-07-group-chat-mockup", "단톡방: the unread “1”"),
      img("korean-on-campus", "koc-l16-b-behind", "Behind the scenes: festival night"),
    ],
  },

  "shy-girl-1": {
    tagline: "She sings only when no one is listening.",
    about: [
      "Han Hye-mi is a shy girl from a strawberry farm in the Korean countryside. Every morning at six, alone among the strawberries in Greenhouse No. 3, she sings. Nobody knows.",
      "Then comes the school festival: one switched music track, one live performance, and one fan-cam that changes everything. When a talent agency comes knocking, her family has to decide whether to let their shy girl go.",
      "The narration is in English and every line a character speaks is in natural Korean, with a small English translation right below it — so you never lose the story while you learn the Korean young Koreans really use.",
    ],
    forWho: [
      "K-pop fans who want to read a story in Korean",
      "Intermediate learners, roughly TOPIK 3 to 5",
      "Readers who finished a beginner course and know Hangul and basic endings",
    ],
    contents: [
      {
        heading: "Part 1 · Songs of Solbat-ri",
        items: [
          "The Secret in the Greenhouse — 비닐하우스의 비밀",
          "The Senior on the Bus — 버스 안의 선배",
          "Black Rose — 검은 장미",
          "Strawberries and a Letter — 딸기와 편지",
          "The Day He Stepped In — 그날, 선배가 나섰다",
          "Mi-na's Bombshell — 미나의 폭탄",
        ],
      },
      {
        heading: "Part 2 · The Festival and the Scout",
        items: ["The Switched Track — 바뀐 음원", "Hye-mi on Stage — 무대 위의 혜미", "One Million Views — 직캠 조회수 100만", "Dad's Guitar — 아빠의 기타"],
      },
      { heading: "Plus", items: ["20 grammar patterns", "150 key expressions with real pronunciation", "K-culture notes and a check-up quiz in every chapter, with answer key"] },
    ],
    characters: [
      { name: "Han Hye-mi", ko: "한혜미", image: "/books/shy-girl-1/a4-char1-220x220.jpg", desc: "Shy, gentle and secretly gifted. She only sings when she's sure no one can hear." },
      { name: "Choi Mi-na", ko: "최미나", image: "/books/shy-girl-1/a4-char2-220x220.jpg", desc: "Her loud, brave best friend — and the first person to hear how special Hye-mi's voice is." },
      { name: "Kang Jin-hyuk", ko: "강진혁", image: "/books/shy-girl-1/a4-char3-220x220.jpg", desc: "The quiet top student on the 7:20 bus. He doesn't talk much, but he notices everything." },
      { name: "Yoon Suk-jin", ko: "윤석진", image: "/books/shy-girl-1/a4-char4-220x220.jpg", desc: "The boy who always stands at the very back of Black Rose, looking at the floor." },
    ],
    excerpt: {
      label: "Hye-mi's grandmother",
      korean: "숨는다고 안 아픈 거 아니여. 혼자 아픈 거지.",
      text: "Hiding doesn't mean it doesn't hurt. It just means you hurt alone.",
    },
    galleryTitle: "From the story",
    gallery: [
      img("shy-girl-1", "a1-header-970x600", "From the greenhouse to the stage"),
      img("shy-girl-1", "a2-story1-300x300", "A secret song"),
      img("shy-girl-1", "a2-story2-300x300", "The festival stage"),
      img("shy-girl-1", "a2-story3-300x300", "The trainee contract"),
      img("shy-girl-1", "a5-map-300x300", "Map of Solbat-ri, Hye-mi's village"),
    ],
  },

  "korea-unlocked": {
    tagline: "The honest insider's guide to South Korea, written by someone who actually lives here.",
    about: [
      "Most Korea travel guides are written by people who visited for two weeks. This one is written by someone who grew up here and still lives here.",
      "Korea Unlocked covers Seoul, Busan, Jeju Island and beyond with the kind of honest, practical advice your Korean friend would give you. Not what's famous — what's actually worth your time. Fully updated for 2026.",
    ],
    forWho: [
      "First-time visitors planning a trip to Korea",
      "K-pop and K-drama fans heading to concerts and filming locations",
      "Travelers who want local tips, not tourist traps",
    ],
    contents: [
      {
        heading: "17 chapters in six parts",
        items: [
          "Before You Go — planning, getting around, culture crash course, survival Korean",
          "Seoul — neighborhoods, landmarks, hidden gems and K-culture experiences",
          "Beyond Seoul — Busan, Jeju and day trips to the DMZ, Suwon, Jeonju, Gyeongju and more",
          "Eat Korea — how Korean meals work, and where to eat in Seoul, Busan and Jeju",
          "Practical Matters — money, SIM and daily life, where to sleep, shopping",
          "Ready-to-Use — 6 itineraries from 3 to 14 days and a quick reference",
        ],
      },
      {
        heading: "Inside",
        items: [
          "2026 entry rules: who needs K-ETA and how to fill in the e-Arrival Card",
          "120+ Local's Notes you won't find on travel blogs",
          "K-drama filming locations, K-pop spots and K-beauty shopping",
          "130+ photos, illustrations and screenshot-ready infographics",
        ],
      },
    ],
    excerpt: {
      label: "Local's Note · Getting Around",
      text: "The single most important thing you can do before leaving Incheon Airport is get a T-money card. Not a taxi. Not a coffee. Not check Instagram. T-money card first. Every subway ride, bus, and convenience store purchase in Korea becomes dramatically simpler the moment that card is in your hand.",
    },
    galleryTitle: "Illustrated guides from the book",
    gallery: [
      img("korea-unlocked", "seoul-district-map", "Seoul at a glance"),
      img("korea-unlocked", "k-drama-filming-locations-map", "K-drama Seoul"),
      img("korea-unlocked", "five-palaces-comparison", "Seoul's palaces compared"),
      img("korea-unlocked", "korean-taxi-color-guide", "Korean taxis by color"),
      img("korea-unlocked", "convenience-store-items-guide", "Convenience-store must-buys"),
      img("korea-unlocked", "jjimjilbang-guide-detail", "Your first jjimjilbang"),
      img("korea-unlocked", "hanbok-rental-guide", "Hanbok rental guide"),
      img("korea-unlocked", "jeju-seasonal-guide-wheel", "Jeju through the seasons"),
      img("korea-unlocked", "pojangmacha-street-food-at-night", "Pojangmacha nights"),
    ],
  },
};
