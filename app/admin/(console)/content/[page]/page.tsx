"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Btn, Card, errMsg, Input, Notice, PageTitle, Textarea } from "@/components/admin/ui";
import { can, useMe } from "@/components/admin/use-me";
import { api, API_URL, mediaUrl, type MediaItem, type Paged } from "@/lib/admin/api";
import { PAGE_LABELS, slotsFor, type ImageSlot } from "@/content/image-slots";
import { locales } from "@/i18n/routing";
import { home, home2 } from "@/messages/en.json";

type Texts = Record<string, Record<string, string>>;
type Images = Record<string, { id: string; url: string; fileName: string | null }>;
type Doc = { texts: Texts; images: Images };


const LABEL: Record<string, string> = { en: "English", ar: "العربية", es: "Español", hi: "हिन्दी", ja: "日本語", ml: "മലയാളം", tr: "Türkçe", ur: "اردو", zh: "中文" };

/** Every built-in home page text, grouped by the word its key starts with (hero, story, channels…). */
function buildGroups() {
  const groups = new Map<string, { id: string; key: string; label: string; fallback: string }[]>();
  for (const [ns, bag] of [["home2", home2], ["home", home]] as const) {
    for (const [key, value] of Object.entries(bag as Record<string, unknown>)) {
      if (typeof value !== "string") continue;
      const group = key.match(/^[a-z]+/)?.[0] ?? "other";
      const list = groups.get(`${ns === "home2" ? "Page" : "Sections"} · ${group}`) ?? [];
      list.push({ id: `${ns}.${key}`, key, label: key, fallback: value });
      groups.set(`${ns === "home2" ? "Page" : "Sections"} · ${group}`, list);
    }
  }
  return [...groups.entries()];
}

export default function ContentPage() {
  const { page } = useParams<{ page: string }>();
  const isHome = page === "home";
  const me = useMe();
  const qc = useQueryClient();
  const canWrite = can(me.data, "content:write");
  const groups = useMemo(buildGroups, []);
  const [locale, setLocale] = useState<string>("en");
  const [texts, setTexts] = useState<Texts>({});
  const [images, setImages] = useState<Images>({});
  const [picking, setPicking] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const products = useQuery({ queryKey: ["products", "all-names"], queryFn: () => api<Paged<{ slug: string; name: string }>>("/admin/products?pageSize=100"), enabled: page === "cards" });
  const slots: ImageSlot[] = useMemo(
    () => [...slotsFor(page), ...(page === "cards" ? (products.data?.items ?? []).map((p) => ({ slot: `product-${p.slug}`, label: `Product: ${p.name}`, hint: "Cover picture on its card in Products (16:10); replaces the screenshot." })) : [])],
    [page, products.data],
  );
  const doc = useQuery({ queryKey: ["content", page], queryFn: () => api<Doc>(`/admin/content/${page}`), enabled: Boolean(page) });
  const library = useQuery({ queryKey: ["media", "content-picker"], queryFn: () => api<Paged<MediaItem>>("/admin/media?pageSize=48"), enabled: picking !== null });
  useEffect(() => {
    if (doc.data) { setTexts(doc.data.texts); setImages(doc.data.images); }
  }, [doc.data]);

  const save = useMutation({
    mutationFn: () => api<Doc>(`/admin/content/${page}`, { method: "PUT", body: { texts, images: Object.fromEntries(Object.entries(images).map(([slot, v]) => [slot, v.id])) } }),
    onSuccess: (d) => { qc.setQueryData(["content", page], d); setSaved(true); },
  });

  const value = (id: string) => texts[locale]?.[id] ?? "";
  const setValue = (id: string, v: string) => { setSaved(false); setTexts((cur) => ({ ...cur, [locale]: { ...(cur[locale] ?? {}), [id]: v } })); };
  const overridden = Object.values(texts).reduce((n, o) => n + Object.values(o).filter((v) => v.trim()).length, 0);

  return (
    <>
      <PageTitle
        title={`${PAGE_LABELS.find((p) => p.page === page)?.label ?? page} content`}
        sub={isHome ? "Edit the text and images on the public home page. Leave a field empty to keep the built-in text. Changes appear on the site within seconds." : "Choose pictures for this page from the Media library. An empty slot keeps the built-in look. Changes appear within seconds."}
        actions={canWrite ? <Btn variant="primary" disabled={save.isPending || !doc.data} onClick={() => save.mutate()}>{save.isPending ? "Saving…" : "Save changes"}</Btn> : null}
      />
      {doc.isError ? <Notice kind="error">{errMsg(doc.error)}</Notice> : null}
      {save.isError ? <div className="mb-3"><Notice kind="error">{errMsg(save.error)}</Notice></div> : null}
      {saved ? <div className="mb-3"><Notice kind="ok">Saved. {overridden} custom text{overridden === 1 ? "" : "s"} across all languages.</Notice></div> : null}

      <nav aria-label="Pages" className="mb-4 flex flex-wrap gap-2">
        {PAGE_LABELS.map((p) => (
          <Link key={p.page} href={`/admin/content/${p.page}`} className={`rounded-full border px-3 py-1 text-xs font-semibold ${p.page === page ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white" : "border-m-line"}`}>{p.label}</Link>
        ))}
      </nav>
      <p className="mb-4 text-sm text-m-muted">Generate pictures with any AI image tool, upload them under <Link href="/admin/media" className="m-link">Media</Link>, then choose them here. Use illustrations of products, teams and workflows; do not show invented customers, logos or screenshots.</p>

      <Card title="Images" className="mb-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {slots.map(({ slot, label, hint }) => (
            <div key={slot}>
              <span className="mb-1 block text-sm font-semibold">{label}</span>
              <p className="mb-2 text-xs text-m-muted">{hint}</p>
              <div className="flex items-center gap-3">
                {images[slot] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`${API_URL}${images[slot].url}`} alt="" className="h-14 w-24 rounded-lg border border-m-line object-cover" />
                ) : <span className="flex h-14 w-24 items-center justify-center rounded-lg border border-dashed border-m-line text-xs text-m-muted">built-in</span>}
                {canWrite ? <Btn onClick={() => setPicking(picking === slot ? null : slot)}>{picking === slot ? "Close" : "Choose image"}</Btn> : null}
                {images[slot] && canWrite ? <Btn variant="danger" onClick={() => { setSaved(false); setImages((cur) => { const n = { ...cur }; delete n[slot]; return n; }); }}>Remove</Btn> : null}
              </div>
              {picking === slot ? (
                <div className="mt-3 grid grid-cols-4 gap-2 rounded-xl border border-m-line p-3 sm:grid-cols-6">
                  {library.data?.items.map((m) => (
                    <button key={m.id} type="button" title={m.fileName} className="overflow-hidden rounded-lg border border-m-line hover:border-[var(--m-accent)]" onClick={() => { setSaved(false); setImages((cur) => ({ ...cur, [slot]: { id: m.id, url: `/api/v1/media/${m.id}/file`, fileName: m.fileName } })); setPicking(null); }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mediaUrl(m)} alt={m.alt ?? m.fileName} className="aspect-square w-full object-cover" />
                    </button>
                  ))}
                  {library.data?.items.length === 0 ? <p className="col-span-full text-sm text-m-muted">The library is empty. Upload an image in Media first.</p> : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      {isHome ? (<>
      <div role="tablist" aria-label="Language" className="mb-4 flex flex-wrap gap-2">
        {locales.map((l) => (
          <button key={l} role="tab" aria-selected={locale === l} type="button" onClick={() => setLocale(l)} className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${locale === l ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white" : "border-m-line"}`}>
            {LABEL[l] ?? l}{Object.keys(texts[l] ?? {}).filter((k) => texts[l][k]?.trim()).length ? " •" : ""}
          </button>
        ))}
      </div>
      {locale !== "en" ? <p className="mb-4 text-sm text-m-muted">Empty fields use the built-in {LABEL[locale]} text. The grey hint shows the English wording for reference.</p> : null}

      <div className="space-y-5">
        {groups.map(([title, items]) => (
          <Card key={title} title={title}>
            <div className="grid gap-4">
              {items.map((f) => {
                const long = f.fallback.length > 90;
                const common = { id: `c-${f.id}`, value: value(f.id), disabled: !canWrite, placeholder: f.fallback, maxLength: 2000, dir: ["ar", "ur"].includes(locale) ? ("rtl" as const) : ("ltr" as const) };
                return (
                  <div key={f.id}>
                    <label htmlFor={`c-${f.id}`} className="mb-1 flex items-center justify-between gap-3 text-xs font-semibold">
                      <span>{f.label}</span>
                      {value(f.id) && canWrite ? <button type="button" className="text-[var(--m-accent)]" onClick={() => setValue(f.id, "")}>Reset to built-in</button> : null}
                    </label>
                    {long ? <Textarea {...common} rows={3} onChange={(e) => setValue(f.id, e.target.value)} /> : <Input {...common} onChange={(e) => setValue(f.id, e.target.value)} />}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
      </>) : null}
    </>
  );
}
