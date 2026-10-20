import Link from "next/link";

export default function SubscribeCancelPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">결제가 취소되었습니다</h2>
        <p className="text-gray-500 mb-8">
          언제든지 다시 업그레이드할 수 있습니다.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/pricing"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700"
          >
            요금제 보기
          </Link>
          <Link
            href="/learn"
            className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50"
          >
            계속 무료로
          </Link>
        </div>
      </div>
    </main>
  );
}
