import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { HeroMotion } from "@/components/motion-reveal";
import { cn } from "@/lib/cn";
import { toneAt, type Tone } from "@/lib/tone";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Colour of the band; the icon tiles on the right cycle through the other brand tones. */
  tone?: Tone;
  /** Up to six decorative icons for the right-hand cluster (hidden on small screens). */
  icons?: LucideIcon[];
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
};

/** Page header for every inner page: tinted band, h1, and a colourful icon cluster that uses the otherwise empty right half. */
export function PageHero({ eyebrow, title, description, tone = "blue", icons = [], icon: Icon, children, className }: PageHeroProps) {
  const tiles = icons.slice(0, 6);
  const start = ["blue", "violet", "teal", "amber", "cyan", "rose"].indexOf(tone);
  return (
    <header className={cn("page-hero", `tone-${tone}`, className)}>
      <div className={cn("relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 md:py-14", tiles.length ? "lg:grid-cols-[1.1fr_0.9fr]" : "")}>
        <HeroMotion>
          {eyebrow ? (
            <p className="tone-chip mb-4 inline-flex !rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">
              {Icon ? <Icon className="me-2 h-4 w-4" aria-hidden /> : null}
              {eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-[var(--m-ink)] md:text-5xl">{title}</h1>
          {description ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-m-muted md:text-lg">{description}</p> : null}
          {children ? <div className="mt-6 flex flex-wrap gap-3">{children}</div> : null}
        </HeroMotion>
        {tiles.length ? (
          <div aria-hidden className="hidden grid-cols-3 gap-4 lg:grid">
            {tiles.map((TileIcon, i) => (
              <div key={i} className={cn("page-hero-tile", `tone-${toneAt(start + i)}`, i % 3 === 1 && "translate-y-5")} style={{ animationDelay: `${i * 0.5}s` }}>
                <span><TileIcon className="h-1/2 w-1/2" strokeWidth={1.75} /></span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
