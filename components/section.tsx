import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  surface?: boolean;
};

export function Section({ id, className, children, surface }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative px-6 py-20 md:py-28",
        surface && "bg-m-surface",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: SectionHeadingProps) {
  return (
    <div className="mb-12 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-8">
      <div className="max-w-2xl">
        {eyebrow ? (
          <>
            <div className="section-rule" />
            <p className="m-eyebrow mb-3">{eyebrow}</p>
          </>
        ) : null}
        <h2 className="font-display text-[1.75rem] font-semibold leading-[1.12] tracking-tight text-[var(--m-ink)] md:text-[2.35rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3.5 max-w-xl text-[1.05rem] leading-relaxed text-m-muted md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link href={action.href} className="m-link shrink-0 text-sm">
          {action.label} →
        </Link>
      ) : null}
    </div>
  );
}
