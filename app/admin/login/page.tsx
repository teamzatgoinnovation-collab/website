"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Btn, errMsg, Field, Input, Notice } from "@/components/admin/ui";
import { api } from "@/lib/admin/api";

export default function LoginPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/auth/login", { method: "POST", body: { email, password } });
      await qc.invalidateQueries({ queryKey: ["me"] });
      router.replace("/admin");
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/branding/zg-mark.svg" alt="ZatGo" className="mb-6 h-9 w-auto self-start" />
      <h1 className="font-display text-2xl font-semibold">Sign in</h1>
      <p className="mb-6 mt-1 text-sm text-m-muted">ZatGo website administration</p>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email"><Input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Password"><Input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        {error ? <Notice kind="error">{error}</Notice> : null}
        <Btn type="submit" variant="primary" disabled={busy} className="w-full justify-center">{busy ? "Signing in…" : "Sign in"}</Btn>
      </form>
    </main>
  );
}
