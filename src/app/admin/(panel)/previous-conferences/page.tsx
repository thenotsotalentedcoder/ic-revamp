"use client";

import { useState, type FormEvent } from "react";
import { Alert, Field, PageTitle, Spinner, api, btn, inputCls, useApi } from "@/components/admin/kit";

type Pub = { year: string; journalUrl: string | null; isbn: string | null; issn: string | null };
const EDITIONS = [
  { year: "2024", label: "iCONICS’24 · 4th edition" },
  { year: "2022", label: "iCONICS’22 · 3rd edition" },
  { year: "2018", label: "iCONICS’18 · 2nd edition" },
  { year: "2016", label: "iCONICS’16 · 1st edition" },
];

function Card({ year, label, pub, onSaved }: { year: string; label: string; pub?: Pub; onSaved: () => void }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setMsg(null);
    try {
      await api(`/api/admin/previous-conferences/${year}`, { method: "PUT", body: { journalUrl: fd.get("journalUrl"), isbn: fd.get("isbn"), issn: fd.get("issn") } });
      setMsg({ ok: true, text: "Saved." });
      onSaved();
    } catch (e2) {
      setMsg({ ok: false, text: e2 instanceof Error ? e2.message : "Could not save" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-3 rounded-[2px] border border-line bg-white p-5">
      <h2 className="text-[18px]">{label}</h2>
      <Field label="Journal / proceedings URL">
        <input name="journalUrl" defaultValue={pub?.journalUrl ?? ""} className={inputCls} placeholder="https://" />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="ISBN">
          <input name="isbn" defaultValue={pub?.isbn ?? ""} className={inputCls} />
        </Field>
        <Field label="ISSN">
          <input name="issn" defaultValue={pub?.issn ?? ""} className={inputCls} />
        </Field>
      </div>
      {msg && <Alert kind={msg.ok ? "success" : "error"}>{msg.text}</Alert>}
      <button type="submit" disabled={busy} className={btn.primary}>
        {busy ? "Saving…" : "Save"}
      </button>
    </form>
  );
}

export default function PreviousConferencesAdmin() {
  const { data, loading, error, reload } = useApi<Pub[]>("/api/admin/previous-conferences");
  return (
    <div className="max-w-[900px]">
      <PageTitle title="Previous conferences" intro="Proceedings link, ISBN and ISSN for each past edition. Shown on the Previous conferences page." />
      {error && <Alert>{error}</Alert>}
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {EDITIONS.map((e) => (
            <Card key={e.year + (data?.find((d) => d.year === e.year)?.journalUrl ?? "")} year={e.year} label={e.label} pub={data?.find((d) => d.year === e.year)} onSaved={reload} />
          ))}
        </div>
      )}
    </div>
  );
}
