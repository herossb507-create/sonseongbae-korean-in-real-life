import Link from "next/link";
import { ChapterDoneMark, LearnProgress } from "@/components/progress/ProgressBits";

export const metadata = {
  title: "Chapters | Korean in Real Life",
  description: "16 free chapters of practical Korean, from Hangul to real conversations.",
};

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1225]">Chapters</h1>
          <p className="text-[#6B5F7A] text-sm mt-1">All 16 chapters · free</p>
        </div>
        <LearnProgress total={CHAPTERS.length} />
      </div>

      <div className="space-y-3">
        {CHAPTERS.map((ch) => {
          return (
            <div
              key={ch.id}
              className="bg-white border border-[#F0E6EE] rounded-xl p-4 flex items-center gap-4 hover:bg-[#FFF0F5] hover:border-[#E8D5E0] transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-[#9B7FE8]/20 flex items-center justify-center text-[#9B7FE8] font-bold text-sm shrink-0">
                {ch.num}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#1E1225] truncate">{ch.title}</span>
                  <ChapterDoneMark id={ch.id} />
                </div>
                <p className="text-xs text-[#6B5F7A] mt-0.5">{ch.wordCount} words</p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/vocab/${ch.id}`}
                  className="text-xs border border-[#F0E6EE] text-[#6B5F7A] px-3 py-1.5 rounded-lg hover:bg-[#FFF5F8] hover:text-[#1E1225] transition-colors"
                >
                  Vocab
                </Link>
                <Link
                  href={`/learn/${ch.id}`}
                  className="text-xs bg-[#9B7FE8] text-white px-3 py-1.5 rounded-lg hover:bg-[#9B7FE8]/80 transition-colors"
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
