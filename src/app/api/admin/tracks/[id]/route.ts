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

export const PUT = admin<{ id: string }>((req, ctx) => tracks.update(req, ctx));
export const DELETE = admin<{ id: string }>((req, ctx) => tracks.remove(req, ctx));
