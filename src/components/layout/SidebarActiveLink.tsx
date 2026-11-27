"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}

export function SidebarActiveLink({ href, children, exact = false }: Props) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-l-2",
        isActive
          ? "bg-gradient-to-r from-[#FF3D8B] to-[#7C5CFF] text-white border-transparent pl-3 font-semibold shadow-[0_4px_18px_rgba(255,61,139,0.4)]"
          : "text-white/70 hover:text-white hover:bg-white/10 border-transparent pl-3",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
