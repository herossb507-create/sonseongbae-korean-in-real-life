"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  isLoggedIn: boolean;
  isAdmin?: boolean;
  isPro?: boolean;
}

export function MobileNav({ isLoggedIn, isAdmin, isPro }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 text-[#8892B0] hover:text-white transition-colors" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader className="mb-8 mt-2">
          <SheetTitle>
            Korean <span className="text-[#FF4757]">in Real Life</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1">
          {isLoggedIn ? (
            <>
              <Link href="/learn" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8892B0] hover:text-white hover:bg-white/5 transition-all text-sm">
                📖 Chapters
              </Link>
              <Link href="/games" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8892B0] hover:text-white hover:bg-white/5 transition-all text-sm">
                🎮 Games
              </Link>
              <Link href="/daily" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8892B0] hover:text-white hover:bg-white/5 transition-all text-sm">
                🔥 Daily
              </Link>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8892B0] hover:text-white hover:bg-white/5 transition-all text-sm">
                📊 Dashboard
              </Link>
              <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8892B0] hover:text-white hover:bg-white/5 transition-all text-sm">
                ⚙️ Settings
              </Link>
              {(isAdmin || isPro) && (
                <div className="px-4 py-2 mt-2">
                  {isAdmin ? (
                    <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                      👑 Admin
                    </span>
                  ) : (
                    <span className="bg-[#4F7FE8]/20 text-[#4F7FE8] text-xs font-semibold px-2.5 py-1 rounded-full">
                      ⭐ Pro
                    </span>
                  )}
                </div>
              )}
              <div className="mt-4 px-4">
                <form action="/api/logout" method="post">
                  <button
                    type="submit"
                    className="w-full text-sm text-[#8892B0] border border-white/10 px-4 py-2.5 rounded-lg hover:text-[#FF4757] hover:border-[#FF4757]/30 transition-colors text-left"
                  >
                    Log out
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <Link href="/pricing" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-[#8892B0] hover:text-white hover:bg-white/5 transition-all text-sm">
                Pricing
              </Link>
              <Link href="/login" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-[#8892B0] hover:text-white hover:bg-white/5 transition-all text-sm">
                Log in
              </Link>
              <div className="mt-4 px-4">
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center bg-gradient-to-r from-[#FF4757] to-[#FF6B81] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Start free
                </Link>
              </div>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
