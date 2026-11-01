"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { Btn, Card, errMsg, Input, Notice, Select } from "@/components/admin/ui";
import { api, mediaUrl, uploadImage, type MediaItem, type Paged } from "@/lib/admin/api";

type Shot = { id: string; device: "DESKTOP" | "MOBILE" | "TABLET"; caption: string | null; sortOrder: number; media: { id: string; alt: string | null; width: number | null; height: number | null; url: string } };
type ProductWithShots = { id: string; screenshots: Shot[] };

const DEVICES = ["DESKTOP", "MOBILE", "TABLET"] as const;

export function ScreenshotsManager({ productId, canWrite }: { productId: string; canWrite: boolean }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [device, setDevice] = useState<(typeof DEVICES)[number]>("DESKTOP");
  const [pickOpen, setPickOpen] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  const product = useQuery({ queryKey: ["product", productId], queryFn: () => api<ProductWithShots>(`/admin/products/${productId}`) });
  const library = useQuery({ queryKey: ["media", "picker"], queryFn: () => api<Paged<MediaItem>>("/admin/media?pageSize=48"), enabled: pickOpen });
  const refresh = () => qc.invalidateQueries({ queryKey: ["product", productId] });

  const attach = useMutation({
    mutationFn: (mediaId: string) => api(`/admin/products/${productId}/screenshots`, { method: "POST", body: { mediaId, device } }),
    onSuccess: () => { setMsg({ kind: "ok", text: "Screenshot added." }); void refresh(); },
    onError: (e) => setMsg({ kind: "error", text: errMsg(e) }),
  });
  const upload = useMutation({
    mutationFn: async (files: File[]) => {
      for (const f of files) {
        const { media } = await uploadImage(f, `${device.toLowerCase()} screenshot`);
        await api(`/admin/products/${productId}/screenshots`, { method: "POST", body: { mediaId: media.id, device } }).catch((e) => { if (!/exists|Conflict/i.test(errMsg(e))) throw e; });
      }
    },
    onSuccess: () => { setMsg({ kind: "ok", text: "Uploaded." }); void refresh(); void qc.invalidateQueries({ queryKey: ["media"] }); },
    onError: (e) => setMsg({ kind: "error", text: errMsg(e) }),
  });
  const remove = useMutation({
    mutationFn: (sid: string) => api(`/admin/products/${productId}/screenshots/${sid}`, { method: "DELETE" }),
    onSuccess: () => void refresh(),
    onError: (e) => setMsg({ kind: "error", text: errMsg(e) }),
  });
  const reorder = useMutation({
    mutationFn: (ids: string[]) => api(`/admin/products/${productId}/screenshots/order`, { method: "PUT", body: { ids } }),
    onSuccess: () => void refresh(),
    onError: (e) => setMsg({ kind: "error", text: errMsg(e) }),
  });
  const caption = useMutation({
    mutationFn: ({ sid, text }: { sid: string; text: string }) => api(`/admin/products/${productId}/screenshots/${sid}`, { method: "PATCH", body: { caption: text } }),
    onError: (e) => setMsg({ kind: "error", text: errMsg(e) }),
  });

  const shots = [...(product.data?.screenshots ?? [])].sort((a, b) => a.device.localeCompare(b.device) || a.sortOrder - b.sortOrder);
  const move = (id: string, dir: -1 | 1) => {
    const ids = shots.map((s) => s.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= ids.length || shots[i].device !== shots[j].device) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    reorder.mutate(ids);
  };

  return (
    <Card title="Screenshots" actions={canWrite ? (
      <div className="flex flex-wrap items-center gap-2">
        <Select aria-label="Device for new screenshots" value={device} onChange={(e) => setDevice(e.target.value as typeof device)} className="!w-auto !py-1.5">{DEVICES.map((d) => <option key={d}>{d}</option>)}</Select>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" multiple hidden onChange={(e) => { const f = Array.from(e.target.files ?? []); if (f.length) upload.mutate(f); e.target.value = ""; }} />
        <Btn disabled={upload.isPending} onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" aria-hidden />{upload.isPending ? "Uploading…" : "Upload"}</Btn>
        <Btn onClick={() => setPickOpen((v) => !v)}>{pickOpen ? "Close library" : "From library"}</Btn>
      </div>
    ) : null}>
      <p className="mb-4 text-sm text-m-muted">Only real application screenshots. Until some exist the site shows a clearly labelled placeholder.</p>
      {msg ? <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div> : null}

      {pickOpen ? (
        <div className="mb-5 grid grid-cols-3 gap-2 rounded-xl border border-m-line p-3 sm:grid-cols-6">
          {library.data?.items.map((m) => (
            <button key={m.id} type="button" onClick={() => attach.mutate(m.id)} className="overflow-hidden rounded-lg border border-m-line hover:border-[var(--m-accent)]" title={m.fileName}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl(m)} alt={m.alt ?? m.fileName} className="aspect-square w-full object-cover" />
            </button>
          ))}
          {library.data?.items.length === 0 ? <p className="col-span-full text-sm text-m-muted">The library is empty. Upload first.</p> : null}
        </div>
      ) : null}

      {shots.length === 0 ? <p className="text-sm text-m-muted">No screenshots yet.</p> : (
        <ul className="space-y-3">
          {shots.map((s, i) => (
            <li key={s.id} className="flex items-center gap-3 rounded-xl border border-m-line p-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl(s.media)} alt={s.media.alt ?? ""} className="h-16 w-24 shrink-0 rounded-md border border-m-line object-cover object-top" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-m-muted">{s.device}{s.media.width ? ` · ${s.media.width}×${s.media.height}` : ""}</p>
                <Input aria-label="Caption" defaultValue={s.caption ?? ""} disabled={!canWrite} placeholder="Caption (optional)" onBlur={(e) => { if (e.target.value !== (s.caption ?? "")) caption.mutate({ sid: s.id, text: e.target.value }); }} className="mt-1 !py-1.5" />
              </div>
              {canWrite ? (
                <div className="flex shrink-0 gap-1">
                  <Btn aria-label="Move up" disabled={i === 0 || shots[i - 1].device !== s.device} onClick={() => move(s.id, -1)} className="!px-2"><ArrowUp className="h-4 w-4" /></Btn>
                  <Btn aria-label="Move down" disabled={i === shots.length - 1 || shots[i + 1].device !== s.device} onClick={() => move(s.id, 1)} className="!px-2"><ArrowDown className="h-4 w-4" /></Btn>
                  <Btn aria-label="Remove screenshot" variant="danger" onClick={() => remove.mutate(s.id)} className="!px-2"><Trash2 className="h-4 w-4" /></Btn>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
