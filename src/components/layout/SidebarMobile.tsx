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
      <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F0E6EE] flex items-center justify-between px-4 py-3 shadow-sm">
        <Link href="/home" className="flex items-center gap-2">
          <span className="text-lg">🌸</span>
          <span className="text-sm font-bold text-[#1E1225]">
            Korean <span className="text-[#E8436F]">in Real Life</span>
          </span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-[#6B5F7A] hover:text-[#E8436F] transition-colors"
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
            className="fixed inset-0 z-50 bg-[#1E1225]/30 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed left-0 top-0 bottom-0 z-50 w-[260px] bg-white border-r border-[#F0E6EE] flex flex-col md:hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-[#F0E6EE]">
              <Link
                href="/home"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <span className="text-xl">🌸</span>
                <div className="leading-tight">
                  <div className="text-sm font-bold text-[#1E1225]">Korean</div>
                  <div className="text-xs text-[#E8436F] font-semibold">in Real Life</div>
                </div>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-[#6B5F7A] hover:text-[#E8436F] transition-colors"
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
                        ? "bg-[#FFF0F5] text-[#E8436F] border-[#E8436F] font-semibold"
                        : "text-[#6B5F7A] hover:text-[#E8436F] hover:bg-[#FFF5F8] border-transparent",
                    ].join(" ")}
                  >
                    <span className="text-base leading-none">{item.icon}</span>
                    <span className={item.gold ? "text-[#F4A261] font-semibold" : undefined}>
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
