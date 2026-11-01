"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Btn, Card, errMsg, Notice, PageTitle, Pager, Select, Textarea } from "@/components/admin/ui";
import { can, useMe } from "@/components/admin/use-me";
import { api, type Paged } from "@/lib/admin/api";
import { cn } from "@/lib/cn";

type Lead = { id: string; name: string; email: string; company: string | null; type?: string; interest?: string | null; productSlug?: string | null; message: string | null; status: string; notes: string | null; createdAt: string };
const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST", "SPAM"];

export default function LeadsPage() {
  const me = useMe();
  const qc = useQueryClient();
  const canWrite = can(me.data, "leads:write");
  const [kind, setKind] = useState<"contacts" | "demos">("contacts");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const list = useQuery({ queryKey: ["leads", kind, status, page], queryFn: () => api<Paged<Lead>>(`/admin/leads/${kind}?page=${page}&pageSize=20${status ? `&status=${status}` : ""}`) });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { status?: string; notes?: string } }) => api(`/admin/leads/${kind}/${id}`, { method: "PATCH", body }),
    onSuccess: () => { setErr(null); void qc.invalidateQueries({ queryKey: ["leads"] }); void qc.invalidateQueries({ queryKey: ["count"] }); },
    onError: (e) => setErr(errMsg(e)),
  });

  return (
    <>
      <PageTitle title="Leads" sub="Enquiries and demo requests from the website." />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div role="tablist" className="inline-flex rounded-full border border-m-line p-0.5">
          {(["contacts", "demos"] as const).map((k) => (
            <button key={k} role="tab" aria-selected={kind === k} onClick={() => { setKind(k); setPage(1); setOpen(null); }} className={cn("rounded-full px-4 py-1.5 text-sm font-medium", kind === k ? "bg-[var(--m-ink)] text-[var(--color-background)]" : "text-m-muted")}>{k === "contacts" ? "Enquiries" : "Demo requests"}</button>
          ))}
        </div>
        <Select aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="!w-auto"><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select>
      </div>
      {err ? <div className="mb-4"><Notice kind="error">{err}</Notice></div> : null}
      {list.isError ? <Notice kind="error">{errMsg(list.error)}</Notice> : null}
      <ul className="space-y-3">
        {list.data?.items.map((l) => (
          <li key={l.id}>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <button type="button" onClick={() => setOpen(open === l.id ? null : l.id)} aria-expanded={open === l.id} className="min-w-0 text-start">
                  <p className="font-semibold">{l.name} <span className="font-normal text-m-muted">· {l.company ?? "—"}</span></p>
                  <p className="text-sm text-m-muted">{l.email} · {new Date(l.createdAt).toLocaleString()}{l.type ? ` · ${l.type}` : ""}</p>
                </button>
                <Select aria-label={`Status for ${l.name}`} disabled={!canWrite} value={l.status} onChange={(e) => update.mutate({ id: l.id, body: { status: e.target.value } })} className="!w-auto !py-1.5">{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select>
              </div>
              {open === l.id ? (
                <div className="mt-4 space-y-3 border-t border-m-line pt-4 text-sm">
                  {l.interest ? <p><span className="font-semibold">Interest: </span>{l.interest}</p> : null}
                  <p className="whitespace-pre-wrap">{l.message}</p>
                  {canWrite ? (
                    <form onSubmit={(e) => { e.preventDefault(); const t = new FormData(e.currentTarget).get("notes"); update.mutate({ id: l.id, body: { notes: String(t ?? "") } }); }}>
                      <Textarea name="notes" aria-label="Internal notes" defaultValue={l.notes ?? ""} placeholder="Internal notes" rows={3} />
                      <Btn type="submit" className="mt-2">Save notes</Btn>
                    </form>
                  ) : l.notes ? <p className="text-m-muted">Notes: {l.notes}</p> : null}
                </div>
              ) : null}
            </Card>
          </li>
        ))}
        {list.data && list.data.items.length === 0 ? <p className="py-10 text-center text-sm text-m-muted">Nothing here.</p> : null}
      </ul>
      <Pager page={page} pages={list.data?.pages ?? 1} onPage={setPage} />
    </>
  );
}
