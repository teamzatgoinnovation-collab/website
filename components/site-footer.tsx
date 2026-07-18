import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { footerNav, site } from "@/content/site";

export async function SiteFooter() {
  const tBrand = await getTranslations("brand");
  const tFooter = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tProducts = await getTranslations("products");

  const labelFor = (
    item:
      | { href: string; key: string }
      | { href: string; productSlug: string }
      | { href: string; key: string },
  ) => {
    if ("productSlug" in item) {
      return tProducts(`${item.productSlug}.name`);
    }
    if (
      item.key === "downloads" ||
      item.key === "pricing" ||
      item.key === "contact" ||
      item.key === "tutorials"
    ) {
      return tNav(item.key as "downloads" | "pricing" | "contact" | "tutorials");
    }
    return tFooter(item.key as Parameters<typeof tFooter>[0]);
  };

  return (
    <footer className="border-t border-m-line bg-[var(--m-ink)] text-[color-mix(in_oklch,var(--color-background)_94%,white)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-4 md:gap-10 md:py-20">
        <div className="md:col-span-1">
          <p className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
            <span
              aria-hidden
              className="inline-flex h-7 w-7 items-center justify-center rounded-[0.35rem] bg-[var(--m-accent)] text-[0.58rem] font-bold tracking-wide text-[var(--m-accent-foreground)]"
            >
              ZG
            </span>
            {tBrand("name")}
          </p>
          <p className="mt-3.5 max-w-[18rem] text-[0.9375rem] leading-relaxed opacity-65">
            {tBrand("tagline")}
          </p>
        </div>
        {(
          [
            ["products", footerNav.products],
            ["resources", footerNav.resources],
            ["company", footerNav.company],
          ] as const
        ).map(([titleKey, items]) => (
          <div key={titleKey}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] opacity-45">
              {tFooter(titleKey)}
            </p>
            <ul className="mt-4 space-y-2.5">
              {items.map((item) => (
                <li key={`${titleKey}-${item.href}-${"key" in item ? item.key : item.productSlug}`}>
                  <Link
                    href={item.href}
                    className="text-[0.9375rem] opacity-75 transition-opacity hover:opacity-100"
                  >
                    {labelFor(item)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs opacity-50 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.legalName}
          </span>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:opacity-100">
              {tFooter("privacy")}
            </Link>
            <Link href="/terms" className="hover:opacity-100">
              {tFooter("terms")}
            </Link>
            <span>{tBrand("footerNote")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
