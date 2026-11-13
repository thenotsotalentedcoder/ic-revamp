"use client";

import Image from "next/image";
import { Badge } from "@/components/admin/kit";
import { ResourceManager } from "@/components/admin/resource";

export default function WorkshopsAdmin() {
  return (
    <ResourceManager
      title="Workshops"
      intro="Workshops and their sessions. Each workshop gets its own page at /workshops/<slug>."
      endpoint="/api/admin/workshops"
      singular="Workshop"
      wide
      expandLabel="Sessions"
      defaults={{ order: 0 }}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "URL slug", type: "text", required: true, placeholder: "quantum-computing-basics", help: "Lowercase letters, numbers and dashes." },
        { name: "tagline", label: "Tagline", type: "text", required: true, wide: true },
        { name: "description", label: "Description", type: "textarea", required: true, rows: 6 },
        { name: "targetAudience", label: "Target audience", type: "textarea", rows: 3 },
        { name: "learningOutcomes", label: "Learning outcomes", type: "lines", help: "One per line." },
        { name: "registrationLink", label: "Registration link", type: "url", placeholder: "https://", help: "Leave empty to use the site’s workshop registration form." },
        { name: "order", label: "Order", type: "number" },
        { name: "posterImage", label: "Poster image", type: "image", help: "PNG, JPG or WebP, up to 5 MB." },
      ]}
      searchKeys={["title", "slug"]}
      columns={[
        {
          key: "title",
          label: "Workshop",
          render: (r) => (
            <span className="flex items-center gap-3">
              <span className="relative h-12 w-9 shrink-0 overflow-hidden bg-surface-100">{r.posterImage ? <Image src={r.posterImage as string} alt="" fill unoptimized sizes="36px" className="object-cover" /> : null}</span>
              <span>
                <span className="block font-semibold">{String(r.title)}</span>
                <span className="block text-[13px] text-ink-600">/{String(r.slug)}</span>
              </span>
            </span>
          ),
        },
        { key: "sessions", label: "Sessions", render: (r) => <Badge>{Array.isArray(r.sessions) ? r.sessions.length : 0}</Badge> },
        { key: "order", label: "Order", className: "tabular-nums" },
      ]}
      expand={(w, reload) => (
        <div>
          <h3 className="mb-2 text-[17px]">Sessions in “{String(w.title)}”</h3>
          <ResourceManager
            nested
            endpoint={`/api/admin/workshops/${w.id}/sessions`}
            itemUrl={(s) => `/api/admin/workshops/${w.id}/sessions/${s.id}`}
            singular="Session"
            wide
            onChange={reload}
            defaults={{ order: 0 }}
            fields={[
              { name: "title", label: "Session title", type: "text", required: true, wide: true },
              { name: "instructorName", label: "Instructor", type: "text", required: true },
              { name: "instructorTitle", label: "Instructor title", type: "text", required: true },
              { name: "instructorInstitution", label: "Institution", type: "text", required: true },
              { name: "instructorCountry", label: "Country", type: "text", required: true },
              { name: "order", label: "Order", type: "number" },
              { name: "instructorPhoto", label: "Instructor photo", type: "image" },
              { name: "topics", label: "Topics", type: "lines", help: "One per line." },
            ]}
            columns={[
              { key: "title", label: "Session", render: (r) => <span className="font-semibold">{String(r.title)}</span> },
              { key: "instructorName", label: "Instructor", render: (r) => <span>{String(r.instructorName)}<span className="block text-[13px] text-ink-600">{String(r.instructorInstitution)}</span></span> },
              { key: "order", label: "Order", className: "tabular-nums" },
            ]}
          />
        </div>
      )}
    />
  );
}
