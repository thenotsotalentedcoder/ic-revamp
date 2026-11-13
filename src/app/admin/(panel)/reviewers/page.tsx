"use client";

import Image from "next/image";
import { Badge } from "@/components/admin/kit";
import { ResourceManager } from "@/components/admin/resource";

export default function ReviewersAdmin() {
  return (
    <ResourceManager
      title="Reviewers"
      intro="Programme committee reviewers shown on the Reviewers page. Emails are never shown publicly."
      endpoint="/api/admin/reviewers"
      singular="Reviewer"
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "from", label: "University / organisation", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "order", label: "Order", type: "number" },
        { name: "isNed", label: "NED reviewer", type: "checkbox", placeholder: "From NED University" },
        { name: "photo", label: "Photo", type: "image", help: "PNG, JPG or WebP, up to 5 MB." },
      ]}
      defaults={{ order: 0, isNed: false }}
      searchKeys={["name", "from", "email"]}
      columns={[
        {
          key: "name",
          label: "Reviewer",
          render: (r) => (
            <span className="flex items-center gap-3">
              <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-surface-100">{r.photo ? <Image src={r.photo as string} alt="" fill unoptimized sizes="36px" className="object-cover" /> : null}</span>
              <span className="font-semibold">{String(r.name)}</span>
            </span>
          ),
        },
        { key: "from", label: "From", render: (r) => <span className="text-ink-600">{String(r.from || "—")}</span> },
        { key: "isNed", label: "", render: (r) => (r.isNed ? <Badge tone="info">NED</Badge> : null) },
        { key: "order", label: "Order", className: "tabular-nums" },
      ]}
    />
  );
}
