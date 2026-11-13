"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Alert, ApiError, Field, Modal, PageTitle, Spinner, api, btn, inputCls, useApi } from "./kit";

type Row = Record<string, unknown> & { id: string };
type Values = Record<string, unknown>;

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "url" | "email" | "select" | "checkbox" | "lines" | "tags" | "image" | "checks";
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  placeholder?: string;
  /** Span both columns of the form grid. */
  wide?: boolean;
  rows?: number;
  showIf?: (v: Values) => boolean;
};

export type Column = { key: string; label: string; render?: (row: Row) => ReactNode; className?: string };

/* ── field inputs ────────────────────────────────────────────────────── */

function TagsInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...value, ...parts.filter((p) => !value.includes(p))]);
    setDraft("");
  };
  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {value.map((t) => (
            <li key={t} className="inline-flex items-center gap-1 rounded-full bg-teal-50 py-0.5 pl-2.5 pr-1 text-[13px] text-teal-800">
              {t}
              <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))} className="grid size-5 place-items-center rounded-full hover:bg-teal-700/15">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          className={inputCls}
          value={draft}
          placeholder={placeholder ?? "Type and press Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
        />
        <button type="button" className={btn.secondary} onClick={add}>
          Add
        </button>
      </div>
    </div>
  );
}

function ImageInput({ current, onPick }: { current: string | null; onPick: (f: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-[2px] bg-surface-100">
        {(preview ?? current) && <Image src={(preview ?? current)!} alt="" fill unoptimized className="object-cover" sizes="80px" />}
      </div>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="block w-full text-[14px] file:mr-3 file:rounded-[2px] file:border file:border-navy-950/25 file:bg-white file:px-3 file:py-2 file:text-[14px] file:font-semibold"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          onPick(f);
          setPreview(f ? URL.createObjectURL(f) : null);
        }}
      />
    </div>
  );
}

function FieldInput({ f, value, set, row }: { f: FieldDef; value: unknown; set: (v: unknown) => void; row: Row | null }) {
  switch (f.type) {
    case "textarea":
      return <textarea className={inputCls} rows={f.rows ?? 4} value={(value as string) ?? ""} placeholder={f.placeholder} onChange={(e) => set(e.target.value)} />;
    case "lines":
      return (
        <textarea
          className={inputCls}
          rows={f.rows ?? 4}
          placeholder={f.placeholder ?? "One per line"}
          value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
          onChange={(e) => set(e.target.value.split("\n"))}
          onBlur={() => set((Array.isArray(value) ? (value as string[]) : []).map((s) => s.trim()).filter(Boolean))}
        />
      );
    case "tags":
      return <TagsInput value={Array.isArray(value) ? (value as string[]) : []} onChange={set} placeholder={f.placeholder} />;
    case "select":
      return (
        <select className={`${inputCls} h-10`} value={(value as string) ?? ""} onChange={(e) => set(e.target.value)}>
          {!f.required && <option value="">—</option>}
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "checkbox":
      return (
        <span className="flex h-10 items-center gap-2 text-[15px]">
          <input type="checkbox" className="size-4 accent-teal-700" checked={!!value} onChange={(e) => set(e.target.checked)} />
          {f.placeholder ?? "Yes"}
        </span>
      );
    case "checks": {
      const cur = Array.isArray(value) ? (value as string[]) : [];
      return f.options?.length ? (
        <ul className="max-h-44 space-y-1 overflow-y-auto rounded-[2px] border border-navy-950/25 p-2">
          {f.options.map((o) => (
            <li key={o.value}>
              <label className="flex items-center gap-2 text-[15px]">
                <input type="checkbox" className="size-4 accent-teal-700" checked={cur.includes(o.value)} onChange={(e) => set(e.target.checked ? [...cur, o.value] : cur.filter((x) => x !== o.value))} />
                {o.label}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[14px] text-ink-600">Nothing to choose from yet.</p>
      );
    }
    case "image":
      return <ImageInput current={(row?.[f.name] as string | null) ?? null} onPick={set} />;
    case "number":
      return <input type="number" className={inputCls} value={(value as number | string) ?? 0} onChange={(e) => set(e.target.value)} />;
    default:
      return <input type={f.type} className={inputCls} value={(value as string) ?? ""} placeholder={f.placeholder} onChange={(e) => set(e.target.value)} />;
  }
}

/* ── the manager ─────────────────────────────────────────────────────── */

export type ManagerProps = {
  title?: string;
  intro?: string;
  endpoint: string;
  singular: string;
  fields: FieldDef[];
  columns: Column[];
  defaults?: Values;
  /** Optional filter dropdown over one field. */
  filter?: { field: string; label: string; options: { value: string; label: string }[] };
  /** Rendered under a row when expanded (nested children). */
  expand?: (row: Row, reload: () => void) => ReactNode;
  expandLabel?: string;
  /** Embed inside another panel: no page title, tighter spacing. */
  nested?: boolean;
  /** Called with the saved list after any change (e.g. to refresh dependent option lists). */
  onChange?: () => void;
  wide?: boolean;
  /** Replace the id-keyed PUT/DELETE url (nested routes have two ids). */
  itemUrl?: (row: Row) => string;
  /** Fields hidden from the table but still searchable. */
  searchKeys?: string[];
};

export function ResourceManager(p: ManagerProps) {
  const { data, error, loading, reload } = useApi<Row[]>(p.endpoint);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const rows = useMemo(() => {
    let r = data ?? [];
    if (p.filter && filter) r = r.filter((x) => x[p.filter!.field] === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      const keys = p.searchKeys ?? p.columns.map((c) => c.key);
      r = r.filter((x) => keys.some((k) => String(x[k] ?? "").toLowerCase().includes(q)));
    }
    return r;
  }, [data, filter, query, p.filter, p.searchKeys, p.columns]);

  const afterChange = async (msg: string) => {
    setFlash(msg);
    await reload();
    p.onChange?.();
  };

  const remove = async (row: Row) => {
    const label = String(row.name ?? row.title ?? row.date ?? "this item");
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return;
    try {
      await api(p.itemUrl ? p.itemUrl(row) : `${p.endpoint}/${row.id}`, { method: "DELETE" });
      await afterChange(`${p.singular} deleted.`);
    } catch (e) {
      setFlash(null);
      window.alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const addBtn = (
    <button type="button" className={btn.primary} onClick={() => setEditing("new")}>
      + Add {p.singular.toLowerCase()}
    </button>
  );

  return (
    <section>
      {!p.nested && <PageTitle title={p.title ?? ""} intro={p.intro} actions={addBtn} />}
      <div className={`flex flex-wrap items-center gap-3 ${p.nested ? "mb-3 justify-between" : "mb-4"}`}>
        {(data?.length ?? 0) > 6 && <input className={`${inputCls} max-w-[260px]`} placeholder="Search…" aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />}
        {p.filter && (
          <select className={`${inputCls} h-10 max-w-[220px]`} aria-label={p.filter.label} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">{p.filter.label}: all</option>
            {p.filter.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
        {p.nested && addBtn}
      </div>
      {flash && (
        <div className="mb-3">
          <Alert kind="success">{flash}</Alert>
        </div>
      )}
      {error && <Alert>{error}</Alert>}
      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <p className="rounded-[2px] border border-dashed border-ink-400 px-4 py-8 text-center text-[15px] text-ink-600">{data?.length ? "Nothing matches." : `No ${p.singular.toLowerCase()}s yet.`}</p>
      ) : (
        <div className="overflow-x-auto rounded-[2px] border border-line bg-white">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <thead>
              <tr className="border-b border-line bg-surface-50 text-[13px] text-ink-600">
                {p.columns.map((c) => (
                  <th key={c.key} scope="col" className={`px-4 py-2.5 font-semibold ${c.className ?? ""}`}>
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="px-4 py-2.5 text-right font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <RowView key={r.id} r={r} p={p} open={open === r.id} toggle={() => setOpen(open === r.id ? null : r.id)} onEdit={() => setEditing(r)} onDelete={() => remove(r)} reload={reload} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FormModal
        open={editing !== null}
        row={editing === "new" ? null : editing}
        props={p}
        onClose={() => setEditing(null)}
        onSaved={async (msg) => {
          setEditing(null);
          await afterChange(msg);
        }}
      />
    </section>
  );
}

function RowView({ r, p, open, toggle, onEdit, onDelete, reload }: { r: Row; p: ManagerProps; open: boolean; toggle: () => void; onEdit: () => void; onDelete: () => void; reload: () => void }) {
  return (
    <>
      <tr className="border-b border-line last:border-0 align-top">
        {p.columns.map((c) => (
          <td key={c.key} className={`px-4 py-3 ${c.className ?? ""}`}>
            {c.render ? c.render(r) : String(r[c.key] ?? "—")}
          </td>
        ))}
        <td className="whitespace-nowrap px-4 py-3 text-right">
          {p.expand && (
            <button type="button" className={btn.ghost} aria-expanded={open} onClick={toggle}>
              {open ? "Hide" : p.expandLabel ?? "Details"}
            </button>
          )}
          <button type="button" className={btn.ghost} onClick={onEdit}>
            Edit
          </button>
          <button type="button" className={btn.ghostDanger} onClick={onDelete}>
            Delete
          </button>
        </td>
      </tr>
      {open && p.expand && (
        <tr className="border-b border-line bg-surface-50">
          <td colSpan={p.columns.length + 1} className="px-4 py-4 sm:px-6">
            {p.expand(r, reload)}
          </td>
        </tr>
      )}
    </>
  );
}

function initial(fields: FieldDef[], row: Row | null, defaults: Values = {}): Values {
  const v: Values = {};
  for (const f of fields) {
    if (f.type === "image") continue;
    const src = row ? row[f.name] : defaults[f.name];
    if (f.type === "tags" || f.type === "lines" || f.type === "checks") v[f.name] = Array.isArray(src) ? src : [];
    else if (f.type === "checkbox") v[f.name] = !!src;
    else if (f.type === "number") v[f.name] = src ?? 0;
    else v[f.name] = src ?? "";
  }
  return v;
}

function FormModal({ open, row, props: p, onClose, onSaved }: { open: boolean; row: Row | null; props: ManagerProps; onClose: () => void; onSaved: (msg: string) => void | Promise<void> }) {
  // Re-mount the form whenever a different row is opened, so state resets without effects.
  return (
    <Modal open={open} onClose={onClose} title={`${row ? "Edit" : "Add"} ${p.singular.toLowerCase()}`} wide={p.wide}>
      <Form key={row?.id ?? "new"} row={row} p={p} onClose={onClose} onSaved={onSaved} />
    </Modal>
  );
}

function Form({ row, p, onClose, onSaved }: { row: Row | null; p: ManagerProps; onClose: () => void; onSaved: (msg: string) => void | Promise<void> }) {
  const [values, setValues] = useState<Values>(() => initial(p.fields, row, p.defaults));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fieldErrs, setFieldErrs] = useState<Record<string, string>>({});

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setFieldErrs({});
    try {
      const body: Values = { ...values };
      // "lines" fields: drop blank lines on save.
      for (const f of p.fields) if (f.type === "lines") body[f.name] = (values[f.name] as string[]).map((s) => s.trim()).filter(Boolean);
      for (const f of p.fields) if (f.showIf && !f.showIf(values)) body[f.name] = f.type === "checks" || f.type === "tags" || f.type === "lines" ? [] : body[f.name];
      await api(row ? (p.itemUrl ? p.itemUrl(row) : `${p.endpoint}/${row.id}`) : p.endpoint, { method: row ? "PUT" : "POST", body });
      await onSaved(`${p.singular} ${row ? "updated" : "added"}.`);
    } catch (e2) {
      if (e2 instanceof ApiError) {
        setErr(e2.message);
        if (e2.errors) setFieldErrs(Object.fromEntries(e2.errors.map((x) => [x.field, x.message])));
      } else setErr("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {p.fields
          .filter((f) => !f.showIf || f.showIf(values))
          .map((f) => (
            <div key={f.name} className={f.wide || f.type === "textarea" || f.type === "lines" || f.type === "tags" || f.type === "checks" || f.type === "image" ? "sm:col-span-2" : ""}>
              <Field label={f.label} required={f.required} help={f.help} error={fieldErrs[f.name]}>
                <FieldInput f={f} value={values[f.name]} set={(v) => setValues((s) => ({ ...s, [f.name]: v }))} row={row} />
              </Field>
            </div>
          ))}
      </div>
      {err && <Alert>{err}</Alert>}
      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <button type="button" className={btn.secondary} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={btn.primary} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
