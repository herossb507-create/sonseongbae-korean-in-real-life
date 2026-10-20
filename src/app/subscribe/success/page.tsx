import Link from "next/link";

export default function SubscribeSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pro 구독 완료!</h2>
        <p className="text-gray-500 mb-8">
          이제 모든 챕터, 발음 듣기, 어휘 플래시카드에 자유롭게 접근할 수 있습니다.
        </p>
        <Link
          href="/learn"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          학습 시작하기 →
        </Link>
      </div>
    </main>
  );
}
