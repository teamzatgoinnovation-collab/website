"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import { ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Link, usePathname } from "@/i18n/navigation";
import { primaryNav, type NavEntry } from "@/content/site";

function NavDropdown({
  entry,
  active,
  label,
  itemLabel,
}: {
  entry: Extract<NavEntry, { type: "dropdown" }>;
  active: boolean;
  label: string;
  itemLabel: (key: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex items-center gap-1 rounded-md px-3 py-2 text-[0.8125rem] font-medium tracking-[-0.01em] transition-colors",
          active ? "text-[var(--m-ink)]" : "text-m-muted hover:text-[var(--m-ink)]",
        )}
      >
        {label}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
        />
        {active ? (
          <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[var(--m-accent)]" />
        ) : null}
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute start-0 top-full z-50 mt-1.5 min-w-[12rem] rounded-[var(--m-radius)] border border-m-line bg-[var(--m-surface-elevated)] p-1.5 shadow-[var(--m-shadow-soft)]"
        >
          {entry.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="block rounded-md px-3 py-2 text-[0.8125rem] font-medium text-m-muted transition-colors hover:bg-[var(--m-surface)] hover:text-[var(--m-ink)]"
            >
              {itemLabel(item.key)}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

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
            className="inline-flex h-8 w-8 items-center justify-center rounded-[0.4rem] bg-[var(--m-accent)] text-[0.68rem] font-bold tracking-wide text-[var(--m-accent-foreground)] transition-transform duration-300 group-hover:scale-105"
          >
            ZG
          </span>
          <span>{tBrand("name")}</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {primaryNav.map((entry) => {
            if (entry.type === "link") {
              const active = isActive(entry.href);
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-[0.8125rem] font-medium tracking-[-0.01em] transition-colors",
                    active
                      ? "text-[var(--m-ink)]"
                      : "text-m-muted hover:text-[var(--m-ink)]",
                  )}
                >
                  {t(entry.key as Parameters<typeof t>[0])}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[var(--m-accent)]" />
                  ) : null}
                </Link>
              );
            }
            const active = entry.items.some((item) => isActive(item.href));
            return (
              <NavDropdown
                key={entry.key}
                entry={entry}
                active={active}
                label={t(entry.key as Parameters<typeof t>[0])}
                itemLabel={(key) => t(key as Parameters<typeof t>[0])}
              />
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
            href="/contact"
            className="m-btn m-btn-primary !hidden sm:!inline-flex !px-4 !py-2"
          >
            {t("getStarted")}
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
            {primaryNav.map((entry) => {
              if (entry.type === "link") {
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-m-muted hover:text-[var(--m-ink)]"
                  >
                    {t(entry.key as Parameters<typeof t>[0])}
                  </Link>
                );
              }
              const isOpen = expandedMobile === entry.key;
              return (
                <div key={entry.key}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setExpandedMobile((cur) => (cur === entry.key ? null : entry.key))
                    }
                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-m-muted hover:text-[var(--m-ink)]"
                  >
                    {t(entry.key as Parameters<typeof t>[0])}
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                    />
                  </button>
                  {isOpen ? (
                    <div className="ms-3 flex flex-col gap-0.5 border-s border-m-line ps-3">
                      {entry.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-md px-3 py-2 text-sm text-m-muted hover:text-[var(--m-ink)]"
                        >
                          {t(item.key as Parameters<typeof t>[0])}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
            <Link
              href="/contact"
              className="mt-2 rounded-md px-3 py-2.5 text-sm font-semibold text-[var(--m-accent)]"
            >
              {t("getStarted")}
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
