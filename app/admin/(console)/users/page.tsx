"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { Btn, Card, errMsg, Field, Input, Notice, PageTitle, Select } from "@/components/admin/ui";
import { can, useMe } from "@/components/admin/use-me";
import { api, type Paged } from "@/lib/admin/api";

type User = { id: string; email: string; name: string; status: "ACTIVE" | "DISABLED"; lastLoginAt: string | null; role: { key: string; name: string } };
type Role = { id: string; key: string; name: string };

export default function UsersPage() {
  const me = useMe();
  const qc = useQueryClient();
  const canWrite = can(me.data, "users:write");
  const users = useQuery({ queryKey: ["users"], queryFn: () => api<Paged<User>>("/admin/users?pageSize=100") });
  const roles = useQuery({ queryKey: ["roles"], queryFn: () => api<Role[]>("/admin/roles"), enabled: can(me.data, "roles:read") });
  const [form, setForm] = useState({ email: "", name: "", password: "", roleKey: "support_staff" });
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["users"] });
  const fail = (e: unknown) => setMsg({ kind: "error", text: errMsg(e) });

  const create = useMutation({
    mutationFn: () => api("/admin/users", { method: "POST", body: form }),
    onSuccess: () => { setMsg({ kind: "ok", text: "User created." }); setForm({ email: "", name: "", password: "", roleKey: "support_staff" }); void refresh(); },
    onError: fail,
  });
  const patch = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { roleKey?: string; status?: string } }) => api(`/admin/users/${id}`, { method: "PATCH", body }),
    onSuccess: () => { setMsg(null); void refresh(); },
    onError: fail,
  });
  const setPassword = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => api(`/admin/users/${id}/password`, { method: "PUT", body: { password } }),
    onSuccess: () => setMsg({ kind: "ok", text: "Password changed and the user's sessions were ended." }),
    onError: fail,
  });
  const roleList = roles.data ?? [{ id: "x", key: "support_staff", name: "Support Staff" }];
  const submit = (e: FormEvent) => { e.preventDefault(); create.mutate(); };

  return (
    <>
      <PageTitle title="Users" sub="Admin accounts. Disabling a user or changing a role ends their sessions immediately." />
      {msg ? <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div> : null}
      {canWrite ? (
        <Card title="Add user" className="mb-6">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><Input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Email"><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Temporary password" hint="At least 8 characters with upper-case, lower-case and a digit."><Input required type="password" autoComplete="new-password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
            <Field label="Role"><Select value={form.roleKey} onChange={(e) => setForm({ ...form, roleKey: e.target.value })}>{roleList.map((r) => <option key={r.key} value={r.key}>{r.name}</option>)}</Select></Field>
            <div className="sm:col-span-2"><Btn type="submit" variant="primary" disabled={create.isPending}>{create.isPending ? "Creating…" : "Create user"}</Btn></div>
          </form>
        </Card>
      ) : null}
      {users.isError ? <Notice kind="error">{errMsg(users.error)}</Notice> : null}
      <div className="overflow-x-auto rounded-2xl border border-m-line">
        <table className="w-full text-sm">
          <thead className="bg-[var(--m-surface)] text-left text-xs uppercase tracking-wider text-m-muted"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Last sign-in</th><th className="px-4 py-3" /></tr></thead>
          <tbody>
            {users.data?.items.map((u) => (
              <tr key={u.id} className="border-t border-m-line">
                <td className="px-4 py-3"><p className="font-medium">{u.name}</p><p className="text-xs text-m-muted">{u.email}</p></td>
                <td className="px-4 py-3">
                  <Select aria-label={`Role for ${u.name}`} disabled={!canWrite || u.id === me.data?.id} value={u.role.key} onChange={(e) => patch.mutate({ id: u.id, body: { roleKey: e.target.value } })} className="!w-auto !py-1.5">
                    {[...new Map([...roleList.map((r) => [r.key, r.name] as const), [u.role.key, u.role.name] as const])].map(([k, n]) => <option key={k} value={k}>{n}</option>)}
                  </Select>
                </td>
                <td className="px-4 py-3">{u.status}</td>
                <td className="px-4 py-3 text-m-muted">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-end">
                  {canWrite && u.id !== me.data?.id ? (
                    <div className="flex justify-end gap-2">
                      <Btn onClick={() => { const pw = window.prompt(`New password for ${u.email} (8+ chars, mixed case, a digit):`); if (pw) setPassword.mutate({ id: u.id, password: pw }); }}>Set password</Btn>
                      <Btn variant={u.status === "ACTIVE" ? "danger" : "ghost"} onClick={() => patch.mutate({ id: u.id, body: { status: u.status === "ACTIVE" ? "DISABLED" : "ACTIVE" } })}>{u.status === "ACTIVE" ? "Disable" : "Enable"}</Btn>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
