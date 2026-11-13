import { admin } from "@/lib/server/http";
import { collection } from "@/lib/server/collection";
import { db } from "@/lib/server/db";
import { workshopSchema } from "@/lib/server/schemas";

const workshops = collection<{ id: string }>({
  model: () => db.workshop as never,
  tags: ["workshops"],
  schema: workshopSchema,
  orderBy: { order: "asc" },
  include: { sessions: { orderBy: { order: "asc" } } },
  files: [{ field: "posterImage", column: "posterImage", folder: "workshops" }],
});

export const GET = admin<Record<string, never>>((req, ctx) => workshops.list(req, ctx as never));
export const POST = admin<Record<string, never>>((req, ctx) => workshops.create(req, ctx as never));
