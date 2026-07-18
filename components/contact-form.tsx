"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { inquiryTypes, type InquiryType } from "@/content/company";

type ContactFormProps = {
  mailTo: string;
};

function isInquiryType(value: string | null): value is InquiryType {
  return Boolean(value && (inquiryTypes as readonly string[]).includes(value));
}

export function ContactForm({ mailTo }: ContactFormProps) {
  const t = useTranslations("contactPage");
  const tPricing = useTranslations("pricing");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const interestParam = searchParams.get("interest")?.trim() ?? "";
  const tierParam = searchParams.get("tier")?.trim() ?? "";
  const typeParam = searchParams.get("type");

  const defaultInquiryType: InquiryType = isInquiryType(typeParam)
    ? typeParam
    : "demo";

  const interestDefault = useMemo(() => {
    if (interestParam) return interestParam;
    if (tierParam) {
      try {
        return tPricing(`${tierParam}.name`);
      } catch {
        return tierParam;
      }
    }
    return "";
  }, [interestParam, tierParam, tPricing]);

  const schema = z.object({
    name: z.string().min(2, t("errors.name")),
    email: z.string().email(t("errors.email")),
    company: z.string().min(2, t("errors.company")),
    inquiryType: z.enum(
      inquiryTypes as unknown as [string, ...string[]],
      { required_error: t("errors.inquiryType") },
    ),
    interest: z.string().min(2, t("errors.interest")),
    message: z.string().min(10, t("errors.message")),
    website: z.string().optional(),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      inquiryType: defaultInquiryType,
      interest: interestDefault,
      website: "",
    },
  });

  useEffect(() => {
    setValue("inquiryType", defaultInquiryType);
    if (interestDefault) setValue("interest", interestDefault);
  }, [defaultInquiryType, interestDefault, setValue]);

  const inquiryType = watch("inquiryType");
  const interest = watch("interest");

  const contextLabel = useMemo(() => {
    if (!interestParam && !tierParam && !typeParam) return null;
    const typeLabel = t(`inquiryTypes.${inquiryType}`);
    const interestPart = interest
      ? t("contextInterest", { value: interest })
      : "";
    let tierPart = "";
    if (tierParam) {
      try {
        tierPart = t("contextTier", { value: tPricing(`${tierParam}.name`) });
      } catch {
        tierPart = t("contextTier", { value: tierParam });
      }
    }
    return `${typeLabel}${interestPart}${tierPart}`;
  }, [
    interest,
    interestParam,
    inquiryType,
    t,
    tPricing,
    tierParam,
    typeParam,
  ]);

  const openMailto = (data: FormValues) => {
    const typeLabel = t(`inquiryTypes.${data.inquiryType}`);
    const subject = encodeURIComponent(`ZatGo ${typeLabel} — ${data.company}`);
    const body = encodeURIComponent(
      [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Company: ${data.company}`,
        `Inquiry type: ${typeLabel}`,
        `Interest: ${data.interest}`,
        tierParam ? `Tier: ${tierParam}` : null,
        "",
        data.message,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    window.location.href = `mailto:${mailTo}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          inquiryType: data.inquiryType,
          interest: data.interest,
          message: data.message,
          website: data.website ?? "",
          tier: tierParam || undefined,
          locale,
        }),
      });

      if (res.ok) {
        toast.success(t("toastTitle"), { description: t("toastDesc") });
        reset({
          inquiryType: defaultInquiryType,
          interest: interestDefault,
          website: "",
          name: "",
          email: "",
          company: "",
          message: "",
        });
        return;
      }

      openMailto(data);
      toast.message(t("toastMailtoTitle"), {
        description: t("toastMailtoDesc"),
      });
      reset({
        inquiryType: defaultInquiryType,
        interest: interestDefault,
        website: "",
        name: "",
        email: "",
        company: "",
        message: "",
      });
    } catch {
      openMailto(data);
      toast.message(t("toastMailtoTitle"), {
        description: t("toastMailtoDesc"),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-5">
      {contextLabel ? (
        <p className="rounded-[var(--m-radius)] border border-m-line bg-[var(--m-surface)] px-3 py-2 text-sm font-medium text-[var(--m-ink)]">
          {contextLabel}
        </p>
      ) : null}

      {/* Honeypot */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div>
        <label htmlFor="name" className="text-sm font-medium">
          {t("name")}
        </label>
        <input id="name" className="m-field" {...register("name")} />
        {errors.name ? (
          <p className="mt-1 text-xs text-[var(--color-destructive)]">
            {errors.name.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          {t("email")}
        </label>
        <input
          id="email"
          type="email"
          className="m-field"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-[var(--color-destructive)]">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="company" className="text-sm font-medium">
          {t("company")}
        </label>
        <input id="company" className="m-field" {...register("company")} />
        {errors.company ? (
          <p className="mt-1 text-xs text-[var(--color-destructive)]">
            {errors.company.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="inquiryType" className="text-sm font-medium">
          {t("inquiryType")}
        </label>
        <select id="inquiryType" className="m-field" {...register("inquiryType")}>
          {inquiryTypes.map((type) => (
            <option key={type} value={type}>
              {t(`inquiryTypes.${type}`)}
            </option>
          ))}
        </select>
        {errors.inquiryType ? (
          <p className="mt-1 text-xs text-[var(--color-destructive)]">
            {errors.inquiryType.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="interest" className="text-sm font-medium">
          {t("interest")}
        </label>
        <input
          id="interest"
          placeholder={t("interestPlaceholder")}
          className="m-field"
          {...register("interest")}
        />
        {errors.interest ? (
          <p className="mt-1 text-xs text-[var(--color-destructive)]">
            {errors.interest.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium">
          {t("message")}
        </label>
        <textarea
          id="message"
          rows={5}
          className="m-field"
          {...register("message")}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-[var(--color-destructive)]">
            {errors.message.message}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="m-btn m-btn-primary !rounded-[var(--m-radius)]"
      >
        {isSubmitting ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
