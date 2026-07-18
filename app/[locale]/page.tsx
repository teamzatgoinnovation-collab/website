import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, BookOpen, Download, GraduationCap, Newspaper } from "lucide-react";

import { HeroBackdrop } from "@/components/hero-backdrop";
import { HeroMotion, MotionReveal } from "@/components/motion-reveal";
import { ProductCard } from "@/components/product-card";
import { Section, SectionHeading } from "@/components/section";
import { caseStudies } from "@/content/case-studies";
import { Link } from "@/i18n/navigation";
import { contactHref } from "@/lib/contact-href";
import { getLocalizedChangelog } from "@/lib/localized-content";
import { getLocalizedHighlightedProducts } from "@/lib/localized-products";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tBrand = await getTranslations("brand");
  const tCases = await getTranslations("caseStudies");
  const tCasesPage = await getTranslations("caseStudiesPage");
  const featured = await getLocalizedHighlightedProducts();
  const latest = (await getLocalizedChangelog()).slice(0, 2);
  const featuredCase = caseStudies[0];

  return (
    <>
      <section className="relative min-h-[min(100svh,48rem)] overflow-hidden hero-plane">
        <HeroBackdrop />
        <div className="relative mx-auto flex min-h-[min(100svh,48rem)] max-w-6xl flex-col justify-center px-6 pb-24 pt-20 md:pb-28">
          <HeroMotion>
            <p className="font-display text-[clamp(2.85rem,10vw,5.75rem)] font-semibold leading-[0.94] tracking-tight text-[var(--m-ink)]">
              {tBrand("name")}
            </p>
          </HeroMotion>
          <HeroMotion delay={0.1}>
            <h1 className="mt-6 max-w-[24ch] font-display text-[clamp(1.4rem,2.8vw,2rem)] font-medium leading-snug tracking-tight text-[var(--m-ink)]">
              {tBrand("tagline")}
            </h1>
          </HeroMotion>
          <HeroMotion delay={0.16}>
            <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-m-muted md:text-lg">
              {t("supporting")}
            </p>
          </HeroMotion>
          <HeroMotion delay={0.24} className="mt-10 flex flex-wrap gap-3">
            <Link href="/products" className="m-btn m-btn-primary">
              {t("exploreProducts")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link href={contactHref({ type: "demo" }) as "/contact"} className="m-btn m-btn-ghost">
              {t("requestDemo")}
            </Link>
          </HeroMotion>
        </div>
      </section>

      <Section>
        <MotionReveal>
          <SectionHeading
            eyebrow={t("productsEyebrow")}
            title={t("productsTitle")}
            description={t("productsDesc")}
            action={{ href: "/products", label: t("allProducts") }}
          />
        </MotionReveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <MotionReveal key={product.slug} delay={i * 0.05}>
              <ProductCard product={product} className="h-full" />
            </MotionReveal>
          ))}
        </div>
      </Section>

      <Section surface>
        <MotionReveal>
          <SectionHeading
            eyebrow={t("storyEyebrow")}
            title={t("storyTitle")}
            description={t("storyDesc")}
          />
        </MotionReveal>
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {[
            { title: t("storyFieldTitle"), body: t("storyFieldBody"), num: "01" },
            { title: t("storyDeskTitle"), body: t("storyDeskBody"), num: "02" },
            { title: t("storyPortalTitle"), body: t("storyPortalBody"), num: "03" },
          ].map((step, i) => (
            <MotionReveal key={step.num} delay={i * 0.07}>
              <div className="border-t border-m-line pt-6">
                <p className="font-display text-sm font-semibold text-[var(--m-accent)]">
                  {step.num}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-m-muted md:text-base">
                  {step.body}
                </p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </Section>

      <Section>
        <MotionReveal>
          <SectionHeading
            eyebrow={t("channelsEyebrow")}
            title={t("channelsTitle")}
            description={t("channelsDesc")}
          />
        </MotionReveal>
        <div className="grid gap-x-12 gap-y-14 md:grid-cols-3">
          {[
            {
              title: t("channelMobileTitle"),
              body: t("channelMobileBody"),
              href: "/downloads" as const,
              num: "01",
              image: "/images/channels/mobile.svg",
            },
            {
              title: t("channelDesktopTitle"),
              body: t("channelDesktopBody"),
              href: "/downloads" as const,
              num: "02",
              image: "/images/channels/desktop.svg",
            },
            {
              title: t("channelWebTitle"),
              body: t("channelWebBody"),
              href: "/products" as const,
              num: "03",
              image: "/images/channels/web.svg",
            },
          ].map((item, i) => (
            <MotionReveal key={item.num} delay={i * 0.07}>
              <div>
                <div className="mb-5 aspect-[16/10] overflow-hidden border border-m-line bg-[color-mix(in_oklch,var(--m-accent-soft)_40%,var(--m-surface))]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="border-t border-m-line pt-6">
                  <p className="font-display text-sm font-semibold text-[var(--m-accent)]">
                    {item.num}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-m-muted">{item.body}</p>
                  <Link href={item.href} className="m-link mt-5 inline-flex items-center gap-1 text-sm">
                    {t("viewChannel")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>
      </Section>

      {featuredCase ? (
        <Section surface>
          <MotionReveal>
            <SectionHeading
              eyebrow={t("casesEyebrow")}
              title={t("casesTitle")}
              action={{ href: "/case-studies", label: t("casesViewAll") }}
            />
          </MotionReveal>
          <MotionReveal>
            <div className="grid gap-8 border-t border-m-line pt-10 md:grid-cols-[1fr_1.4fr] md:gap-14">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--m-accent)]">
                  {tCases(`${featuredCase.id}.industry`)}
                </p>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  {tCases(`${featuredCase.id}.title`)}
                </h3>
              </div>
              <div>
                <p className="text-base leading-relaxed text-m-muted md:text-lg">
                  {tCases(`${featuredCase.id}.summary`)}
                </p>
                <Link
                  href={`/case-studies/${featuredCase.slug}`}
                  className="m-link mt-6 inline-flex items-center gap-1 text-sm"
                >
                  {tCasesPage("readStudy")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </MotionReveal>
        </Section>
      ) : null}

      <Section>
        <MotionReveal>
          <SectionHeading
            eyebrow={t("resourcesEyebrow")}
            title={t("resourcesTitle")}
            description={t("resourcesDesc")}
          />
        </MotionReveal>
        <div className="grid gap-0 border-y border-m-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/downloads" as const,
              title: t("resourceDownloads"),
              desc: t("resourceDownloadsDesc"),
              icon: Download,
            },
            {
              href: "/docs" as const,
              title: t("resourceDocs"),
              desc: t("resourceDocsDesc"),
              icon: BookOpen,
            },
            {
              href: "/tutorials" as const,
              title: t("resourceTutorials"),
              desc: t("resourceTutorialsDesc"),
              icon: GraduationCap,
            },
            {
              href: "/updates" as const,
              title: t("resourceUpdates"),
              desc: t("resourceUpdatesDesc"),
              icon: Newspaper,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <MotionReveal key={item.href} delay={i * 0.05}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col border-m-line px-5 py-7 transition-colors hover:bg-[var(--m-surface)] sm:border-e last:border-e-0 lg:border-e"
                >
                  <Icon className="h-[1.1rem] w-[1.1rem] text-[var(--m-accent)]" />
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-m-muted">{item.desc}</p>
                  <span className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--m-ink)] transition-colors group-hover:text-[var(--m-accent)]">
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </span>
                </Link>
              </MotionReveal>
            );
          })}
        </div>
      </Section>

      <Section surface>
        <MotionReveal>
          <SectionHeading
            eyebrow={t("updatesEyebrow")}
            title={t("updatesTitle")}
            action={{ href: "/updates", label: t("fullChangelog") }}
          />
        </MotionReveal>
        <div className="space-y-0">
          {latest.map((entry, i) => (
            <MotionReveal key={entry.id} delay={i * 0.05}>
              <article className="grid gap-3 border-t border-m-line py-8 md:grid-cols-[8rem_1fr] md:gap-10">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-m-muted">
                  {entry.date}
                  <span className="mt-1 block font-medium normal-case tracking-normal text-[var(--m-accent)]">
                    v{entry.version}
                  </span>
                </p>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                    {entry.title}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-m-muted md:text-base">
                    {entry.summary}
                  </p>
                </div>
              </article>
            </MotionReveal>
          ))}
        </div>
      </Section>

      <Section className="!py-28 md:!py-36">
        <MotionReveal className="relative overflow-hidden rounded-[var(--m-radius)] bg-[var(--m-ink)] px-8 py-16 text-center text-[var(--color-background)] md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -end-10 -top-10 h-56 w-56 rounded-full bg-[var(--m-accent)] opacity-30 blur-3xl"
          />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-sm leading-relaxed opacity-75 md:text-base">
            {t("ctaBody")}
          </p>
          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={contactHref({ type: "demo" }) as "/contact"}
              className="m-btn !bg-[var(--m-accent)] !text-[var(--m-accent-foreground)]"
            >
              {t("ctaButton")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link
              href="/products"
              className="m-btn border border-white/25 bg-transparent text-[var(--color-background)] hover:bg-white/10"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </MotionReveal>
      </Section>
    </>
  );
}
