import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function TabletFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full max-w-md rounded-[1.6rem] bg-zinc-800 p-2.5 shadow-[0_30px_60px_-20px_rgba(16,24,40,0.5)]",
        className,
      )}
    >
      <div className="h-full w-full overflow-hidden rounded-[1.1rem] bg-white">{children}</div>
    </div>
  );
}
