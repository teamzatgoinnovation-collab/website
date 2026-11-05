import { setRequestLocale } from "next-intl/server";
import { getSiteT } from "@/lib/site-content";
import { ArrowRight, BookOpen, CheckCircle2, Download, Globe, GraduationCap, Monitor, Newspaper, PlayCircle, Rocket, Smartphone } from "lucide-react";

import { EcosystemDiagram } from "@/components/ecosystem-diagram";
import { HeroMotion, MotionReveal } from "@/components/motion-reveal";
import { HeroCarousel } from "@/components/hero-carousel";
import { HeroHeadline } from "@/components/hero-headline";
import { Skyline } from "@/components/illustrations/skyline";
import { PhoneShowcaseSection, IndustriesGrid, ProductFamilyStrip, ProductsAndConnections, StatsBand, IntegrationsSection, ShowcaseSection, SolutionsGrid, WhyGrid, getFeatured } from "@/components/home-sections";
import { Section, SectionHeading } from "@/components/section";
import { Link } from "@/i18n/navigation";
import { screenshotsOf } from "@/lib/catalog";
import { getLocalizedChangelog } from "@/lib/localized-content";
import { BookDemoLink } from "@/components/demo-dialog";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { t, images } = await getSiteT("home", "home");
  const { t: t2 } = await getSiteT("home", "home2");
  const featured = await getFeatured();
  const latest = (await getLocalizedChangelog()).slice(0, 2);

  return (
    <>
      <section className="hero-aurora relative overflow-hidden">
        {images.heroBackground ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images.heroBackground} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
        ) : (
          <Skyline className="pointer-events-none absolute bottom-0 start-0 h-[46%] w-[68%] opacity-70" />
        )}
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-5 pb-28 pt-10 md:pt-14 lg:grid-cols-[1fr_1.05fr] lg:pb-32">
          <div className="relative z-10">
            <HeroMotion>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EDE9FF] px-4 py-1.5 text-sm font-semibold text-[#4B33C8] dark:bg-white/10 dark:text-[#C9BEFF]">
                <Rocket className="h-4 w-4" aria-hidden />{t2("heroBadge")}
              </span>
              <HeroHeadline
                className="mt-5 font-display text-[clamp(2.6rem,6.2vw,4.7rem)] font-extrabold leading-[1.02] tracking-tight text-[var(--m-ink)]"
                words={[{ text: t2("heroWord1") }, { text: t2("heroWord2") }, { text: t2("heroWord3"), gradient: true }]}
              />
            </HeroMotion>
            <HeroMotion delay={0.12}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[color-mix(in_oklch,var(--m-ink)_78%,transparent)] md:text-lg">{t2("heroBody")}</p>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-semibold">
                {[t2("heroCheck1"), t2("heroCheck2"), t2("heroCheck3")].map((c) => (
                  <li key={c} className="inline-flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[var(--m-teal)]" aria-hidden />{c}</li>
                ))}
              </ul>
            </HeroMotion>
            <HeroMotion delay={0.22} className="mt-9 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-[var(--m-accent)] px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(41,82,227,0.8)] transition-transform hover:-translate-y-0.5"><Download className="h-4 w-4" aria-hidden />{t2("ctaExplore")}<ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden /></Link>
              <a href="#showcase" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--m-ink)] shadow-[0_10px_26px_-14px_rgba(16,24,40,0.5)] ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 dark:bg-white/10 dark:text-white dark:ring-white/10"><PlayCircle className="h-5 w-5 text-[var(--m-accent)]" aria-hidden />{t2("ctaSeeApps")}</a>
            </HeroMotion>
          </div>
          <HeroMotion delay={0.18}>
            <HeroCarousel
              slides={featured.map((p) => ({ slug: p.slug, name: p.name, tagline: p.tagline, desktop: screenshotsOf(p, "desktop")[0], mobile: screenshotsOf(p, "mobile"), accent: p.accent, logoUrl: p.logoUrl }))}
              learnMore={t2("learnMore")}
              slideLabel={t2("slideLabel")}
              prevLabel={t2("slidePrev")}
              nextLabel={t2("slideNext")}
            />
          </HeroMotion>
        </div>
      </section>

      <ProductFamilyStrip />
      <ProductsAndConnections />
      <StatsBand />
      <PhoneShowcaseSection />
      <SolutionsGrid />
      <IndustriesGrid />
      <ShowcaseSection />
      <WhyGrid />
      <IntegrationsSection />

      <Section surface>
        <MotionReveal>
          <SectionHeading eyebrow={t("ecosystemEyebrow")} title={t("ecosystemTitle")} description={t("ecosystemDesc")} />
        </MotionReveal>
        <MotionReveal delay={0.05}>
          <EcosystemDiagram labels={Object.fromEntries(["Erp","Finance","Field","Crm","Inventory","Ops"].flatMap((k) => [[`${k}Title`, t(`ecosystem${k}Title`)], [`${k}Body`, t(`ecosystem${k}Body`)]]))} />
        </MotionReveal>
      </Section>

      <Section surface>
        <MotionReveal>
          <SectionHeading
            eyebrow={t("storyEyebrow")}
            title={t("storyTitle")}
            description={t("storyDesc")}
          />
        </MotionReveal>
        <div className="grid gap-7 md:grid-cols-3 md:gap-8">
          {[
            { title: t("storyFieldTitle"), body: t("storyFieldBody"), num: "01", image: images.storyFieldImage },
            { title: t("storyDeskTitle"), body: t("storyDeskBody"), num: "02", image: images.storyDeskImage },
            { title: t("storyPortalTitle"), body: t("storyPortalBody"), num: "03", image: images.storyPortalImage },
          ].map((step, i) => (
            <MotionReveal key={step.num} delay={i * 0.07}>
              <div className="border-t border-m-line pt-6">
                {step.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={step.image} alt="" loading="lazy" decoding="async" className="mb-5 aspect-[16/9] w-full rounded-2xl object-cover" />
                ) : null}
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
              Icon: Smartphone,
              image: images.channelMobileImage,
            },
            {
              title: t("channelDesktopTitle"),
              body: t("channelDesktopBody"),
              href: "/downloads" as const,
              num: "02",
              Icon: Monitor,
              image: images.channelDesktopImage,
            },
            {
              title: t("channelWebTitle"),
              body: t("channelWebBody"),
              href: "/products" as const,
              num: "03",
              Icon: Globe,
              image: images.channelWebImage,
            },
          ].map((item, i) => (
            <MotionReveal key={item.num} delay={i * 0.07}>
              <div>
                <div className="mb-5 flex aspect-[16/8] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#2952E3]/15 via-[#16B8E8]/15 to-[#08B69A]/15">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  ) : (
                    <span className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-[var(--m-accent)] shadow-[0_18px_40px_-18px_rgba(41,82,227,0.6)] dark:bg-white/10"><item.Icon className="h-9 w-9" aria-hidden /></span>
                  )}
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
              <article className="grid gap-3 border-t border-m-line py-8 md:grid-cols-[8rem_1fr] md:gap-7">
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

      <Section className="!py-14 md:!py-16">
        <MotionReveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#2952E3] via-[#16B8E8] to-[#08B69A] px-6 py-10 text-center text-white md:px-10 md:py-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -end-10 -top-10 h-56 w-56 rounded-full bg-white opacity-25 blur-3xl"
          />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-sm leading-relaxed opacity-75 md:text-base">
            {t("ctaBody")}
          </p>
          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
            <BookDemoLink className="m-btn !bg-white !text-[#1B3FBF] shadow-lg">
              {t("ctaButton")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </BookDemoLink>
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
