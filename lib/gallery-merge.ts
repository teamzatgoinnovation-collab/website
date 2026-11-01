/**
 * Pure helpers that turn the screenshots uploaded in /admin (as served by website-api) into gallery items.
 * No framework imports so it can be unit-tested with `node --test`.
 */
export type Device = "DESKTOP" | "MOBILE" | "TABLET";

export type GalleryItem = {
  src: string;
  device: Device;
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type ApiScreenshot = {
  device?: string;
  caption?: string | null;
  media?: { url?: string; alt?: string | null; width?: number | null; height?: number | null };
};

const DEVICES = new Set<string>(["DESKTOP", "MOBILE", "TABLET"]);

/** Accepts only image URLs on our own API origin; anything else in the response is dropped. */
export function fromApi(shots: unknown, publicBase: string): GalleryItem[] {
  const base = publicBase.replace(/\/$/, "");
  if (!base || !Array.isArray(shots)) return [];
  const out: GalleryItem[] = [];
  for (const s of shots as ApiScreenshot[]) {
    const rel = s?.media?.url;
    if (typeof rel !== "string" || !/^\/api\/v1\/media\/[0-9a-f-]{36}\/file$/.test(rel)) continue;
    if (typeof s.device !== "string" || !DEVICES.has(s.device)) continue;
    out.push({
      src: `${base}${rel}`,
      device: s.device as Device,
      caption: s.caption ?? undefined,
      alt: s.media?.alt ?? undefined,
      width: s.media?.width ?? undefined,
      height: s.media?.height ?? undefined,
    });
  }
  return out;
}

export function splitByDevice(items: GalleryItem[]): { desktop: string[]; mobile: string[]; tablet: string[] } {
  const pick = (d: Device) => items.filter((i) => i.device === d).map((i) => i.src);
  return { desktop: pick("DESKTOP"), mobile: pick("MOBILE"), tablet: pick("TABLET") };
}
