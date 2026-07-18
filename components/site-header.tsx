"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Link, usePathname } from "@/i18n/navigation";
import { primaryNav } from "@/content/site";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300",
        scrolled
          ? "border-b border-m-line bg-[color-mix(in_oklch,var(--color-background)_88%,transparent)] shadow-[0_1px_0_color-mix(in_oklch,var(--m-ink)_4%,transparent)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.35rem] max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-display text-[1.15rem] font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-[0.4rem] bg-[var(--m-ink)] text-[0.68rem] font-bold tracking-wide text-[var(--color-background)] transition-transform duration-300 group-hover:scale-105"
          >
            ZG
          </span>
          <span>{tBrand("name")}</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {primaryNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-[0.8125rem] font-medium tracking-[-0.01em] transition-colors",
                  active
                    ? "text-[var(--m-ink)]"
                    : "text-m-muted hover:text-[var(--m-ink)]",
                )}
              >
                {t(item.key)}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[var(--m-accent)]" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          {mounted ? (
            <Button
              variant="ghost"
              aria-label="Toggle theme"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <span className="inline-flex h-9 w-9" />
          )}
          <Link
            href="/downloads"
            className="m-btn m-btn-primary hidden sm:inline-flex !px-4 !py-2"
          >
            {t("downloads")}
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--m-ink)] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-m-line bg-[var(--color-background)] px-6 py-5 lg:hidden">
          <nav className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-m-muted hover:text-[var(--m-ink)]"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 rounded-md px-3 py-2.5 text-sm font-semibold text-[var(--m-accent)]"
            >
              {t("contact")}
            </Link>
            <div className="mt-3 px-3">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
