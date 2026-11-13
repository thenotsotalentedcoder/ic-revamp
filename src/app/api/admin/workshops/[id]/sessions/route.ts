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

export const GET = admin<{ id: string }>((req, ctx) => sessions.list(req, ctx as never));
export const POST = admin<{ id: string }>((req, ctx) => sessions.create(req, ctx as never));
