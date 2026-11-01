import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Headset, Mail, MessageCircle, Phone, MapPin, Calendar } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { MotionReveal } from "@/components/motion-reveal";
import { Section } from "@/components/section";
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
    <>
    <PageHero eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} tone="blue" icon={Mail} icons={[Mail, MessageCircle, Phone, Calendar, MapPin, Headset]} />
    <Section>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <ul className="space-y-2 text-sm text-m-muted">
            <li>· {t("bullet1")}</li>
            <li>· {t("bullet2")}</li>
            <li>· {t("bullet3")}</li>
          </ul>

          <MotionReveal className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
            <div className="tone-card tone-blue flex items-start gap-3 p-4 sm:col-span-2">
              <span aria-hidden className="tone-rule" />
              <span className="tone-chip h-10 w-10 shrink-0"><Mail className="h-5 w-5" /></span>
              <p className="min-w-0"><span className="block text-xs text-m-muted">{t("emailLabel")}</span><a href={`mailto:${company.email}`} className="m-link break-words font-medium">{company.email}</a></p>
            </div>
            {hasPhone ? (
              <div className="tone-card tone-teal flex items-start gap-3 p-4">
                <span aria-hidden className="tone-rule" />
                <span className="tone-chip h-10 w-10 shrink-0"><Phone className="h-5 w-5" /></span>
                <p className="min-w-0"><span className="block text-xs text-m-muted">{t("phoneLabel")}</span><a href={`tel:${company.phone}`} className="m-link font-medium">{company.phone}</a></p>
              </div>
            ) : null}
            {hasWhatsapp ? (
              <div className="tone-card tone-teal flex items-start gap-3 p-4">
                <span aria-hidden className="tone-rule" />
                <span className="tone-chip h-10 w-10 shrink-0"><MessageCircle className="h-5 w-5" /></span>
                <p className="min-w-0"><span className="block text-xs text-m-muted">{t("whatsappLabel")}</span><a href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="m-link font-medium">{company.whatsapp}</a></p>
              </div>
            ) : null}
            <div className="tone-card tone-amber flex items-start gap-3 p-4">
              <span aria-hidden className="tone-rule" />
              <span className="tone-chip h-10 w-10 shrink-0"><MapPin className="h-5 w-5" /></span>
              <p className="min-w-0"><span className="block text-xs text-m-muted">{t("addressLabel")}</span>{hasAddress ? <span className="font-medium text-[var(--m-ink)]">{company.address}</span> : <span className="text-m-muted">{t("addressFallback")}</span>}</p>
            </div>
            <div className="tone-card tone-violet flex items-start gap-3 p-4 sm:col-span-2">
              <span aria-hidden className="tone-rule" />
              <span className="tone-chip h-10 w-10 shrink-0"><Headset className="h-5 w-5" /></span>
              <p className="min-w-0 pt-2.5">
                <Link href="/downloads" className="m-link">{t("downloadsLink")}</Link>
                {" · "}
                <Link href="/docs" className="m-link">{t("supportLink")}</Link>
              </p>
            </div>
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
          ) : null}
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
    </>
  );
}
