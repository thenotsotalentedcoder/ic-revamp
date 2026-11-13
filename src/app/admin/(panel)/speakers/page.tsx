"use client";

import Image from "next/image";
import { Badge, useApi } from "@/components/admin/kit";
import { ResourceManager, type FieldDef } from "@/components/admin/resource";

export default function SpeakersAdmin() {
  const { data: workshops } = useApi<{ id: string; title: string }[]>("/api/admin/workshops");
  const fields: FieldDef[] = [
    { name: "name", label: "Name", type: "text", required: true, placeholder: "Prof. Dr. Jane Doe" },
    { name: "title", label: "Title / position", type: "text", required: true, placeholder: "Professor" },
    { name: "institution", label: "Institution", type: "text", required: true },
    { name: "country", label: "Country", type: "text", required: true, help: "Used for the flag, e.g. United States, New Zealand, Pakistan." },
    { name: "type", label: "Type", type: "select", required: true, options: [{ value: "keynote", label: "Keynote" }, { value: "workshop", label: "Workshop" }] },
    { name: "order", label: "Order", type: "number", help: "Lower numbers appear first." },
    { name: "photo", label: "Photo", type: "image", help: "PNG, JPG or WebP, up to 5 MB. Portrait works best." },
    { name: "bio", label: "Biography", type: "textarea", required: true, rows: 7 },
    { name: "topics", label: "Research areas", type: "tags" },
    { name: "workshops", label: "Workshops", type: "checks", showIf: (v) => v.type === "workshop", options: (workshops ?? []).map((w) => ({ value: w.title, label: w.title })), help: "Only for workshop speakers." },
    { name: "website", label: "Website", type: "url", placeholder: "https://" },
    { name: "linkedin", label: "LinkedIn", type: "url", placeholder: "https://" },
    { name: "scholar", label: "Google Scholar", type: "url", placeholder: "https://" },
  ];
  return (
    <ResourceManager
      title="Speakers"
      intro="Keynote and workshop speakers shown on the home page and the speakers page."
      endpoint="/api/admin/speakers"
      singular="Speaker"
      wide
      fields={fields}
      defaults={{ type: "keynote", order: 0 }}
      filter={{ field: "type", label: "Type", options: [{ value: "keynote", label: "Keynote" }, { value: "workshop", label: "Workshop" }] }}
      searchKeys={["name", "institution", "country"]}
      columns={[
        {
          key: "name",
          label: "Speaker",
          render: (r) => (
            <span className="flex items-center gap-3">
              <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-surface-100">{r.photo ? <Image src={r.photo as string} alt="" fill unoptimized sizes="40px" className="object-cover" /> : null}</span>
              <span>
                <span className="block font-semibold">{String(r.name)}</span>
                <span className="block text-[13px] text-ink-600">{String(r.institution)}</span>
              </span>
            </span>
          ),
        },
        { key: "country", label: "Country" },
        { key: "type", label: "Type", render: (r) => <Badge tone={r.type === "keynote" ? "info" : "neutral"}>{r.type === "keynote" ? "Keynote" : "Workshop"}</Badge> },
        { key: "order", label: "Order", className: "tabular-nums" },
      ]}
    />
  );
}
