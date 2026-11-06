import { setRequestLocale } from "next-intl/server";
import { getSiteT } from "@/lib/site-content";
import { ArrowRight, CheckCircle2, Download, Rocket } from "lucide-react";

import { HeroMotion, MotionReveal } from "@/components/motion-reveal";
import { SpaceStepsSlideshow } from "@/components/space-steps-slideshow";
import { HeroHeadline } from "@/components/hero-headline";
import { Skyline } from "@/components/illustrations/skyline";
import { PhoneShowcaseSection, ProductsGrid, WhyGrid } from "@/components/home-sections";
import { Section } from "@/components/section";
import { spaceUrl } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { buildSteps } from "@/lib/space-steps";
import { BookDemoLink } from "@/components/demo-dialog";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { t, images } = await getSiteT("home", "home");
  const { t: t2 } = await getSiteT("home", "home2");
  const steps = buildSteps(t2, images);

  return (
    <>
      <section className="hero-aurora relative overflow-hidden">
        {images.heroBackground ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images.heroBackground} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
        ) : (
          <Skyline className="pointer-events-none absolute bottom-0 start-0 h-[46%] w-[68%] opacity-70" />
        )}
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-5 pb-14 pt-10 md:pt-14 lg:grid-cols-[1fr_1.05fr] lg:pb-16">
          <div className="relative z-10">
            <HeroMotion>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EDE9FF] px-4 py-1.5 text-sm font-semibold text-[#4B33C8] dark:bg-white/10 dark:text-[#C9BEFF]">
                <Rocket className="h-4 w-4" aria-hidden />{t2("spaceBadge")}
              </span>
              <HeroHeadline
                className="mt-5 font-display text-[clamp(2.6rem,6.2vw,4.7rem)] font-extrabold leading-[1.02] tracking-tight text-[var(--m-ink)]"
                words={[{ text: t2("spaceWord1") }, { text: t2("spaceWord2") }, { text: t2("spaceWord3"), gradient: true }]}
              />
            </HeroMotion>
            <HeroMotion delay={0.12}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[color-mix(in_oklch,var(--m-ink)_78%,transparent)] md:text-lg">{t2("spaceBody")}</p>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-semibold">
                {[t2("spaceCheck1"), t2("spaceCheck2"), t2("spaceCheck3")].map((c) => (
                  <li key={c} className="inline-flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[var(--m-teal)]" aria-hidden />{c}</li>
                ))}
              </ul>
            </HeroMotion>
            <HeroMotion delay={0.22} className="mt-9 flex flex-wrap gap-3">
              <a href={`${spaceUrl}/signup`} rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-[var(--m-accent)] px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(41,82,227,0.8)] transition-transform hover:-translate-y-0.5"><Rocket className="h-4 w-4" aria-hidden />{t2("spaceCta")}<ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden /></a>
              <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--m-ink)] shadow-[0_10px_26px_-14px_rgba(16,24,40,0.5)] ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 dark:bg-white/10 dark:text-white dark:ring-white/10"><Download className="h-4 w-4 text-[var(--m-accent)]" aria-hidden />{t2("spaceCtaSecondary")}</Link>
            </HeroMotion>
          </div>
          <HeroMotion delay={0.18}>
            <SpaceStepsSlideshow
              steps={steps}
              labels={{ prev: t2("slidePrev"), next: t2("slideNext"), slide: t2("spaceSlideLabel"), step: t2("spaceStepWord"), note: t2("spaceNote"), host: new URL(spaceUrl).host }}
            />
          </HeroMotion>
        </div>
      </section>

      <ProductsGrid />
      <PhoneShowcaseSection />
      <WhyGrid />

      <Section className="!py-12 md:!py-14">
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
