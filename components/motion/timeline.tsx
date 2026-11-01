"use client";

import { motion, useReducedMotion } from "framer-motion";

export type TimelineStep = { title: string; body: string };

/** Vertical timeline whose rail draws as it scrolls into view. */
export function Timeline({ steps }: { steps: TimelineStep[] }) {
  const reduce = useReducedMotion();
  return (
    <ol className="relative ms-3 border-s border-m-line">
      <motion.span
        aria-hidden
        className="absolute -start-px top-0 h-full w-px origin-top bg-[var(--m-accent)]"
        initial={reduce ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {steps.map((s, n) => (
        <motion.li
          key={s.title}
          className="relative ps-8 pb-10 last:pb-0"
          initial={reduce ? false : { opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: n * 0.1 }}
        >
          <span className="absolute -start-[0.9rem] top-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--m-accent)] text-xs font-semibold text-[var(--m-accent-foreground)]">
            {n + 1}
          </span>
          <h3 className="font-display text-lg font-semibold">{s.title}</h3>
          <p className="mt-1 text-sm text-m-muted">{s.body}</p>
        </motion.li>
      ))}
    </ol>
  );
}
