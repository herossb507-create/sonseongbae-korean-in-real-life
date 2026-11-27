"use client";

import { dDay } from "@/lib/concerts/dday";
import { useToday } from "@/lib/concerts/useToday";

/** Countdown chip ("D-12", "D-DAY"); hidden for past shows and before hydration. */
export default function DDayBadge({ date, className = "" }: { date: string; className?: string }) {
  const label = dDay(date, useToday());
  if (!label) return null;
  const soon = label === "D-DAY" || Number(label.slice(2)) <= 7;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-black tracking-wide ${
        soon ? "bg-[#FF3D8B] text-white shadow-[0_0_12px_rgb(255_61_139/0.6)]" : "bg-[#140F2D] text-[#22D3EE]"
      } ${className}`}
    >
      {label}
    </span>
  );
}
