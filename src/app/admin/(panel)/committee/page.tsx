"use client";

import { Badge } from "@/components/admin/kit";
import { ResourceManager } from "@/components/admin/resource";

// Keep in sync with COMMITTEES in lib/server/schemas.ts (the server accepts any name; this list just guides the form).
const COMMITTEES = [
  "Organizing",
  "IEEE Coordination",
  "Publications",
  "Technical Program",
  "Finance",
  "Website & Socials",
  "Grants & Sponsorship",
  "Travel, Accommodation & Protocol",
  "Publicity",
  "Shield & Certificates",
  "Registration",
  "Reception",
  "Catering",
  "IT Support",
];

export default function CommitteeAdmin() {
  return (
    <ResourceManager
      title="Committee"
      intro="Organising committee members, grouped by committee on the public Committee page."
      endpoint="/api/admin/committee"
      singular="Member"
      fields={[
        { name: "committeeName", label: "Committee", type: "select", required: true, options: COMMITTEES.map((c) => ({ value: c, label: c })) },
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text", required: true, placeholder: "Chair, Member, Patron…" },
        { name: "institution", label: "Institution", type: "text" },
        { name: "email", label: "Email", type: "email", help: "Not shown publicly." },
        { name: "order", label: "Order", type: "number" },
        { name: "isChair", label: "Chair", type: "checkbox", placeholder: "This member chairs the committee" },
      ]}
      defaults={{ committeeName: "Organizing", institution: "NED University of Engineering & Technology", order: 0, isChair: false }}
      filter={{ field: "committeeName", label: "Committee", options: COMMITTEES.map((c) => ({ value: c, label: c })) }}
      searchKeys={["name", "role", "institution", "committeeName"]}
      columns={[
        { key: "name", label: "Name", render: (r) => <span className="font-semibold">{String(r.name)}</span> },
        { key: "role", label: "Role", render: (r) => <span className="flex items-center gap-2">{String(r.role)}{r.isChair ? <Badge tone="info">Chair</Badge> : null}</span> },
        { key: "committeeName", label: "Committee" },
        { key: "institution", label: "Institution", render: (r) => <span className="text-ink-600">{String(r.institution || "—")}</span> },
        { key: "order", label: "Order", className: "tabular-nums" },
      ]}
    />
  );
}
