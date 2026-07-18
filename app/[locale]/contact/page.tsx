import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "@/components/contact-form";
import { MotionReveal } from "@/components/motion-reveal";
import { Section, SectionHeading } from "@/components/section";
import { company, getSocialLinks } from "@/content/company";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return buildPageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");
  const social = getSocialLinks();
  const hasPhone = Boolean(company.phone);
  const hasWhatsapp = Boolean(company.whatsapp);
  const hasAddress = Boolean(company.address);

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("heading")}
            description={t("description")}
          />
          <ul className="mt-2 space-y-2 text-sm text-m-muted">
            <li>· {t("bullet1")}</li>
            <li>· {t("bullet2")}</li>
            <li>· {t("bullet3")}</li>
          </ul>

          <MotionReveal className="mt-10 space-y-3 text-sm">
            <p>
              <span className="text-m-muted">{t("emailLabel")}: </span>
              <a
                href={`mailto:${company.email}`}
                className="m-link font-medium"
              >
                {company.email}
              </a>
            </p>
            {hasPhone ? (
              <p>
                <span className="text-m-muted">{t("phoneLabel")}: </span>
                <a href={`tel:${company.phone}`} className="m-link font-medium">
                  {company.phone}
                </a>
              </p>
            ) : null}
            {hasWhatsapp ? (
              <p>
                <span className="text-m-muted">{t("whatsappLabel")}: </span>
                <a
                  href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m-link font-medium"
                >
                  {company.whatsapp}
                </a>
              </p>
            ) : null}
            {hasAddress ? (
              <p>
                <span className="text-m-muted">{t("addressLabel")}: </span>
                <span className="font-medium text-[var(--m-ink)]">
                  {company.address}
                </span>
              </p>
            ) : (
              <p className="text-m-muted">{t("addressFallback")}</p>
            )}
            <p>
              <Link href="/downloads" className="m-link">
                {t("downloadsLink")}
              </Link>
              {" · "}
              <Link href="/docs" className="m-link">
                {t("supportLink")}
              </Link>
            </p>
          </MotionReveal>

          {social.length > 0 ? (
            <MotionReveal className="mt-8">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-m-muted">
                {t("socialTitle")}
              </p>
              <ul className="mt-3 flex flex-wrap gap-4 text-sm">
                {social.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="m-link"
                    >
                      {t(`social.${item.id}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          ) : (
            <p className="mt-8 text-xs text-m-muted">{t("socialFallback")}</p>
          )}
        </div>
        <Suspense
          fallback={
            <div className="min-h-[24rem] animate-pulse rounded-[var(--m-radius)] bg-[var(--m-surface)]" />
          }
        >
          <ContactForm mailTo={company.email} />
        </Suspense>
      </div>
    </Section>
  );
}
