// TODO: 구독 상태 Supabase에서 fetch, Stripe Customer Portal 연결

import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Korean in Real Life
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>

        {/* Profile */}
        <section className="bg-white rounded-xl border p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                defaultValue="you@example.com"
                readOnly
              />
            </div>
            <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Save changes
            </button>
          </div>
        </section>

        {/* Subscription */}
        <section className="bg-white rounded-xl border p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-1">Subscription</h2>
          <p className="text-sm text-gray-500 mb-4">
            Current plan: <strong>Free</strong>
          </p>
          <div className="flex gap-3">
            <Link
              href="/pricing"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Upgrade to Pro
            </Link>
            {/* TODO: Stripe Customer Portal 링크 */}
            <button className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50">
              Manage billing
            </button>
          </div>
        </section>

        {/* Danger zone */}
        <section className="bg-white rounded-xl border border-red-100 p-6">
          <h2 className="font-semibold text-red-600 mb-2">Danger zone</h2>
          <p className="text-sm text-gray-500 mb-4">
            Permanently delete your account and all associated data.
          </p>
          <button className="text-sm border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50">
            Delete account
          </button>
        </section>
      </div>
    </main>
  );
}
