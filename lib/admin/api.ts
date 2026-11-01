/**
 * Browser-side client for website-api. Auth lives entirely in httpOnly cookies set by the API, so no token
 * is ever readable by this code. A 401 triggers one silent refresh (rotating refresh token) and a retry.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
const V1 = `${API_URL}/api/v1`;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function readError(res: Response): Promise<ApiError> {
  let message = res.statusText || "Request failed";
  try {
    const body = (await res.json()) as { message?: string | string[] };
    message = Array.isArray(body.message) ? body.message.join(", ") : (body.message ?? message);
  } catch {
    /* non-JSON error body */
  }
  return new ApiError(res.status, message);
}

let refreshing: Promise<boolean> | null = null;
function refreshSession(): Promise<boolean> {
  refreshing ??= fetch(`${V1}/auth/refresh`, { method: "POST", credentials: "include" })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

async function raw(path: string, init: RequestInit, retry = true): Promise<Response> {
  const res = await fetch(`${V1}${path}`, { ...init, credentials: "include" });
  if (res.status === 401 && retry && !path.startsWith("/auth/")) {
    if (await refreshSession()) return raw(path, init, false);
  }
  return res;
}

export async function api<T = unknown>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await raw(path, {
    method: init.method ?? "GET",
    headers: init.body === undefined ? undefined : { "content-type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (!res.ok) throw await readError(res);
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export type MediaItem = { id: string; fileName: string; mimeType: string; sizeBytes: number; sha256: string; alt: string | null; width: number | null; height: number | null; url: string; createdAt: string };

/** Upload one image as the raw request body; metadata goes in encoded headers (see website-api MediaController). */
export async function uploadImage(file: File, alt = ""): Promise<{ media: MediaItem; created: boolean }> {
  const res = await raw("/admin/media", {
    method: "POST",
    headers: { "content-type": file.type || "application/octet-stream", "x-file-name": encodeURIComponent(file.name), "x-alt": encodeURIComponent(alt) },
    body: file,
  });
  if (!res.ok) throw await readError(res);
  return (await res.json()) as { media: MediaItem; created: boolean };
}

export const mediaUrl = (m: { url: string }) => `${API_URL}${m.url}`;

export type Me = { id: string; email: string; name: string; roleKey: string; permissions: string[] };
export type Paged<T> = { items: T[]; total: number; page: number; pageSize: number; pages: number };
