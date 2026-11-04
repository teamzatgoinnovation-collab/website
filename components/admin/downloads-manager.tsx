"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { Btn, Card, errMsg, Field, Input, Notice, Select } from "@/components/admin/ui";
import { api, uploadDownload, type DownloadItem } from "@/lib/admin/api";

const ACCEPT: Record<string, string> = { ANDROID: ".apk,.zip", WINDOWS: ".exe,.msi,.zip", MACOS: ".dmg,.zip", LINUX: ".zip" };
const LABEL: Record<string, string> = { ANDROID: "Android (.apk)", WINDOWS: "Windows (.exe, .msi)", MACOS: "macOS (.dmg)", LINUX: "Linux (.zip)" };

const size = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

/** Platforms the product runs on (saved on the product) that can carry an installer. */
export function DownloadsManager({ productId, platforms, canWrite }: { productId: string; platforms: string[]; canWrite: boolean }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const usable = platforms.filter((p) => p in ACCEPT);
  const [platform, setPlatform] = useState("");
  const [version, setVersion] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const chosen = usable.includes(platform) ? platform : (usable[0] ?? "");

  const list = useQuery({ queryKey: ["downloads", productId], queryFn: () => api<DownloadItem[]>(`/admin/products/${productId}/downloads`) });
  const refresh = () => qc.invalidateQueries({ queryKey: ["downloads", productId] });

  const upload = useMutation({
    mutationFn: (file: File) => { setProgress(0); return uploadDownload(productId, file, { platform: chosen, version: version.trim() }, setProgress); },
    onSuccess: () => { setMsg({ kind: "ok", text: "File uploaded. It is now downloadable on the product page." }); void refresh(); },
    onError: (e) => setMsg({ kind: "error", text: errMsg(e) }),
    onSettled: () => setProgress(null),
  });
  const toggle = useMutation({
    mutationFn: (v: { id: string; enabled: boolean }) => api(`/admin/products/${productId}/downloads/${v.id}`, { method: "PATCH", body: { enabled: v.enabled } }),
    onSuccess: () => void refresh(),
    onError: (e) => setMsg({ kind: "error", text: errMsg(e) }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/products/${productId}/downloads/${id}`, { method: "DELETE" }),
    onSuccess: () => void refresh(),
    onError: (e) => setMsg({ kind: "error", text: errMsg(e) }),
  });

  const pick = () => {
    if (!version.trim()) { setMsg({ kind: "error", text: "Enter the version first, for example 1.0.0." }); return; }
    fileRef.current?.click();
  };

  return (
    <Card title="Downloads">
      <p className="mb-4 text-sm text-m-muted">Attach the app file for each platform. Visitors see a Download button on the product page. Files up to 100 MB: .apk, .exe, .msi, .dmg or .zip. The newest enabled version per platform is shown.</p>
      {msg ? <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div> : null}

      {canWrite ? (
        usable.length === 0 ? (
          <p className="mb-4 text-sm text-m-muted">Tick Android, Windows, macOS or Linux under <strong>Platforms</strong> above and save the product first.</p>
        ) : (
          <div className="mb-5 grid items-end gap-3 sm:grid-cols-[1fr_9rem_auto]">
            <Field label="Platform"><Select value={chosen} onChange={(e) => setPlatform(e.target.value)}>{usable.map((p) => <option key={p} value={p}>{LABEL[p]}</option>)}</Select></Field>
            <Field label="Version"><Input placeholder="1.0.0" value={version} maxLength={30} onChange={(e) => setVersion(e.target.value)} /></Field>
            <div>
              <input ref={fileRef} type="file" accept={ACCEPT[chosen]} hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) { setMsg(null); upload.mutate(f); } e.target.value = ""; }} />
              <Btn variant="primary" disabled={upload.isPending} onClick={pick}><Upload className="h-4 w-4" aria-hidden />{upload.isPending ? "Uploading…" : "Choose file"}</Btn>
            </div>
            {progress !== null ? (
              <div className="sm:col-span-3" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Upload progress">
                <div className="h-2 overflow-hidden rounded-full bg-[var(--m-surface)]"><div className="h-full bg-[var(--m-accent)] transition-[width]" style={{ width: `${Math.round(progress * 100)}%` }} /></div>
                <p className="mt-1 text-xs text-m-muted">{Math.round(progress * 100)}%{progress >= 1 ? " – processing…" : ""}</p>
              </div>
            ) : null}
          </div>
        )
      ) : null}

      {list.isError ? <Notice kind="error">{errMsg(list.error)}</Notice> : null}
      {list.data?.length === 0 ? <p className="text-sm text-m-muted">No files attached yet.</p> : (
        <ul className="space-y-3">
          {list.data?.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-m-line p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{d.fileName}</p>
                <p className="text-xs text-m-muted">{LABEL[d.platform] ?? d.platform} · v{d.version} · {size(d.sizeBytes)} · {d.downloadCount} download{d.downloadCount === 1 ? "" : "s"}{d.sha256 ? ` · sha256 ${d.sha256.slice(0, 12)}…` : ""}</p>
              </div>
              {canWrite ? (
                <div className="flex shrink-0 items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={d.enabled} disabled={toggle.isPending} onChange={(e) => toggle.mutate({ id: d.id, enabled: e.target.checked })} />Visible</label>
                  <Btn aria-label={`Delete ${d.fileName}`} variant="danger" disabled={remove.isPending} onClick={() => { if (window.confirm(`Delete ${d.fileName}? The file is removed from the server and the download link stops working.`)) remove.mutate(d.id); }} className="!px-2"><Trash2 className="h-4 w-4" /></Btn>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
