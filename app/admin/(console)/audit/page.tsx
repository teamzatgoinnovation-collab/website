"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { errMsg, Input, Notice, PageTitle, Pager } from "@/components/admin/ui";
import { api, type Paged } from "@/lib/admin/api";

type Row = { id: string; action: string; entityType: string; entityId: string | null; createdAt: string; actor: { email: string; name: string } | null };

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const list = useQuery({ queryKey: ["audit", page, q], queryFn: () => api<Paged<Row>>(`/admin/audit-logs?page=${page}&pageSize=30${q ? `&q=${encodeURIComponent(q)}` : ""}`) });
  return (
    <>
      <PageTitle title="Audit log" sub="Every admin change and sign-in event." />
      <Input aria-label="Filter by action" placeholder="Filter, e.g. product or auth.login" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="mb-4 max-w-sm" />
      {list.isError ? <Notice kind="error">{errMsg(list.error)}</Notice> : null}
      <div className="overflow-x-auto rounded-2xl border border-m-line">
        <table className="w-full text-sm">
          <thead className="bg-[var(--m-surface)] text-left text-xs uppercase tracking-wider text-m-muted"><tr><th className="px-4 py-3">When</th><th className="px-4 py-3">Who</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Entity</th></tr></thead>
          <tbody>
            {list.data?.items.map((r) => (
              <tr key={r.id} className="border-t border-m-line">
                <td className="whitespace-nowrap px-4 py-2.5 text-m-muted">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2.5">{r.actor?.email ?? "—"}</td>
                <td className="px-4 py-2.5 font-mono text-xs">{r.action}</td>
                <td className="px-4 py-2.5 text-m-muted">{r.entityType}{r.entityId ? ` ${r.entityId.slice(0, 8)}` : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager page={page} pages={list.data?.pages ?? 1} onPage={setPage} />
    </>
  );
}
