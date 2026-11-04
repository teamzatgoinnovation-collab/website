"use client";

import { useTranslations } from "next-intl";

import { company } from "@/content/company";
import { waLink } from "@/lib/whatsapp";

/** Floating click-to-chat button. A plain wa.me link: nothing is loaded from WhatsApp and nothing is sent until the visitor opens the chat. */
export function WhatsAppButton() {
  const t = useTranslations("whatsapp");
  const base = waLink(company.whatsapp, t("message"));
  if (!base) return null;

  return (
    <a
      href={base}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
      onClick={(e) => {
        // Tell the owner which page the visitor was on.
        const page = `${document.title} - ${window.location.href}`;
        e.currentTarget.href = waLink(company.whatsapp, `${t("message")}\n${page}`) ?? base;
      }}
      className="wa-fab group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] end-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-10px_rgba(18,140,70,0.75)] outline-offset-4 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#128C7E] print:hidden md:bottom-6 md:end-6"
    >
      <span aria-hidden className="wa-fab-ring absolute inset-0 rounded-full bg-[#25D366]" />
      <svg viewBox="0 0 32 32" className="relative h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M16.04 3C9.4 3 4 8.4 4 15.03c0 2.12.55 4.19 1.6 6.02L4 29l8.1-1.57a12.03 12.03 0 0 0 3.94.66h.01C22.68 28.09 28.08 22.7 28.08 16.07 28.08 9.4 22.68 3 16.04 3Zm0 22.03h-.01a10 10 0 0 1-5.1-1.4l-.37-.22-4.8.93.98-4.68-.24-.38a9.96 9.96 0 0 1-1.53-5.3c0-5.5 4.49-9.98 10.02-9.98 5.52 0 10.01 4.49 10.01 10 0 5.52-4.49 10.03-10.01 10.03h.05Zm5.5-7.5c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.23 5.12 4.53.72.3 1.28.5 1.7.63.72.23 1.37.2 1.88.12.58-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
      </svg>
      <span className="pointer-events-none absolute end-full me-3 hidden whitespace-nowrap rounded-full bg-[var(--m-ink)] px-3 py-1.5 text-xs font-semibold text-[var(--color-background)] opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
        {t("label")}
      </span>
    </a>
  );
}
