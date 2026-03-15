import Link from "next/link";
import { PricingCard } from "@/components/PricingCard";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Korean in Real Life
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
          >
            Start free
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, honest pricing</h1>
        <p className="text-gray-500 mb-14 text-lg">
          Start free. Upgrade when you&apos;re ready.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <PricingCard
            plan="Free"
            price="$0"
            period="forever"
            features={[
              "Chapters 1–2 (preview)",
              "50 vocabulary words",
              "Basic progress tracking",
            ]}
            cta="Get started"
            href="/signup"
            highlighted={false}
          />
          <PricingCard
            plan="Pro"
            price="$7.99"
            period="per month"
            annualPrice="$59.99/year (save 37%)"
            features={[
              "All 16 chapters",
              "Pronunciation audio (TTS)",
              "Vocabulary flashcards",
              "Progress dashboard",
              "PDF cheat sheets",
              "Priority support",
            ]}
            cta="Start Pro"
            href="/signup?plan=pro"
            highlighted={true}
          />
        </div>
      </section>
    </main>
  );
}
