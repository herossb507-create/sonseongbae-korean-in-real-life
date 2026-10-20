import Link from "next/link";
import { login } from "./actions";

interface Props {
  searchParams: { error?: string };
}

export default function LoginPage({ searchParams }: Props) {
  return (
    <main className="min-h-screen bg-[#FFF5F8] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#9B7FE8]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#E8436F]/6 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🇰🇷</span>
            <div className="text-left">
              <div className="text-lg font-bold text-[#1E1225] leading-tight">Korean in Real Life</div>
              <div className="text-xs text-[#E8436F] font-semibold">AI-Powered Learning</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#1E1225] mt-2">Welcome back</h1>
          <p className="text-[#6B5F7A] text-sm mt-1">Sign in to continue learning</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#F0E6EE] rounded-2xl p-8 shadow-[0_8px_32px_rgba(232,67,111,0.10)]">
          {searchParams.error && (
            <div className="mb-5 p-3.5 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl text-sm text-[#EF4444]">
              {searchParams.error}
            </div>
          )}

          <form action={login} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#6B5F7A] mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full bg-white border border-[#F0E6EE] rounded-xl px-4 py-3 text-[#1E1225] text-sm placeholder:text-[#B0A8BB] focus:outline-none focus:border-[#E8436F] focus:ring-2 focus:ring-[#E8436F]/20 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B5F7A] mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full bg-white border border-[#F0E6EE] rounded-xl px-4 py-3 text-[#1E1225] text-sm placeholder:text-[#B0A8BB] focus:outline-none focus:border-[#E8436F] focus:ring-2 focus:ring-[#E8436F]/20 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#E8436F] to-[#F06B8A] hover:from-[#F06B8A] hover:to-[#E8436F] text-white py-3 rounded-xl text-sm font-semibold shadow-[0_4px_24px_rgba(232,67,111,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Log in
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-[#6B5F7A]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#9B7FE8] hover:text-[#B099FF] font-medium transition-colors">
            Sign up free
          </Link>
        </p>
      </div>
    </main>
  );
}
