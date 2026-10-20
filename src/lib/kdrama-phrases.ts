export interface KDramaPhrase {
  id: string;
  korean: string;
  romanization: string;
  english: string;
  category: "romance" | "friendship" | "drama" | "motivation" | "daily" | "funny";
  drama?: string;
  level: "beginner" | "intermediate";
}

export const KDRAMA_PHRASES: KDramaPhrase[] = [
  // 💕 Romance (12개)
  { id: "r1", korean: "사랑해", romanization: "saranghae", english: "I love you", category: "romance", drama: "Boys Over Flowers", level: "beginner" },
  { id: "r2", korean: "보고 싶어", romanization: "bogo sipeo", english: "I miss you", category: "romance", level: "beginner" },
  { id: "r3", korean: "내 곁에 있어줘", romanization: "nae gyeote isseojwo", english: "Stay by my side", category: "romance", drama: "Goblin", level: "intermediate" },
  { id: "r4", korean: "나 좋아해?", romanization: "na joahae?", english: "Do you like me?", category: "romance", level: "beginner" },
  { id: "r5", korean: "손 잡아도 돼요?", romanization: "son jabado dwaeyo?", english: "Can I hold your hand?", category: "romance", level: "intermediate" },
  { id: "r6", korean: "당신 때문에 행복해요", romanization: "dangsin ttaemune haengbokhaeyo", english: "I'm happy because of you", category: "romance", level: "intermediate" },
  { id: "r7", korean: "처음부터 너였어", romanization: "cheoeumebuteo neoyeosseo", english: "It was always you from the beginning", category: "romance", drama: "Crash Landing on You", level: "intermediate" },
  { id: "r8", korean: "운명이야", romanization: "unmyeongiya", english: "It's fate / destiny", category: "romance", level: "beginner" },
  { id: "r9", korean: "같이 가자", romanization: "gachi gaja", english: "Let's go together", category: "romance", level: "beginner" },
  { id: "r10", korean: "네가 최고야", romanization: "nega choegoya", english: "You're the best", category: "romance", level: "beginner" },
  { id: "r11", korean: "설레어", romanization: "seolleoeo", english: "I have butterflies / I'm excited (romantically)", category: "romance", level: "intermediate" },
  { id: "r12", korean: "오늘 예뻐 보여", romanization: "oneul yeppeo boyeo", english: "You look pretty today", category: "romance", level: "beginner" },

  // 👫 Friendship (9개)
  { id: "f1", korean: "우리 친구야", romanization: "uri chinguya", english: "We're friends", category: "friendship", level: "beginner" },
  { id: "f2", korean: "내가 있잖아", romanization: "naega itjana", english: "I'm here for you", category: "friendship", drama: "Reply 1988", level: "beginner" },
  { id: "f3", korean: "힘내!", romanization: "himne!", english: "Cheer up! / You can do it!", category: "friendship", level: "beginner" },
  { id: "f4", korean: "걱정하지 마", romanization: "geokjeonghaji ma", english: "Don't worry", category: "friendship", level: "beginner" },
  { id: "f5", korean: "같이 먹자", romanization: "gachi meokja", english: "Let's eat together", category: "friendship", level: "beginner" },
  { id: "f6", korean: "진짜 친구 맞지?", romanization: "jinjja chingu matji?", english: "We're really friends, right?", category: "friendship", level: "beginner" },
  { id: "f7", korean: "오랜만이야", romanization: "oraenmaniya", english: "Long time no see", category: "friendship", level: "beginner" },
  { id: "f8", korean: "보고 싶었어", romanization: "bogo sipeosseo", english: "I missed you", category: "friendship", level: "beginner" },
  { id: "f9", korean: "우리 사이잖아", romanization: "uri saijana", english: "We're close, after all", category: "friendship", level: "intermediate" },

  // 😤 Drama Moments (9개)
  { id: "d1", korean: "어떻게 감히!", romanization: "eotteoke gamhi!", english: "How dare you!", category: "drama", level: "intermediate" },
  { id: "d2", korean: "이게 다 뭐야!", romanization: "ige da mwoya!", english: "What is all this!", category: "drama", level: "beginner" },
  { id: "d3", korean: "믿을 수가 없어", romanization: "mideul suga eopseo", english: "I can't believe it", category: "drama", level: "intermediate" },
  { id: "d4", korean: "배신자!", romanization: "baesinja!", english: "Traitor!", category: "drama", level: "beginner" },
  { id: "d5", korean: "용서 못 해", romanization: "yongseo mot hae", english: "I can't forgive you", category: "drama", level: "intermediate" },
  { id: "d6", korean: "내가 가만히 있을 것 같아?", romanization: "naega gamanhi isseul geot gata?", english: "You think I'll just let this go?", category: "drama", level: "intermediate" },
  { id: "d7", korean: "이거 전쟁이야", romanization: "igeo jeonjaengiya", english: "This is war", category: "drama", level: "intermediate" },
  { id: "d8", korean: "왜 이래?", romanization: "wae irae?", english: "Why are you acting like this?", category: "drama", level: "beginner" },
  { id: "d9", korean: "다 끝났어", romanization: "da kkeutnatsseo", english: "It's all over", category: "drama", level: "beginner" },

  // 🌟 Motivation (9개)
  { id: "m1", korean: "포기하지 마", romanization: "pogihaji ma", english: "Don't give up", category: "motivation", level: "beginner" },
  { id: "m2", korean: "할 수 있어", romanization: "hal su isseo", english: "You can do it", category: "motivation", level: "beginner" },
  { id: "m3", korean: "최선을 다해", romanization: "choeseoneul dahae", english: "Do your best", category: "motivation", level: "intermediate" },
  { id: "m4", korean: "괜찮아, 다시 시작해", romanization: "gwaenchana, dasi sijakhae", english: "It's okay, start again", category: "motivation", level: "beginner" },
  { id: "m5", korean: "꿈을 잃지 마", romanization: "kkumeul ilhji ma", english: "Don't lose your dream", category: "motivation", level: "intermediate" },
  { id: "m6", korean: "난 네 편이야", romanization: "nan ne pyeoniya", english: "I'm on your side", category: "motivation", drama: "Itaewon Class", level: "beginner" },
  { id: "m7", korean: "이겨낼 수 있어", romanization: "igyeonaael su isseo", english: "You can overcome this", category: "motivation", level: "intermediate" },
  { id: "m8", korean: "지금이 기회야", romanization: "jigeum-i gihoeyiya", english: "Now is your chance", category: "motivation", level: "intermediate" },
  { id: "m9", korean: "언젠가는 될 거야", romanization: "eonjenga-neun doel geoya", english: "Someday it will happen", category: "motivation", level: "intermediate" },

  // ☕ Daily Life (9개)
  { id: "dl1", korean: "밥 먹었어?", romanization: "bap meogeosseo?", english: "Have you eaten?", category: "daily", level: "beginner" },
  { id: "dl2", korean: "어디야?", romanization: "eodiya?", english: "Where are you?", category: "daily", level: "beginner" },
  { id: "dl3", korean: "뭐 해?", romanization: "mwo hae?", english: "What are you doing?", category: "daily", level: "beginner" },
  { id: "dl4", korean: "잘 자", romanization: "jal ja", english: "Good night / Sleep well", category: "daily", level: "beginner" },
  { id: "dl5", korean: "조심해서 가", romanization: "josimhaeseo ga", english: "Go safely / Take care on the way", category: "daily", level: "beginner" },
  { id: "dl6", korean: "나 왔어", romanization: "na wasseo", english: "I'm here / I came", category: "daily", level: "beginner" },
  { id: "dl7", korean: "오늘 어땠어?", romanization: "oneul eottaesseo?", english: "How was today?", category: "daily", level: "beginner" },
  { id: "dl8", korean: "시간 있어?", romanization: "sigan isseo?", english: "Do you have time?", category: "daily", level: "beginner" },
  { id: "dl9", korean: "같이 커피 마실래?", romanization: "gachi keopi masilae?", english: "Want to grab coffee together?", category: "daily", level: "beginner" },

  // 😂 Funny & Iconic (9개)
  { id: "fn1", korean: "대박!", romanization: "daebak!", english: "Awesome! / No way! / Jackpot!", category: "funny", level: "beginner" },
  { id: "fn2", korean: "헐!", romanization: "heol!", english: "OMG! / Seriously?!", category: "funny", level: "beginner" },
  { id: "fn3", korean: "진짜?", romanization: "jinjja?", english: "Really? / Seriously?", category: "funny", level: "beginner" },
  { id: "fn4", korean: "어머!", romanization: "eomeo!", english: "Oh my! / Goodness!", category: "funny", level: "beginner" },
  { id: "fn5", korean: "아이고!", romanization: "aigo!", english: "Oh dear! / Oh no!", category: "funny", level: "beginner" },
  { id: "fn6", korean: "뭐라고?", romanization: "mworago?", english: "What did you say? / Say that again?", category: "funny", level: "beginner" },
  { id: "fn7", korean: "완전 공감!", romanization: "wanjeon gonggam!", english: "I totally relate! / So relatable!", category: "funny", level: "beginner" },
  { id: "fn8", korean: "소름 돋아!", romanization: "soreum dota!", english: "I got goosebumps!", category: "funny", level: "intermediate" },
  { id: "fn9", korean: "웃기고 있네", romanization: "utgigo inne", english: "You're so funny / Don't make me laugh", category: "funny", level: "intermediate" },
];

export const KDRAMA_CATEGORIES = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "romance", label: "Romance", emoji: "💕" },
  { id: "friendship", label: "Friendship", emoji: "👫" },
  { id: "drama", label: "Drama", emoji: "😤" },
  { id: "motivation", label: "Motivation", emoji: "🌟" },
  { id: "daily", label: "Daily", emoji: "☕" },
  { id: "funny", label: "Funny", emoji: "😂" },
];
