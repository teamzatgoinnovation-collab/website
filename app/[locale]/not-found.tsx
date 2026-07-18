import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tc = await getTranslations("common");

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col justify-center px-6 py-24">
      <div className="section-rule" />
      <p className="m-eyebrow">{t("code")}</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-m-muted">{t("body")}</p>
      <Link href="/" className="m-btn m-btn-primary mt-10 w-fit">
        {tc("backHome")}
      </Link>
    </div>
  );
}
