import { getSiteT } from "@/lib/site-content";
import {
  ArrowRight, BarChart3, Boxes, Calculator, Cloud, Download, Layers, LayoutDashboard, MoonStar, Package, Plug,
  ShieldCheck, ShoppingBag, SlidersHorizontal, Smartphone, Truck, Users, Warehouse, WifiOff, Workflow, type LucideIcon,
} from "lucide-react";

import { PhoneShowcase, type PhoneProduct } from "@/components/phone-showcase";
import { MotionReveal } from "@/components/motion-reveal";
import { Section, SectionHeading } from "@/components/section";
import { whyTiles } from "@/content/home-sections";
import { OppoPhoneFrame, MacBookFrame, ScreenshotSlot } from "@/components/devices";
import { Link } from "@/i18n/navigation";
import { getCatalog, layoutOf, screenshotsOf } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/catalog-types";
import { ProductMark } from "@/components/product-mark";

const icons: Record<string, LucideIcon> = {
  Boxes, Calculator, Warehouse, ShoppingBag, Truck, Users, BarChart3, Smartphone, Workflow,
  Layers, Download, Cloud, WifiOff, Plug, ShieldCheck, SlidersHorizontal, LayoutDashboard,
  MoonStar, Package,
};

export async function getFeatured(): Promise<CatalogProduct[]> {
  const all = await getCatalog();
  const featured = all.filter((p) => p.highlight);
  return featured.length ? featured : all.slice(0, 4);
}

function SectionBanner({ src }: { src?: string }) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" loading="lazy" decoding="async" className="mx-auto mb-6 h-auto w-full max-w-3xl rounded-3xl shadow-[0_24px_50px_-34px_rgba(41,82,227,0.5)]" />
  );
}

export async function WhyGrid() {
  const { t, images } = await getSiteT("home", "home2");
  return (
    <Section className="!py-10 md:!py-12">
      <MotionReveal>
        <SectionHeading eyebrow={t("whyEyebrow")} title={t("whyTitle")} />
      </MotionReveal>
      <SectionBanner src={images.whyBanner} />
      <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
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

/**
 * Product cards. A card shows device pictures only when screenshots were uploaded in
 * the admin; otherwise it is a clean card with the product mark, name and tagline.
 */
export async function ProductsGrid() {
  const { t } = await getSiteT("home", "home2");
  const featured = await getFeatured();
  return (
    <Section className="!py-10 md:!py-12">
      <div>
        <div>
          <MotionReveal className="mb-6 max-w-xl">
            <p className="m-eyebrow mb-3 inline-flex items-center gap-2"><span aria-hidden className="h-0.5 w-6 rounded bg-[var(--m-accent)]" />{t("productsEyebrow")}</p>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{t("productsTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-m-muted md:text-base">{t("productsDesc")}</p>
            <Link href="/products" className="m-btn m-btn-primary mt-5 inline-flex">{t("viewAllProducts")}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
          </MotionReveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                          <div className="w-[42%] translate-y-8 transition-transform duration-500 group-hover:translate-y-5"><OppoPhoneFrame><ScreenshotSlot src={mobile} alt={`${p.name} mobile`} /></OppoPhoneFrame></div>
                        ) : null}
                      </div>
                    )}
                  </Link>
                </MotionReveal>
              );
            })}
          </div>
        </div>

      </div>
    </Section>
  );
}

/** Only products with mobile screenshots uploaded in the admin appear here; with none, the whole section is omitted. */
export async function PhoneShowcaseSection() {
  const { t } = await getSiteT("home", "home2");
  const featured = await getFeatured();
  const products: PhoneProduct[] = featured
    .map((p) => ({ slug: p.slug, name: p.name, tagline: p.tagline, features: p.capabilities.slice(0, 5), mobile: screenshotsOf(p, "mobile"), accent: p.accent ?? "#2952E3" }))
    .filter((p) => p.mobile.length > 0);
  if (!products.length) return null;
  return (
    <Section className="!py-10 overflow-hidden md:!py-12">
      <MotionReveal>
        <SectionHeading eyebrow={t("phoneEyebrow")} title={t("phoneTitle")} description={t("phoneDesc")} />
      </MotionReveal>
      <MotionReveal delay={0.05}>
        <PhoneShowcase products={products} ariaLabel={t("phoneTitle")} />
      </MotionReveal>
    </Section>
  );
}

