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

// Keep a reference to the current utterance: Chrome on Android can garbage-collect
// it mid-sentence, which cuts the audio off (or never starts it).
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Load the voice list early so the first tap already has a Korean voice to pick.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  speechSynthesis.getVoices();
  speechSynthesis.addEventListener?.("voiceschanged", () => speechSynthesis.getVoices());
}

const HELP_SHOWN_KEY = "tts-help-shown";

/** One-time hint when the device can't speak Korean (no voice, muted, unsupported). */
function showTtsHelp(reason: "unsupported" | "no-korean-voice" | "error") {
  if (typeof document === "undefined") return;
  try {
    if (sessionStorage.getItem(HELP_SHOWN_KEY)) return;
    sessionStorage.setItem(HELP_SHOWN_KEY, "1");
  } catch {
    // storage blocked: still show it once for this page view
    if (document.getElementById("tts-help")) return;
  }
  const message =
    reason === "unsupported"
      ? "This browser can't play pronunciation audio. Try Chrome or Safari."
      : "Can't play Korean audio? Turn up your media volume. On Android, install a Korean voice: Settings → Text-to-speech output → Google → Install voice data → Korean.";

  const box = document.createElement("div");
  box.id = "tts-help";
  box.setAttribute("role", "status");
  box.style.cssText =
    "position:fixed;left:12px;right:12px;bottom:16px;z-index:9999;max-width:480px;margin:0 auto;" +
    "background:#1E1225;color:#fff;border-radius:14px;padding:12px 40px 12px 14px;font-size:13px;line-height:1.45;" +
    "box-shadow:0 8px 24px rgba(0,0,0,.25)";
  box.textContent = "🔊 " + message;
  const close = document.createElement("button");
  close.textContent = "✕";
  close.setAttribute("aria-label", "Close");
  close.style.cssText = "position:absolute;top:8px;right:10px;background:none;border:0;color:#fff;font-size:16px;cursor:pointer";
  close.onclick = () => box.remove();
  box.appendChild(close);
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 12000);
}

/**
 * 한국어 TTS 재생
 * ⚠️ 반드시 사용자 클릭 핸들러에서 직접 호출할 것 — 모바일 브라우저는 탭 직후에만 소리를 허용함.
 * 그래서 목소리 목록을 기다리지 않고 항상 즉시 speak()를 호출한다. 목록이 아직 비어 있어도
 * lang="ko-KR"이면 브라우저가 기본 한국어 음성을 고른다.
 */
export function speakKorean(text: string, options: SpeakOptions = {}): void {
  if (typeof window === "undefined") return;
  if (!text.trim()) return;
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    showTtsHelp("unsupported");
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ko-KR";
  utter.rate = options.rate ?? 0.85;
  utter.pitch = options.pitch ?? 1.2;

  const voices = speechSynthesis.getVoices();
  const voice = pickKoreanVoice();
  if (voice) utter.voice = voice;
  else if (voices.length > 0) showTtsHelp("no-korean-voice"); // voices loaded, none Korean

  utter.onerror = (e) => {
    // "interrupted"/"canceled" just mean the next word replaced this one.
    if (e.error !== "interrupted" && e.error !== "canceled") showTtsHelp("error");
  };
  utter.onend = () => {
    if (currentUtterance === utter) currentUtterance = null;
  };

  // Chrome on Android drops an utterance spoken right after cancel() when nothing
  // was playing, so only cancel when something is actually queued.
  if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel();
  if (speechSynthesis.paused) speechSynthesis.resume();

  currentUtterance = utter;
  speechSynthesis.speak(utter);
}
