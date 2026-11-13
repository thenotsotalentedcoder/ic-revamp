import { admin } from "@/lib/server/http";
import { collection } from "@/lib/server/collection";
import { db } from "@/lib/server/db";
import { dateSchema } from "@/lib/server/schemas";

const dates = collection<{ id: string }>({
  model: () => db.importantDate as never,
  tags: ["dates"],
  schema: dateSchema,
  orderBy: { order: "asc" },
});

export const GET = admin<Record<string, never>>((req, ctx) => dates.list(req, ctx as never));
export const POST = admin<Record<string, never>>((req, ctx) => dates.create(req, ctx as never));
