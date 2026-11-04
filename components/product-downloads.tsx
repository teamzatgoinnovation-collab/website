import { Download, Monitor, Smartphone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { MotionReveal } from "@/components/motion-reveal";
import type { ProductDownload } from "@/lib/catalog-types";

const LABEL: Record<ProductDownload["platform"], string> = { ANDROID: "Android", WINDOWS: "Windows", MACOS: "macOS", LINUX: "Linux" };

const size = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

/** App files uploaded in the admin. Rendered only when the product has at least one enabled download. */
export async function ProductDownloads({ downloads, productName }: { downloads: ProductDownload[]; productName: string }) {
  const t = await getTranslations("productDetail");
  if (downloads.length === 0) return null;
  return (
    <MotionReveal className="mt-10 border-t border-m-line pt-8">
      <h2 className="font-display text-xl font-semibold tracking-tight">{t("downloadsTitle")}</h2>
      <p className="mt-2 text-sm text-m-muted">{t("downloadsNote")}</p>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {downloads.map((d) => {
          const Icon = d.platform === "ANDROID" ? Smartphone : Monitor;
          return (
            <li key={d.id} className="m-tile flex flex-col p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--m-radius)] bg-[var(--m-accent-soft)] text-[var(--m-accent)]"><Icon className="h-5 w-5" aria-hidden /></span>
              <p className="mt-4 font-display text-base font-semibold tracking-tight text-[var(--m-ink)]">{productName} · {LABEL[d.platform]}</p>
              <p className="mt-1 text-sm text-m-muted">{t("downloadVersion", { version: d.version })} · {size(d.sizeBytes)}</p>
              {d.sha256 ? <p className="mt-2 break-all font-mono text-[0.65rem] text-m-muted" title={d.sha256}>SHA-256: {d.sha256.slice(0, 16)}…</p> : null}
              <a href={d.url} download={d.fileName} rel="nofollow" className="m-btn m-btn-primary mt-5 justify-center">
                <Download className="h-4 w-4" aria-hidden />{t("downloadAction", { platform: LABEL[d.platform] })}
              </a>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-m-muted">{t("downloadsDisclaimer")}</p>
    </MotionReveal>
  );
}
