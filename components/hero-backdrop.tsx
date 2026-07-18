"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Full-bleed route / ops network — visual idea for the platform, not decorative fluff. */
export function HeroBackdrop() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 hero-grain" />
      <motion.svg
        className="absolute -right-[8%] top-[8%] h-[85%] w-[70%] text-[var(--m-accent)] opacity-40 dark:opacity-45 rtl:-left-[8%] rtl:right-auto rtl:-scale-x-100"
        viewBox="0 0 640 640"
        fill="none"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.path
          d="M80 420 C160 320, 220 280, 300 260 S460 220, 560 120"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 6"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: 0.2, ease: "easeInOut" }}
        />
        <motion.path
          d="M60 200 C180 210, 240 340, 320 380 S480 460, 580 500"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.35, ease: "easeInOut" }}
        />
        <motion.path
          d="M120 520 C200 440, 280 180, 400 160 S520 140, 600 80"
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.7"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.7, delay: 0.45, ease: "easeInOut" }}
        />
        {/* Soft pulse along the primary route */}
        {!reduceMotion ? (
          <motion.circle
            r={4}
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: 4.5, delay: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <animateMotion
              dur="4.5s"
              repeatCount="indefinite"
              begin="1.4s"
              path="M80 420 C160 320, 220 280, 300 260 S460 220, 560 120"
            />
          </motion.circle>
        ) : null}
        {[
          [300, 260],
          [460, 220],
          [320, 380],
          [400, 160],
          [200, 210],
          [520, 480],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={i % 2 === 0 ? 5 : 3.5}
            fill="currentColor"
            initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
            animate={
              reduceMotion
                ? { scale: 1, opacity: 1 }
                : {
                    scale: [1, 1.35, 1],
                    opacity: [1, 0.65, 1],
                  }
            }
            transition={
              reduceMotion
                ? { delay: 0.7 + i * 0.08, duration: 0.35 }
                : {
                    delay: 0.7 + i * 0.08,
                    duration: 0.35,
                    scale: {
                      delay: 1.6 + i * 0.2,
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    opacity: {
                      delay: 1.6 + i * 0.2,
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
            }
          />
        ))}
        <motion.circle
          cx={560}
          cy={120}
          r={10}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          initial={reduceMotion ? false : { scale: 0 }}
          animate={
            reduceMotion
              ? { scale: 1 }
              : { scale: [1, 1.15, 1], opacity: [1, 0.7, 1] }
          }
          transition={
            reduceMotion
              ? { delay: 1.1, type: "spring", stiffness: 180, damping: 14 }
              : {
                  delay: 1.1,
                  scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                }
          }
        />
      </motion.svg>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-background)] to-transparent" />
    </div>
  );
}
