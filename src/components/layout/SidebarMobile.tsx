"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { NavItem } from "./Sidebar";
import { SidebarProgress } from "./SidebarProgress";

interface Props {
  navItems: NavItem[];
}

export function SidebarMobile({ navItems }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0E0A1F] text-white border-b border-white/10 flex items-center justify-between px-4 py-3 shadow-[0_4px_20px_rgba(124,92,255,0.25)]">
        <Link href="/home" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF3D8B] to-[#7C5CFF] text-xs font-bold">한</span>
          <span className="text-sm font-black">
            Korean <span className="text-neon">in Real Life</span>
          </span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-white/80 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Overlay + Drawer */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-[#140F2D]/30 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="stage-bg fixed left-0 top-0 bottom-0 z-50 w-[260px] text-white flex flex-col md:hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
              <Link
                href="/home"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF3D8B] to-[#7C5CFF] text-sm font-bold">한</span>
                <div className="leading-tight">
                  <div className="text-sm font-black">Korean</div>
                  <div className="text-xs text-neon font-bold">in Real Life</div>
                </div>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-white/70 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-l-2",
                      active
                        ? "bg-gradient-to-r from-[#FF3D8B] to-[#7C5CFF] text-white border-transparent font-semibold"
                        : "text-white/70 hover:text-white hover:bg-white/10 border-transparent",
                    ].join(" ")}
                  >
                    <span className="text-base leading-none">{item.icon}</span>
                    <span className={item.gold ? "text-[#FFC46B] font-semibold" : undefined}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <SidebarProgress onNavigate={() => setOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
