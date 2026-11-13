"use client";

import { useState, type FormEvent } from "react";
import { Alert, Field, api, btn, inputCls } from "@/components/admin/kit";

export function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setErr(null);
    try {
      await api("/api/admin/login", { method: "POST", body: { email: fd.get("email"), password: fd.get("password") } });
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/admin"; // full load so the new session cookie is used everywhere
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Sign in failed");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email">
        <input name="email" type="email" autoComplete="username" required autoFocus className={inputCls} />
      </Field>
      <Field label="Password">
        <input name="password" type="password" autoComplete="current-password" required className={inputCls} />
      </Field>
      {err && <Alert>{err}</Alert>}
      <button type="submit" disabled={busy} className={`${btn.primary} w-full`}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
