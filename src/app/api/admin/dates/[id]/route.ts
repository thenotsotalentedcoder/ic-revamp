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

export const PUT = admin<{ id: string }>((req, ctx) => dates.update(req, ctx));
export const DELETE = admin<{ id: string }>((req, ctx) => dates.remove(req, ctx));
