"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Download, Menu, Moon, Rocket, Sun, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { MegaPanel, useMegaColumns } from "@/components/mega-menu";
import { SiteSearch } from "@/components/site-search";
import { Button } from "@/components/ui/button";
import { primaryNav, spaceUrl, type NavDropdownEntry, type NavMegaEntry } from "@/content/site";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { BookDemoLink } from "@/components/demo-dialog";

/** Hover + click + Escape + outside-click behaviour shared by dropdowns and mega panels. */
function useMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
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
  return { open, setOpen, rootRef, openNow, closeSoon };
}

function TriggerButton({
  label,
  open,
  active,
  onClick,
}: {
  label: string;
  open: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1 rounded-md px-2.5 py-2 text-[0.8125rem] font-medium tracking-[-0.01em] transition-colors",
        active || open ? "text-[var(--m-ink)]" : "text-m-muted hover:text-[var(--m-ink)]",
      )}
    >
      {label}
      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      {active ? <span className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-[var(--m-accent)]" /> : null}
    </button>
  );
}

function NavDropdown({
  entry,
  active,
  label,
  itemLabel,
}: {
  entry: NavDropdownEntry;
  active: boolean;
  label: string;
  itemLabel: (key: string) => string;
}) {
  const { open, setOpen, rootRef, openNow, closeSoon } = useMenu();
  return (
    <div ref={rootRef} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <TriggerButton label={label} open={open} active={active} onClick={() => setOpen((v) => !v)} />
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
              onClick={() => setOpen(false)}
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

function NavMega({ entry, active, label, allLabel }: { entry: NavMegaEntry; active: boolean; label: string; allLabel: string }) {
  const { open, setOpen, rootRef, openNow, closeSoon } = useMenu();
  const reduce = useReducedMotion();
  return (
    <div ref={rootRef} onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <TriggerButton label={label} open={open} active={active} onClick={() => setOpen((v) => !v)} />
      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute inset-x-0 top-full z-50 border-b border-m-line bg-[var(--color-background)] shadow-[var(--m-shadow-soft)]"
          >
            <MegaPanel entry={entry} allLabel={allLabel} onNavigate={() => setOpen(false)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MobileMega({ entry, label, expanded, onToggle }: { entry: NavMegaEntry; label: string; expanded: boolean; onToggle: () => void }) {
  const columns = useMegaColumns(entry.panel);
  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-m-muted hover:text-[var(--m-ink)]"
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded ? (
        <div className="ms-3 flex flex-col gap-0.5 border-s border-m-line ps-3">
          <Link href={entry.href as "/products"} className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--m-accent)]">
            {label}
          </Link>
          {columns.flatMap((c) => c.items).map((it) => (
            <Link key={it.href} href={it.href as "/products"} className="rounded-md px-3 py-2 text-sm text-m-muted hover:text-[var(--m-ink)]">
              {it.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const allLabelKey = {
  products: "allProductsLink",
  industries: "allIndustriesLink",
  integrations: "allIntegrationsLink",
} as const;

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

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const label = (key: string) => t(key as Parameters<typeof t>[0]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300",
        scrolled
          ? "border-b border-m-line bg-[color-mix(in_oklch,var(--color-background)_88%,transparent)] shadow-[0_1px_0_color-mix(in_oklch,var(--m-ink)_4%,transparent)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[3.75rem] max-w-7xl items-center justify-between gap-3 px-5">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 font-display text-[1.15rem] font-semibold tracking-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/branding/zg-mark.svg" alt="" width={44} height={24} className="h-6 w-auto transition-transform duration-300 group-hover:scale-105" />
          <span>{tBrand("name")}</span>
        </Link>

        <nav aria-label={t("menuLabel")} className="hidden items-center xl:flex">
          {primaryNav.map((entry) => {
            if (entry.type === "link") {
              const active = isActive(entry.href);
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={cn(
                    "relative rounded-md px-2.5 py-2 text-[0.8125rem] font-medium tracking-[-0.01em] transition-colors",
                    active ? "text-[var(--m-ink)]" : "text-m-muted hover:text-[var(--m-ink)]",
                  )}
                >
                  {label(entry.key)}
                  {active ? <span className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-[var(--m-accent)]" /> : null}
                </Link>
              );
            }
            if (entry.type === "mega") {
              return (
                <NavMega
                  key={entry.key}
                  entry={entry}
                  active={isActive(entry.href)}
                  label={label(entry.key)}
                  allLabel={label(allLabelKey[entry.panel])}
                />
              );
            }
            return (
              <NavDropdown
                key={entry.key}
                entry={entry}
                active={entry.items.some((item) => isActive(item.href))}
                label={label(entry.key)}
                itemLabel={label}
              />
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <SiteSearch />
          {mounted ? (
            <Button variant="ghost" aria-label="Toggle theme" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          ) : (
            <span className="inline-flex h-9 w-9" />
          )}
          <Link href="/downloads" className="m-btn m-btn-ghost !hidden min-[1800px]:!inline-flex !px-3.5 !py-2">
            <Download className="h-4 w-4" />
            {t("downloadSoftware")}
          </Link>
          <a href={`${spaceUrl}/signup`} rel="noopener" className="m-btn m-btn-ghost !hidden whitespace-nowrap min-[1700px]:!inline-flex !px-3.5 !py-2">
            <Rocket className="h-4 w-4" aria-hidden />
            {t("createSite")}
          </a>
          <BookDemoLink className="m-btn m-btn-primary !hidden sm:!inline-flex !px-4 !py-2">
            {t("bookDemo")}
          </BookDemoLink>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--m-ink)] xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="max-h-[calc(100svh-3.75rem)] overflow-y-auto border-t border-m-line bg-[var(--color-background)] px-5 py-5 xl:hidden">
          <nav aria-label={t("menuLabel")} className="flex flex-col gap-1">
            {primaryNav.map((entry) => {
              if (entry.type === "link") {
                return (
                  <Link key={entry.href} href={entry.href} className="rounded-md px-3 py-2.5 text-sm font-medium text-m-muted hover:text-[var(--m-ink)]">
                    {label(entry.key)}
                  </Link>
                );
              }
              const expanded = expandedMobile === entry.key;
              const toggle = () => setExpandedMobile((cur) => (cur === entry.key ? null : entry.key));
              if (entry.type === "mega") {
                return <MobileMega key={entry.key} entry={entry} label={label(entry.key)} expanded={expanded} onToggle={toggle} />;
              }
              return (
                <div key={entry.key}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={toggle}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-m-muted hover:text-[var(--m-ink)]"
                  >
                    {label(entry.key)}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
                  </button>
                  {expanded ? (
                    <div className="ms-3 flex flex-col gap-0.5 border-s border-m-line ps-3">
                      {entry.items.map((item) => (
                        <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm text-m-muted hover:text-[var(--m-ink)]">
                          {label(item.key)}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
            <div className="mt-3 flex flex-wrap gap-2 px-3">
              <a href={`${spaceUrl}/signup`} rel="noopener" className="m-btn m-btn-primary !px-4 !py-2">
                <Rocket className="h-4 w-4" aria-hidden />
                {t("createSite")}
              </a>
              <BookDemoLink className="m-btn m-btn-ghost !px-4 !py-2">
                {t("bookDemo")}
              </BookDemoLink>
              <Link href="/downloads" className="m-btn m-btn-ghost !px-4 !py-2">
                <Download className="h-4 w-4" />
                {t("downloadSoftware")}
              </Link>
            </div>
            <div className="mt-3 px-3">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
