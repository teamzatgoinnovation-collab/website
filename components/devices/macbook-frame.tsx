import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function MacBookFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative w-full max-w-3xl", className)}>
      <div className="rounded-t-[1.1rem] bg-zinc-800 p-[0.55rem] pb-0 shadow-[0_30px_60px_-24px_rgba(16,24,40,0.5)]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-[0.7rem] bg-white">
          {children}
          <span aria-hidden className="absolute start-1/2 top-0 z-10 h-2 w-16 -translate-x-1/2 rounded-b-md bg-zinc-800 rtl:translate-x-1/2" />
        </div>
      </div>
      <div aria-hidden className="mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-2xl bg-gradient-to-b from-zinc-300 to-zinc-400 rtl:translate-x-[2%]">
        <div className="mx-auto h-1 w-24 rounded-b-md bg-zinc-500/60" />
      </div>
    </div>
  );
}

/** Browser chrome for web apps. */
export function BrowserFrame({ children, url, className }: { children: ReactNode; url: string; className?: string }) {
  return (
    <div className={cn("w-full overflow-hidden rounded-xl border border-m-line bg-[var(--m-surface-elevated)] shadow-[var(--m-shadow-soft)]", className)}>
      <div className="flex items-center gap-2 border-b border-m-line bg-[var(--m-surface)] px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <i className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <i className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <span className="mx-auto max-w-[60%] truncate rounded-md bg-[var(--m-surface-elevated)] px-3 py-0.5 text-[0.7rem] text-m-muted" dir="ltr">{url}</span>
      </div>
      <div className="relative aspect-[16/10]">{children}</div>
    </div>
  );
}
