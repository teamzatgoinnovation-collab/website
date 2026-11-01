import { timingSafeEqual } from "node:crypto";

import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { CATALOG_TAG } from "@/lib/catalog";

export const runtime = "nodejs";

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Called by the API (server to server) after an admin edits the catalog, so public pages refresh in seconds. */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  const given = req.headers.get("x-revalidate-secret") ?? "";
  if (!secret || !same(given, secret)) return NextResponse.json({ ok: false }, { status: 401 });
  revalidateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
