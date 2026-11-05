"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { PHONE_RATIO_DEFAULT, phoneRatio } from "@/lib/device-ratio";
import { PhoneScreenContext } from "./phone-screen-context";

/**
 * Oppo-style phone: slim even bezels, flat rounded corners, centred punch-hole camera and thin side keys.
 * No brand name or logo is drawn. The screen takes the shape of its screenshot (within phone-like limits),
 * so nothing is cropped; pass `ratio` (width / height) when it is known up front to avoid a layout shift.
 */
export function OppoPhoneFrame({ children, className, ratio }: { children: ReactNode; className?: string; ratio?: number }) {
  const [measured, setMeasured] = useState<number | null>(null);
  const screenRatio = measured ?? ratio ?? PHONE_RATIO_DEFAULT;
  const report = useCallback((r: number) => {
    const next = phoneRatio(r, 1);
    setMeasured((cur) => (cur !== null && Math.abs(cur - next) < 0.002 ? cur : next));
  }, []);
  const ctx = useMemo(() => ({ screenRatio, report }), [screenRatio, report]);

  return (
    <div
      className={cn(
        "relative w-full max-w-[16rem] rounded-[2.2rem] bg-gradient-to-b from-zinc-600 to-zinc-800 p-[3px] shadow-[0_30px_60px_-20px_rgba(16,24,40,0.55)]",
        className,
      )}
    >
      {/* side keys: power on the right, volume on the left (mirrored in RTL) */}
      <span aria-hidden className="absolute -end-[2px] top-[22%] h-[9%] w-[3px] rounded-e-sm bg-zinc-600" />
      <span aria-hidden className="absolute -start-[2px] top-[17%] h-[6%] w-[3px] rounded-s-sm bg-zinc-600" />
      <span aria-hidden className="absolute -start-[2px] top-[25%] h-[6%] w-[3px] rounded-s-sm bg-zinc-600" />
      <div className="relative rounded-[2.05rem] bg-black p-[6px]">
        <div className="relative w-full overflow-hidden rounded-[1.7rem] bg-black" style={{ aspectRatio: String(screenRatio) }}>
          <PhoneScreenContext.Provider value={ctx}>{children}</PhoneScreenContext.Provider>
          <span aria-hidden className="absolute start-1/2 top-1.5 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-black ring-1 ring-zinc-800 rtl:translate-x-1/2" />
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}
