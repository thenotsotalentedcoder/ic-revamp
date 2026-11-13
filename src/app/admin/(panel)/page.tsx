"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, PageTitle, Spinner, Switch, api, useApi } from "@/components/admin/kit";

type Stats = Record<string, number | null>;
const n = (v: number | null | undefined) => (v == null ? "—" : v.toLocaleString());

export default function Dashboard() {
  const stats = useApi<Stats>("/api/admin/stats");
  const settings = useApi<Record<string, string>>("/api/admin/settings");
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const toggle = async (key: string, on: boolean) => {
    setBusy(key);
    setErr(null);
    try {
      await api("/api/admin/settings", { method: "PUT", body: { key, value: String(on) } });
      await settings.reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(null);
    }
  };

  const s = stats.data;
  const tiles: [string, number | null | undefined, string][] = [
    ["Speakers", s?.speakers, "/admin/speakers"],
    ["Workshops", s?.workshops, "/admin/workshops"],
    ["Important dates", s?.dates, "/admin/dates"],
    ["Tracks", s?.tracks, "/admin/tracks"],
    ["Committee members", s?.committee, "/admin/committee"],
    ["Reviewers", s?.reviewers, "/admin/reviewers"],
  ];

  return (
    <div className="max-w-[1000px]">
      <PageTitle title="Dashboard" intro="December 23–24, 2026 · NED University of Engineering & Technology, Karachi" />
      {stats.error && <Alert>{stats.error}</Alert>}
      {stats.loading ? (
        <Spinner />
      ) : (
        <>
          <section aria-labelledby="content-h" className="mb-8">
            <h2 id="content-h" className="mb-3 text-[18px]">
              Content
            </h2>
            <div className="grid gap-px overflow-hidden rounded-[2px] border border-line bg-line sm:grid-cols-3">
              {tiles.map(([k, v, href]) => (
                <Link key={k} href={href} className="block bg-white p-4 hover:bg-teal-50">
                  <span className="block text-[13px] text-ink-600">{k}</span>
                  <span className="block font-display text-[26px] font-semibold leading-tight tabular-nums">{n(v)}</span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <section aria-labelledby="vis-h">
        <h2 id="vis-h" className="mb-1 text-[18px]">
          Site visibility
        </h2>
        <p className="mb-3 text-[15px] text-ink-600">Turn a section off to show “Coming soon” on the public site and hide it from navigation.</p>
        {err && <Alert>{err}</Alert>}
        {settings.loading ? (
          <Spinner />
        ) : (
          <ul className="divide-y divide-line rounded-[2px] border border-line bg-white">
            {[
              ["speakers_active", "Speakers page"],
              ["schedule_active", "Schedule page"],
            ].map(([key, label]) => (
              <li key={key} className="flex items-center justify-between gap-4 px-4 py-3">
                <span>
                  <span className="block font-semibold">{label}</span>
                  <span className="block text-[14px] text-ink-600">{settings.data?.[key] === "false" ? "Hidden: visitors see “Coming soon”." : "Visible to visitors."}</span>
                </span>
                <Switch label={label} checked={settings.data?.[key] !== "false"} disabled={busy === key} onChange={(v) => toggle(key, v)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
