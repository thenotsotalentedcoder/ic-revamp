import { admin } from "@/lib/server/http";
import { collection } from "@/lib/server/collection";
import { db } from "@/lib/server/db";
import { sessionSchema } from "@/lib/server/schemas";

const sessions = collection<{ id: string; sessionId: string }>({
  model: () => db.workshopSession as never,
  tags: ["workshops"],
  schema: sessionSchema,
  orderBy: { order: "asc" },
  idParam: "sessionId",
  files: [{ field: "instructorPhoto", column: "instructorPhoto", folder: "speakers" }],
  scope: (p) => ({ workshopId: p.id }),
});

export const PUT = admin<{ id: string; sessionId: string }>((req, ctx) => sessions.update(req, ctx));
export const DELETE = admin<{ id: string; sessionId: string }>((req, ctx) => sessions.remove(req, ctx));
