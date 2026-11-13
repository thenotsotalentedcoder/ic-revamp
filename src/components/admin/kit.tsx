"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

/* ── API helper ──────────────────────────────────────────────────────── */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: { field: string; message: string }[],
  ) {
    super(message);
  }
}

/** Turn a plain object into FormData: files as-is, arrays as JSON strings, booleans as "true"/"false". */
export function toFormData(values: Record<string, unknown>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) {
    if (v == null) continue;
    if (v instanceof File) fd.append(k, v);
    else if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
    else fd.append(k, String(v));
  }
  return fd;
}

export async function api<T = unknown>(url: string, opts: { method?: string; body?: Record<string, unknown> | FormData } = {}): Promise<T> {
  const { method = "GET", body } = opts;
  const hasFile = body && !(body instanceof FormData) && Object.values(body).some((v) => v instanceof File);
  const init: RequestInit = { method, credentials: "same-origin" };
  if (body instanceof FormData) init.body = body;
  else if (hasFile) init.body = toFormData(body!);
  else if (body) {
    init.body = JSON.stringify(body);
    init.headers = { "Content-Type": "application/json" };
  }
  const res = await fetch(url, init);
  let json: { success?: boolean; data?: T; message?: string; errors?: { field: string; message: string }[] } = {};
  try {
    json = await res.json();
  } catch {
    /* non-JSON */
  }
  if (res.status === 401 && !url.endsWith("/login")) {
    // Full reload on purpose: drops all client state tied to the old session.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/admin/login";
    throw new ApiError("Session expired", 401);
  }
  if (!res.ok || json.success === false) throw new ApiError(json.message ?? `Request failed (${res.status})`, res.status, json.errors);
  return json.data as T;
}

/** Load a list/object from the admin API with loading + error state and a reload function. */
export function useApi<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!url);
  const reload = useCallback(async () => {
    if (!url) return;
    try {
      setError(null);
      setData(await api<T>(url));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [url]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);
  return { data, error, loading, reload, setData };
}

/* ── Primitives ──────────────────────────────────────────────────────── */

export const inputCls =
  "w-full rounded-[2px] border border-navy-950/25 bg-white px-3 py-2 text-[15px] text-navy-950 placeholder:text-ink-400 focus:border-teal-700 disabled:bg-surface-100";

const BTN = "inline-flex h-10 items-center justify-center gap-2 rounded-[2px] px-4 text-[15px] font-semibold transition-colors duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50";
export const btn = {
  primary: `${BTN} bg-navy-950 text-white hover:bg-navy-800`,
  secondary: `${BTN} border border-navy-950/25 bg-white text-navy-950 hover:border-navy-950`,
  danger: `${BTN} border border-danger/40 bg-white text-danger hover:border-danger hover:bg-danger/5`,
  ghost: "inline-flex h-8 items-center rounded-[2px] px-2 text-[14px] font-semibold text-teal-700 hover:bg-teal-50 disabled:opacity-50",
  ghostDanger: "inline-flex h-8 items-center rounded-[2px] px-2 text-[14px] font-semibold text-danger hover:bg-danger/5 disabled:opacity-50",
};

export function Alert({ kind = "error", children }: { kind?: "error" | "success"; children: ReactNode }) {
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`rounded-[2px] border px-3 py-2 text-[14px] ${kind === "error" ? "border-danger/30 bg-danger/5 text-danger" : "border-success/30 bg-success/5 text-success"}`}>
      {children}
    </p>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "bad" | "info" }) {
  const tones = { neutral: "bg-surface-100 text-ink-600", good: "bg-success/10 text-success", warn: "bg-amber-100 text-amber-800", bad: "bg-danger/10 text-danger", info: "bg-teal-50 text-teal-800" };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-semibold ${tones[tone]}`}>{children}</span>;
}

export function PageTitle({ title, intro, actions }: { title: string; intro?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] leading-tight">{title}</h1>
        {intro && <p className="mt-1 max-w-[640px] text-[15px] text-ink-600">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return <p className="py-10 text-center text-[15px] text-ink-600">{label}</p>;
}

export function Modal({ title, open, onClose, children, wide = false }: { title: string; open: boolean; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-labelledby={titleId}
      className={`m-auto max-h-[calc(100dvh-32px)] overflow-y-auto rounded-[2px] bg-white p-0 text-navy-950 shadow-[0_2px_4px_rgba(11,27,51,0.08),0_32px_80px_rgba(11,27,51,0.28)] backdrop:bg-navy-950/50`}
      style={{ width: `min(${wide ? 820 : 640}px, calc(100vw - 24px))` }}
    >
      {open && (
        <div className="p-5 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-[22px] leading-tight">
              {title}
            </h2>
            <button type="button" onClick={onClose} aria-label="Close" className="grid size-9 shrink-0 place-items-center rounded-[2px] hover:bg-surface-100">
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

export function Field({ label, help, error, children, required }: { label: string; help?: string; error?: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[14px] font-semibold">
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      {children}
      {help && <span className="mt-1 block text-[13px] text-ink-600">{help}</span>}
      {error && <span className="mt-1 block text-[13px] font-medium text-danger">{error}</span>}
    </label>
  );
}

export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 disabled:opacity-50 ${checked ? "bg-teal-700" : "bg-ink-400"}`}
    >
      <span className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform duration-150 ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

export function formatDate(v: unknown) {
  if (!v) return "—";
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}
