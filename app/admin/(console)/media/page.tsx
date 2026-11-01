"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { Btn, errMsg, Input, Notice, PageTitle, Pager } from "@/components/admin/ui";
import { can, useMe } from "@/components/admin/use-me";
import { api, mediaUrl, uploadImage, type MediaItem, type Paged } from "@/lib/admin/api";

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export default function MediaPage() {
  const me = useMe();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const canWrite = can(me.data, "media:write");

  const list = useQuery({ queryKey: ["media", page, q], queryFn: () => api<Paged<MediaItem>>(`/admin/media?page=${page}&pageSize=24${q ? `&q=${encodeURIComponent(q)}` : ""}`) });
  const refresh = () => qc.invalidateQueries({ queryKey: ["media"] });
  const upload = useMutation({
    mutationFn: async (files: File[]) => { for (const f of files) await uploadImage(f, ""); },
    onSuccess: () => { setMsg({ kind: "ok", text: "Uploaded." }); void refresh(); },
    onError: (e) => setMsg({ kind: "error", text: errMsg(e) }),
  });
  const del = useMutation({
    mutationFn: (id: string) => api(`/admin/media/${id}`, { method: "DELETE" }),
    onSuccess: () => { setMsg(null); void refresh(); },
    onError: (e) => setMsg({ kind: "error", text: errMsg(e) }),
  });
  const alt = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => api(`/admin/media/${id}`, { method: "PATCH", body: { alt: text } }),
    onError: (e) => setMsg({ kind: "error", text: errMsg(e) }),
  });

  return (
    <>
      <PageTitle title="Media library" sub="PNG, JPEG, WebP and AVIF up to the server limit. SVG is not accepted." actions={canWrite ? (
        <>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" multiple hidden onChange={(e) => { const f = Array.from(e.target.files ?? []); if (f.length) upload.mutate(f); e.target.value = ""; }} />
          <Btn variant="primary" disabled={upload.isPending} onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" aria-hidden />{upload.isPending ? "Uploading…" : "Upload images"}</Btn>
        </>
      ) : null} />
      <Input aria-label="Search media" placeholder="Search by file name or alt text" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="mb-4 max-w-sm" />
      {msg ? <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div> : null}
      {list.isError ? <Notice kind="error">{errMsg(list.error)}</Notice> : null}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.data?.items.map((m) => (
          <li key={m.id} className="overflow-hidden rounded-2xl border border-m-line bg-[var(--m-surface-elevated)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaUrl(m)} alt={m.alt ?? m.fileName} loading="lazy" className="aspect-video w-full bg-[var(--m-surface)] object-contain" />
            <div className="space-y-2 p-3 text-xs">
              <p className="truncate font-semibold" title={m.fileName}>{m.fileName}</p>
              <p className="text-m-muted">{m.width ? `${m.width}×${m.height} · ` : ""}{kb(m.sizeBytes)} · {m.mimeType.replace("image/", "")}</p>
              <Input aria-label="Alt text" defaultValue={m.alt ?? ""} disabled={!canWrite} placeholder="Alt text (describe the image)" onBlur={(e) => { if (e.target.value !== (m.alt ?? "")) alt.mutate({ id: m.id, text: e.target.value }); }} className="!py-1.5 !text-xs" />
              {canWrite ? <Btn variant="danger" onClick={() => { if (window.confirm(`Delete ${m.fileName}?`)) del.mutate(m.id); }} className="!px-2.5 !py-1.5 !text-xs"><Trash2 className="h-3.5 w-3.5" aria-hidden />Delete</Btn> : null}
            </div>
          </li>
        ))}
      </ul>
      {list.data && list.data.items.length === 0 ? <p className="py-10 text-center text-sm text-m-muted">No media yet.</p> : null}
      <Pager page={page} pages={list.data?.pages ?? 1} onPage={setPage} />
    </>
  );
}
