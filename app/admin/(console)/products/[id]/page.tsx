"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { Btn, Card, errMsg, Field, Input, Notice, PageTitle, Select, Textarea } from "@/components/admin/ui";
import { ScreenshotsManager } from "@/components/admin/screenshots-manager";
import { can, useMe } from "@/components/admin/use-me";
import { api, API_URL, mediaUrl, type MediaItem, type Paged } from "@/lib/admin/api";
import type { Product } from "../page";

type LocaleBlock = { name?: string; tagline?: string; summary?: string; description?: string; [k: string]: unknown };
type Detail = Product & {
  features: { id: string; title: string; body: string | null }[];
  platforms: { platform: string; storeUrl: string | null }[];
  channels: string[];
  accent: string | null;
  logoId: string | null;
  modules: { name: string; summary: string }[];
  faq: { question: string; answer: string }[];
  translations: Record<string, LocaleBlock> | null;
};
const CHANNELS = ["mobile", "desktop", "web"] as const;
const LOCALES: [string, string][] = [["ar", "Arabic"], ["es", "Spanish"], ["hi", "Hindi"], ["ja", "Japanese"], ["ml", "Malayalam"], ["tr", "Turkish"], ["ur", "Urdu"], ["zh", "Chinese"]];
const RTL = new Set(["ar", "ur"]);
const PLATFORMS = ["WINDOWS", "LINUX", "MACOS", "ANDROID", "IOS", "WEB"] as const;

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const me = useMe();
  const qc = useQueryClient();
  const canWrite = can(me.data, "products:write");
  const q = useQuery({ queryKey: ["product", id], queryFn: () => api<Detail>(`/admin/products/${id}`) });
  const [form, setForm] = useState<Partial<Product>>({});
  const [features, setFeatures] = useState<{ title: string; body: string }[]>([]);
  const [platforms, setPlatforms] = useState<Record<string, string>>({});
  const [channels, setChannels] = useState<string[]>([]);
  const [accent, setAccent] = useState("");
  const [logoId, setLogoId] = useState<string | null>(null);
  const [pickLogo, setPickLogo] = useState(false);
  const [modules, setModules] = useState<{ name: string; summary: string }[]>([]);
  const [faq, setFaq] = useState<{ question: string; answer: string }[]>([]);
  const [translations, setTranslations] = useState<Record<string, LocaleBlock>>({});
  const [locale, setLocale] = useState("ar");
  const library = useQuery({ queryKey: ["media", "logo-picker"], queryFn: () => api<Paged<MediaItem>>("/admin/media?pageSize=48"), enabled: pickLogo });
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!q.data) return;
    setForm(q.data);
    setFeatures(q.data.features.map((f) => ({ title: f.title, body: f.body ?? "" })));
    setPlatforms(Object.fromEntries(q.data.platforms.map((p) => [p.platform, p.storeUrl ?? ""])));
    setChannels(q.data.channels ?? []);
    setAccent(q.data.accent ?? "");
    setLogoId(q.data.logoId ?? null);
    setModules(q.data.modules ?? []);
    setFaq(q.data.faq ?? []);
    setTranslations((q.data.translations as Record<string, LocaleBlock> | null) ?? {});
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { name, tagline, summary, description, status, availability, isFeatured, sortOrder, docsUrl, supportUrl, pricingNote, scheduledAt } = form;
      await api(`/admin/products/${id}`, { method: "PATCH", body: { name, tagline, summary, description, status, availability, isFeatured, sortOrder: Number(sortOrder ?? 0), docsUrl: docsUrl || undefined, supportUrl: supportUrl || undefined, pricingNote: pricingNote || undefined, scheduledAt: status === "SCHEDULED" ? scheduledAt : undefined, channels, accent: /^#[0-9a-fA-F]{6}$/.test(accent) ? accent : null, logoId, modules: modules.filter((m) => m.name.trim()).map((m) => ({ name: m.name.trim(), summary: m.summary.trim() })), faq: faq.filter((f) => f.question.trim() && f.answer.trim()).map((f) => ({ question: f.question.trim(), answer: f.answer.trim() })), translations } });
      await api(`/admin/products/${id}/features`, { method: "PUT", body: { features: features.filter((f) => f.title.trim()).map((f) => ({ title: f.title.trim(), body: f.body.trim() || undefined })) } });
      await api(`/admin/products/${id}/platforms`, { method: "PUT", body: { platforms: Object.entries(platforms).map(([platform, storeUrl]) => ({ platform, storeUrl: storeUrl || undefined })) } });
    },
    onSuccess: () => { setNote({ kind: "ok", text: "Saved." }); void qc.invalidateQueries({ queryKey: ["product", id] }); void qc.invalidateQueries({ queryKey: ["products"] }); },
    onError: (e) => setNote({ kind: "error", text: errMsg(e) }),
  });
  const archive = useMutation({
    mutationFn: () => api(`/admin/products/${id}`, { method: "DELETE" }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["products"] }); window.location.assign("/admin/products"); },
    onError: (e) => setNote({ kind: "error", text: errMsg(e) }),
  });

  if (q.isPending) return <p className="text-sm text-m-muted">Loading…</p>;
  if (q.isError) return <Notice kind="error">{errMsg(q.error)}</Notice>;

  const set = <K extends keyof Product>(k: K, v: Product[K]) => setForm((f) => ({ ...f, [k]: v }));
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setNote(null); save.mutate(); };
  const dis = !canWrite;

  return (
    <>
      <p className="mb-2 text-sm"><Link href="/admin/products" className="m-link">← Products</Link></p>
      <PageTitle title={form.name ?? q.data.name} sub={`/${q.data.slug}`} />
      <form onSubmit={onSubmit} className="space-y-6">
        <Card title="Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><Input disabled={dis} required value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Tagline"><Input disabled={dis} required value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} /></Field>
            <div className="sm:col-span-2"><Field label="Summary"><Input disabled={dis} required value={form.summary ?? ""} onChange={(e) => set("summary", e.target.value)} /></Field></div>
            <div className="sm:col-span-2"><Field label="Description"><Textarea disabled={dis} required rows={6} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field></div>
            <Field label="Status" hint="Only Published (or Scheduled in the past) is visible on the website."><Select disabled={dis} value={form.status ?? "DRAFT"} onChange={(e) => set("status", e.target.value)}>{["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
            <Field label="Availability"><Select disabled={dis} value={form.availability ?? "COMING_SOON"} onChange={(e) => set("availability", e.target.value)}><option value="AVAILABLE">Available</option><option value="COMING_SOON">Coming soon</option></Select></Field>
            {form.status === "SCHEDULED" ? <Field label="Publish at"><Input disabled={dis} type="datetime-local" required value={(form.scheduledAt ?? "").slice(0, 16)} onChange={(e) => set("scheduledAt", e.target.value ? new Date(e.target.value).toISOString() : null)} /></Field> : null}
            <Field label="Sort order"><Input disabled={dis} type="number" value={form.sortOrder ?? 0} onChange={(e) => set("sortOrder", Number(e.target.value))} /></Field>
            <Field label="Docs URL"><Input disabled={dis} type="url" value={form.docsUrl ?? ""} onChange={(e) => set("docsUrl", e.target.value)} /></Field>
            <Field label="Support URL"><Input disabled={dis} type="url" value={form.supportUrl ?? ""} onChange={(e) => set("supportUrl", e.target.value)} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" disabled={dis} checked={form.isFeatured ?? false} onChange={(e) => set("isFeatured", e.target.checked)} />Featured on the homepage</label>
          </div>
        </Card>

        <Card title="Appearance on the site">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand colour" hint="Used for the cards, hero and phone showcase of this product. Leave empty for the site blue.">
              <div className="flex items-center gap-2">
                <input type="color" aria-label="Pick brand colour" disabled={dis} value={/^#[0-9a-fA-F]{6}$/.test(accent) ? accent : "#2952e3"} onChange={(e) => setAccent(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-m-line bg-transparent p-1" />
                <Input disabled={dis} placeholder="#2952E3" value={accent} onChange={(e) => setAccent(e.target.value)} className="max-w-[9rem]" />
                {accent ? <Btn disabled={dis} onClick={() => setAccent("")}>Clear</Btn> : null}
              </div>
            </Field>
            <Field label="Runs on" hint="Mobile products appear in the phone showcase.">
              <div className="flex flex-wrap gap-4 pt-2">
                {CHANNELS.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm capitalize"><input type="checkbox" disabled={dis} checked={channels.includes(c)} onChange={(e) => setChannels((cur) => (e.target.checked ? [...cur, c] : cur.filter((x) => x !== c)))} />{c}</label>
                ))}
              </div>
            </Field>
            <div className="sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold">Logo</span>
              <div className="flex items-center gap-3">
                {logoId ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`${API_URL}/api/v1/media/${logoId}/file`} alt="" className="h-12 w-12 rounded-xl border border-m-line object-contain" />
                ) : <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-m-line text-xs text-m-muted">none</span>}
                {canWrite ? <Btn onClick={() => setPickLogo((v) => !v)}>{pickLogo ? "Close library" : "Choose from library"}</Btn> : null}
                {logoId && canWrite ? <Btn variant="danger" onClick={() => setLogoId(null)}>Remove</Btn> : null}
              </div>
              {pickLogo ? (
                <div className="mt-3 grid grid-cols-4 gap-2 rounded-xl border border-m-line p-3 sm:grid-cols-8">
                  {library.data?.items.map((m) => (
                    <button key={m.id} type="button" onClick={() => { setLogoId(m.id); setPickLogo(false); }} className="overflow-hidden rounded-lg border border-m-line hover:border-[var(--m-accent)]" title={m.fileName}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mediaUrl(m)} alt={m.alt ?? m.fileName} className="aspect-square w-full object-contain" />
                    </button>
                  ))}
                  {library.data?.items.length === 0 ? <p className="col-span-full text-sm text-m-muted">The library is empty. Upload an image in Media first.</p> : null}
                </div>
              ) : null}
            </div>
          </div>
        </Card>

        <Card title="Features" actions={canWrite ? <Btn onClick={() => setFeatures((f) => [...f, { title: "", body: "" }])}><Plus className="h-4 w-4" aria-hidden />Add</Btn> : null}>
          <ul className="space-y-3">
            {features.map((f, i) => (
              <li key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                <Input aria-label="Feature title" disabled={dis} placeholder="Title" value={f.title} onChange={(e) => setFeatures((a) => a.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
                <Input aria-label="Feature description" disabled={dis} placeholder="Short description (optional)" value={f.body} onChange={(e) => setFeatures((a) => a.map((x, j) => (j === i ? { ...x, body: e.target.value } : x)))} />
                {canWrite ? <Btn aria-label="Remove feature" variant="danger" onClick={() => setFeatures((a) => a.filter((_, j) => j !== i))} className="!px-2"><Trash2 className="h-4 w-4" /></Btn> : null}
              </li>
            ))}
            {features.length === 0 ? <li className="text-sm text-m-muted">No features listed.</li> : null}
          </ul>
        </Card>

        <Card title="Modules" actions={canWrite ? <Btn onClick={() => setModules((m) => [...m, { name: "", summary: "" }])}><Plus className="h-4 w-4" aria-hidden />Add</Btn> : null}>
          <p className="mb-3 text-xs text-m-muted">Longer descriptions shown in the Modules section of the product page.</p>
          <ul className="space-y-3">
            {modules.map((m, i) => (
              <li key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                <Input aria-label="Module name" disabled={dis} placeholder="Name" value={m.name} onChange={(e) => setModules((a) => a.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                <Input aria-label="Module summary" disabled={dis} placeholder="What it does" value={m.summary} onChange={(e) => setModules((a) => a.map((x, j) => (j === i ? { ...x, summary: e.target.value } : x)))} />
                {canWrite ? <Btn aria-label="Remove module" variant="danger" onClick={() => setModules((a) => a.filter((_, j) => j !== i))} className="!px-2"><Trash2 className="h-4 w-4" /></Btn> : null}
              </li>
            ))}
            {modules.length === 0 ? <li className="text-sm text-m-muted">No modules listed.</li> : null}
          </ul>
        </Card>

        <Card title="FAQ" actions={canWrite ? <Btn onClick={() => setFaq((f) => [...f, { question: "", answer: "" }])}><Plus className="h-4 w-4" aria-hidden />Add</Btn> : null}>
          <ul className="space-y-3">
            {faq.map((f, i) => (
              <li key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                <Input aria-label="Question" disabled={dis} placeholder="Question" value={f.question} onChange={(e) => setFaq((a) => a.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))} />
                <Textarea aria-label="Answer" disabled={dis} rows={2} placeholder="Answer" value={f.answer} onChange={(e) => setFaq((a) => a.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)))} className="!min-h-[2.75rem]" />
                {canWrite ? <Btn aria-label="Remove question" variant="danger" onClick={() => setFaq((a) => a.filter((_, j) => j !== i))} className="!px-2"><Trash2 className="h-4 w-4" /></Btn> : null}
              </li>
            ))}
            {faq.length === 0 ? <li className="text-sm text-m-muted">No questions yet.</li> : null}
          </ul>
        </Card>

        <Card title="Translations">
          <p className="mb-4 text-xs text-m-muted">The text above is English. Add each language version of the main text here; anything left empty falls back to English on that language page.</p>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Select aria-label="Language" value={locale} onChange={(e) => setLocale(e.target.value)} className="!w-auto">
              {LOCALES.map(([code, label]) => <option key={code} value={code}>{label}{translations[code]?.name ? " ✓" : ""}</option>)}
            </Select>
            {translations[locale] ? <Btn disabled={dis} onClick={() => setTranslations((t) => { const n = { ...t }; delete n[locale]; return n; })}>Remove this language</Btn> : null}
          </div>
          <div className="grid gap-4" dir={RTL.has(locale) ? "rtl" : "ltr"}>
            {(["name", "tagline", "summary", "description"] as const).map((k) => {
              const value = (translations[locale]?.[k] as string | undefined) ?? "";
              const onChange = (v: string) => setTranslations((t) => ({ ...t, [locale]: { ...(t[locale] ?? {}), [k]: v } }));
              return (
                <Field key={k} label={`${k[0].toUpperCase()}${k.slice(1)} (${locale})`}>
                  {k === "description" ? <Textarea disabled={dis} rows={5} value={value} onChange={(e) => onChange(e.target.value)} /> : <Input disabled={dis} value={value} onChange={(e) => onChange(e.target.value)} />}
                </Field>
              );
            })}
          </div>
        </Card>

        <Card title="Platforms">
          <div className="grid gap-3 sm:grid-cols-2">
            {PLATFORMS.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <label className="flex w-28 items-center gap-2 text-sm"><input type="checkbox" disabled={dis} checked={p in platforms} onChange={(e) => setPlatforms((cur) => { const n = { ...cur }; if (e.target.checked) n[p] = ""; else delete n[p]; return n; })} />{p}</label>
                {(p === "ANDROID" || p === "IOS") && p in platforms ? <Input aria-label={`${p} store URL`} disabled={dis} type="url" placeholder="Store URL (optional)" value={platforms[p]} onChange={(e) => setPlatforms((cur) => ({ ...cur, [p]: e.target.value }))} className="!py-1.5" /> : null}
              </div>
            ))}
          </div>
        </Card>

        {note ? <Notice kind={note.kind}>{note.text}</Notice> : null}
        {canWrite ? (
          <div className="flex flex-wrap gap-3">
            <Btn type="submit" variant="primary" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save changes"}</Btn>
            <Btn variant="danger" disabled={archive.isPending} onClick={() => { if (window.confirm(`Archive "${q.data.name}"? It will disappear from the website.`)) archive.mutate(); }}>Archive product</Btn>
          </div>
        ) : <Notice>You have read-only access to products.</Notice>}
      </form>

      <div className="mt-6"><ScreenshotsManager productId={id} canWrite={canWrite} /></div>
    </>
  );
}
