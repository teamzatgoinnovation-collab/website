"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Btn, Card, errMsg, Field, Input, Notice, PageTitle, Pager, Select, Textarea } from "@/components/admin/ui";
import { can, useMe } from "@/components/admin/use-me";
import { api, type Paged } from "@/lib/admin/api";

export type Product = { id: string; slug: string; name: string; tagline: string; summary: string; description: string; status: string; availability: string; isFeatured: boolean; sortOrder: number; docsUrl: string | null; supportUrl: string | null; pricingNote: string | null; scheduledAt: string | null };

const EMPTY = { slug: "", name: "", tagline: "", summary: "", description: "" };

export default function ProductsPage() {
  const me = useMe();
  const router = useRouter();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const list = useQuery({
    queryKey: ["products", page, q, status],
    queryFn: () => api<Paged<Product>>(`/admin/products?page=${page}&pageSize=20${q ? `&q=${encodeURIComponent(q)}` : ""}${status ? `&status=${status}` : ""}`),
  });
  const create = useMutation({
    mutationFn: () => api<Product>("/admin/products", { method: "POST", body: form }),
    onSuccess: (p) => { void qc.invalidateQueries({ queryKey: ["products"] }); router.push(`/admin/products/${p.id}`); },
  });
  const toggle = useMutation({
    mutationFn: (v: { id: string; status: "PUBLISHED" | "DRAFT" }) => api<Product>(`/admin/products/${v.id}`, { method: "PATCH", body: { status: v.status } }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["products"] }); },
  });
  const canWrite = can(me.data, "products:write");
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e: FormEvent) => { e.preventDefault(); create.mutate(); };

  return (
    <>
      <PageTitle title="Products" sub="New products start as drafts and stay private until published." actions={can(me.data, "products:write") ? <Btn variant="primary" onClick={() => setCreating((v) => !v)}>{creating ? "Cancel" : "New product"}</Btn> : null} />

      {creating ? (
        <Card title="New product" className="mb-6">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug" hint="Lowercase letters, digits and hyphens. Used in the page URL."><Input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={set("slug")} /></Field>
            <Field label="Name"><Input required minLength={2} value={form.name} onChange={set("name")} /></Field>
            <Field label="Tagline"><Input required minLength={2} value={form.tagline} onChange={set("tagline")} /></Field>
            <Field label="Summary"><Input required value={form.summary} onChange={set("summary")} /></Field>
            <div className="sm:col-span-2"><Field label="Description"><Textarea required value={form.description} onChange={set("description")} /></Field></div>
            {create.isError ? <div className="sm:col-span-2"><Notice kind="error">{errMsg(create.error)}</Notice></div> : null}
            <div className="sm:col-span-2"><Btn type="submit" variant="primary" disabled={create.isPending}>{create.isPending ? "Creating…" : "Create draft"}</Btn></div>
          </form>
        </Card>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-3">
        <Input aria-label="Search products" placeholder="Search by name" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="max-w-xs" />
        <Select aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="max-w-[10rem]">
          <option value="">All statuses</option>
          {["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"].map((s) => <option key={s}>{s}</option>)}
        </Select>
      </div>

      {list.isError ? <Notice kind="error">{errMsg(list.error)}</Notice> : null}
      {toggle.isError ? <div className="mb-3"><Notice kind="error">{errMsg(toggle.error)}</Notice></div> : null}
      <div className="overflow-x-auto rounded-2xl border border-m-line">
        <table className="w-full text-sm">
          <thead className="bg-[var(--m-surface)] text-left text-xs uppercase tracking-wider text-m-muted">
            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Availability</th>{canWrite ? <th className="px-4 py-3">Action</th> : null}</tr>
          </thead>
          <tbody>
            {list.data?.items.map((p) => (
              <tr key={p.id} className="border-t border-m-line">
                <td className="px-4 py-3 font-medium"><Link href={`/admin/products/${p.id}`} className="m-link">{p.name}</Link></td>
                <td className="px-4 py-3 text-m-muted">{p.slug}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-m-muted">{p.availability.replace("_", " ")}</td>
                {canWrite ? (
                  <td className="px-4 py-3">
                    {p.status === "PUBLISHED" ? (
                      <Btn variant="danger" aria-label={`Disable ${p.name}`} disabled={toggle.isPending} onClick={() => toggle.mutate({ id: p.id, status: "DRAFT" })}>Disable</Btn>
                    ) : (
                      <Btn variant="ghost" aria-label={`Enable ${p.name}`} disabled={toggle.isPending} onClick={() => toggle.mutate({ id: p.id, status: "PUBLISHED" })}>Enable</Btn>
                    )}
                  </td>
                ) : null}
              </tr>
            ))}
            {list.data && list.data.items.length === 0 ? <tr><td colSpan={canWrite ? 5 : 4} className="px-4 py-8 text-center text-m-muted">No products yet.</td></tr> : null}
          </tbody>
        </table>
      </div>
      <Pager page={page} pages={list.data?.pages ?? 1} onPage={setPage} />
    </>
  );
}
