"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Card, PageTitle } from "@/components/admin/ui";
import { can, useMe } from "@/components/admin/use-me";
import { api, type Paged } from "@/lib/admin/api";

function Count({ label, path, perm, href }: { label: string; path: string; perm: string; href: string }) {
  const me = useMe();
  const q = useQuery({ queryKey: ["count", path], queryFn: () => api<Paged<unknown>>(path), enabled: can(me.data, perm) });
  if (!can(me.data, perm)) return null;
  return (
    <Link href={href} className="block">
      <Card className="transition-colors hover:border-[var(--m-accent)]">
        <p className="text-xs font-semibold uppercase tracking-wider text-m-muted">{label}</p>
        <p className="mt-2 font-display text-3xl font-semibold">{q.isPending ? "…" : (q.data?.total ?? "–")}</p>
      </Card>
    </Link>
  );
}

export default function OverviewPage() {
  const me = useMe();
  return (
    <>
      <PageTitle title={`Welcome, ${me.data?.name ?? ""}`} sub="What needs attention" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Count label="Products" path="/admin/products?pageSize=1" perm="products:read" href="/admin/products" />
        <Count label="New enquiries" path="/admin/leads/contacts?status=NEW&pageSize=1" perm="leads:read" href="/admin/leads" />
        <Count label="New demo requests" path="/admin/leads/demos?status=NEW&pageSize=1" perm="leads:read" href="/admin/leads" />
        <Count label="Media files" path="/admin/media?pageSize=1" perm="media:read" href="/admin/media" />
      </div>
    </>
  );
}
