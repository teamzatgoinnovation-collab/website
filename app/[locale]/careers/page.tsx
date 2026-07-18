import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";

import { CompanyPageShell } from "@/components/company-page-shell";
import { MotionReveal } from "@/components/motion-reveal";
import { careerRoles } from "@/content/company";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careersPage" });
  return buildPageMetadata({
    locale,
    path: "/careers",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careersPage");

  return (
    <CompanyPageShell
      eyebrow={t("eyebrow")}
      heading={t("heading")}
      description={t("description")}
    >
      <h2 className="font-display text-xl font-bold text-[var(--m-ink)]">
        {t("openRoles")}
      </h2>
      {careerRoles.length === 0 ? (
        <p className="mt-4 text-[var(--m-muted)]">{t("empty")}</p>
      ) : (
        <ul className="mt-6 divide-y divide-[var(--m-line)] border-y border-[var(--m-line)]">
          {careerRoles.map((role, i) => (
            <li key={role.id}>
              <MotionReveal delay={i * 0.05}>
                <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[var(--m-ink)]">
                      {t(`roles.${role.id}.title`)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--m-muted)]">
                      {t(`roles.${role.id}.summary`)}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-wider text-[var(--m-muted)]">
                      {role.location} · {role.type}
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="shrink-0 text-sm font-semibold text-[var(--m-accent)] hover:underline"
                  >
                    {t("applyCta")}
                  </Link>
                </div>
              </MotionReveal>
            </li>
          ))}
        </ul>
      )}
    </CompanyPageShell>
  );
}
