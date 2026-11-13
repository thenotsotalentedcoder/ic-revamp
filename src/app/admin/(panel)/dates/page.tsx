"use client";

import { ResourceManager } from "@/components/admin/resource";

export default function DatesAdmin() {
  return (
    <ResourceManager
      title="Important dates"
      intro="The timeline on the home page and the call for papers. Dates are free text, e.g. “September 10, 2026” or “December 23-24, 2026”."
      endpoint="/api/admin/dates"
      singular="Date"
      fields={[
        { name: "title", label: "Title", type: "text", required: true, placeholder: "Full paper submission" },
        { name: "date", label: "Date", type: "text", required: true, placeholder: "September 10, 2026" },
        { name: "order", label: "Order", type: "number", help: "Lower numbers appear first." },
        { name: "description", label: "Description", type: "textarea", rows: 3 },
      ]}
      defaults={{ order: 0 }}
      columns={[
        { key: "order", label: "#", className: "w-12 tabular-nums" },
        { key: "title", label: "Title" },
        { key: "date", label: "Date" },
        { key: "description", label: "Description", render: (r) => <span className="text-ink-600">{String(r.description || "—")}</span> },
      ]}
    />
  );
}
