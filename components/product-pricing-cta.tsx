import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeading } from "@/components/section";
import { Link } from "@/i18n/navigation";
import { contactHref } from "@/lib/contact-href";

export async function ProductPricingCta({ productName }: { productName: string }) {
  const t = await getTranslations("productDetail");
  const ctaHref = contactHref({ type: "sales", interest: productName }) as "/contact";

  return (
    <MotionReveal className="mt-16 border-t border-m-line pt-16">
      <SectionHeading eyebrow={t("pricingEyebrow")} title={t("pricingTitle")} />
      <div className="m-tile max-w-md p-7">
        <p className="font-display text-3xl font-semibold tracking-tight">
          {t("pricingCustomLabel")}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-m-muted">
          {t("pricingCustomBody")}
        </p>
        <Link href={ctaHref} className="m-btn m-btn-primary mt-6 w-full">
          {t("pricingCta")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </MotionReveal>
  );
}
