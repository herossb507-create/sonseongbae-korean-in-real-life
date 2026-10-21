"use client";

import { motion } from "framer-motion";

interface Props {
  streak: number;
}

export function StreakCounter({ streak }: Props) {
  if (streak === 0) return null;

  return (
    <motion.div
      className="flex items-center gap-1 bg-[#FF4757]/10 border border-[#FF4757]/20 rounded-full px-2.5 py-1"
      whileHover={{ scale: 1.05 }}
      title={`${streak}-day streak!`}
    >
      <motion.span
        animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
        transition={{
          duration: 0.6,
          delay: 1,
          repeat: Infinity,
          repeatDelay: 6,
        }}
        className="text-sm leading-none"
      >
        🔥
      </motion.span>
      <span className="text-xs font-bold text-[#FF4757]">{streak}</span>
    </motion.div>
  );
}
