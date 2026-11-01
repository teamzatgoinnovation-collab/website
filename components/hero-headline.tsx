"use client";

import { motion, useReducedMotion } from "framer-motion";

export type HeadlineWord = { text: string; gradient?: boolean };

/** Word-by-word reveal for the hero H1. The accessible name is the full sentence; the animated words are decorative. */
export function HeroHeadline({ words, className }: { words: HeadlineWord[]; className?: string }) {
  const reduce = useReducedMotion();
  const label = words.map((w) => w.text).join(" ");
  return (
    <h1 aria-label={label} className={className}>
      {words.map((w, i) => (
        <motion.span
          key={`${w.text}-${i}`}
          aria-hidden
          className={`inline-block ${w.gradient ? "grad-text" : ""}`}
          initial={reduce ? false : { opacity: 0, y: 22, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.08 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {w.text}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </h1>
  );
}
