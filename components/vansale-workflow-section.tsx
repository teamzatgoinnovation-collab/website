import {
  CloudOff,
  CreditCard,
  Database,
  MapPin,
  Users,
  Warehouse,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeading } from "@/components/section";

const workflowItems = [
  { key: "offline", icon: CloudOff },
  { key: "vanStock", icon: Warehouse },
  { key: "customers", icon: Users },
  { key: "collections", icon: CreditCard },
  { key: "routes", icon: MapPin },
  { key: "erpnext", icon: Database },
] as const;

export async function VanSaleWorkflowSection() {
  const t = await getTranslations("vanSaleWorkflow");

  return (
    <MotionReveal className="mt-10 border-t border-m-line pt-16">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("description")}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {workflowItems.map(({ key, icon: Icon }) => (
          <div key={key} className="m-tile p-5">
            <Icon className="h-5 w-5 text-[var(--m-accent)]" />
            <p className="mt-4 font-display text-base font-semibold tracking-tight text-[var(--m-ink)]">
              {t(`items.${key}.title`)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-m-muted">
              {t(`items.${key}.body`)}
            </p>
          </div>
        ))}
      </div>
    </MotionReveal>
  );
}
