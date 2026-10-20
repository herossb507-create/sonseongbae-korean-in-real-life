export interface DialogueLine {
  speaker: "A" | "B";
  speakerName: string;
  korean: string;
  romanization: string;
  english: string;
}

export interface DialogueScenario {
  id: string;
  title: string;
  titleKo: string;
  emoji: string;
  setting: string;
  difficulty: "beginner" | "intermediate";
  lines: DialogueLine[];
}

export const DIALOGUE_SCENARIOS: DialogueScenario[] = [
  {
    id: "cafe",
    title: "At a Café",
    titleKo: "카페에서",
    emoji: "☕",
    setting: "A trendy coffee shop in Seoul",
    difficulty: "beginner",
    lines: [
      { speaker: "A", speakerName: "Customer", korean: "안녕하세요. 아메리카노 한 잔 주세요.", romanization: "Annyeonghaseyo. Americano han jan juseyo.", english: "Hello. One Americano, please." },
      { speaker: "B", speakerName: "Staff", korean: "네, 사이즈는 어떻게 하시겠어요?", romanization: "Ne, saijeuneun eotteoke hasigeseoyo?", english: "Sure, what size would you like?" },
      { speaker: "A", speakerName: "Customer", korean: "큰 걸로 주세요.", romanization: "Keun geollo juseyo.", english: "A large one, please." },
      { speaker: "B", speakerName: "Staff", korean: "뜨겁게 드릴까요, 아니면 아이스로 드릴까요?", romanization: "Tteugeobge deurilkkayo, animyeon aiseullo deurilkkayo?", english: "Would you like it hot or iced?" },
      { speaker: "A", speakerName: "Customer", korean: "아이스로 주세요. 얼마예요?", romanization: "Aiseullo juseyo. Eolmayeyo?", english: "Iced, please. How much is it?" },
      { speaker: "B", speakerName: "Staff", korean: "오천오백 원이에요.", romanization: "Ocheonobaek wonieyo.", english: "It's 5,500 won." },
      { speaker: "A", speakerName: "Customer", korean: "카드 돼요?", romanization: "Kadeu dwaeyo?", english: "Do you take card?" },
      { speaker: "B", speakerName: "Staff", korean: "네, 물론이죠. 여기 단말기에 대주세요.", romanization: "Ne, mullonjyo. Yeogi danmalgie daejuseyo.", english: "Yes, of course. Please tap here on the terminal." },
      { speaker: "A", speakerName: "Customer", korean: "감사합니다. 와이파이 비밀번호가 뭐예요?", romanization: "Gamsahamnida. Waipai bimilbeonhoga mwoyeyo?", english: "Thank you. What's the Wi-Fi password?" },
      { speaker: "B", speakerName: "Staff", korean: "cafe1234예요. 이쪽 자리에 앉으세요.", romanization: "cafe1234yeyo. Ijjok jarie anjeuseyo.", english: "It's cafe1234. Please have a seat over here." },
    ],
  },
  {
    id: "shopping",
    title: "Shopping for Clothes",
    titleKo: "옷 쇼핑",
    emoji: "🛍️",
    setting: "A clothing store in Myeongdong",
    difficulty: "beginner",
    lines: [
      { speaker: "B", speakerName: "Staff", korean: "어서 오세요! 찾으시는 거 있으세요?", romanization: "Eoseo oseyo! Chajeusingeo isseuseoyo?", english: "Welcome! Are you looking for something?" },
      { speaker: "A", speakerName: "Customer", korean: "그냥 구경하는 거예요.", romanization: "Geunyang gugyeonghaneun geoyeyo.", english: "I'm just browsing." },
      { speaker: "A", speakerName: "Customer", korean: "저, 이 티셔츠 다른 색 있어요?", romanization: "Jeo, i tisyeocheu dareun saek isseoyo?", english: "Excuse me, does this t-shirt come in other colors?" },
      { speaker: "B", speakerName: "Staff", korean: "네, 검정이랑 흰색 있어요. 사이즈는요?", romanization: "Ne, geomjeongnirang hinsaek isseoyo. Saijeuneunyo?", english: "Yes, we have black and white. What size?" },
      { speaker: "A", speakerName: "Customer", korean: "중간 사이즈 입어봐도 될까요?", romanization: "Junggan saijeu ibeobwado doelkkayo?", english: "Can I try on the medium size?" },
      { speaker: "B", speakerName: "Staff", korean: "물론이죠! 탈의실은 저쪽에 있어요.", romanization: "Mullonjyo! Taleuisireun jeojjoge isseoyo.", english: "Of course! The fitting room is over there." },
      { speaker: "A", speakerName: "Customer", korean: "이거 얼마예요?", romanization: "Igeo eolmayeyo?", english: "How much is this?" },
      { speaker: "B", speakerName: "Staff", korean: "29,000원이에요. 지금 세일 중이에요.", romanization: "Imangu cheonwonieyo. Jigeum seil jungieyo.", english: "It's 29,000 won. It's currently on sale." },
      { speaker: "A", speakerName: "Customer", korean: "조금 더 싸게 해줄 수 있어요?", romanization: "Jogeum deo ssage haejul su isseoyo?", english: "Can you give me a little discount?" },
      { speaker: "B", speakerName: "Staff", korean: "죄송해요, 이미 할인된 가격이에요.", romanization: "Joesonghaeyo, imi harindoen gagyeogieyo.", english: "I'm sorry, it's already the discounted price." },
      { speaker: "A", speakerName: "Customer", korean: "알겠어요. 이걸로 할게요.", romanization: "Algesseoyo. Igeolro halgeyo.", english: "I see. I'll take this one." },
    ],
  },
  {
    id: "restaurant",
    title: "Ordering at a Restaurant",
    titleKo: "식당에서",
    emoji: "🍜",
    setting: "A Korean barbecue restaurant",
    difficulty: "beginner",
    lines: [
      { speaker: "A", speakerName: "Customer", korean: "여기요! 주문할게요.", romanization: "Yeogiyo! Jumunhalgeyo.", english: "Excuse me! We'd like to order." },
      { speaker: "B", speakerName: "Server", korean: "네, 말씀하세요.", romanization: "Ne, malsseum haseyo.", english: "Yes, go ahead." },
      { speaker: "A", speakerName: "Customer", korean: "삼겹살 2인분이랑 냉면 하나 주세요.", romanization: "Samgyeopsal iinbunnirang naengmyeon hana juseyo.", english: "Two servings of samgyeopsal and one naengmyeon, please." },
      { speaker: "B", speakerName: "Server", korean: "음료는 뭘로 하시겠어요?", romanization: "Eumnyoneun mwollo hasigeseoyo?", english: "What would you like to drink?" },
      { speaker: "A", speakerName: "Customer", korean: "물이랑 소주 한 병 주세요.", romanization: "Mullirang soju han byeong juseyo.", english: "Water and a bottle of soju, please." },
      { speaker: "B", speakerName: "Server", korean: "잠시 후에 가져다 드릴게요.", romanization: "Jamsi hue gajyeoda deurilgeyo.", english: "I'll bring it to you in a moment." },
      { speaker: "A", speakerName: "Customer", korean: "저 혹시 불판 바꿔 주실 수 있어요?", romanization: "Jeo hoksi bulpan bakkwo jusil su isseoyo?", english: "Could you change the grill plate, please?" },
      { speaker: "B", speakerName: "Server", korean: "네, 바로 바꿔 드릴게요.", romanization: "Ne, baro bakkwo deurilgeyo.", english: "Yes, I'll change it right away." },
      { speaker: "A", speakerName: "Customer", korean: "계산서 주세요.", romanization: "Gyesanseo juseyo.", english: "The check, please." },
      { speaker: "B", speakerName: "Server", korean: "56,000원이에요. 카드 되세요?", romanization: "Osimnyukon wonieyo. Kadeu doeseoyo?", english: "It's 56,000 won. Do you have a card?" },
    ],
  },
  {
    id: "directions",
    title: "Asking for Directions",
    titleKo: "길 묻기",
    emoji: "🗺️",
    setting: "On a street in Seoul",
    difficulty: "intermediate",
    lines: [
      { speaker: "A", speakerName: "Tourist", korean: "저 실례합니다. 경복궁이 어디에 있어요?", romanization: "Jeo sillyehamnida. Gyeongbokgungi eodie isseoyo?", english: "Excuse me. Where is Gyeongbokgung Palace?" },
      { speaker: "B", speakerName: "Local", korean: "아, 경복궁요? 여기서 좀 멀어요.", romanization: "A, Gyeongbokgunyo? Yeogiseo jom meoreoyo.", english: "Oh, Gyeongbokgung? It's a bit far from here." },
      { speaker: "A", speakerName: "Tourist", korean: "지하철로 갈 수 있어요?", romanization: "Jihacheolro gal su isseoyo?", english: "Can I get there by subway?" },
      { speaker: "B", speakerName: "Local", korean: "네, 3호선 경복궁역에서 내리면 돼요.", romanization: "Ne, samhoseon Gyeongbokgungnyeogeseo naeriimyeon dwaeyo.", english: "Yes, take Line 3 and get off at Gyeongbokgung Station." },
      { speaker: "A", speakerName: "Tourist", korean: "가장 가까운 지하철역이 어디예요?", romanization: "Gajang gakkaun jihacheollyeogi eodiyeyo?", english: "Where's the nearest subway station?" },
      { speaker: "B", speakerName: "Local", korean: "이 길로 쭉 가다가 오른쪽으로 꺾으면 있어요.", romanization: "I gillo jjuk gadaga oreunjjogeuro kkeogkeumyeon isseoyo.", english: "Go straight down this road and turn right." },
      { speaker: "A", speakerName: "Tourist", korean: "걸어서 얼마나 걸려요?", romanization: "Georeoseo eolmana geollyeoyo?", english: "How long does it take on foot?" },
      { speaker: "B", speakerName: "Local", korean: "한 오 분 정도요.", romanization: "Han o bun jeongdoyo.", english: "About five minutes." },
      { speaker: "A", speakerName: "Tourist", korean: "정말 감사합니다!", romanization: "Jeongmal gamsahamnida!", english: "Thank you so much!" },
      { speaker: "B", speakerName: "Local", korean: "아니에요. 좋은 여행 하세요!", romanization: "Anieyo. Joeun yeohaeng haseyo!", english: "Not at all. Have a great trip!" },
    ],
  },
  {
    id: "hotel",
    title: "Hotel Check-In",
    titleKo: "호텔 체크인",
    emoji: "🏨",
    setting: "A hotel in central Seoul",
    difficulty: "intermediate",
    lines: [
      { speaker: "A", speakerName: "Guest", korean: "안녕하세요. 체크인하려고요.", romanization: "Annyeonghaseyo. Chekeuinharyeoyo.", english: "Hello. I'd like to check in." },
      { speaker: "B", speakerName: "Receptionist", korean: "성함이 어떻게 되세요?", romanization: "Seonghami eotteoke doeseoyo?", english: "What is your name?" },
      { speaker: "A", speakerName: "Guest", korean: "김민준이에요. 예약했어요.", romanization: "Kim Minjun-ieyo. Yeyakhaeosseoyo.", english: "Kim Minjun. I have a reservation." },
      { speaker: "B", speakerName: "Receptionist", korean: "확인했습니다. 3박 2인실이시죠?", romanization: "Hwagin-haetseumnida. Sambak iinsil-isijiyo?", english: "I've confirmed it. Three nights, double room, correct?" },
      { speaker: "A", speakerName: "Guest", korean: "네, 맞아요. 조기 체크인 가능해요?", romanization: "Ne, majayo. Jogi chekeurin ganeunghaeyo?", english: "Yes, that's right. Is early check-in possible?" },
      { speaker: "B", speakerName: "Receptionist", korean: "네, 방이 준비가 되어 있어요.", romanization: "Ne, bangi junbiga doeeo isseoyo.", english: "Yes, the room is ready." },
      { speaker: "A", speakerName: "Guest", korean: "수영장은 몇 시까지 열려 있어요?", romanization: "Suyeongjangeum myeot sikkaji yeollyeo isseoyo?", english: "Until what time is the pool open?" },
      { speaker: "B", speakerName: "Receptionist", korean: "밤 10시까지 이용하실 수 있어요.", romanization: "Bam yeolssikkaji iyonghashil su isseoyo.", english: "You can use it until 10 PM." },
      { speaker: "A", speakerName: "Guest", korean: "아침 식사는 포함되어 있나요?", romanization: "Achim siksaneun pohamdoeeo innayo?", english: "Is breakfast included?" },
      { speaker: "B", speakerName: "Receptionist", korean: "네, 아침 7시부터 10시까지 1층 레스토랑에서 제공됩니다.", romanization: "Ne, achim ilgopsibuteo yeolssikkaji ilcheung reseutorangeseo jegongdemnida.", english: "Yes, breakfast is served from 7 to 10 AM at the first-floor restaurant." },
    ],
  },
  {
    id: "meeting",
    title: "Meeting Someone New",
    titleKo: "새로운 만남",
    emoji: "🤝",
    setting: "A language exchange meetup in Seoul",
    difficulty: "beginner",
    lines: [
      { speaker: "A", speakerName: "Person A", korean: "안녕하세요! 저는 사라예요.", romanization: "Annyeonghaseyo! Jeoneun Sarah-yeyo.", english: "Hello! I'm Sarah." },
      { speaker: "B", speakerName: "Person B", korean: "안녕하세요. 저는 준호예요. 반가워요!", romanization: "Annyeonghaseyo. Jeoneun Junho-yeyo. Bangawoyo!", english: "Hello. I'm Junho. Nice to meet you!" },
      { speaker: "A", speakerName: "Person A", korean: "한국어 배우신 지 얼마나 됐어요?", romanization: "Hangugeo baeusin ji eolmana dwaesseoyo?", english: "How long have you been learning Korean?" },
      { speaker: "B", speakerName: "Person B", korean: "한 6개월 됐어요. 아직 많이 부족해요.", romanization: "Han yukgaewol dwaesseoyo. Ajik manhi bujokaeyo.", english: "About six months. I'm still lacking a lot." },
      { speaker: "A", speakerName: "Person A", korean: "아니에요, 잘 하시는 것 같아요!", romanization: "Anieyo, jal hashineun geot gatayo!", english: "Not at all, you seem to speak well!" },
      { speaker: "B", speakerName: "Person B", korean: "감사해요. 어디서 왔어요?", romanization: "Gamsahaeyo. Eodiseo wasseoyo?", english: "Thank you. Where are you from?" },
      { speaker: "A", speakerName: "Person A", korean: "미국에서 왔어요. 어떤 일 해요?", romanization: "Migugeseo wasseoyo. Eotteon il haeyo?", english: "I'm from the USA. What do you do?" },
      { speaker: "B", speakerName: "Person B", korean: "회사원이에요. 사라 씨는요?", romanization: "Hoesawoniieyo. Sarah ssieuneunyo?", english: "I work at a company. What about you, Sarah?" },
      { speaker: "A", speakerName: "Person A", korean: "학생이에요. 어떤 드라마 좋아해요?", romanization: "Haksaengieyo. Eotteon deurama joahaeyo?", english: "I'm a student. What kind of dramas do you like?" },
      { speaker: "B", speakerName: "Person B", korean: "저는 로맨스 드라마를 제일 좋아해요!", romanization: "Jeoneun reomaenseu deuramaruel jeil joahaeyo!", english: "I like romance dramas the most!" },
    ],
  },
  {
    id: "plans",
    title: "Making Weekend Plans",
    titleKo: "주말 계획 세우기",
    emoji: "📅",
    setting: "Texting or chatting with a friend",
    difficulty: "beginner",
    lines: [
      { speaker: "A", speakerName: "Friend A", korean: "이번 주말에 뭐 해?", romanization: "Ibeon jumale mwo hae?", english: "What are you doing this weekend?" },
      { speaker: "B", speakerName: "Friend B", korean: "아직 계획 없어. 왜?", romanization: "Ajik gyehoek eopseo. Wae?", english: "No plans yet. Why?" },
      { speaker: "A", speakerName: "Friend A", korean: "같이 한강에 가지 않을래?", romanization: "Gachi Hangange gaji aneullae?", english: "Would you like to go to Hangang River together?" },
      { speaker: "B", speakerName: "Friend B", korean: "좋아! 몇 시에 만날까?", romanization: "Joah! Myeot sie mannalka?", english: "Sounds good! What time should we meet?" },
      { speaker: "A", speakerName: "Friend A", korean: "오후 3시 어때?", romanization: "Ohu sesshi eottae?", english: "How about 3 PM?" },
      { speaker: "B", speakerName: "Friend B", korean: "좋아. 어디서 만날까?", romanization: "Joah. Eodiseo mannalka?", english: "Sure. Where should we meet?" },
      { speaker: "A", speakerName: "Friend A", korean: "뚝섬 한강공원 어때?", romanization: "Ttukseom Hanganggongwon eottae?", english: "How about Ttukseom Hangang Park?" },
      { speaker: "B", speakerName: "Friend B", korean: "완전 좋아! 치킨 사 갈게.", romanization: "Wanjeon joah! Chikin sa galge.", english: "Sounds perfect! I'll bring fried chicken." },
      { speaker: "A", speakerName: "Friend A", korean: "나는 맥주 챙겨갈게. 같이 야경 보자!", romanization: "Naneun maekju chaenggyeogalge. Gachi yagyeong boja!", english: "I'll bring beer. Let's watch the night scenery together!" },
      { speaker: "B", speakerName: "Friend B", korean: "최고다! 내일 봐!", romanization: "Choegoda! Naeil bwa!", english: "Amazing! See you tomorrow!" },
    ],
  },
  {
    id: "pharmacy",
    title: "At the Pharmacy",
    titleKo: "약국에서",
    emoji: "💊",
    setting: "A pharmacy in Korea",
    difficulty: "intermediate",
    lines: [
      { speaker: "A", speakerName: "Customer", korean: "안녕하세요. 두통약 있어요?", romanization: "Annyeonghaseyo. Dutoyngyak isseoyo?", english: "Hello. Do you have headache medicine?" },
      { speaker: "B", speakerName: "Pharmacist", korean: "네, 있어요. 어떤 증상이세요?", romanization: "Ne, isseoyo. Eotteon jeungsangiseoyo?", english: "Yes, we do. What are your symptoms?" },
      { speaker: "A", speakerName: "Customer", korean: "머리가 많이 아프고 열도 좀 있어요.", romanization: "Meoriga manhi apeugo yeoldo jom isseoyo.", english: "I have a bad headache and a slight fever." },
      { speaker: "B", speakerName: "Pharmacist", korean: "언제부터 그러셨어요?", romanization: "Eonjebuteo geureosyeosseoyo?", english: "Since when have you had these symptoms?" },
      { speaker: "A", speakerName: "Customer", korean: "어제부터요. 콧물도 나요.", romanization: "Eojebuteoyo. Konmuldo nayo.", english: "Since yesterday. I also have a runny nose." },
      { speaker: "B", speakerName: "Pharmacist", korean: "감기 기운이 있는 것 같네요. 이 종합감기약 드세요.", romanization: "Gamgi giunni inneun geot gannaeyo. I jonghapgamgiyak deuseyo.", english: "It sounds like you have a cold. Take this combined cold medicine." },
      { speaker: "A", speakerName: "Customer", korean: "하루에 몇 번 먹어야 해요?", romanization: "Harue myeot beon meogeoya haeyo?", english: "How many times a day should I take it?" },
      { speaker: "B", speakerName: "Pharmacist", korean: "하루 세 번, 식후에 드세요.", romanization: "Haru se beon, sikuhe deuseyo.", english: "Three times a day, after meals." },
      { speaker: "A", speakerName: "Customer", korean: "알레르기 있는데 괜찮을까요?", romanization: "Allereugi inneunde gwaenchanheulkkayo?", english: "I have allergies — will it be okay?" },
      { speaker: "B", speakerName: "Pharmacist", korean: "어떤 알레르기예요? 성분을 확인해 드릴게요.", romanization: "Eotteon allergeuiyeyo? Seongbuneul hwagin-hae deurilgeyo.", english: "What kind of allergy? I'll check the ingredients for you." },
      { speaker: "A", speakerName: "Customer", korean: "감사합니다. 얼마예요?", romanization: "Gamsahamnida. Eolmayeyo?", english: "Thank you. How much is it?" },
      { speaker: "B", speakerName: "Pharmacist", korean: "8,500원이에요. 빨리 나으세요!", romanization: "Palcheonobek wonieyo. Bballi naeuseyo!", english: "It's 8,500 won. Get well soon!" },
    ],
  },
];
