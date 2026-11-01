import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BookDemoLink } from "@/components/demo-dialog";
import { Section } from "@/components/section";
import { Link } from "@/i18n/navigation";

/** Colourful closing call-to-action for inner pages. Opens the demo popup; no invented claims. */
export async function CtaBand() {
  const t = await getTranslations("ctaBand");
  return (
    <Section className="!pt-4">
      <div className="cta-band px-6 py-9 md:flex md:items-center md:justify-between md:gap-8 md:px-10">
        <div aria-hidden className="pointer-events-none absolute -end-10 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <div className="relative max-w-xl">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{t("title")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/85 md:text-base">{t("body")}</p>
        </div>
        <div className="relative mt-6 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
          <BookDemoLink className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#2952e3] shadow-lg transition-transform hover:-translate-y-0.5">
            {t("primary")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </BookDemoLink>
          <Link href="/contact" className="inline-flex items-center rounded-full border border-white/50 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
            {t("secondary")}
          </Link>
        </div>
      </div>
    </Section>
  );
}
