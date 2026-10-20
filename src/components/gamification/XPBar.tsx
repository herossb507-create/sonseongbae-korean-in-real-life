"use client";

import { motion } from "framer-motion";
import { xpToNextLevel, getLevelName } from "@/lib/xp";

interface Props {
  xp: number;
  level: number;
}

export function XPBar({ xp, level }: Props) {
  const { current, needed, percent } = xpToNextLevel(xp);
  const levelName = getLevelName(level);

  return (
    <div
      className="flex items-center gap-2"
      title={`${levelName} · ${current}/${needed} XP to next level`}
    >
      <span className="text-xs font-bold text-[#FFD700] whitespace-nowrap">
        Lv.{level}
      </span>
      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FFD700] to-[#FF4757] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
