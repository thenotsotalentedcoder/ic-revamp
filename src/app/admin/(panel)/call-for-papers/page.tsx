"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Alert, Field, PageTitle, Spinner, api, btn, inputCls, useApi } from "@/components/admin/kit";

type Settings = Record<string, string>;

export default function CfpAdmin() {
  const { data, loading, error, reload } = useApi<Settings>("/api/admin/settings");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const uploadFiles = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    for (const k of ["poster", "latexTemplate"]) if (!(fd.get(k) as File)?.size) fd.delete(k);
    if (![...fd.keys()].length) return setMsg({ ok: false, text: "Choose a file first." });
    setBusy(true);
    setMsg(null);
    try {
      await api("/api/admin/cfp-assets", { method: "PUT", body: fd });
      form.reset();
      setMsg({ ok: true, text: "Files uploaded." });
      await reload();
    } catch (e2) {
      setMsg({ ok: false, text: e2 instanceof Error ? e2.message : "Upload failed" });
    } finally {
      setBusy(false);
    }
  };

  const saveLink = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("link") ?? "");
    setBusy(true);
    setMsg(null);
    try {
      await api("/api/admin/settings", { method: "PUT", body: { key: "cfp_overleaf_template_url", value } });
      setMsg({ ok: true, text: "Link saved." });
      await reload();
    } catch (e2) {
      setMsg({ ok: false, text: e2 instanceof Error ? e2.message : "Could not save" });
    } finally {
      setBusy(false);
    }
  };

  const poster = data?.cfp_poster_url;
  const latex = data?.cfp_latex_template_url;
  const isUrl = (v?: string) => !!v && /^https?:\/\//.test(v);

  return (
    <div className="max-w-[760px]">
      <PageTitle title="Call for papers" intro="The poster and templates linked from the Call for papers page." />
      {error && <Alert>{error}</Alert>}
      {msg && (
        <div className="mb-4">
          <Alert kind={msg.ok ? "success" : "error"}>{msg.text}</Alert>
        </div>
      )}
      {loading ? (
        <Spinner />
      ) : (
        <div className="space-y-6">
          <form onSubmit={uploadFiles} className="space-y-4 rounded-[2px] border border-line bg-white p-5">
            <h2 className="text-[18px]">Files</h2>
            <Field label="Poster image" help="PNG, JPG or WebP, up to 5 MB.">
              <input name="poster" type="file" accept="image/png,image/jpeg,image/webp" className="block w-full text-[14px]" />
            </Field>
            {isUrl(poster) ? (
              <div className="flex items-center gap-3">
                <span className="relative h-20 w-14 overflow-hidden bg-surface-100">
                  <Image src={poster!} alt="" fill unoptimized sizes="56px" className="object-cover" />
                </span>
                <a href={poster} target="_blank" rel="noreferrer" className="text-[14px] font-semibold text-teal-700 underline">
                  Current poster
                </a>
              </div>
            ) : (
              <p className="text-[14px] text-ink-600">{poster ? "The saved poster is from the retired server. Upload it again." : "No poster uploaded."}</p>
            )}
            <Field label="LaTeX template (.zip)" help="Up to 50 MB.">
              <input name="latexTemplate" type="file" accept=".zip,application/zip" className="block w-full text-[14px]" />
            </Field>
            <p className="text-[14px] text-ink-600">
              {isUrl(latex) ? (
                <a href={latex} target="_blank" rel="noreferrer" className="font-semibold text-teal-700 underline">
                  Current template
                </a>
              ) : latex ? (
                "The saved template is from the retired server. Upload it again."
              ) : (
                "No template uploaded."
              )}
            </p>
            <button type="submit" disabled={busy} className={btn.primary}>
              {busy ? "Uploading…" : "Upload"}
            </button>
          </form>

          <form onSubmit={saveLink} className="space-y-4 rounded-[2px] border border-line bg-white p-5">
            <h2 className="text-[18px]">Overleaf template link</h2>
            <Field label="URL">
              <input name="link" type="url" defaultValue={data?.cfp_overleaf_template_url ?? ""} className={inputCls} placeholder="https://www.overleaf.com/…" />
            </Field>
            <button type="submit" disabled={busy} className={btn.primary}>
              Save link
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
