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
          ? "bg-[#FFF0F5] text-[#E8436F] border-[#E8436F] pl-3 font-semibold"
          : "text-[#6B5F7A] hover:text-[#E8436F] hover:bg-[#FFF5F8] border-transparent pl-3",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
