"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNavProducts } from "@/components/catalog-context";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { contactHref } from "@/lib/contact-href";

type OpenOptions = { interest?: string; productSlug?: string };
const Ctx = createContext<{ open: (o?: OpenOptions) => void }>({ open: () => {} });
export const useDemo = () => useContext(Ctx);

/** Opens the popup. Still a normal link to the contact form, so it works without JavaScript and in a new tab. */
export function BookDemoLink({ children, className, interest, productSlug }: { children: ReactNode; className?: string; interest?: string; productSlug?: string }) {
  const { open } = useDemo();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    open({ interest, productSlug });
  };
  return (
    <Link href={contactHref({ type: "demo", interest }) as "/contact"} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<OpenOptions | null>(null);
  const open = useCallback((o?: OpenOptions) => setOpts(o ?? {}), []);
  const value = useMemo(() => ({ open }), [open]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <DemoDialog opts={opts} onClose={() => setOpts(null)} />
    </Ctx.Provider>
  );
}

type Result = { email: string; confirmationEmail: boolean };

function DemoDialog({ opts, onClose }: { opts: OpenOptions | null; onClose: () => void }) {
  const t = useTranslations("demo");
  const locale = useLocale();
  const products = useNavProducts();
  const ref = useRef<HTMLDialogElement>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const schema = useMemo(
    () => z.object({
      name: z.string().trim().min(2, t("errors.name")).max(120),
      email: z.string().trim().email(t("errors.email")).max(200),
      company: z.string().trim().min(2, t("errors.company")).max(160),
      productSlug: z.string().optional(),
      preferredDate: z.string().optional(),
      message: z.string().max(2000).optional(),
      website: z.string().optional(), // honeypot
    }),
    [t],
  );
  type Values = z.infer<typeof schema>;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { productSlug: "", website: "" } });

  const isOpen = opts !== null;
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isOpen && !d.open) {
      const match = opts?.productSlug ?? products.find((p) => p.name === opts?.interest)?.slug ?? "";
      reset({ productSlug: match, website: "" });
      setResult(null);
      setError(null);
      d.showModal();
      document.body.style.overflow = "hidden";
    }
    if (!isOpen && d.open) d.close();
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, opts, products, reset]);

  const submit = handleSubmit(async (v) => {
    setError(null);
    const product = products.find((p) => p.slug === v.productSlug);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: v.name.trim(),
          email: v.email.trim(),
          company: v.company.trim(),
          inquiryType: "demo",
          interest: product?.name ?? opts?.interest ?? t("generalInterest"),
          productSlug: v.productSlug || undefined,
          preferredDate: v.preferredDate || undefined,
          message: v.message?.trim() || t("defaultMessage"),
          locale,
          website: v.website,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const body = (await res.json()) as { confirmationEmail?: boolean };
      setResult({ email: v.email.trim(), confirmationEmail: Boolean(body.confirmationEmail) });
    } catch {
      setError(t("error"));
    }
  });

  const today = new Date().toISOString().slice(0, 10);
  const field = "m-field w-full";
  const label = "mb-1.5 block text-xs font-semibold text-[var(--m-ink)]";

  return (
    <dialog
      ref={ref}
      aria-labelledby="demo-title"
      onClose={onClose}
      onCancel={onClose}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="m-auto w-[min(32rem,calc(100vw-1.5rem))] max-w-none overflow-visible rounded-3xl border border-m-line bg-[var(--color-background)] p-0 text-[var(--m-ink)] shadow-[0_40px_90px_-30px_rgba(16,24,40,0.6)] backdrop:bg-black/55 backdrop:backdrop-blur-sm"
    >
      <div className="max-h-[90svh] overflow-y-auto p-5 sm:p-6">
        <button type="button" onClick={onClose} aria-label={t("close")} className="absolute end-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-m-muted hover:bg-[var(--m-surface)] hover:text-[var(--m-ink)]">
          <X className="h-5 w-5" aria-hidden />
        </button>

        {result ? (
          <div className="py-4 text-center" role="status">
            <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--m-teal)]" aria-hidden />
            <h2 id="demo-title" className="mt-4 font-display text-2xl font-bold">{t("successTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-m-muted">
              {result.confirmationEmail ? t("successMail", { email: result.email }) : t("successNoMail")}
            </p>
            <button type="button" onClick={onClose} className="m-btn m-btn-primary mt-6">{t("close")}</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2 id="demo-title" className="font-display text-2xl font-bold tracking-tight">{t("title")}</h2>
            <p className="mt-1 text-sm text-m-muted">{t("intro")}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="demo-name" className={label}>{t("name")}</label>
                <input id="demo-name" autoComplete="name" autoFocus className={field} aria-invalid={Boolean(errors.name)} {...register("name")} />
                {errors.name ? <p className="mt-1 text-xs text-red-600" role="alert">{errors.name.message}</p> : null}
              </div>
              <div>
                <label htmlFor="demo-email" className={label}>{t("email")}</label>
                <input id="demo-email" type="email" autoComplete="email" className={field} aria-invalid={Boolean(errors.email)} {...register("email")} />
                {errors.email ? <p className="mt-1 text-xs text-red-600" role="alert">{errors.email.message}</p> : null}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="demo-company" className={label}>{t("company")}</label>
                <input id="demo-company" autoComplete="organization" className={field} aria-invalid={Boolean(errors.company)} {...register("company")} />
                {errors.company ? <p className="mt-1 text-xs text-red-600" role="alert">{errors.company.message}</p> : null}
              </div>
              {products.length ? (
                <div>
                  <label htmlFor="demo-product" className={label}>{t("product")}</label>
                  <select id="demo-product" className={field} {...register("productSlug")}>
                    <option value="">{t("productAny")}</option>
                    {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                  </select>
                </div>
              ) : null}
              <div className={cn(products.length ? "" : "sm:col-span-2")}>
                <label htmlFor="demo-date" className={label}>{t("date")}</label>
                <input id="demo-date" type="date" min={today} className={field} {...register("preferredDate")} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="demo-message" className={label}>{t("message")}</label>
                <textarea id="demo-message" rows={3} className={cn(field, "min-h-[5rem]")} {...register("message")} />
              </div>
              {/* honeypot: hidden from people and assistive tech, bots fill it */}
              <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
                <label>Website<input tabIndex={-1} autoComplete="off" {...register("website")} /></label>
              </div>
            </div>

            {error ? <p role="alert" className="mt-4 rounded-xl border border-red-500/40 px-4 py-3 text-sm text-red-600">{error} <Link href="/contact" className="m-link" onClick={onClose}>{t("useContactPage")}</Link></p> : null}

            <button type="submit" disabled={isSubmitting} className="m-btn m-btn-primary mt-6 w-full justify-center disabled:opacity-60">{isSubmitting ? t("sending") : t("submit")}</button>
            <p className="mt-3 text-center text-xs text-m-muted">{t("privacy")}</p>
          </form>
        )}
      </div>
    </dialog>
  );
}

