import { admin } from "@/lib/server/http";
import { collection } from "@/lib/server/collection";
import { db } from "@/lib/server/db";
import { speakerSchema } from "@/lib/server/schemas";

const speakers = collection<{ id: string }>({
  model: () => db.speaker as never,
  tags: ["speakers", "workshops"],
  schema: speakerSchema,
  orderBy: [{ order: "asc" }, { name: "asc" }],
  files: [{ field: "photo", column: "photo", folder: "speakers" }],
});

export const PUT = admin<{ id: string }>((req, ctx) => speakers.update(req, ctx));
export const DELETE = admin<{ id: string }>((req, ctx) => speakers.remove(req, ctx));
