import type { ReactNode } from "react";

import { MotionReveal } from "@/components/motion-reveal";

type CompanyPageShellProps = {
  eyebrow: string;
  heading: string;
  description?: string;
  children: ReactNode;
};

export function CompanyPageShell({
  eyebrow,
  heading,
  description,
  children,
}: CompanyPageShellProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <MotionReveal>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--m-accent)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-[var(--m-ink)] md:text-5xl">
          {heading}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--m-muted)]">
            {description}
          </p>
        ) : null}
      </MotionReveal>
      <div className="mt-8">{children}</div>
    </div>
  );
}
