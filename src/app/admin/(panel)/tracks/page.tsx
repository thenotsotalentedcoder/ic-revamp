"use client";

import { Badge } from "@/components/admin/kit";
import { ResourceManager } from "@/components/admin/resource";

export default function TracksAdmin() {
  return (
    <ResourceManager
      title="Research tracks"
      intro="Paper tracks and their topics, shown on the home page and the call for papers."
      endpoint="/api/admin/tracks"
      singular="Track"
      expandLabel="Topics"
      defaults={{ order: 0, icon: "book" }}
      fields={[
        { name: "name", label: "Track name", type: "text", required: true, wide: true },
        { name: "icon", label: "Icon key", type: "text", help: "Kept for compatibility; the new site does not render icons." },
        { name: "order", label: "Order", type: "number" },
      ]}
      columns={[
        { key: "order", label: "#", className: "w-12 tabular-nums" },
        { key: "name", label: "Track", render: (r) => <span className="font-semibold">{String(r.name)}</span> },
        { key: "topics", label: "Topics", render: (r) => <Badge>{Array.isArray(r.topics) ? r.topics.length : 0}</Badge> },
      ]}
      expand={(t, reload) => (
        <div>
          <h3 className="mb-2 text-[17px]">Topics in “{String(t.name)}”</h3>
          <ResourceManager
            nested
            endpoint={`/api/admin/tracks/${t.id}/topics`}
            itemUrl={(x) => `/api/admin/tracks/${t.id}/topics/${x.id}`}
            singular="Topic"
            onChange={reload}
            defaults={{ order: 0 }}
            fields={[
              { name: "name", label: "Topic", type: "text", required: true, wide: true },
              { name: "order", label: "Order", type: "number" },
            ]}
            columns={[
              { key: "order", label: "#", className: "w-12 tabular-nums" },
              { key: "name", label: "Topic" },
            ]}
          />
        </div>
      )}
    />
  );
}
