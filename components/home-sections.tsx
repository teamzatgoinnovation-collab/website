import { getTranslations } from "next-intl/server";
import {
  ArrowRight, BarChart3, Boxes, Calculator, Cloud, Download, Layers, LayoutDashboard, Plug,
  ShieldCheck, ShoppingBag, SlidersHorizontal, Smartphone, Truck, Users, Warehouse, WifiOff,
  Workflow, type LucideIcon,
} from "lucide-react";

import { AppShowcase, type ShowcaseProduct } from "@/components/app-showcase";
import { CountUp } from "@/components/motion/count-up";
import { MotionReveal } from "@/components/motion-reveal";
import { Section, SectionHeading } from "@/components/section";
import {
  featuredSlugs, industryTiles, solutionTiles, whyTiles, type Accent,
} from "@/content/home-sections";
import { integrationPages } from "@/content/integration-pages";
import { Link } from "@/i18n/navigation";
import { products as productCatalog } from "@/content/products";
import { serviceSlugs } from "@/content/services";
import { industryPages } from "@/content/industry-pages";
import { locales } from "@/i18n/routing";
import { getLocalizedProducts } from "@/lib/localized-products";
import { getProductMedia } from "@/lib/product-media";

const icons: Record<string, LucideIcon> = {
  Boxes, Calculator, Warehouse, ShoppingBag, Truck, Users, BarChart3, Smartphone, Workflow,
  Layers, Download, Cloud, WifiOff, Plug, ShieldCheck, SlidersHorizontal, LayoutDashboard,
};

const accentClass: Record<Accent, string> = {
  primary: "text-[var(--m-accent)] bg-[color-mix(in_oklch,var(--m-accent)_12%,transparent)]",
  cyan: "text-[var(--m-cyan)] bg-[color-mix(in_oklch,var(--m-cyan)_14%,transparent)]",
  teal: "text-[var(--m-teal)] bg-[color-mix(in_oklch,var(--m-teal)_14%,transparent)]",
  purple: "text-[var(--m-purple)] bg-[color-mix(in_oklch,var(--m-purple)_14%,transparent)]",
};
const accents: Accent[] = ["primary", "cyan", "teal", "purple"];

export async function getFeatured() {
  const all = await getLocalizedProducts();
  return featuredSlugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ ...p, media: getProductMedia(p.slug) }));
}

export async function FeaturedProducts() {
  const t = await getTranslations("home2");
  const tCommon = await getTranslations("common");
  const featured = await getFeatured();
  return (
    <Section>
      <MotionReveal>
        <SectionHeading
          eyebrow={t("featuredEyebrow")}
          title={t("featuredTitle")}
          description={t("featuredDesc")}
          action={{ href: "/products", label: tCommon.has("viewAll") ? tCommon("viewAll") : "All products" }}
        />
      </MotionReveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((p, i) => (
          <MotionReveal key={p.slug} delay={i * 0.06}>
            <Link
              href={`/products/${p.slug}` as "/products"}
              className="group flex h-full flex-col rounded-2xl border border-m-line bg-[var(--m-surface-elevated)] p-6 shadow-[var(--m-shadow-soft)] transition-transform hover:-translate-y-1"
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl font-display text-sm font-bold ${accentClass[accents[i % 4]]}`}>
                {p.name.slice(0, 2)}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">{p.name}</h3>
              <p className="mt-1 text-sm font-medium text-[var(--m-accent)]">{p.tagline}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-m-muted">{p.description}</p>
              <ul className="mt-4 space-y-1 text-sm text-m-muted">
                {p.capabilities.slice(0, 3).map((c) => (
                  <li key={c} className="flex gap-2"><span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--m-teal)]" />{c}</li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="rounded-full border border-m-line px-2.5 py-0.5 uppercase tracking-wider text-m-muted">
                  {p.status === "coming-soon" ? t("comingSoon") : p.channels.join(" · ")}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold group-hover:text-[var(--m-accent)]">
                  {t("learnMore")}<ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </span>
              </div>
            </Link>
          </MotionReveal>
        ))}
      </div>
    </Section>
  );
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
  const products: ShowcaseProduct[] = featured.map((p) => ({
    slug: p.slug, name: p.name, tagline: p.tagline, desktop: p.media.desktop, mobile: p.media.mobile,
  }));
  return (
    <Section surface>
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

/** Counts come straight from the catalog data, so they cannot drift from what the site actually lists. */
export async function FactsStrip() {
  const t = await getTranslations("home2");
  const facts = [
    { n: productCatalog.length, label: t("factProducts") },
    { n: industryPages.length, label: t("factIndustries") },
    { n: serviceSlugs.length, label: t("factServices") },
    { n: locales.length, label: t("factLanguages") },
  ];
  return (
    <section aria-label={t("factsLabel")} className="px-6 py-14">
      <dl className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center md:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="order-2 mt-1 text-sm text-m-muted">{f.label}</dt>
            <dd className="font-display text-4xl font-semibold tracking-tight text-[var(--m-accent)]"><CountUp to={f.n} /></dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
