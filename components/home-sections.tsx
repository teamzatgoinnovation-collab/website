import { getTranslations } from "next-intl/server";
import {
  ArrowRight, BarChart3, Boxes, Calculator, Calendar, Cloud, CreditCard, Download, HardDrive, Languages,
  Layers, LayoutDashboard, Mail, MapPin, MessageCircle, MoonStar, Package, Plug, Plus, ShieldCheck, ShoppingBag,
  SlidersHorizontal, Smartphone, Truck, Users, Warehouse, WifiOff, Workflow, Briefcase, type LucideIcon,
} from "lucide-react";

import { AppShowcase, type ShowcaseProduct } from "@/components/app-showcase";
import { IphoneShowcase, type PhoneProduct } from "@/components/iphone-showcase";
import { CountUp } from "@/components/motion/count-up";
import { MotionReveal } from "@/components/motion-reveal";
import { Section, SectionHeading } from "@/components/section";
import {
  industryTiles, solutionTiles, whyTiles, type Accent,
} from "@/content/home-sections";
import { integrationPages } from "@/content/integration-pages";
import { AppleIPhoneFrame, MacBookFrame, ScreenshotSlot } from "@/components/devices";
import { Link } from "@/i18n/navigation";
import { serviceSlugs } from "@/content/services";
import { industryPages } from "@/content/industry-pages";
import { locales } from "@/i18n/routing";
import { getCatalog, layoutOf, screenshotsOf } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/catalog-types";
import { ProductMark } from "@/components/product-mark";

const icons: Record<string, LucideIcon> = {
  Boxes, Calculator, Warehouse, ShoppingBag, Truck, Users, BarChart3, Smartphone, Workflow,
  Layers, Download, Cloud, WifiOff, Plug, ShieldCheck, SlidersHorizontal, LayoutDashboard,
  MoonStar, Package,
};

const accentClass: Record<Accent, string> = {
  primary: "text-[var(--m-accent)] bg-[color-mix(in_oklch,var(--m-accent)_12%,transparent)]",
  cyan: "text-[var(--m-cyan)] bg-[color-mix(in_oklch,var(--m-cyan)_14%,transparent)]",
  teal: "text-[var(--m-teal)] bg-[color-mix(in_oklch,var(--m-teal)_14%,transparent)]",
  purple: "text-[var(--m-purple)] bg-[color-mix(in_oklch,var(--m-purple)_14%,transparent)]",
};

export async function getFeatured(): Promise<CatalogProduct[]> {
  const all = await getCatalog();
  const featured = all.filter((p) => p.highlight);
  return featured.length ? featured : all.slice(0, 4);
}

export async function SolutionsGrid() {
  const t = await getTranslations("home2");
  return (
    <Section surface>
      <MotionReveal>
        <SectionHeading eyebrow={t("solutionsEyebrow")} title={t("solutionsTitle")} description={t("solutionsDesc")} />
      </MotionReveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {solutionTiles.map((s, i) => {
          const Icon = icons[s.icon] ?? Boxes;
          return (
            <MotionReveal key={s.title} delay={(i % 3) * 0.05}>
              <div className="flex h-full gap-4 rounded-2xl border border-m-line bg-[var(--m-surface-elevated)] p-5">
                <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClass[s.accent]}`}><Icon className="h-5 w-5" aria-hidden /></span>
                <div>
                  <h3 className="font-display text-base font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-m-muted">{s.body}</p>
                </div>
              </div>
            </MotionReveal>
          );
        })}
      </div>
    </Section>
  );
}

export async function IndustriesGrid() {
  const t = await getTranslations("home2");
  return (
    <Section>
      <MotionReveal>
        <SectionHeading eyebrow={t("industriesEyebrow")} title={t("industriesTitle")} action={{ href: "/industries", label: t("learnMore") }} />
      </MotionReveal>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {industryTiles.map((s, i) => (
          <MotionReveal key={s.slug} delay={(i % 5) * 0.04}>
            <Link href={`/industries/${s.slug}` as "/industries"} className="group relative block h-full overflow-hidden rounded-2xl border border-m-line bg-[var(--m-surface-elevated)] p-4 transition-colors hover:border-[var(--m-accent)]">
              <span aria-hidden className={`absolute inset-x-0 top-0 h-1 ${["bg-[var(--m-accent)]","bg-[var(--m-cyan)]","bg-[var(--m-teal)]","bg-[var(--m-purple)]"][i % 4]}`} />
              <h3 className="mt-2 font-display text-sm font-semibold">{s.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-m-muted">{s.body}</p>
            </Link>
          </MotionReveal>
        ))}
      </div>
    </Section>
  );
}

export async function ShowcaseSection() {
  const t = await getTranslations("home2");
  const featured = await getFeatured();
  const products: ShowcaseProduct[] = featured
    .map((p) => ({ slug: p.slug, name: p.name, tagline: p.tagline, desktop: screenshotsOf(p, "desktop"), mobile: screenshotsOf(p, "mobile") }))
    .filter((p) => p.desktop.length || p.mobile.length);
  if (!products.length) return null; // nothing uploaded in the admin yet: no section, no placeholder
  return (
    <Section surface id="showcase">
      <MotionReveal>
        <SectionHeading eyebrow={t("showcaseEyebrow")} title={t("showcaseTitle")} description={t("showcaseDesc")} />
      </MotionReveal>
      <AppShowcase
        products={products}
        labels={{
          desktop: t("labelDesktop"), mobile: t("labelMobile"), fullscreen: t("labelFullscreen"),
          close: t("labelClose"), prev: t("labelPrev"), next: t("labelNext"),
        }}
      />
    </Section>
  );
}

export async function WhyGrid() {
  const t = await getTranslations("home2");
  return (
    <Section>
      <MotionReveal>
        <SectionHeading eyebrow={t("whyEyebrow")} title={t("whyTitle")} />
      </MotionReveal>
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {whyTiles.map((w, i) => {
          const Icon = icons[w.icon] ?? Layers;
          return (
            <MotionReveal key={w.title} delay={(i % 3) * 0.05}>
              <div className="border-t border-m-line pt-5">
                <Icon className="h-5 w-5 text-[var(--m-accent)]" aria-hidden />
                <h3 className="mt-3 font-display text-base font-semibold">{w.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-m-muted">{w.body}</p>
              </div>
            </MotionReveal>
          );
        })}
      </div>
    </Section>
  );
}

export async function IntegrationsSection() {
  const t = await getTranslations("home2");
  const ti = await getTranslations("integrationsPage");
  return (
    <Section surface>
      <MotionReveal>
        <SectionHeading eyebrow={t("integrationsEyebrow")} title={t("integrationsTitle")} description={t("integrationsDesc")} action={{ href: "/integrations", label: t("learnMore") }} />
      </MotionReveal>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {integrationPages.map((g) => (
          <li key={g.slug}>
            <Link href={`/integrations/${g.slug}` as "/integrations"} className="block h-full rounded-2xl border border-dashed border-m-line bg-[var(--m-surface-elevated)] p-4 transition-colors hover:border-[var(--m-accent)]">
              <p className="font-display text-sm font-semibold">{ti(`items.${g.slug}.name`)}</p>
              <p className="mt-0.5 text-xs text-m-muted">{ti(`items.${g.slug}.category`)}</p>
              <span className="mt-3 inline-block rounded-full bg-[color-mix(in_oklch,var(--m-purple)_14%,transparent)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--m-purple)]">
                {g.status === "planned" ? t("planned") : t("live")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** The product names with their marks (logo from the admin, or initials on the brand colour). */
export async function ProductFamilyStrip() {
  const t = await getTranslations("home2");
  const featured = await getFeatured();
  if (!featured.length) return null;
  return (
    <div className="relative z-20 mx-auto -mt-10 max-w-6xl px-5">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-3xl border border-white/70 bg-white/90 px-5 py-5 shadow-[0_24px_60px_-28px_rgba(41,82,227,0.45)] backdrop-blur dark:border-white/10 dark:bg-[var(--m-surface-elevated)]/90">
        <p className="max-w-[9rem] text-xs font-semibold leading-snug text-m-muted">{t("familyLabel")}</p>
        <ul className="flex flex-1 flex-wrap items-center justify-around gap-x-8 gap-y-3">
          {featured.map((p) => (
            <li key={p.slug}>
              <Link href={`/products/${p.slug}` as "/products"} className="flex items-center gap-2.5 font-display text-base font-semibold text-[var(--m-ink)] transition-opacity hover:opacity-80">
                <ProductMark name={p.name} accent={p.accent} logoUrl={p.logoUrl} className="h-9 w-9 text-xs" />
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const connectTiles: { Icon: LucideIcon; tone: string }[] = [
  { Icon: Mail, tone: "text-rose-500" },
  { Icon: MessageCircle, tone: "text-emerald-500" },
  { Icon: MapPin, tone: "text-blue-500" },
  { Icon: HardDrive, tone: "text-amber-500" },
  { Icon: Calendar, tone: "text-sky-500" },
  { Icon: CreditCard, tone: "text-indigo-500" },
];

/**
 * Product cards beside the planned-integrations panel. A card shows device pictures only when screenshots were uploaded in
 * the admin; otherwise it is a clean card with the product mark, name and tagline.
 */
export async function ProductsAndConnections() {
  const t = await getTranslations("home2");
  const featured = await getFeatured();
  return (
    <Section className="!pb-10 !pt-12 md:!pt-14">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <MotionReveal className="mb-6 max-w-xl">
            <p className="m-eyebrow mb-3 inline-flex items-center gap-2"><span aria-hidden className="h-0.5 w-6 rounded bg-[var(--m-accent)]" />{t("productsEyebrow")}</p>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{t("productsTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-m-muted md:text-base">{t("productsDesc")}</p>
            <Link href="/products" className="m-btn m-btn-primary mt-5 inline-flex">{t("viewAllProducts")}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
          </MotionReveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {featured.map((p, i) => {
              const layout = layoutOf(p);
              const accent = p.accent ?? "#2952E3";
              const desktop = screenshotsOf(p, "desktop")[0];
              const mobile = screenshotsOf(p, "mobile")[0];
              return (
                <MotionReveal key={p.slug} delay={i * 0.06}>
                  <Link
                    href={`/products/${p.slug}` as "/products"}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/70 p-5 shadow-[0_18px_40px_-26px_rgba(16,24,40,0.45)] transition-transform hover:-translate-y-1 dark:border-white/10 ${layout === "none" ? "min-h-[13rem]" : "min-h-[22rem]"}`}
                    style={{ background: `linear-gradient(180deg, color-mix(in oklch, ${accent} 16%, white), color-mix(in oklch, ${accent} 4%, white))` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <ProductMark name={p.name} accent={p.accent} logoUrl={p.logoUrl} className="h-10 w-10 shrink-0 text-sm" />
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-lg font-bold leading-tight text-[#101828]">{p.name}</h3>
                        <p className="truncate text-xs text-[#475467]">{p.tagline}</p>
                      </div>
                    </div>
                    {p.status === "coming-soon" ? <span className="mt-3 w-fit rounded-full bg-white/80 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-[#475467]">{t("comingSoon")}</span> : null}
                    {layout === "none" ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#475467]">{p.summary}</p>
                    ) : (
                      <div className="relative mt-auto flex h-48 items-end justify-center pt-4">
                        {layout === "laptop" && desktop ? (
                          <div className="w-[92%] translate-y-3 transition-transform duration-500 group-hover:-translate-y-0.5"><MacBookFrame><ScreenshotSlot src={desktop} alt={`${p.name} desktop`} /></MacBookFrame></div>
                        ) : mobile ? (
                          <div className="w-[42%] translate-y-8 transition-transform duration-500 group-hover:translate-y-5"><AppleIPhoneFrame><ScreenshotSlot src={mobile} alt={`${p.name} mobile`} /></AppleIPhoneFrame></div>
                        ) : null}
                      </div>
                    )}
                  </Link>
                </MotionReveal>
              );
            })}
          </div>
        </div>

        <MotionReveal delay={0.1}>
          <aside className="flex h-full flex-col rounded-3xl border border-[#D8E4FF] bg-gradient-to-b from-[#EAF1FF] to-[#F7FAFF] p-5 dark:border-white/10 dark:from-[#16213a] dark:to-[#101828]">
            <h3 className="font-display text-xl font-bold tracking-tight">{t("connectTitle")}</h3>
            <p className="mt-1 text-sm text-m-muted">{t("connectDesc")}</p>
            <ul className="mt-5 grid grid-cols-4 gap-3 xl:grid-cols-3">
              {connectTiles.map(({ Icon, tone }, i) => (
                <li key={i} className="flex aspect-square items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_-14px_rgba(41,82,227,0.55)] dark:bg-white/10"><Icon className={`h-7 w-7 ${tone}`} aria-hidden /></li>
              ))}
              <li className="flex aspect-square flex-col items-center justify-center rounded-2xl text-xs font-semibold text-[var(--m-accent)]"><Plus className="h-5 w-5" aria-hidden />More</li>
            </ul>
            <p className="mt-4 text-xs text-m-muted">{t("connectNote")}</p>
            <Link href="/integrations" className="m-link mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold">{t("learnMoreArrow")}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
          </aside>
        </MotionReveal>
      </div>
    </Section>
  );
}

/** Gradient band: only counts that come straight from the data (published products, industries, services, languages). */
export async function StatsBand() {
  const t = await getTranslations("home2");
  const products = await getCatalog();
  const facts: { n: number; label: string; Icon: LucideIcon }[] = [
    ...(products.length ? [{ n: products.length, label: t("factProducts"), Icon: Package }] : []),
    { n: industryPages.length, label: t("factIndustries"), Icon: Briefcase },
    { n: serviceSlugs.length, label: t("factServices"), Icon: Workflow },
    { n: locales.length, label: t("factLanguages"), Icon: Languages },
  ];
  return (
    <section aria-label={t("factsLabel")} className="mt-6 overflow-hidden bg-gradient-to-r from-[#2952E3] via-[#16B8E8] to-[#08B69A] text-white md:rounded-t-[2.25rem]">
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-5 py-7 lg:grid-cols-[1fr_auto_1fr]">
        <dl className="grid grid-cols-2 items-start gap-6 sm:grid-cols-4 lg:col-span-1 lg:grid-cols-4">
          {facts.map(({ n, label, Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="h-7 w-7 shrink-0 opacity-90" aria-hidden />
              <div>
                <dd className="font-display text-3xl font-bold leading-none"><CountUp to={n} /></dd>
                <dt className="mt-1 text-xs text-white/85">{label}</dt>
              </div>
            </div>
          ))}
        </dl>
        <span aria-hidden className="hidden h-12 w-px bg-white/30 lg:block" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-bold">{t("bandTitle")}</p>
            <p className="text-sm text-white/85">{t("bandBody")}</p>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#1B3FBF] shadow-lg transition-transform hover:-translate-y-0.5">{t("contactUs")}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
        </div>
      </div>
    </section>
  );
}

/** Only products with mobile screenshots uploaded in the admin appear here; with none, the whole section is omitted. */
export async function IphoneShowcaseSection() {
  const t = await getTranslations("home2");
  const featured = await getFeatured();
  const products: PhoneProduct[] = featured
    .map((p) => ({ slug: p.slug, name: p.name, tagline: p.tagline, features: p.capabilities.slice(0, 5), mobile: screenshotsOf(p, "mobile"), accent: p.accent ?? "#2952E3" }))
    .filter((p) => p.mobile.length > 0);
  if (!products.length) return null;
  return (
    <Section className="overflow-hidden">
      <MotionReveal>
        <SectionHeading eyebrow={t("phoneEyebrow")} title={t("phoneTitle")} description={t("phoneDesc")} />
      </MotionReveal>
      <MotionReveal delay={0.05}>
        <IphoneShowcase products={products} ariaLabel={t("phoneTitle")} />
      </MotionReveal>
    </Section>
  );
}

