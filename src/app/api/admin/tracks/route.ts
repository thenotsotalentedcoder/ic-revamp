import { admin } from "@/lib/server/http";
import { collection } from "@/lib/server/collection";
import { db } from "@/lib/server/db";
import { trackSchema } from "@/lib/server/schemas";

const tracks = collection<{ id: string }>({
  model: () => db.track as never,
  tags: ["tracks"],
  schema: trackSchema,
  orderBy: { order: "asc" },
  include: { topics: { orderBy: { order: "asc" } } },
});

export const GET = admin<Record<string, never>>((req, ctx) => tracks.list(req, ctx as never));
export const POST = admin<Record<string, never>>((req, ctx) => tracks.create(req, ctx as never));
