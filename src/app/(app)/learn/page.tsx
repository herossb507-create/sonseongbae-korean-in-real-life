import Link from "next/link";
import { ChapterDoneMark, LearnProgress } from "@/components/progress/ProgressBits";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/concerts/site";

export const metadata = pageMeta({
  title: "Learn Korean: 16 Free Chapters from Hangul to Real Conversations",
  description:
    "A free, structured Korean course: Hangul, greetings, numbers, food, shopping, honorifics, K-pop and K-drama Korean. Read each chapter with audio, flashcards and quizzes.",
  path: "/learn",
});

const CHAPTERS = [
  { id: "ch01", num: 1, title: "Meet Hangul — The Korean Alphabet", wordCount: 20 },
  { id: "ch02", num: 2, title: "How Korean Works — A Quick Grammar Overview", wordCount: 20 },
  { id: "ch03", num: 3, title: "Hello & Goodbye — Greetings & Introductions", wordCount: 20 },
  { id: "ch04", num: 4, title: "Nice to Meet You — Talking About Yourself", wordCount: 20 },
  { id: "ch05", num: 5, title: "Numbers, Dates & Time", wordCount: 20 },
  { id: "ch06", num: 6, title: "Getting Around — Directions & Transport", wordCount: 20 },
  { id: "ch07", num: 7, title: "Let's Eat! — Food, Restaurants & Korean Food Culture", wordCount: 20 },
  { id: "ch08", num: 8, title: "Shopping — Markets, Stores & Bargaining", wordCount: 20 },
  { id: "ch09", num: 9, title: "At Work & School — Professional Korean", wordCount: 20 },
  { id: "ch10", num: 10, title: "Staying Healthy — Pharmacy & Hospital", wordCount: 20 },
  { id: "ch11", num: 11, title: "Making Friends — Small Talk & Casual Conversation", wordCount: 20 },
  { id: "ch12", num: 12, title: "Respect & Relationships — Understanding Honorifics", wordCount: 20 },
  { id: "ch13", num: 13, title: "Emotions & Reactions — Expressing Yourself", wordCount: 20 },
  { id: "ch14", num: 14, title: "K-Pop & K-Drama — Language Through Pop Culture", wordCount: 20 },
  { id: "ch15", num: 15, title: "Holidays & Customs — Seollal, Chuseok & More", wordCount: 20 },
  { id: "ch16", num: 16, title: "Dining Etiquette & Social Customs", wordCount: 20 },
];

export default function LearnPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Korean in Real Life: Practical Korean from Hangul to Real Conversations",
          description:
            "A free 16-chapter Korean course for beginners: Hangul, greetings, numbers, food, shopping, honorifics, K-pop and K-drama Korean, with audio and flashcards.",
          url: `${SITE_URL}/learn`,
          inLanguage: "en",
          educationalLevel: "Beginner",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: 0, priceCurrency: "USD", category: "Free" },
          provider: { "@type": "Organization", name: "Korean in Real Life", url: `${SITE_URL}/` },
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "Online",
            courseWorkload: "PT10H",
          },
          syllabusSections: CHAPTERS.map((ch) => ({
            "@type": "Syllabus",
            name: `Chapter ${ch.num}: ${ch.title}`,
            url: `${SITE_URL}/learn/${ch.id}`,
          })),
        }}
      />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#140F2D]">Chapters</h1>
          <p className="text-[#5A5475] text-sm mt-1">All 16 chapters · free</p>
        </div>
        <LearnProgress total={CHAPTERS.length} />
      </div>

      <div className="space-y-3">
        {CHAPTERS.map((ch) => {
          return (
            <div
              key={ch.id}
              className="bg-white border border-[#EAE4F7] rounded-xl p-4 flex items-center gap-4 hover:bg-[#F2ECFF] hover:border-[#DCD2F3] transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-[#7C5CFF]/20 flex items-center justify-center text-[#7C5CFF] font-bold text-sm shrink-0">
                {ch.num}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#140F2D] truncate">{ch.title}</span>
                  <ChapterDoneMark id={ch.id} />
                </div>
                <p className="text-xs text-[#5A5475] mt-0.5">{ch.wordCount} words</p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/vocab/${ch.id}`}
                  className="text-xs border border-[#EAE4F7] text-[#5A5475] px-3 py-1.5 rounded-lg hover:bg-[#F8F5FF] hover:text-[#140F2D] transition-colors"
                >
                  Vocab
                </Link>
                <Link
                  href={`/learn/${ch.id}`}
                  className="text-xs bg-[#7C5CFF] text-white px-3 py-1.5 rounded-lg hover:bg-[#7C5CFF]/80 transition-colors"
                >
                  Read
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
