import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Apple-style phone: rounded titanium bezel, Dynamic Island, 19.5:9 screen. */
export function AppleIPhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19.5] w-full max-w-[17rem] rounded-[2.6rem] bg-gradient-to-b from-zinc-300 to-zinc-500 p-[3px] shadow-[0_30px_60px_-20px_rgba(16,24,40,0.55)]",
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.45rem] bg-black p-[7px]">
        <div className="relative h-full w-full overflow-hidden rounded-[2.05rem] bg-white">
          {children}
          <span
            aria-hidden
            className="absolute start-1/2 top-2.5 z-10 h-[1.35rem] w-[28%] -translate-x-1/2 rounded-full bg-black rtl:translate-x-1/2"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
