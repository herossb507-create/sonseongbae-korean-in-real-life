/**
 * Korean TTS utility — Web Speech API
 *
 * 여성 목소리 우선순위:
 *  - macOS Safari/Chrome : "Yuna" (시스템 기본 한국어 목소리 = 여성)
 *  - Windows             : "Heami", "Microsoft Heami"
 *  - Chrome (Google)     : "Google 한국의", "Google 한국어" (여성)
 *  - Android             : "Google Korean"
 *
 * ⚠️ Safari 주의: 반드시 사용자 클릭 이벤트 내에서 동기적으로 호출해야 함.
 *    비동기(fetch 후 등)로 호출하면 autoplay 정책에 의해 차단됨.
 */

const FEMALE_VOICE_KEYWORDS = [
  "유나",        // macOS 한국어 시스템 설정 (핵심!)
  "yuna",        // macOS 영어 시스템 설정
  "heami",       // Windows
  "해미",         // Windows 한국어 설정
  "google 한국의",
  "google 한국어",
  "google korean",
  "수아",
  "sora",
  "나나",
  "female",
  "google",
];

const MALE_VOICE_KEYWORDS = ["male", "남성", "daniel", "thomas", "유호"];

function pickKoreanVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  // "ko-KR", "ko-KP", "ko" 만 허용 — "kok-IN"(콘카니어) 등 다른 언어 제외
  const krVoices = voices.filter(
    (v) => v.lang === "ko-KR" || v.lang === "ko_KR" || v.lang === "ko-KP" || v.lang === "ko"
  );
  if (krVoices.length === 0) return null;

  const nameLower = (v: SpeechSynthesisVoice) => v.name.toLowerCase();

  // 1순위: 여성 키워드 포함
  const female = krVoices.find((v) =>
    FEMALE_VOICE_KEYWORDS.some((kw) => nameLower(v).includes(kw))
  );
  if (female) return female;

  // 2순위: 남성 키워드 없는 것 (대부분 시스템의 첫 번째 한국어 목소리 = 여성)
  const nonMale = krVoices.find(
    (v) => !MALE_VOICE_KEYWORDS.some((kw) => nameLower(v).includes(kw))
  );
  if (nonMale) return nonMale;

  return krVoices[0];
}

export interface SpeakOptions {
  rate?: number;   // 기본 0.85 (학습용 천천히)
  pitch?: number;  // 기본 1.2
}

function doSpeak(text: string, rate: number, pitch: number): void {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ko-KR";
  utter.rate = rate;
  utter.pitch = pitch;

  const voice = pickKoreanVoice();
  if (voice) utter.voice = voice;

  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

/**
 * 한국어 TTS 재생
 * ⚠️ 반드시 사용자 클릭 핸들러에서 직접 호출할 것 (Safari autoplay 정책)
 */
export function speakKorean(text: string, options: SpeakOptions = {}): void {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  if (!text.trim()) return;

  const rate = options.rate ?? 0.85;
  const pitch = options.pitch ?? 1.2;

  const voices = speechSynthesis.getVoices();

  if (voices.length > 0) {
    // 목소리 이미 로드됨 → 바로 실행 (Safari 동기 실행 유지)
    doSpeak(text, rate, pitch);
    return;
  }

  // 목소리 미로드 → voiceschanged 이벤트 대기
  let fired = false;

  const onVoicesChanged = () => {
    if (fired) return;
    fired = true;
    doSpeak(text, rate, pitch);
  };

  speechSynthesis.addEventListener("voiceschanged", onVoicesChanged, {
    once: true,
  });

  // Safari 폴링 대비 (voiceschanged 미발생 케이스)
  [200, 500, 1000].forEach((ms) => {
    setTimeout(() => {
      if (!fired && speechSynthesis.getVoices().length > 0) {
        fired = true;
        speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
        doSpeak(text, rate, pitch);
      }
    }, ms);
  });
}
