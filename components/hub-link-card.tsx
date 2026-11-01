"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useTranslations } from "next-intl";
import type { Tone } from "@/lib/tone";

type HubLinkCardProps = {
  title: string;
  description: string;
  href: string;
  meta?: string;
  external?: boolean;
  className?: string;
  tone?: Tone;
  icon?: ReactNode;
};

export function HubLinkCard({
  title,
  description,
  href,
  meta,
  external = true,
  className,
  tone = "blue",
  icon,
}: HubLinkCardProps) {
  const t = useTranslations("common");

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(`tone-card tone-${tone} group flex flex-col p-5`, className)}
    >
      <span aria-hidden className="tone-rule" />
      {icon ? <span className="tone-chip mb-4 h-10 w-10">{icon}</span> : null}
      {meta ? <p className="m-eyebrow mb-3">{meta}</p> : null}
      <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-m-muted">{description}</p>
      <span className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--m-ink)] transition-colors group-hover:text-[var(--m-accent)]">
        {external ? t("openInDocs") : t("view")}
        {external ? (
          <ExternalLink className="ms-1.5 h-3.5 w-3.5" />
        ) : (
          <ArrowRight className="ms-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" />
        )}
      </span>
    </a>
  );
}
