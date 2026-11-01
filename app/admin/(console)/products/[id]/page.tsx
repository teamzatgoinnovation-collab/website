"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { Btn, Card, errMsg, Field, Input, Notice, PageTitle, Select, Textarea } from "@/components/admin/ui";
import { ScreenshotsManager } from "@/components/admin/screenshots-manager";
import { can, useMe } from "@/components/admin/use-me";
import { api } from "@/lib/admin/api";
import type { Product } from "../page";

type Detail = Product & { features: { id: string; title: string; body: string | null }[]; platforms: { platform: string; storeUrl: string | null }[] };
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
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!q.data) return;
    setForm(q.data);
    setFeatures(q.data.features.map((f) => ({ title: f.title, body: f.body ?? "" })));
    setPlatforms(Object.fromEntries(q.data.platforms.map((p) => [p.platform, p.storeUrl ?? ""])));
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { name, tagline, summary, description, status, availability, isFeatured, sortOrder, docsUrl, supportUrl, pricingNote, scheduledAt } = form;
      await api(`/admin/products/${id}`, { method: "PATCH", body: { name, tagline, summary, description, status, availability, isFeatured, sortOrder: Number(sortOrder ?? 0), docsUrl: docsUrl || undefined, supportUrl: supportUrl || undefined, pricingNote: pricingNote || undefined, scheduledAt: status === "SCHEDULED" ? scheduledAt : undefined } });
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
