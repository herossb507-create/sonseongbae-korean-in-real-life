import Link from "next/link";
import { SidebarActiveLink } from "./SidebarActiveLink";
import { SidebarMobile } from "./SidebarMobile";
import { SidebarProgress } from "./SidebarProgress";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
  gold?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/home", label: "Home", icon: "🏠", exact: true },
  { href: "/learn", label: "Chapters", icon: "📖" },
  { href: "/games", label: "Games", icon: "🎮" },
  { href: "/kdrama", label: "K-Drama", icon: "🎬" },
  { href: "/dialogues", label: "Dialogues", icon: "💬" },
  { href: "/books", label: "Books", icon: "📚" },
  { href: "/concerts", label: "K-pop Concerts", icon: "🎤" },
  { href: "/daily", label: "Daily Challenge", icon: "🔥", gold: true },
  { href: "/dashboard", label: "Stats", icon: "📊" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
  return (
    <>
      {/* Mobile top bar */}
      <SidebarMobile navItems={NAV_ITEMS} />

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] min-h-screen bg-white border-r border-[#F0E6EE] sticky top-0 h-screen overflow-y-auto shrink-0 shadow-[2px_0_12px_rgba(232,67,111,0.06)]">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#F0E6EE]">
          <Link href="/home" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E8436F] to-[#9B7FE8] flex items-center justify-center text-white text-sm font-bold shadow-md">
              한
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-[#1E1225]">Korean</div>
              <div className="text-xs text-[#E8436F] font-semibold">in Real Life</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <SidebarActiveLink key={item.href} href={item.href} exact={item.exact}>
              <span className="text-base leading-none">{item.icon}</span>
              <span className={item.gold ? "text-[#F4A261] font-semibold" : undefined}>{item.label}</span>
            </SidebarActiveLink>
          ))}
        </nav>

        <SidebarProgress />
      </aside>
    </>
  );
}
