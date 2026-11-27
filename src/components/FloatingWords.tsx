"use client";

import { motion } from "framer-motion";

const WORDS = [
  { text: "안녕하세요", x: "8%", y: "15%", delay: 0 },
  { text: "감사합니다", x: "80%", y: "10%", delay: 0.8 },
  { text: "사랑해요", x: "65%", y: "60%", delay: 1.6 },
  { text: "한국어", x: "12%", y: "70%", delay: 2.4 },
  { text: "맛있어요", x: "88%", y: "40%", delay: 1.2 },
  { text: "화이팅", x: "45%", y: "85%", delay: 0.4 },
];

/** Korean words drifting in the background; `dark` for the stage-coloured hero. */
export function FloatingWords({ dark = false }: { dark?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {WORDS.map((w, i) => (
        <motion.span
          key={w.text}
          className="absolute font-bold text-2xl md:text-3xl"
          style={{
            left: w.x,
            top: w.y,
            color: dark
              ? i % 2 === 0 ? "#FF6FB1" : "#A78BFF"
              : i % 2 === 0 ? "rgba(255,61,139,0.07)" : "rgba(124,92,255,0.07)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: dark ? [0, 0.22, 0.12, 0.22] : [0, 0.08, 0.05, 0.08],
            y: [20, 0, -8, 0],
          }}
          transition={{
            delay: w.delay,
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          {w.text}
        </motion.span>
      ))}
    </div>
  );
}
