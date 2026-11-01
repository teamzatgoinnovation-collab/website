"use client";

import { useQueryClient } from "@tanstack/react-query";
import { BarChart3, ClipboardList, FileText, Image as ImageIcon, LogOut, Package, Users, Inbox } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { Btn } from "@/components/admin/ui";
import { can, isUnauthorized, useMe } from "@/components/admin/use-me";
import { api } from "@/lib/admin/api";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin", label: "Overview", icon: BarChart3, perm: null },
  { href: "/admin/products", label: "Products", icon: Package, perm: "products:read" },
  { href: "/admin/content/home", label: "Content", icon: FileText, perm: "content:read" },
  { href: "/admin/media", label: "Media", icon: ImageIcon, perm: "media:read" },
  { href: "/admin/leads", label: "Leads", icon: Inbox, perm: "leads:read" },
  { href: "/admin/users", label: "Users", icon: Users, perm: "users:read" },
  { href: "/admin/audit", label: "Audit log", icon: ClipboardList, perm: "audit:read" },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const qc = useQueryClient();
  const me = useMe();

  useEffect(() => {
    if (me.isError && isUnauthorized(me.error)) router.replace("/admin/login");
  }, [me.isError, me.error, router]);

  if (me.isPending || (me.isError && isUnauthorized(me.error))) {
    return <p className="p-10 text-sm text-m-muted">Checking your session…</p>;
  }
  if (me.isError) return <p className="p-10 text-sm text-red-600">Could not reach the API. Check that it is running.</p>;

  const user = me.data;
  const logout = async () => {
    await api("/auth/logout", { method: "POST" }).catch(() => undefined);
    qc.clear();
    router.replace("/admin/login");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-m-line bg-[var(--m-surface)] p-4 lg:border-b-0 lg:border-e">
        <div className="mb-5 flex items-center gap-2.5 px-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/branding/zg-mark.svg" alt="" className="h-6 w-auto" />
          <span className="font-display font-semibold">Admin</span>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
          {NAV.filter((n) => !n.perm || can(user, n.perm)).map((n) => {
            const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href.startsWith("/admin/content") ? "/admin/content" : n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={cn("flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium", active ? "bg-[var(--m-accent)] text-[var(--m-accent-foreground)]" : "text-m-muted hover:bg-[var(--m-surface-elevated)] hover:text-[var(--m-ink)]")}
              >
                <n.icon className="h-4 w-4" aria-hidden />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 border-t border-m-line px-2 pt-4 text-xs text-m-muted lg:mt-auto">
          <p className="font-semibold text-[var(--m-ink)]">{user.name}</p>
          <p className="truncate">{user.email}</p>
          <p className="mb-3 mt-0.5 uppercase tracking-wider">{user.roleKey.replace("_", " ")}</p>
          <Btn onClick={logout}><LogOut className="h-4 w-4" aria-hidden />Sign out</Btn>
        </div>
      </aside>
      <main className="min-w-0 p-5 sm:p-8">{children}</main>
    </div>
  );
}
