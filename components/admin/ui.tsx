"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[var(--m-ink)]">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-m-muted">{hint}</span> : null}
    </label>
  );
}

export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cn("m-field", p.className)} />;
export const Textarea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={cn("m-field min-h-[7rem]", p.className)} />;
export const Select = (p: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={cn("m-field", p.className)} />;

export function Btn({ variant = "ghost", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  return (
    <button
      type="button"
      {...p}
      className={cn(
        "m-btn !px-3.5 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "m-btn-primary",
        variant === "ghost" && "m-btn-ghost",
        variant === "danger" && "!border !border-red-500/40 !text-red-600 dark:!text-red-400",
        className,
      )}
    />
  );
}

export function Card({ title, actions, children, className }: { title?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-m-line bg-[var(--m-surface-elevated)] p-5", className)}>
      {title || actions ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h2 className="font-display text-base font-semibold">{title}</h2> : <span />}
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function PageTitle({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        {sub ? <p className="mt-1 text-sm text-m-muted">{sub}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function Notice({ kind = "info", children }: { kind?: "info" | "error" | "ok"; children: ReactNode }) {
  return (
    <p role={kind === "error" ? "alert" : "status"} className={cn("rounded-xl border px-4 py-3 text-sm", kind === "error" && "border-red-500/40 text-red-600 dark:text-red-400", kind === "ok" && "border-[var(--m-teal)]/50 text-[var(--m-teal)]", kind === "info" && "border-m-line text-m-muted")}>
      {children}
    </p>
  );
}

export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-m-muted">
      <Btn disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</Btn>
      <span>Page {page} of {pages}</span>
      <Btn disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</Btn>
    </div>
  );
}

export const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");
