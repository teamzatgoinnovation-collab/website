import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function AndroidPhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19] w-full max-w-[16rem] rounded-[1.9rem] bg-zinc-800 p-[6px] shadow-[0_30px_60px_-20px_rgba(16,24,40,0.55)]",
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-white">
        {children}
        <span
          aria-hidden
          className="absolute start-1/2 top-2 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-black rtl:translate-x-1/2"
        />
      </div>
    </div>
  );
}
